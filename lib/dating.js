// The dating harness.
//   1. Swipe round  — every agent reads every other agent's dating card and privately rates fit for its person.
//   2. Dates        — top mutual prospects go on a real multi-turn date: initiator's agent picks a venue from
//                     shared interests and sends an invite; the two agents then talk turn-by-turn, each one
//                     speaking AS its person with ONLY its own person's profile + the other's public card.
//   3. Debrief      — each agent privately scores the date for its own person and writes them a note.
//   4. Ranking      — per person, dated candidates ranked by (own agent's verdict 60% + other side 40%, +5 if mutual
//                     second date), undated candidates by mutual swipe interest (discounted, labelled "predicted").
import { load, save, emit, uid } from './db.js';
import { chat, llmInfo } from './llm.js';
import { topicsOf } from './analyze.js';

const TURNS = Number(process.env.DATE_TURNS || 10);
const DATE_CONC = Number(process.env.DATE_CONCURRENCY || 4);
const first = (p) => (p.name || '?').split(' ')[0];

export function eligible(a, b) {
  if (!a || !b || a.id === b.id) return false;
  const ok = (x, y) => !x.interestedIn || x.interestedIn === 'any' || !y.gender || x.interestedIn === y.gender;
  return ok(a, b) && ok(b, a);
}

const names = (xs) => (xs || []).map((x) => (typeof x === 'string' ? x : x.name)).filter(Boolean).join(', ');

export function card(p) {
  const a = p.analysis || {};
  return `${p.name} — ${a.headline || ''}${a.location ? ' · ' + a.location : ''}
Dating card (written by their agent, in their voice): "${a.dating_card || ''}"
Hobbies: ${names(a.hobbies)}
Interests: ${names(a.interests)}
Values: ${(a.values || []).join(', ')}
Lifestyle: ${(a.lifestyle || []).join(', ')}
Looking for: ${a.ideal_partner || ''}`;
}

function fullProfile(p) {
  const a = p.analysis || {};
  return `Name: ${p.name}
Headline: ${a.headline || ''} · Location: ${a.location || ''}
Summary: ${a.summary || ''}
Career: ${a.career?.summary || ''} (${a.career?.ambition || ''})
Needs: ${(a.needs || []).map((n) => `${n.need} (${n.why})`).join('; ')}
Hobbies: ${(a.hobbies || []).map((h) => `${h.name} [${h.evidence}]`).join('; ')}
Interests: ${(a.interests || []).map((h) => `${h.name} [${h.evidence}]`).join('; ')}
Values: ${(a.values || []).join(', ')}
Personality: ${JSON.stringify(a.personality || {})}
Lifestyle: ${(a.lifestyle || []).join(', ')}
Communication style: ${a.communication_style || ''} · Humor: ${a.humor || ''}
Ideal partner: ${a.ideal_partner || ''}
Green flags: ${(a.green_flags || []).join('; ')}
Potential frictions: ${(a.potential_frictions || []).join('; ')}
Likely dealbreakers: ${(a.dealbreakers_likely || []).join('; ')}`;
}

// ---------------------------------------------------------------- 1. swipe
async function swipe(space, aId, candidateIds) {
  const db = load(space);
  const a = db.people[aId];
  db.swipes[aId] ||= {};
  for (let i = 0; i < candidateIds.length; i += 25) {
    const batch = candidateIds.slice(i, i + 25).map((id) => db.people[id]);
    let ratings;
    if (llmInfo.isMock) {
      const mine = new Set(a.analysis?._topics || topicsOf(JSON.stringify(a.analysis)));
      ratings = batch.map((b) => {
        const theirs = topicsOf(JSON.stringify(b.analysis));
        const shared = theirs.filter((t) => mine.has(t));
        return { id: b.id, score: Math.min(95, 30 + shared.length * 15 + Math.round(Math.random() * 10)), reason: shared.length ? `Shared: ${shared.join(', ')}` : 'Little overlap found' };
      });
    } else {
      const out = await chat({
        system: `You are ${a.name}'s personal dating agent. You know your person deeply:\n${fullProfile(a)}\n\nYou are browsing the dating cards that other agents posted for their people. For EACH card, rate 0-100 how promising a match they are for YOUR person — weigh your person's needs, values, lifestyle rhythm, complementary personalities and likely frictions, not just shared hobbies. Be discerning and use the full range (most land 25-75; above 85 only for exceptional fits). Return JSON: {"ratings":[{"id": string, "score": number, "reason": string (max 18 words, specific)}]}`,
        messages: [{ role: 'user', text: batch.map((b) => `[id: ${b.id}]\n${card(b)}`).join('\n\n---\n\n') }],
        json: true, temperature: 0.4, maxTokens: 3000,
      });
      ratings = out.ratings || [];
    }
    for (const r of ratings) {
      if (!db.people[r.id] || r.id === aId) continue;
      db.swipes[aId][r.id] = { score: Math.max(0, Math.min(100, Math.round(Number(r.score) || 0))), reason: r.reason || '' };
      emit(space, { type: 'swipe', from: aId, to: r.id, score: db.swipes[aId][r.id].score, reason: r.reason });
    }
    save(space);
  }
}

