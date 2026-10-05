import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { load, save, replace, bus, uid, ROOT, MEDIA_DIR, SEED_DIR } from './lib/db.js';
import { analyzePerson } from './lib/analyze.js';
import { runRound, runDate, rankingFor, eligible } from './lib/dating.js';
import { parseInstagram, parseLinkedIn } from './lib/scrape.js';
import { llmInfo } from './lib/llm.js';

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use('/media', express.static(MEDIA_DIR, { maxAge: '7d' }));
app.use(express.static(path.join(ROOT, 'public')));

const ADMIN_KEY = process.env.ADMIN_KEY || '';
const SPACES = ['demo', 'live'];
const isAdmin = (req) => !ADMIN_KEY || req.get('x-admin-key') === ADMIN_KEY;

// /api/:space/...  — demo is read-only unless you hold the admin key
app.use('/api/:space', (req, res, next) => {
  if (!SPACES.includes(req.params.space)) return res.status(404).json({ error: 'Unknown space' });
  if (req.params.space === 'demo' && req.method !== 'GET' && !(ADMIN_KEY && req.get('x-admin-key') === ADMIN_KEY))
    return res.status(403).json({ error: 'The demo is a frozen, already-run example. Switch to Live to add people and run dates.' });
  req.space = req.params.space;
  req.db = load(req.space);
  next();
});

const summary = (p) => ({
  id: p.id, name: p.name, status: p.status, error: p.error, avatar: p.avatar, linkedin: p.linkedin, instagram: p.instagram,
  headline: p.analysis?.headline, location: p.analysis?.location, one_liner: p.analysis?.one_liner,
  tags: [...(p.analysis?.hobbies || []).slice(0, 3).map((h) => h.name)], gender: p.gender, interestedIn: p.interestedIn,
  seeded: !!p.seeded, createdAt: p.createdAt,
});
const dateSummary = (d) => ({
  id: d.id, a: d.a, b: d.b, status: d.status, venue: d.venue, match: d.match, mutual: d.mutual, createdAt: d.createdAt,
  messages: d.transcript.filter((t) => t.kind !== 'scene').length,
  headlines: d.verdicts ? { [d.a]: d.verdicts[d.a]?.headline, [d.b]: d.verdicts[d.b]?.headline } : {},
});

app.get('/api/:space/state', (req, res) => {
  const { people, dates, meta } = req.db;
  res.json({
    space: req.space, llm: llmInfo, scrapers: { apify: !!process.env.APIFY_TOKEN }, job: meta.job,
    people: Object.values(people).sort((a, b) => a.createdAt - b.createdAt).map(summary),
    dates: Object.values(dates).sort((a, b) => b.createdAt - a.createdAt).map(dateSummary),
  });
});

function addPerson(req, body) {
  const linkedin = String(body.linkedin || '').trim(), instagram = String(body.instagram || '').trim();
  if (!parseLinkedIn(linkedin)) throw new Error(`Invalid LinkedIn URL: "${linkedin}" (expected linkedin.com/in/…)`);
  if (!parseInstagram(instagram) || !/instagram\.com/i.test(instagram)) throw new Error(`Invalid Instagram URL: "${instagram}" (expected instagram.com/username)`);
  const dup = Object.values(req.db.people).find((p) => parseLinkedIn(p.linkedin) === parseLinkedIn(linkedin) || parseInstagram(p.instagram) === parseInstagram(instagram));
  if (dup) return { person: dup, duplicate: true };
  const id = uid('p_');
  const p = {
    id, createdAt: Date.now(), status: 'queued', linkedin, instagram, name: parseInstagram(instagram),
    gender: ['man', 'woman', 'nonbinary'].includes(body.gender) ? body.gender : null,
    interestedIn: ['man', 'woman', 'any'].includes(body.interestedIn) ? body.interestedIn : 'any',
    manual: { linkedinText: String(body.linkedinText || body.manual?.linkedinText || '').slice(0, 8000), instagramText: String(body.instagramText || body.manual?.instagramText || '').slice(0, 8000) },
    log: [],
  };
  req.db.people[id] = p;
  save(req.space);
  return { person: p, duplicate: false };
}

