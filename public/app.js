// Wingman front-end — a tiny hash-routed SPA (no framework) with a live SSE feed.
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (s) => esc(s).replace(/\*([^*]+)\*/g, '<em>*$1*</em>');
const first = (n) => String(n || '?').split(' ')[0];

const params = new URLSearchParams(location.search);
let SPACE = params.get('space') || localStorage.getItem('wingman.space') || 'live';
if (!['demo', 'live'].includes(SPACE)) SPACE = 'live';
let STATE = { people: [], dates: [], job: null, llm: {} };
let CURRENT = { view: null, id: null };
const P = (id) => STATE.people.find((p) => p.id === id) || { id, name: 'Unknown' };

async function api(path, opts = {}) {
  const r = await fetch(`/api/${SPACE}${path}`, {
    method: opts.method || 'GET', headers: { 'content-type': 'application/json' },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `Request failed (${r.status})`);
  return data;
}
function toast(msg, ms = 3500) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), ms);
}
function hue(s) { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) % 360; return h; }
function av(p, size = '') {
  if (p?.avatar) return `<img class="avatar ${size}" src="${esc(p.avatar)}" alt="${esc(p.name)}" loading="lazy" onerror="this.style.opacity=0.15">`;
  const h = hue(p?.name || p?.id);
  const ini = String(p?.name || '?').split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return `<div class="avatar ${size}" style="background:linear-gradient(135deg,hsl(${h} 70% 55%),hsl(${(h + 60) % 360} 70% 45%))">${esc(ini)}</div>`;
}
const scoreColor = (s) => (s == null ? 'rgba(255,255,255,.04)' : `hsla(${Math.round((s / 100) * 140) - 10}, 80%, 55%, ${0.15 + (s / 100) * 0.7})`);
const basisChip = (b) => ({ mutual: '<span class="chip rose">💞 mutual 2nd date</span>', dated: '<span class="chip violet">☕ dated</span>', predicted: '<span class="chip amber">🔮 predicted from swipes</span>', unscored: '<span class="chip">—</span>' }[b] || '');
const ago = (t) => { const s = Math.round((Date.now() - t) / 1000); return s < 60 ? `${s}s ago` : s < 3600 ? `${Math.round(s / 60)}m ago` : s < 86400 ? `${Math.round(s / 3600)}h ago` : `${Math.round(s / 86400)}d ago`; };
const readOnly = () => SPACE === 'demo';
const roNote = () => `<div class="card row between" style="margin-bottom:18px;border-color:rgba(255,179,92,.35)"><span>👀 You're viewing the <b>frozen demo</b> — the finished example, already run. Switch to <b>Live</b> to paste your own links and send agents on dates.</span><button class="btn sm primary" id="go-live">Switch to Live</button></div>`;

// ---------------------------------------------------------------- state + live feed
async function refreshState() {
  STATE = await api('/state');
  $('#llm-info').textContent = `agent brain: ${STATE.llm.provider}/${STATE.llm.model}${STATE.scrapers?.apify ? ' · scraping: Apify + public endpoints' : ' · scraping: public endpoints'}`;
  renderJob();
}
let debounce;
function softRefresh() {
  clearTimeout(debounce);
  debounce = setTimeout(async () => {
    await refreshState();
    if (['home', 'people', 'dates', 'rankings'].includes(CURRENT.view)) route(true);
  }, 700);
}
let es;
function connect() {
  es?.close();
  es = new EventSource(`/api/${SPACE}/events`);
  es.onmessage = (m) => {
    const ev = JSON.parse(m.data);
    if (ev.type === 'job') { STATE.job = ev.job; renderJob(); if (!ev.job?.running) softRefresh(); }
    if (ev.type === 'analysis' && CURRENT.view === 'profile' && CURRENT.id === ev.personId) appendLog(ev);
    if (ev.type === 'person') { if (CURRENT.view === 'profile' && CURRENT.id === ev.personId) route(true); softRefresh(); }
    if (ev.type === 'date_msg' && CURRENT.view === 'date' && CURRENT.id === ev.dateId) appendMsg(ev.item);
    if (['date_venue', 'date_end', 'date_status'].includes(ev.type) && CURRENT.view === 'date' && CURRENT.id === ev.dateId) route(true);
    if (['date_start', 'date_end'].includes(ev.type)) softRefresh();
    if (CURRENT.view === 'home') tick(ev);
  };
}
function renderJob() {
  const j = STATE.job, bar = $('#jobbar');
  if (!j?.running) return bar.classList.add('hidden');
  bar.classList.remove('hidden');
  const pct = j.total ? Math.round((j.done / j.total) * 100) : 5;
  const label = j.phase === 'swiping' ? `🃏 Agents are reading each other's dating cards & swiping… (${j.done}/${j.total} agents)` : `☕ Agents are out on dates… (${j.done}/${j.total} finished)`;
  bar.innerHTML = `<div class="inner"><span class="dot"></span><span>${label}</span><div class="progress"><i style="width:${pct}%"></i></div><a class="btn sm" href="#/dates">Watch live</a></div>`;
}