async function ensureSwipes(space, onlyFor = null, progress = () => {}) {
  const db = load(space);
  const ready = Object.values(db.people).filter((p) => p.status === 'ready');
  const tasks = [];
  for (const a of ready) {
    const missing = ready.filter((b) => eligible(a, b) && !db.swipes[a.id]?.[b.id] && (!onlyFor || a.id === onlyFor || b.id === onlyFor)).map((b) => b.id);
    if (missing.length) tasks.push([a.id, missing]);
  }
  let done = 0;
  await pool(tasks, DATE_CONC, async ([aId, ids]) => {
    try { await swipe(space, aId, ids); } catch (e) { console.error('swipe failed', aId, e.message); }
    progress(++done, tasks.length);
  });
}

// ---------------------------------------------------------------- 2+3. date
const ACTS = [
  { title: 'Act I · Arrival & first impressions', hint: 'Arrival and first impressions: break the ice, react to the venue and to them, light playful banter, notice details.' },
  { title: 'Act II · Getting real', hint: 'Getting real: talk about what actually drives you, work vs. life, values, what you want in a partner. Probe your person\'s needs and possible dealbreakers naturally.' },
  { title: 'Act III · The wrap-up', hint: 'Wrapping up: reflect honestly on the vibe. If it clicked, show it; if it didn\'t, be kind but don\'t fake it. Hint at whether you\'d want a second date.' },
];

function dateSystem(me, other, venue, actHint, isLast) {
  const a = me.analysis || {};
  return `You are the AI dating agent for ${me.name}. Right now you are ON A DATE on ${first(me)}'s behalf with ${other.name}, who is represented by their own agent.
You speak AS ${first(me)} — first person, in their real voice: ${a.voice || 'natural'}.

EVERYTHING YOU KNOW ABOUT ${first(me).toUpperCase()} (your only truth; draw on real specifics from it; never invent big facts like jobs, places or relationships that aren't here):
${fullProfile(me)}

WHAT YOU KNOW ABOUT YOUR DATE (only their public dating card):
${card(other)}

THE DATE: ${venue.activity} at ${venue.venue}.

YOUR PRIVATE MISSION: find out if ${first(other)} genuinely fits ${first(me)}. Test against ${first(me)}'s needs and dealbreakers. Be honest — chemistry is earned, not assumed. If something clashes with ${first(me)}'s needs, let it show politely.

STYLE: 1-3 sentences per turn. Conversational, specific, warm, witty if ${first(me)} is witty. React to what they just said, then add something or ask something. You may include one short action in *asterisks*. No lists, no emojis spam, never mention AI/agents/profiles/cards.
PHASE: ${actHint}${isLast ? '\nThis is your LAST line of the date — say goodbye in a way that reflects how you really feel about it.' : ''}`;
}

function povMessages(d, meId) {
  return d.transcript.filter((t) => t.kind !== 'scene').map((t) => ({ role: t.speaker === meId ? 'assistant' : 'user', text: t.text }));
}

