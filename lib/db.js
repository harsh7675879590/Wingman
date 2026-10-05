// Tiny JSON-file store with two "spaces":
//   demo — the frozen, pre-run example (seed/demo.json, committed to the repo, read-only on the web)
//   live — the playground visitors paste their own links into (seeded from demo on first boot)
import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import { fileURLToPath } from 'url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SEED_DIR = path.join(ROOT, 'seed');
export const DATA_DIR = process.env.DATA_DIR 
  ? path.resolve(process.env.DATA_DIR) 
  : (process.env.VERCEL ? path.join('/tmp', 'data') : path.join(ROOT, 'data'));
export const MEDIA_DIR = process.env.VERCEL ? path.join('/tmp', 'media') : path.join(SEED_DIR, 'media');

export const bus = new EventEmitter();
bus.setMaxListeners(500);

const cache = {};
const timers = {};

function fileFor(space) {
  return space === 'demo' ? path.join(SEED_DIR, 'demo.json') : path.join(DATA_DIR, `${space}.json`);
}

function empty() {
  return { people: {}, dates: {}, swipes: {}, meta: { createdAt: Date.now(), job: null } };
}

export function load(space) {
  if (cache[space]) return cache[space];
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}
  try { fs.mkdirSync(MEDIA_DIR, { recursive: true }); } catch {}
  let data = null;
  const f = fileFor(space);
  if (fs.existsSync(f)) data = JSON.parse(fs.readFileSync(f, 'utf8'));
  else if (space === 'live' && fs.existsSync(fileFor('demo'))) {
    data = JSON.parse(fs.readFileSync(fileFor('demo'), 'utf8'));
    for (const p of Object.values(data.people)) p.seeded = true;
  }
  data = data || empty();
  data.people ||= {}; data.dates ||= {}; data.swipes ||= {}; data.meta ||= {};
  // A job can't survive a restart.
  if (data.meta.job?.running) data.meta.job = { ...data.meta.job, running: false, phase: 'interrupted' };
  for (const p of Object.values(data.people)) if (p.status === 'analyzing') p.status = 'error', p.error = 'Interrupted by restart — click re-analyze.';
  for (const d of Object.values(data.dates)) if (d.status === 'live') d.status = 'abandoned';
  cache[space] = data;
  return data;
}

export function save(space, immediate = false) {
  const write = () => {
    try {
      const f = fileFor(space);
      fs.mkdirSync(path.dirname(f), { recursive: true });
      fs.writeFileSync(f + '.tmp', JSON.stringify(cache[space], null, space === 'demo' ? 1 : 0));
      fs.renameSync(f + '.tmp', f);
    } catch (e) {
      console.warn('save warning:', e.message);
    }
  };
  clearTimeout(timers[space]);
  if (immediate) return write();
  timers[space] = setTimeout(write, 250);
}

export function replace(space, data) {
  cache[space] = data;
  save(space, true);
}

export function emit(space, event) {
  bus.emit('event', { space, at: Date.now(), ...event });
}

export const uid = (p = '') => p + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