// ---------------------------------------------------------------- router
const routes = [
  [/^#?\/?$/, home], [/^#\/add$/, addView], [/^#\/people$/, peopleView], [/^#\/p\/(.+)$/, profileView],
  [/^#\/dates$/, datesView], [/^#\/d\/(.+)$/, dateView], [/^#\/rankings(?:\/(.+))?$/, rankingsView], [/^#\/how$/, howView],
];
async function route(soft = false) {
  const hash = location.hash || '#/';
  for (const [re, fn] of routes) {
    const m = hash.match(re);
    if (!m) continue;
    document.querySelectorAll('.nav a').forEach((a) => a.classList.toggle('active', hash.startsWith(a.getAttribute('href').split('/').slice(0, 2).join('/'))));
    try { 
      await fn(m[1]); 
    } catch (e) { 
      console.warn('Route failed:', e);
      $('#app').innerHTML = `
        <div class="card empty" style="max-width:540px;margin:60px auto;text-align:center">
          <div style="font-size:32px;margin-bottom:10px">⚠️</div>
          <h3 style="margin-bottom:8px">${esc(e.message)}</h3>
          <p class="muted small">This item was not found or is still being generated.</p>
          <div class="row center" style="margin-top:16px;gap:10px">
            <a class="btn primary" href="#/dates">View Dates</a>
            <a class="btn" href="#/people">View Agents</a>
            <a class="btn" href="#/">Home</a>
          </div>
        </div>`; 
    }
    if (soft) window.scrollTo(0, y); else window.scrollTo(0, 0);
    $('#go-live')?.addEventListener('click', () => setSpace('live'));
    return;
  }
  location.hash = '#/';
}
function setSpace(s) {
  SPACE = s; localStorage.setItem('wingman.space', s);
  const u = new URL(location.href); u.searchParams.set('space', s); history.replaceState(null, '', u);
  document.querySelectorAll('#space-switch button').forEach((b) => b.classList.toggle('on', b.dataset.space === s));
  connect(); refreshState().then(() => route());
}

// ---------------------------------------------------------------- home
function home() {
  CURRENT = { view: 'home' };
  const ready = STATE.people.filter((p) => p.status === 'ready');
  const done = STATE.dates.filter((d) => d.status === 'done');
  const top = [...done].sort((a, b) => b.match - a.match).slice(0, 6);
  $('#app').innerHTML = `
  <section class="hero">
    <div>
      <div class="chip violet" style="margin-bottom:18px">🪽 Agentic dating · ${SPACE === 'demo' ? 'frozen demo run' : 'live playground'}</div>
      <h1>Your agent goes on<br/><span class="grad-text">the dates for you.</span></h1>
      <p class="lead">Paste a LinkedIn and a public Instagram. An AI agent reads the person, writes a deep profile — needs, hobbies, interests — then goes out on real dates with other people's agents and ranks who fits them best.</p>
      <div class="row wrap" style="margin-top:26px">
        <a class="btn primary" href="#/add" id="cta-add">➕ Paste your links</a>
        <a class="btn" href="#/dates" id="cta-dates">☕ Watch agents date</a>
        <a class="btn" href="#/rankings" id="cta-rank">🏆 Rankings</a>
      </div>
      <div class="stats">
        <div class="stat"><div class="num grad-text">${ready.length}</div><div class="lbl">agents profiled</div></div>
        <div class="stat"><div class="num grad-text">${done.length}</div><div class="lbl">dates completed</div></div>
        <div class="stat"><div class="num grad-text">${done.filter((d) => d.mutual).length}</div><div class="lbl">mutual 2nd dates</div></div>
        <div class="stat"><div class="num grad-text">${done.reduce((s, d) => s + d.messages, 0)}</div><div class="lbl">lines spoken on dates</div></div>
      </div>
    </div>
    <div class="pipeline">
      <div class="pipe" style="animation-delay:.05s"><div class="ico">🔗</div><div><b>LinkedIn + Instagram</b><span>The only two sources. Public profiles only.</span></div></div>
      <div class="arrow">↓</div>
      <div class="pipe" style="animation-delay:.15s"><div class="ico">🧠</div><div><b>The agent reads its person</b><span>Bio, career, captions, hashtags, locations — and looks at their photos.</span></div></div>
      <div class="arrow">↓</div>
      <div class="pipe" style="animation-delay:.25s"><div class="ico">🪪</div><div><b>Profile page</b><span>Needs · hobbies · interests · values · personality, every claim cited.</span></div></div>
      <div class="arrow">↓</div>
      <div class="pipe" style="animation-delay:.35s"><div class="ico">🍷</div><div><b>The agents date</b><span>Swipe on cards, pick a venue, talk turn-by-turn, debrief privately.</span></div></div>
      <div class="arrow">↓</div>
      <div class="pipe" style="animation-delay:.45s"><div class="ico">🏆</div><div><b>Ranking</b><span>For every person: who fits them best, and why.</span></div></div>
    </div>
  </section>
  <section class="grid g2">
    <div class="card"><div class="section-title">💞 Top couples so far</div>
      ${top.length ? top.map((d) => `<a class="row between" href="#/d/${d.id}" style="padding:10px 0;border-bottom:1px solid var(--border)"><div class="row"><div class="pair">${av(P(d.a), 'sm')}${av(P(d.b), 'sm')}</div><div><b>${esc(first(P(d.a).name))} & ${esc(first(P(d.b).name))}</b><div class="small dim">${esc(d.venue?.venue || '')}</div></div></div><div class="row"><span>${d.mutual ? '💞' : ''}</span><b class="grad-text" style="font-size:20px;font-family:Outfit">${d.match}</b></div></a>`).join('') : `<div class="muted">No dates yet. ${ready.length >= 2 ? '<a class="grad-text" href="#/dates">Start a dating round →</a>' : 'Add at least two people first.'}</div>`}
    </div>
    <div class="card"><div class="section-title"><span class="dot"></span> Live activity</div><div class="ticker" id="ticker"><div class="muted small">Waiting for agents to do something… (start a round or add a person)</div></div></div>
  </section>`;
}
function tick(ev) {
  const t = $('#ticker'); if (!t) return;
  let html = '';
  if (ev.type === 'analysis') html = `${av(P(ev.personId), 'sm')}<span><b>${esc(first(P(ev.personId).name))}'s agent:</b> ${esc(ev.msg.slice(0, 120))}</span>`;
  if (ev.type === 'swipe') html = `🃏 <span><b>${esc(first(P(ev.from).name))}'s agent</b> rated ${esc(first(P(ev.to).name))} <b>${ev.score}</b> — ${esc(ev.reason || '')}</span>`;
  if (ev.type === 'date_msg' && ev.item.kind !== 'scene') html = `${av(P(ev.item.speaker), 'sm')}<span><b>${esc(first(P(ev.item.speaker).name))}:</b> ${fmt(ev.item.text.slice(0, 140))}</span>`;
  if (ev.type === 'date_end') html = `💘 <span>A date just ended — match <b>${ev.match}</b>${ev.mutual ? ' · both want a second date!' : ''}</span>`;
  if (!html) return;
  if (t.firstElementChild?.classList.contains('muted')) t.innerHTML = '';
  t.insertAdjacentHTML('afterbegin', `<div class="tick">${html}</div>`);
  while (t.children.length > 8) t.lastElementChild.remove();
}

// ---------------------------------------------------------------- add
function addView() {
  CURRENT = { view: 'add' };
  $('#app').innerHTML = `${readOnly() ? roNote() : ''}
  <h2>Add people</h2><p class="muted" style="margin-top:-6px">Each person = exactly two links: their LinkedIn and their own <b>public</b> Instagram. That's all the agent will ever know.</p>
  <div class="grid g2" style="margin-top:20px">
    <form class="card" id="single-form">
      <div class="section-title">👤 One person</div>
      <div class="field"><label for="f-li">LinkedIn URL</label><input id="f-li" name="linkedin" placeholder="https://www.linkedin.com/in/username" required /></div>
      <div class="field"><label for="f-ig">Instagram URL (public)</label><input id="f-ig" name="instagram" placeholder="https://www.instagram.com/username" required /></div>
      <div class="grid g2" style="gap:12px">
        <div class="field"><label for="f-g">They are <span class="dim">(optional)</span></label><select id="f-g" name="gender"><option value="">Prefer not to say</option><option value="woman">A woman</option><option value="man">A man</option><option value="nonbinary">Non-binary</option></select></div>
        <div class="field"><label for="f-i">Interested in <span class="dim">(optional)</span></label><select id="f-i" name="interestedIn"><option value="any">Everyone</option><option value="woman">Women</option><option value="man">Men</option></select></div>
      </div>
      <details style="margin-bottom:14px"><summary class="small">Scraper blocked? Paste the visible text of the same public profiles</summary>
        <p class="small dim">LinkedIn/Instagram sometimes block anonymous scraping. Copy-paste what's publicly visible on <i>those two profiles</i> — still the only two sources.</p>
        <div class="field"><label for="f-lit">LinkedIn profile text</label><textarea id="f-lit" name="linkedinText" rows="4"></textarea></div>
        <div class="field"><label for="f-igt">Instagram profile text (bio + captions)</label><textarea id="f-igt" name="instagramText" rows="4"></textarea></div>
      </details>
      <label class="check"><input type="checkbox" name="consent" id="f-consent" required /> This is me, or this person agreed to be represented by an agent on Wingman.</label>
      <button class="btn primary" style="margin-top:16px;width:100%;justify-content:center" id="f-submit" ${readOnly() ? 'disabled' : ''}>🧠 Create agent & analyze</button>
    </form>
    <form class="card" id="bulk-form">
      <div class="section-title">👥 Bulk paste</div>
      <label for="b-text">One person per line: <span class="kbd">linkedin_url instagram_url</span></label>
      <textarea id="b-text" name="text" rows="11" placeholder="https://www.linkedin.com/in/jane-doe https://www.instagram.com/janedoe\nhttps://www.linkedin.com/in/sam-lee https://instagram.com/sam.lee"></textarea>
      <label class="check" style="margin-top:12px"><input type="checkbox" name="consent" id="b-consent" required /> Everyone in this list agreed to be represented on Wingman.</label>
      <button class="btn" style="margin-top:16px;width:100%;justify-content:center" id="b-submit" ${readOnly() ? 'disabled' : ''}>Add all & analyze</button>
      <div id="bulk-out" class="small" style="margin-top:12px"></div>
    </form>
  </div>
  <div class="card small muted" style="margin-top:18px">⚙️ Agent brain: <b>${esc(STATE.llm.provider)}/${esc(STATE.llm.model)}</b>${STATE.llm.isMock ? ' — <span style="color:var(--amber)">offline heuristic mode (no API key configured)</span>' : ''} · Scraping: ${STATE.scrapers?.apify ? 'Apify actors → public endpoints fallback' : 'public endpoints (set APIFY_TOKEN for robust scraping)'} · Private Instagram accounts are rejected.</div>`;

  $('#single-form').onsubmit = async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target)); f.consent = !!f.consent;
    try { const r = await api('/people', { method: 'POST', body: f }); toast(r.duplicate ? 'Already here — opening their profile.' : 'Agent created — watch it read its person.'); await refreshState(); location.hash = `#/p/${r.id}`; } catch (err) { toast('⚠️ ' + err.message, 6000); }
  };
  $('#bulk-form').onsubmit = async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target)); f.consent = !!f.consent;
    try {
      const r = await api('/people/bulk', { method: 'POST', body: f });
      $('#bulk-out').innerHTML = r.results.map((x) => x.error ? `<div style="color:#ff8080">✗ ${esc(x.error)}</div>` : `<div style="color:var(--mint)">✓ ${x.duplicate ? 'already added' : 'queued'}: <a href="#/p/${x.id}">${esc(x.line.slice(0, 70))}</a></div>`).join('');
      refreshState();
    } catch (err) { toast('⚠️ ' + err.message, 6000); }
  };
}