export async function runDate(space, aId, bId) {
  const db = load(space);
  const A = db.people[aId], B = db.people[bId];
  const d = { id: uid('d_'), a: aId, b: bId, status: 'live', createdAt: Date.now(), transcript: [], verdicts: {}, venue: null };
  db.dates[d.id] = d;
  emit(space, { type: 'date_start', dateId: d.id, a: aId, b: bId });
  save(space);

  const push = (item) => {
    d.transcript.push({ at: Date.now(), ...item });
    emit(space, { type: 'date_msg', dateId: d.id, item: d.transcript.at(-1) });
    save(space);
  };

  try {
    // Invite: initiator's agent picks a venue from what it knows of both people.
    let plan;
    if (llmInfo.isMock) {
      const shared = topicsOf(JSON.stringify(A.analysis)).filter((t) => topicsOf(JSON.stringify(B.analysis)).includes(t));
      plan = { venue: shared[0] ? `a spot for ${shared[0]} lovers` : 'a cozy café', activity: shared[0] || 'coffee', why: 'shared interest', invite: `Hey ${first(B)}! Want to grab ${shared[0] || 'coffee'} this weekend?` };
    } else {
      plan = await chat({
        system: dateSystem(A, B, { venue: 'TBD', activity: 'TBD' }, 'You are planning the date.', false),
        messages: [{ role: 'user', text: `Plan a first date for ${first(A)} and ${first(B)} that ${first(A)} would genuinely suggest, inspired by something real you both seem to share (or a playful bridge between your worlds). Pick a concrete, plausible venue type in/near ${A.analysis?.location || 'their city'}. Then write ${first(A)}'s invite message to ${first(B)} (1-2 sentences, in ${first(A)}'s voice, referencing something specific from their card). JSON: {"venue": string, "activity": string, "why": string, "invite": string}` }],
        json: true, temperature: 0.9, maxTokens: 600,
      });
    }
    d.venue = { venue: plan.venue, activity: plan.activity, why: plan.why };
    emit(space, { type: 'date_venue', dateId: d.id, venue: d.venue });
    push({ speaker: aId, kind: 'invite', text: plan.invite });

    const replyTo = async (speaker, other, actHint, isLast) => {
      if (llmInfo.isMock) return mockLine(speaker, other, d.transcript.length, isLast);
      return chat({ system: dateSystem(speaker, other, d.venue, actHint, isLast), messages: povMessages(d, speaker.id), temperature: 0.95, maxTokens: 220 });
    };

    push({ speaker: bId, kind: 'msg', text: await replyTo(B, A, 'You just received this date invite. Reply in character — accept (with your own spin) or playfully counter-propose a detail.', false) });

    let act = -1;
    for (let i = 0; i < TURNS; i++) {
      const nextAct = Math.min(2, Math.floor((i * 3) / TURNS));
      if (nextAct !== act) { act = nextAct; push({ speaker: null, kind: 'scene', text: ACTS[act].title }); }
      const [me, other] = i % 2 === 0 ? [A, B] : [B, A];
      const text = await replyTo(me, other, ACTS[act].hint, i >= TURNS - 2);
      push({ speaker: me.id, kind: 'msg', text });
    }

    // Debrief: each agent privately reports back to its own person.
    d.status = 'debrief';
    emit(space, { type: 'date_status', dateId: d.id, status: d.status });
    const transcriptText = d.transcript.map((t) => (t.kind === 'scene' ? `--- ${t.text} ---` : `${db.people[t.speaker].name}: ${t.text}`)).join('\n');
    const verdict = async (me, other) => {
      if (llmInfo.isMock) {
        const shared = topicsOf(JSON.stringify(me.analysis)).filter((t) => topicsOf(JSON.stringify(other.analysis)).includes(t));
        const s = Math.min(95, 35 + shared.length * 14);
        return { scores: { values: s, lifestyle: s, interests: s, communication: s, goals: s, chemistry: s }, overall: s, second_date: s >= 60, headline: shared.length ? `Bonded over ${shared[0]}` : 'Polite but flat', highlight: '', concern: '', note_to_human: `(offline mode) Shared topics: ${shared.join(', ') || 'none'}.` };
      }
      return chat({
        system: `You are ${me.name}'s personal dating agent. You just went on a date on ${first(me)}'s behalf. Now you debrief PRIVATELY to ${first(me)}. Your loyalty is to ${first(me)}'s long-term happiness — not to being nice. Calibrate: an average pleasant date is ~55; 80+ means you'd genuinely push ${first(me)} to meet them; below 40 means a real mismatch with their needs.\n\n${first(me).toUpperCase()}'S PROFILE:\n${fullProfile(me)}`,
        messages: [{ role: 'user', text: `Date: ${d.venue.activity} at ${d.venue.venue} with ${other.name}.\nTheir card:\n${card(other)}\n\nTRANSCRIPT:\n${transcriptText}\n\nReturn JSON: {"scores": {"values": 0-100, "lifestyle": 0-100, "interests": 0-100, "communication": 0-100, "goals": 0-100, "chemistry": 0-100}, "overall": 0-100, "second_date": boolean, "headline": string (max 7 words), "highlight": string (the best moment), "concern": string (the biggest doubt), "note_to_human": string (2-3 sentences talking directly to ${first(me)} as "you")}` }],
        json: true, temperature: 0.4, maxTokens: 800,
      });
    };
    const [va, vb] = await Promise.all([verdict(A, B), verdict(B, A)]);
    d.verdicts[aId] = va; d.verdicts[bId] = vb;
    const sa = Number(va.overall) || 0, sb = Number(vb.overall) || 0;
    d.match = sa + sb ? Math.round((2 * sa * sb) / (sa + sb)) : 0;
    d.mutual = !!(va.second_date && vb.second_date);
    d.status = 'done';
    d.endedAt = Date.now();
    emit(space, { type: 'date_end', dateId: d.id, match: d.match, mutual: d.mutual });
  } catch (e) {
    d.status = 'error'; d.error = e.message;
    emit(space, { type: 'date_status', dateId: d.id, status: 'error', error: e.message });
  }
  save(space);
  return d;
}