// analysis queue so a bulk paste of 25 doesn't stampede the scrapers
const analysisQueue = [];
let analysing = 0;
function enqueueAnalysis(space, id) {
  analysisQueue.push([space, id]);
  pump();
}
function pump() {
  while (analysing < 3 && analysisQueue.length) {
    const [space, id] = analysisQueue.shift();
    analysing++;
    analyzePerson(space, id).finally(() => { analysing--; pump(); });
  }
}

app.post('/api/:space/people', (req, res) => {
  try {
    if (!req.body.consent) throw new Error('Please confirm you have this person\'s consent (or that it is you).');
    const { person, duplicate } = addPerson(req, req.body);
    if (!duplicate) enqueueAnalysis(req.space, person.id);
    res.json({ id: person.id, duplicate });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/api/:space/people/bulk', (req, res) => {
  if (!req.body.consent) return res.status(400).json({ error: 'Please confirm consent for everyone in the list.' });
  const lines = String(req.body.text || '').split(/\n/).map((l) => l.trim()).filter(Boolean);
  const results = [];
  for (const line of lines) {
    const urls = line.match(/https?:\/\/\S+|(?:www\.)?(?:linkedin|instagram)\.com\/\S+/gi) || [];
    const linkedin = urls.find((u) => /linkedin/i.test(u)), instagram = urls.find((u) => /instagram/i.test(u));
    try {
      const { person, duplicate } = addPerson(req, { linkedin, instagram });
      if (!duplicate) enqueueAnalysis(req.space, person.id);
      results.push({ line, id: person.id, duplicate });
    } catch (e) { results.push({ line, error: e.message }); }
  }
  res.json({ results });
});

app.get('/api/:space/people/:id', (req, res) => {
  const p = req.db.people[req.params.id];
  if (!p) return res.status(404).json({ error: 'Not found' });
  const dates = Object.values(req.db.dates).filter((d) => d.a === p.id || d.b === p.id).sort((a, b) => b.createdAt - a.createdAt).map(dateSummary);
  const { manual, ...rest } = p;
  res.json({ ...rest, hasManual: !!(manual?.linkedinText || manual?.instagramText), dates, ranking: rankingFor(req.db, p.id).slice(0, 5) });
});

app.post('/api/:space/people/:id/reanalyze', (req, res) => {
  const p = req.db.people[req.params.id];
  if (!p) return res.status(404).json({ error: 'Not found' });
  if (p.status === 'analyzing') return res.status(409).json({ error: 'Already analyzing' });
  if (req.body.linkedinText || req.body.instagramText) p.manual = { linkedinText: String(req.body.linkedinText || p.manual?.linkedinText || '').slice(0, 8000), instagramText: String(req.body.instagramText || p.manual?.instagramText || '').slice(0, 8000) };
  p.status = 'queued';
  save(req.space);
  enqueueAnalysis(req.space, p.id);
  res.json({ ok: true });
});

app.patch('/api/:space/people/:id', (req, res) => {
  const p = req.db.people[req.params.id];
  if (!p) return res.status(404).json({ error: 'Not found' });
  if ('gender' in req.body) p.gender = ['man', 'woman', 'nonbinary'].includes(req.body.gender) ? req.body.gender : null;
  if ('interestedIn' in req.body) p.interestedIn = ['man', 'woman', 'any'].includes(req.body.interestedIn) ? req.body.interestedIn : 'any';
  save(req.space);
  res.json({ ok: true });
});

app.delete('/api/:space/people/:id', (req, res) => {
  const p = req.db.people[req.params.id];
  if (!p) return res.status(404).json({ error: 'Not found' });
  if (p.seeded && !isAdmin(req)) return res.status(403).json({ error: 'People from the seeded example can only be removed by the admin.' });
  delete req.db.people[p.id];
  delete req.db.swipes[p.id];
  for (const s of Object.values(req.db.swipes)) delete s[p.id];
  for (const [k, d] of Object.entries(req.db.dates)) if (d.a === p.id || d.b === p.id) delete req.db.dates[k];
  save(req.space);
  res.json({ ok: true });
});

// Find matches for one person: swipes in both directions + K real dates.
app.post('/api/:space/people/:id/match', (req, res) => {
  const p = req.db.people[req.params.id];
  if (!p || p.status !== 'ready') return res.status(400).json({ error: 'Person must be analyzed first.' });
  const perPerson = Math.max(1, Math.min(6, Number(req.body.perPerson) || 3));
  runRound(req.space, { perPerson, onlyFor: p.id }).catch((e) => console.error(e));
  res.json({ ok: true });
});

app.post('/api/:space/round', (req, res) => {
  if (req.db.meta.job?.running) return res.status(409).json({ error: 'A dating round is already running.' });
  const perPerson = Math.max(1, Math.min(8, Number(req.body.perPerson) || 3));
  runRound(req.space, { perPerson }).catch((e) => console.error(e));
  res.json({ ok: true });
});

app.post('/api/:space/dates', async (req, res) => {
  const { a, b } = req.body;
  const A = req.db.people[a], B = req.db.people[b];
  if (!A || !B || A.status !== 'ready' || B.status !== 'ready') return res.status(400).json({ error: 'Both people must be analyzed first.' });
  if (a === b) return res.status(400).json({ error: 'Pick two different people.' });
  const d = runDate(req.space, a, b);
  // respond as soon as the date exists so the UI can watch it live
  setTimeout(() => {
    const live = Object.values(req.db.dates).filter((x) => x.a === a && x.b === b).sort((x, y) => y.createdAt - x.createdAt)[0];
    res.json({ id: live?.id, warning: eligible(A, B) ? null : 'Note: their stated preferences don\'t match, but the date was run on request.' });
  }, 50);
  d.catch(() => {});
});

app.get('/api/:space/dates/:id', (req, res) => {
  const d = req.db.dates[req.params.id];
  if (!d) return res.status(404).json({ error: 'Not found' });
  res.json(d);
});

app.get('/api/:space/rankings', (req, res) => {
  const out = {};
  for (const p of Object.values(req.db.people)) if (p.status === 'ready') out[p.id] = rankingFor(req.db, p.id);
  res.json(out);
});

app.get('/api/:space/export', (req, res) => {
  res.setHeader('content-disposition', `attachment; filename="wingman-${req.space}.json"`);
  res.json(req.db);
});

// Freeze the current live run as the public demo (admin only).
app.post('/api/live/publish-demo', (req, res) => {
  if (!ADMIN_KEY || req.get('x-admin-key') !== ADMIN_KEY) return res.status(403).json({ error: 'Admin key required (set ADMIN_KEY).' });
  const snap = JSON.parse(JSON.stringify(load('live')));
  for (const p of Object.values(snap.people)) { delete p.seeded; delete p.manual; }
  snap.meta.job = null;
  snap.meta.publishedAt = Date.now();
  replace('demo', snap);
  res.json({ ok: true, people: Object.keys(snap.people).length, dates: Object.keys(snap.dates).length });
});

// Live event stream (analysis steps, swipes, every date message as it is spoken).
app.get('/api/:space/events', (req, res) => {
  res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache', connection: 'keep-alive', 'x-accel-buffering': 'no' });
  res.write('retry: 2000\n\n');
  const on = (ev) => { if (ev.space === req.space) res.write(`data: ${JSON.stringify(ev)}\n\n`); };
  bus.on('event', on);
  const ping = setInterval(() => res.write(': ping\n\n'), 20000);
  req.on('close', () => { bus.off('event', on); clearInterval(ping); });
});

app.get('*', (req, res) => res.sendFile(path.join(ROOT, 'public', 'index.html')));

const PORT = Number(process.env.PORT || 3000);
const isMain = process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1] === fileURLToPath(import.meta.url));
if (isMain && !process.env.VERCEL) {
  try { fs.mkdirSync(SEED_DIR, { recursive: true }); } catch {}
  app.listen(PORT, () => console.log(`Wingman running on http://localhost:${PORT}  (LLM: ${llmInfo.provider}/${llmInfo.model}, Apify: ${process.env.APIFY_TOKEN ? 'on' : 'off'})`));
}

export default app;