// ---------------------------------------------------------------- people
function peopleView() {
  CURRENT = { view: 'people' };
  const ppl = STATE.people;
  $('#app').innerHTML = `${readOnly() ? roNote() : ''}
  <div class="row between wrap" style="margin-bottom:18px"><div><h2 style="margin:0">Agents <span class="dim">· ${ppl.length}</span></h2><div class="muted">Every person is represented by one agent. Click to open the profile page.</div></div>
  <div class="row"><input id="search" placeholder="Search name, job, hobby…" style="width:260px" /><a class="btn primary" href="#/add">➕ Add</a></div></div>
  ${ppl.length ? `<div class="grid g4" id="pgrid">${ppl.map((p) => `
    <a class="card pcard" href="#/p/${p.id}" data-q="${esc([p.name, p.headline, p.location, ...(p.tags || [])].join(' ').toLowerCase())}">
      <div class="row between">${av(p, 'md')}<span class="badge ${p.status}">${p.status === 'analyzing' ? '<span class="dot"></span> reading' : p.status}</span></div>
      <div><h3>${esc(p.name)}</h3><div class="small muted">${esc(p.headline || '')}</div></div>
      <div class="one">${esc(p.one_liner || (p.status === 'error' ? p.error : 'Agent is reading this person…'))}</div>
      <div class="chips">${(p.tags || []).map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>
    </a>`).join('')}</div>` : `<div class="card empty">No agents yet. <a class="grad-text" href="#/add">Paste the first two links →</a></div>`}`;
  $('#search')?.addEventListener('input', (e) => { const q = e.target.value.toLowerCase(); document.querySelectorAll('#pgrid .pcard').forEach((c) => (c.style.display = c.dataset.q.includes(q) ? '' : 'none')); });
}