function mockLine(me, other, n, isLast) {
  const mine = topicsOf(JSON.stringify(me.analysis));
  const t = mine[n % Math.max(1, mine.length)] || 'life';
  if (isLast) return `This was lovely, ${first(other)}. Let's see where it goes!`;
  return [`So ${first(other)}, how did you get into ${t}?`, `*laughs* Honestly, ${t} is kind of my whole personality on weekends.`, `What does a perfect Sunday look like for you?`, `I've been heads-down at work lately, but ${t} keeps me sane.`][n % 4];
}

// ---------------------------------------------------------------- orchestration
async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) await fn(items[i++]); }));
}

const pairKey = (a, b) => [a, b].sort().join('|');
function datedPairs(db) {
  const s = new Set();
  for (const d of Object.values(db.dates)) if (d.status === 'done' || d.status === 'live' || d.status === 'debrief') s.add(pairKey(d.a, d.b));
  return s;
}
const mutualSwipe = (db, a, b) => ((db.swipes[a]?.[b]?.score ?? 0) + (db.swipes[b]?.[a]?.score ?? 0)) / 2;

function setJob(space, job) {
  const db = load(space);
  db.meta.job = job ? { ...db.meta.job, ...job } : null;
  emit(space, { type: 'job', job: db.meta.job });
  save(space);
}

export async function runRound(space, { perPerson = 3, onlyFor = null } = {}) {
  const db = load(space);
  if (db.meta.job?.running) throw new Error('A dating round is already running.');
  setJob(space, { running: true, phase: 'swiping', done: 0, total: 0, startedAt: Date.now(), onlyFor });
  try {
    await ensureSwipes(space, onlyFor, (done, total) => setJob(space, { done, total }));
    const ready = Object.values(db.people).filter((p) => p.status === 'ready');
    const dated = datedPairs(db);
    const count = {};
    for (const k of dated) for (const id of k.split('|')) count[id] = (count[id] || 0) + 1;
    const plan = [];
    const people = onlyFor ? ready.filter((p) => p.id === onlyFor) : ready;
    for (const p of people) {
      const cands = ready.filter((o) => eligible(p, o) && !dated.has(pairKey(p.id, o.id))).sort((x, y) => mutualSwipe(db, p.id, y.id) - mutualSwipe(db, p.id, x.id));
      for (const o of cands) {
        if ((count[p.id] || 0) >= perPerson) break;
        dated.add(pairKey(p.id, o.id));
        count[p.id] = (count[p.id] || 0) + 1; count[o.id] = (count[o.id] || 0) + 1;
        // the person who swiped harder makes the first move
        plan.push((db.swipes[p.id]?.[o.id]?.score ?? 0) >= (db.swipes[o.id]?.[p.id]?.score ?? 0) ? [p.id, o.id] : [o.id, p.id]);
      }
    }
    setJob(space, { phase: 'dating', done: 0, total: plan.length });
    let done = 0;
    await pool(plan, DATE_CONC, async ([a, b]) => { await runDate(space, a, b); setJob(space, { done: ++done }); });
    setJob(space, { running: false, phase: 'done', finishedAt: Date.now() });
  } catch (e) {
    setJob(space, { running: false, phase: 'error', error: e.message });
    throw e;
  }
}

// ---------------------------------------------------------------- 4. ranking
export function rankingFor(db, id) {
  const me = db.people[id];
  const rows = [];
  for (const o of Object.values(db.people)) {
    if (o.id === id || o.status !== 'ready' || !eligible(me, o)) continue;
    const dates = Object.values(db.dates).filter((d) => d.status === 'done' && pairKey(d.a, d.b) === pairKey(id, o.id)).sort((x, y) => y.createdAt - x.createdAt);
    const d = dates[0];
    if (d) {
      const own = Number(d.verdicts[id]?.overall) || 0, theirs = Number(d.verdicts[o.id]?.overall) || 0;
      rows.push({ id: o.id, score: Math.min(100, Math.round(0.6 * own + 0.4 * theirs + (d.mutual ? 5 : 0))), basis: d.mutual ? 'mutual' : 'dated', own, theirs, dateId: d.id, reason: d.verdicts[id]?.note_to_human || '', headline: d.verdicts[id]?.headline || '' });
    } else {
      const s1 = db.swipes[id]?.[o.id], s2 = db.swipes[o.id]?.[id];
      if (s1 || s2) rows.push({ id: o.id, score: Math.round(((s1?.score ?? s2.score) + (s2?.score ?? s1.score)) / 2 * 0.9), basis: 'predicted', own: s1?.score ?? null, theirs: s2?.score ?? null, reason: s1?.reason || s2?.reason || '' });
      else rows.push({ id: o.id, score: null, basis: 'unscored', reason: 'Not evaluated yet — run a dating round.' });
    }
  }
  return rows.sort((x, y) => (y.score ?? -1) - (x.score ?? -1));
}
