// Provider-agnostic LLM client (Gemini or any OpenAI-compatible API) with
// vision support, JSON mode, retries and a global concurrency limiter.
const PROVIDER = (process.env.LLM_PROVIDER ||
  (process.env.GEMINI_API_KEY ? 'gemini' : process.env.OPENAI_API_KEY ? 'openai' : 'mock')).toLowerCase();

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const OPENAI_BASE = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const MAX_CONC = Number(process.env.LLM_CONCURRENCY || 4);

export const llmInfo = {
  provider: PROVIDER,
  model: PROVIDER === 'gemini' ? GEMINI_MODEL : PROVIDER === 'openai' ? OPENAI_MODEL : 'offline-heuristics',
  isMock: PROVIDER === 'mock',
};

let active = 0;
const queue = [];
async function withSlot(fn) {
  if (active >= MAX_CONC) await new Promise((r) => queue.push(r));
  active++;
  try { return await fn(); } finally { active--; queue.shift()?.(); }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function parseJSON(text) {
  if (!text) throw new Error('Empty LLM response');
  let t = String(text).trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try { return JSON.parse(t); } catch {}
  const s = t.indexOf('{'), e = t.lastIndexOf('}');
  if (s >= 0 && e > s) return JSON.parse(t.slice(s, e + 1));
  throw new Error('Could not parse JSON from LLM: ' + t.slice(0, 200));
}

/**
 * messages: [{ role: 'user'|'assistant', text, images?: [{ mime, data(base64) }] }]
 */
export async function chat({ system, messages, json = false, temperature = 0.8, maxTokens = 2048, think = false }) {
  if (llmInfo.isMock) throw new Error('MOCK');
  return withSlot(async () => {
    let lastErr;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const out = PROVIDER === 'gemini'
          ? await callGemini({ system, messages, json, temperature, maxTokens, think })
          : await callOpenAI({ system, messages, json, temperature, maxTokens });
        return json ? parseJSON(out) : out.trim();
      } catch (e) {
        lastErr = e;
        const retryable = e.status === 429 || e.status >= 500 || /parse|Empty/i.test(e.message) || e.name === 'TypeError';
        if (!retryable) break;
        await sleep(1500 * 2 ** attempt + Math.random() * 500);
      }
    }
    throw lastErr;
  });
}

async function callGemini({ system, messages, json, temperature, maxTokens, think }) {
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [
      ...(m.images || []).map((img) => ({ inline_data: { mime_type: img.mime, data: img.data } })),
      { text: m.text || ' ' },
    ],
  }));
  // Gemini needs alternating roles starting with user.
  if (contents[0]?.role !== 'user') contents.unshift({ role: 'user', parts: [{ text: '(begin)' }] });
  const body = {
    contents,
    systemInstruction: system ? { parts: [{ text: system }] } : undefined,
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens + (think ? 4096 : 0),
      ...(json ? { responseMimeType: 'application/json' } : {}),
      ...(/2\.5/.test(GEMINI_MODEL) && !/pro/.test(GEMINI_MODEL) ? { thinkingConfig: { thinkingBudget: think ? 2048 : 0 } } : {}),
    },
  };
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  });
  if (!r.ok) { const err = new Error(`Gemini ${r.status}: ${(await r.text()).slice(0, 300)}`); err.status = r.status; throw err; }
  const data = await r.json();
  const text = data.candidates?.[0]?.content?.parts?.filter((p) => !p.thought).map((p) => p.text || '').join('') || '';
  if (!text) { const err = new Error('Empty Gemini response: ' + JSON.stringify(data).slice(0, 200)); err.status = 500; throw err; }
  return text;
}

async function callOpenAI({ system, messages, json, temperature, maxTokens }) {
  const msgs = [];
  if (system) msgs.push({ role: 'system', content: system });
  for (const m of messages) {
    if (m.images?.length) {
      msgs.push({ role: m.role, content: [
        ...m.images.map((img) => ({ type: 'image_url', image_url: { url: `data:${img.mime};base64,${img.data}`, detail: 'low' } })),
        { type: 'text', text: m.text || ' ' },
      ] });
    } else msgs.push({ role: m.role, content: m.text || ' ' });
  }
  const r = await fetch(`${OPENAI_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: OPENAI_MODEL, messages: msgs, temperature, max_tokens: maxTokens,
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  });
  if (!r.ok) { const err = new Error(`OpenAI ${r.status}: ${(await r.text()).slice(0, 300)}`); err.status = r.status; throw err; }
  const data = await r.json();
  return data.choices?.[0]?.message?.content || '';
}