// ---------------------------------------------------------------- profile
const logLine = (l) => `<div><span class="t">${new Date(l.at).toLocaleTimeString()}</span><span class="${l.kind}">${esc(l.msg)}</span></div>`;
function appendLog(ev) {
  const t = $('#log'); if (!t) return;
  t.insertAdjacentHTML('beforeend', logLine({ at: Date.now(), msg: ev.msg, kind: ev.kind }));
  t.scrollTop = t.scrollHeight;
}
const srcTag = (s) => `<span class="src ${esc(s || 'both')}">${esc(s || 'both')}</span>`;

async function profileView(id) {
  CURRENT = { view: 'profile', id };
  const p = await api(`/people/${id}`);
  const a = p.analysis || {};
  const ready = p.status === 'ready';
  const others = STATE.people.filter((o) => o.id !== id && o.status === 'ready');
  const ig = p.sources?.instagram, li = p.sources?.linkedin;
  $('#app').innerHTML = `
  <div class="card profile-head">
    ${av(p, 'lg')}
    <div>
      <div class="row wrap" style="gap:8px;margin-bottom:6px"><span class="badge ${p.status}">${p.status === 'analyzing' ? '<span class="dot"></span> agent is reading' : esc(p.status)}</span>${a.confidence != null ? `<span class="chip">🎯 analysis confidence ${a.confidence}%</span>` : ''}</div>
      <h1>${esc(p.name)}</h1>
      <div class="muted">${esc(a.headline || '')}${a.location ? ' · 📍 ' + esc(a.location) : ''}</div>
      ${a.one_liner ? `<p class="oneliner grad-text">${esc(a.one_liner)}</p>` : ''}
      <div class="row wrap" style="margin-top:12px;gap:8px"><a class="btn sm" target="_blank" rel="noopener" href="${esc(p.linkedin)}" id="link-li">in · LinkedIn</a><a class="btn sm" target="_blank" rel="noopener" href="${esc(p.instagram)}" id="link-ig">◎ Instagram</a></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;min-width:230px">
      ${!readOnly() && ready ? `<button class="btn primary" id="btn-match">💘 Find my matches (3 dates)</button>
      <div class="row" style="gap:6px"><select id="date-with"><option value="">Send on a date with…</option>${others.map((o) => `<option value="${o.id}">${esc(o.name)}</option>`).join('')}</select><button class="btn sm" id="btn-date">Go</button></div>` : ''}
      <a class="btn" href="#/rankings/${id}" id="btn-rank">🏆 ${esc(first(p.name))}'s ranking</a>
      ${!readOnly() && p.status !== 'analyzing' && p.status !== 'queued' ? `<button class="btn sm" id="btn-re">↻ Re-analyze</button>` : ''}
    </div>
  </div>

  ${!ready ? `
    <div class="grid g2" style="margin-top:22px">
      <div class="card"><div class="section-title">🧠 The agent is reading ${esc(first(p.name))}</div><div class="terminal" id="log">${(p.log || []).map(logLine).join('')}</div>
      ${p.status === 'error' ? `<p style="color:#ff8080">${esc(p.error)}</p>` : ''}</div>
      ${p.status === 'error' && !readOnly() ? `<form class="card" id="manual-form"><div class="section-title">Scraper blocked? Paste the public profile text</div><p class="small dim">Copy what's visible on their public LinkedIn and Instagram pages (the same two sources) and re-run the agent.</p>
        <div class="field"><label>LinkedIn profile text</label><textarea name="linkedinText" rows="5"></textarea></div><div class="field"><label>Instagram text (bio + captions)</label><textarea name="instagramText" rows="5"></textarea></div><button class="btn primary">Re-run analysis</button></form>` : `<div class="card"><div class="section-title">What happens</div><ol class="muted"><li>Scrape the public LinkedIn (career, education, skills, about).</li><li>Scrape the public Instagram (bio, captions, hashtags, locations).</li><li>Download recent photos so the agent can actually look at them.</li><li>Write an evidence-cited profile: needs, hobbies, interests, values, personality, voice.</li></ol></div>`}
    </div>` : `
  <div class="layout">
    <div class="grid" style="gap:18px">
      <div class="card"><div class="section-title">📝 The agent's read on ${esc(first(p.name))}</div><p style="font-size:16px;margin:0">${esc(a.summary)}</p></div>

      <div class="card"><div class="section-title">❤️ Needs <span class="dim" style="text-transform:none;letter-spacing:0">— what ${esc(first(p.name))} needs from a partner</span></div>
        <div class="grid g2" style="gap:12px">${(a.needs || []).map((n) => `<div class="need"><b>${esc(n.need)}</b><div class="small muted">${esc(n.why)}</div><div class="evidence">${srcTag(n.source)}<i>${esc(n.evidence)}</i></div></div>`).join('')}</div></div>

      <div class="grid g2" style="gap:18px">
        <div class="card"><div class="section-title">🎒 Hobbies</div><div class="grid" style="gap:8px">${(a.hobbies || []).map((h) => `<div class="item"><div class="row between"><b>${esc(h.name)}</b>${srcTag(h.source)}</div><div class="small dim">${esc(h.evidence)}</div></div>`).join('')}</div></div>
        <div class="card"><div class="section-title">✨ Interests</div><div class="grid" style="gap:8px">${(a.interests || []).map((h) => `<div class="item"><div class="row between"><b>${esc(h.name)}</b>${srcTag(h.source)}</div><div class="small dim">${esc(h.evidence)}</div></div>`).join('')}</div></div>
      </div>

      <div class="grid g2" style="gap:18px">
        <div class="card"><div class="section-title">🧬 Personality</div><div class="bars">${['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'emotional_stability'].map((k) => `<div class="bar"><span>${k.replace('_', ' ')}</span><div class="track"><i style="width:${Number(a.personality?.[k]) || 0}%"></i></div><b>${Number(a.personality?.[k]) || 0}</b></div>`).join('')}</div><div class="small muted">${esc(a.personality?.note || '')}</div></div>
        <div class="card"><div class="section-title">🧭 Values & lifestyle</div><div class="chips" style="margin-bottom:12px">${(a.values || []).map((v) => `<span class="chip violet">${esc(v)}</span>`).join('')}</div><div class="chips">${(a.lifestyle || []).map((v) => `<span class="chip amber">${esc(v)}</span>`).join('')}</div></div>
      </div>

      <div class="grid g3" style="gap:18px">
        <div class="card"><div class="section-title">💼 Career</div><b>${esc(a.career?.field || '')}</b><div class="small muted">${esc(a.career?.stage || '')} · ${esc(a.career?.ambition || '')}</div><p class="small">${esc(a.career?.summary || '')}</p></div>
        <div class="card"><div class="section-title">💬 Communication</div><p class="small" style="margin:0 0 8px">${esc(a.communication_style || '')}</p><div class="small muted"><b>Humor:</b> ${esc(a.humor || '')}</div></div>
        <div class="card"><div class="section-title">🗣️ Voice on dates</div><p class="small" style="margin:0">${esc(a.voice || '')}</p></div>
      </div>

      <div class="grid g2" style="gap:18px">
        <div class="card"><div class="section-title">💘 Ideal partner</div><p style="margin:0 0 12px">${esc(a.ideal_partner || '')}</p><div class="section-title" style="margin-top:12px">🌇 Ideal first date</div><p style="margin:0">${esc(a.ideal_first_date || '')}</p></div>
        <div class="card"><div class="section-title">🟢 Green flags</div><div class="chips" style="margin-bottom:14px">${(a.green_flags || []).map((v) => `<span class="chip mint">${esc(v)}</span>`).join('')}</div><div class="section-title">🟠 Potential frictions</div><div class="chips" style="margin-bottom:14px">${(a.potential_frictions || []).map((v) => `<span class="chip amber">${esc(v)}</span>`).join('')}</div><div class="section-title">⛔ Likely dealbreakers</div><div class="chips">${(a.dealbreakers_likely || []).map((v) => `<span class="chip rose">${esc(v)}</span>`).join('')}</div></div>
      </div>

      <div class="card"><div class="section-title">🪪 Dating card <span class="dim" style="text-transform:none;letter-spacing:0">— the only thing other agents get to see</span></div><p class="quote">“${esc(a.dating_card || '')}”</p><div class="small dim" style="margin-top:10px">Conversation starters: ${(a.conversation_starters || []).map(esc).join(' · ')}</div></div>

      <div class="card"><div class="section-title">🧠 How the agent read ${esc(first(p.name))} <span class="dim" style="text-transform:none;letter-spacing:0">— full reading log</span></div><div class="terminal" id="log">${(p.log || []).map(logLine).join('')}</div>
        <div class="small dim" style="margin-top:10px">${esc(a.confidence_note || '')}</div></div>

      <details class="card"><summary>🔎 Raw sources the agent used (LinkedIn via ${esc(li?.via || 'n/a')}, Instagram via ${esc(ig?.via || 'n/a')})</summary>
        <div class="grid g2" style="margin-top:12px"><pre class="raw">${esc(JSON.stringify(li || 'LinkedIn not scraped' + (p.hasManual ? ' (pasted text used)' : ''), null, 2))}</pre><pre class="raw">${esc(JSON.stringify(ig ? { ...ig, posts: ig.posts?.map(({ imageUrl, ...r }) => r) } : 'Instagram not scraped' + (p.hasManual ? ' (pasted text used)' : ''), null, 2))}</pre></div></details>
    </div>

    <aside class="grid" style="gap:18px">
      ${p.photos?.length ? `<div class="card"><div class="section-title">📸 Photos the agent looked at</div><div class="photos">${p.photos.map((ph) => `<img src="${esc(ph.url)}" title="${esc(ph.caption)}" alt="${esc(ph.caption || 'Instagram photo')}" loading="lazy" onerror="this.remove()" />`).join('')}</div></div>` : ''}
      ${ig ? `<div class="card small"><div class="section-title">◎ Instagram</div><b>@${esc(ig.username)}</b><div class="muted">${esc(ig.bio || '')}</div><div class="dim" style="margin-top:6px">${ig.followers ?? '?'} followers · ${ig.postsCount ?? '?'} posts</div></div>` : ''}
      <div class="card"><div class="section-title">🏆 Best fits so far</div>${p.ranking?.filter((r) => r.score != null).length ? p.ranking.filter((r) => r.score != null).map((r, i) => `<a class="row between" href="${r.dateId ? `#/d/${r.dateId}` : `#/p/${r.id}`}" style="padding:8px 0;border-bottom:1px solid var(--border)"><div class="row"><b class="dim" style="width:16px">${i + 1}</b>${av(P(r.id), 'sm')}<span>${esc(P(r.id).name)}</span></div><b class="grad-text">${r.score}</b></a>`).join('') + `<a class="small grad-text" href="#/rankings/${id}" style="display:block;margin-top:10px">Full ranking →</a>` : '<div class="small muted">No dates yet.</div>'}</div>
      <div class="card"><div class="section-title">☕ Dates (${p.dates.length})</div>${p.dates.length ? p.dates.map((d) => { const o = P(d.a === id ? d.b : d.a); return `<a class="row between" href="#/d/${d.id}" style="padding:8px 0;border-bottom:1px solid var(--border)"><div class="row">${av(o, 'sm')}<div><div>${esc(o.name)}</div><div class="small dim">${esc(d.venue?.venue || '…')}</div></div></div><span>${d.status === 'done' ? `${d.mutual ? '💞 ' : ''}<b>${d.match}</b>` : `<span class="badge ${d.status}">${d.status}</span>`}</span></a>`; }).join('') : '<div class="small muted">No dates yet.</div>'}</div>
      ${!readOnly() ? `<div class="card small"><div class="section-title">⚙️ Preferences</div><div class="field"><label>They are</label><select id="pref-g"><option value="">Prefer not to say</option>${['woman', 'man', 'nonbinary'].map((g) => `<option value="${g}" ${p.gender === g ? 'selected' : ''}>${g}</option>`).join('')}</select></div><div class="field"><label>Interested in</label><select id="pref-i">${[['any', 'Everyone'], ['woman', 'Women'], ['man', 'Men']].map(([v, l]) => `<option value="${v}" ${p.interestedIn === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>${!p.seeded ? `<button class="btn sm" id="btn-del" style="color:#ff8080">Remove person</button>` : ''}</div>` : ''}
    </aside>
  </div>`}`;

  const log = $('#log'); if (log && !ready) log.scrollTop = log.scrollHeight;
  $('#btn-match')?.addEventListener('click', async () => { try { await api(`/people/${id}/match`, { method: 'POST', body: { perPerson: 3 } }); toast(`${first(p.name)}'s agent is swiping, then heading out on 3 dates…`); location.hash = '#/dates'; } catch (e) { toast('⚠️ ' + e.message); } });
  $('#btn-date')?.addEventListener('click', async () => { const b = $('#date-with').value; if (!b) return toast('Pick someone first'); try { const r = await api('/dates', { method: 'POST', body: { a: id, b } }); if (r.warning) toast(r.warning); location.hash = `#/d/${r.id}`; } catch (e) { toast('⚠️ ' + e.message); } });
  $('#btn-re')?.addEventListener('click', async () => { await api(`/people/${id}/reanalyze`, { method: 'POST', body: {} }); route(true); });
  $('#manual-form')?.addEventListener('submit', async (e) => { e.preventDefault(); await api(`/people/${id}/reanalyze`, { method: 'POST', body: Object.fromEntries(new FormData(e.target)) }); route(true); });
  const savePref = async () => { await api(`/people/${id}`, { method: 'PATCH', body: { gender: $('#pref-g').value, interestedIn: $('#pref-i').value } }); toast('Preferences saved'); refreshState(); };
  $('#pref-g')?.addEventListener('change', savePref); $('#pref-i')?.addEventListener('change', savePref);
  $('#btn-del')?.addEventListener('click', async () => { if (!confirm(`Remove ${p.name} and all their dates?`)) return; try { await api(`/people/${id}`, { method: 'DELETE' }); await refreshState(); location.hash = '#/people'; } catch (e) { toast('⚠️ ' + e.message); } });
}

// ---------------------------------------------------------------- dates list
function datesView() {
  CURRENT = { view: 'dates' };
  const ready = STATE.people.filter((p) => p.status === 'ready');
  const live = STATE.dates.filter((d) => d.status === 'live' || d.status === 'debrief');
  const rest = STATE.dates.filter((d) => !(d.status === 'live' || d.status === 'debrief'));
  const dc = (d) => `<a class="card dcard" href="#/d/${d.id}">
    <div class="pair">${av(P(d.a), 'md')}${av(P(d.b), 'md')}</div>
    <div><b style="font-family:Outfit;font-size:17px">${esc(P(d.a).name)} <span class="heart">&</span> ${esc(P(d.b).name)}</b>
      <div class="small muted">${d.venue ? `📍 ${esc(d.venue.venue)} — ${esc(d.venue.activity)}` : 'Picking a venue…'}</div>
      <div class="small dim">${d.status === 'done' ? `“${esc(d.headlines?.[d.a] || '')}” / “${esc(d.headlines?.[d.b] || '')}”` : `${d.messages} lines so far`} · ${ago(d.createdAt)}</div></div>
    <div class="score">${d.status === 'done' ? `${d.mutual ? '💞 ' : ''}<span class="grad-text">${d.match}</span><small>match</small>` : `<span class="badge ${d.status}">${d.status === 'live' ? '<span class="dot"></span> live' : esc(d.status)}</span>`}</div></a>`;
  $('#app').innerHTML = `${readOnly() ? roNote() : ''}
  <div class="row between wrap" style="margin-bottom:18px"><div><h2 style="margin:0">Dates <span class="dim">· ${STATE.dates.length}</span></h2><div class="muted">Each date is two independent agents talking — each knows only its own person deeply and the other's public card.</div></div></div>
  ${!readOnly() ? `<div class="grid g2" style="margin-bottom:22px">
    <div class="card"><div class="section-title">🃏 Run a dating round</div><p class="small muted" style="margin-top:-6px">Every agent swipes on every card it hasn't seen, then the strongest mutual prospects go on real dates.</p>
      <div class="row"><label for="per" style="margin:0;white-space:nowrap">Dates per person</label><input id="per" type="number" min="1" max="8" value="3" style="width:80px" /><button class="btn primary" id="btn-round" ${STATE.job?.running || ready.length < 2 ? 'disabled' : ''}>Start round</button></div></div>
    <div class="card"><div class="section-title">🎯 Arrange a specific date</div>
      <div class="row"><select id="da"><option value="">Person A</option>${ready.map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select><span class="heart">&</span><select id="db"><option value="">Person B</option>${ready.map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select><button class="btn" id="btn-pair">Send</button></div></div>
  </div>` : ''}
  ${live.length ? `<div class="section-title"><span class="dot"></span> Happening now</div><div class="grid" style="margin-bottom:24px">${live.map(dc).join('')}</div>` : ''}
  <div class="section-title">Finished</div>
  ${rest.length ? `<div class="grid g2">${rest.map(dc).join('')}</div>` : `<div class="card empty">No dates yet.</div>`}`;
  $('#btn-round')?.addEventListener('click', async () => {
    try {
      const per = Number($('#per').value) || 1;
      toast('Starting dating round — agents are swiping…');
      const res = await api('/round', { method: 'POST', body: { perPerson: per } });
      toast(res.completed ? 'Round completed!' : 'Round started — watch live…');
      await refreshState();
      route(true);
    } catch (e) {
      toast('⚠️ ' + e.message);
    }
  });
  $('#btn-pair')?.addEventListener('click', async () => {
    const a = $('#da').value, b = $('#db').value;
    if (!a || !b || a === b) return toast('Pick two different people');
    try {
      toast('Setting up date…');
      const r = await api('/dates', { method: 'POST', body: { a, b } });
      if (!r.id) throw new Error('Could not initialize date');
      if (r.warning) toast(r.warning);
      await refreshState();
      location.hash = `#/d/${r.id}`;
    } catch (e) {
      toast('⚠️ ' + e.message);
    }
  });
}

// ---------------------------------------------------------------- single date
let DATE = null;
const msgHtml = (t, i = 0) => {
  if (t.kind === 'scene') return `<div class="scene">${esc(t.text)}</div>`;
  const p = P(t.speaker), side = t.speaker === DATE.a ? 'left' : 'right';
  return `<div class="msg ${side}" style="animation-delay:${Math.min(i, 30) * 0.04}s">${av(p, 'sm')}<div class="bubble"><div class="who">${esc(first(p.name))}'s agent ${t.kind === 'invite' ? '<span class="tag">· invite</span>' : ''}</div>${fmt(t.text)}</div></div>`;
};
function appendMsg(item) {
  if (!DATE) return;
  DATE.transcript.push(item);
  const chat = $('#chat'); if (!chat) return;
  $('#typing')?.remove();
  chat.insertAdjacentHTML('beforeend', msgHtml(item));
  chat.insertAdjacentHTML('beforeend', typingHtml());
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}
const typingHtml = () => {
  const msgs = DATE.transcript.filter((t) => t.kind !== 'scene');
  const next = msgs.length ? (msgs.at(-1).speaker === DATE.a ? DATE.b : DATE.a) : DATE.a;
  return DATE.status === 'live' ? `<div class="msg ${next === DATE.a ? 'left' : 'right'}" id="typing">${av(P(next), 'sm')}<div class="bubble typing"><i></i><i></i><i></i></div></div>` : '';
};
function verdictCard(meId, otherId, side) {
  const v = DATE.verdicts?.[meId]; if (!v) return '';
  const me = P(meId);
  return `<div class="card verdict ${side}">
    <div class="row between"><div class="row">${av(me, 'sm')}<div><b>${esc(first(me.name))}'s agent</b><div class="small dim">private debrief to ${esc(first(me.name))}</div></div></div><div class="big grad-text">${Number(v.overall) || 0}</div></div>
    <h3 style="margin:14px 0 6px">“${esc(v.headline || '')}”</h3>
    <div class="bars" style="margin:12px 0">${Object.entries(v.scores || {}).map(([k, s]) => `<div class="bar"><span>${esc(k)}</span><div class="track"><i style="width:${Number(s) || 0}%"></i></div><b>${Number(s) || 0}</b></div>`).join('')}</div>
    <p class="small"><b>✨ Best moment:</b> <span class="muted">${esc(v.highlight || '')}</span></p>
    <p class="small"><b>🤔 Doubt:</b> <span class="muted">${esc(v.concern || '')}</span></p>
    <p class="quote">${esc(v.note_to_human || '')}</p>
    <div style="margin-top:12px">${v.second_date ? '<span class="chip mint">✅ Wants a second date</span>' : '<span class="chip rose">✋ Would pass</span>'}</div></div>`;
}
async function dateView(id) {
  CURRENT = { view: 'date', id };
  DATE = await api(`/dates/${id}`);
  const A = P(DATE.a), B = P(DATE.b);
  $('#app').innerHTML = `<div class="theatre">
    <a href="#/dates" class="small muted">← all dates</a>
    <div class="venue" style="margin-top:12px">
      <div class="pair">${av(A, 'lg')}${av(B, 'lg')}</div>
      <div class="small muted"><a href="#/p/${A.id}">${esc(A.name)}</a> <span class="heart">&</span> <a href="#/p/${B.id}">${esc(B.name)}</a></div>
      <h2>${DATE.venue ? `📍 ${esc(DATE.venue.venue)}` : '<span class="dot"></span> Planning the date…'}</h2>
      ${DATE.venue ? `<div class="muted">${esc(DATE.venue.activity)}</div><div class="small dim" style="margin-top:6px">Why ${esc(first(A.name))}'s agent picked it: ${esc(DATE.venue.why || '')}</div>` : ''}
      <div style="margin-top:10px"><span class="badge ${DATE.status}">${DATE.status === 'live' ? '<span class="dot"></span> live — agents are talking' : DATE.status === 'debrief' ? 'agents are debriefing privately…' : esc(DATE.status)}</span></div>
    </div>
    <div class="chat" id="chat">${DATE.transcript.map(msgHtml).join('')}${typingHtml()}</div>
    ${DATE.status === 'error' ? `<div class="card" style="color:#ff8080">Date failed: ${esc(DATE.error)}</div>` : ''}
    ${DATE.status === 'done' ? `
      <div class="card match-hero"><div class="section-title" style="justify-content:center">After the date</div><div class="num grad-text">${DATE.match}</div><div class="muted">match score (harmonic mean of both agents' private verdicts)</div><div style="margin-top:10px">${DATE.mutual ? '<span class="chip rose">💞 Both agents want a second date</span>' : '<span class="chip">Not mutual</span>'}</div></div>
      <div class="grid g2" style="margin-top:18px">${verdictCard(DATE.a, DATE.b, 'left')}${verdictCard(DATE.b, DATE.a, 'right')}</div>` : ''}
  </div>`;
}

// ---------------------------------------------------------------- rankings
async function rankingsView(id) {
  CURRENT = { view: 'rankings', id };
  const all = await api('/rankings');
  const ready = STATE.people.filter((p) => all[p.id]);
  if (!ready.length) { $('#app').innerHTML = `<div class="card empty">No rankings yet — add people and run a dating round.</div>`; return; }
  const sel = id && all[id] ? id : null;
  const couples = STATE.dates.filter((d) => d.status === 'done').sort((a, b) => b.match - a.match).slice(0, 10);
  $('#app').innerHTML = `${readOnly() ? roNote() : ''}
  <h2>Rankings</h2><p class="muted" style="margin-top:-6px">For every person: who fits them best. Dated pairs use the agents' post-date verdicts (60% their own agent, 40% the other side, +5 if both want a second date). Undated pairs are predicted from mutual swipes.</p>
  <div class="rank-layout" style="margin-top:18px">
    <div class="card plist">
      <a href="#/rankings" class="${!sel ? 'on' : ''}"><div class="avatar sm" style="background:var(--grad)">★</div><b>Overview</b></a>
      ${ready.map((p) => `<a href="#/rankings/${p.id}" class="${sel === p.id ? 'on' : ''}">${av(p, 'sm')}<div style="min-width:0"><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.name)}</div><div class="small dim">${all[p.id][0]?.score != null ? `#1 ${esc(first(P(all[p.id][0].id).name))} · ${all[p.id][0].score}` : '—'}</div></div></a>`).join('')}
    </div>
    <div>${sel ? (() => {
      const me = P(sel);
      return `<div class="card row" style="margin-bottom:16px">${av(me, 'md')}<div><h3 style="margin:0">Who fits ${esc(me.name)} best</h3><div class="small muted">${esc(me.headline || '')}</div></div><a class="btn sm" style="margin-left:auto" href="#/p/${sel}">Profile</a></div>
      ${all[sel].map((r, i) => { const o = P(r.id); return `<div class="rank" style="animation-delay:${i * 0.03}s"><div class="pos">${i + 1}</div>${av(o, 'md')}<div><div class="row wrap" style="gap:8px"><a href="#/p/${o.id}"><b style="font-family:Outfit;font-size:17px">${esc(o.name)}</b></a>${basisChip(r.basis)}</div><div class="small dim">${esc(o.headline || '')}</div>${r.headline ? `<div class="small" style="margin-top:4px">“${esc(r.headline)}”</div>` : ''}<div class="why">${esc(r.reason)}</div>${r.dateId ? `<a class="small grad-text" href="#/d/${r.dateId}">Read the date →</a>` : ''}</div><div class="score">${r.score ?? '—'}<small>${r.own != null ? `${esc(first(me.name))}: ${r.own} · them: ${r.theirs ?? '—'}` : ''}</small></div></div>`; }).join('')}`;
    })() : `
      <div class="card" style="margin-bottom:18px"><div class="section-title">💞 Top couples</div>${couples.map((d, i) => `<a class="rank" href="#/d/${d.id}"><div class="pos">${i + 1}</div><div class="pair">${av(P(d.a), 'sm')}${av(P(d.b), 'sm')}</div><div><b>${esc(P(d.a).name)} & ${esc(P(d.b).name)}</b><div class="why">${esc(d.venue?.venue || '')}</div></div><div class="score">${d.mutual ? '💞 ' : ''}${d.match}</div></a>`).join('') || '<div class="muted">No dates yet.</div>'}</div>
      <div class="card matrix"><div class="section-title">🔥 Fit matrix <span class="dim" style="text-transform:none;letter-spacing:0">— row = person, column = candidate; click a cell</span></div>
        <table><tr><th></th>${ready.map((p) => `<th class="rot"><div>${esc(first(p.name))}</div></th>`).join('')}</tr>
        ${ready.map((r) => `<tr><th class="left">${esc(first(r.name))}</th>${ready.map((c) => { if (c.id === r.id) return '<td style="background:rgba(255,255,255,.02)"></td>'; const x = all[r.id].find((y) => y.id === c.id); const s = x?.score ?? null; return `<td title="${esc(r.name)} → ${esc(c.name)}: ${s ?? 'n/a'} (${x?.basis || 'ineligible'})" style="background:${scoreColor(s)};${x?.basis === 'mutual' ? 'outline:2px solid var(--rose)' : ''}" data-go="${x?.dateId ? `#/d/${x.dateId}` : `#/rankings/${r.id}`}">${s ?? ''}</td>`; }).join('')}</tr>`).join('')}</table></div>`}
    </div>
  </div>`;
  document.querySelectorAll('[data-go]').forEach((td) => td.addEventListener('click', () => (location.hash = td.dataset.go)));
}

// ---------------------------------------------------------------- how it works
function howView() {
  CURRENT = { view: 'how' };
  $('#app').innerHTML = `<div class="how" style="max-width:900px;margin:0 auto">
  <h2>How Wingman works</h2>
  <p>Every person is represented by an agent. The agent only ever sees two things: the person's <b>public LinkedIn</b> and their <b>public Instagram</b>. From those, it builds a deep profile — then it dates other agents on that person's behalf.</p>
  <div class="grid g2" style="margin-top:20px">
    <div class="card"><h3>1 · Scrape</h3><p>LinkedIn: Apify LinkedIn profile actor (headline, about, experience, education, skills, activity) → fallback to the public profile page's JSON-LD + meta tags. Instagram: Apify Instagram profile actor → fallback to Instagram's public <span class="kbd">web_profile_info</span> endpoint (bio, posts, captions, hashtags, locations, alt-text). Private accounts are rejected.</p></div>
    <div class="card"><h3>2 · Read & analyze</h3><p>The agent gets the text <i>and</i> up to 6 recent Instagram photos (vision). It writes an evidence-cited profile: needs, hobbies, interests, values, Big-Five personality, lifestyle, career, communication style, humor, ideal partner, frictions, its person's <b>voice</b>, and a public dating card. It is forbidden from inferring sensitive traits (religion, ethnicity, health, orientation, politics) or rating looks.</p></div>
    <div class="card"><h3>3 · Swipe</h3><p>Each agent reads every other agent's dating card and privately scores (0–100) how promising they are for <i>its</i> person — weighing needs and frictions, not just shared hobbies.</p></div>
    <div class="card"><h3>4 · Date</h3><p>The top mutual prospects go out. The more-interested agent picks a venue from what both share and sends an invite. Then the two agents talk turn-by-turn through three acts (arrival → getting real → wrap-up). <b>Each agent is a separate LLM context</b>: it knows its own person deeply and the other person only through their card — exactly like a real first date. Each speaks as its person, in their voice, while secretly testing for needs and dealbreakers.</p></div>
    <div class="card"><h3>5 · Debrief</h3><p>After the date, each agent privately reports to its own person: scores for values, lifestyle, interests, communication, goals and chemistry; an overall score; best moment; biggest doubt; whether it wants a second date; and a note addressed to its person.</p></div>
    <div class="card"><h3>6 · Rank</h3><p>For every person, candidates are ranked: dated pairs = 60% own agent's verdict + 40% the other side's, +5 if both want a second date. Undated pairs are estimated from mutual swipes (discounted ×0.9 and labelled "predicted").</p></div>
  </div>
  <div class="card" style="margin-top:18px"><h3>Stack</h3><p>Node.js + Express, vanilla JS/CSS front-end, Server-Sent Events for live dates, JSON file store. LLM: Google Gemini 2.5 Flash (vision + JSON mode) or any OpenAI-compatible model. Two spaces: <b>Demo</b> (the frozen, pre-run example) and <b>Live</b> (paste your own links — your agent dates the existing pool).</p></div>
  </div>`;
}

// ---------------------------------------------------------------- boot
document.querySelectorAll('#space-switch button').forEach((b) => { b.classList.toggle('on', b.dataset.space === SPACE); b.addEventListener('click', () => setSpace(b.dataset.space)); });
window.addEventListener('hashchange', () => route());
connect();
refreshState().then(() => route()).catch((e) => ($('#app').innerHTML = `<div class="empty">⚠️ ${esc(e.message)}</div>`));
