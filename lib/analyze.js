// The "reading" step: an agent studies its person using ONLY their LinkedIn + Instagram
// (text + up to 6 Instagram photos via vision) and writes a structured profile.
import { load, save, emit } from './db.js';
import { chat, llmInfo } from './llm.js';
import { scrapeInstagram, scrapeLinkedIn, fetchImage, storeImage } from './scrape.js';

const ANALYST_SYSTEM = `You are a person's personal dating agent — think a perceptive, warm, slightly witty matchmaker with the rigor of an investigator.
You are about to represent this person in the dating world, so you must understand them deeply.

HARD RULES
- You may ONLY use the two sources provided: their public LinkedIn and their public Instagram (text + photos). No outside knowledge about them, even if they seem famous.
- Every need, hobby and interest must be grounded in a concrete piece of evidence from those sources. Cite the source ("linkedin", "instagram" or "both") and a short quote or observation (e.g. "3 of 12 posts are trail runs", "headline: 'Founder @ ...'", "bio: 'chai > coffee'").
- Read between the lines: what someone posts vs. what they do for work, captions' tone, what recurs, what's absent, where they travel, who appears in photos (friends, family, pets), how polished vs. candid they are.
- NEVER infer or mention: religion, ethnicity/race, health conditions, sexual orientation, political views, income figures, or exact age. Do not rate physical attractiveness.
- Be specific, not generic. "Likes travel" is weak; "Chases mountain sunrises — 4 posts from Himalayan treks, captions about early alarms" is strong.
- If data is thin, say so in confidence_note and keep claims modest.

Return ONLY JSON with this exact shape:
{
  "name": string, "headline": string, "location": string,
  "one_liner": string (a vivid one-sentence hook about who they are),
  "summary": string (3-4 sentence portrait of the person — work life, off-duty life, energy),
  "reading_notes": [string] (6-10 short notes of what you noticed while reading, in order, each prefixed with [LinkedIn], [Instagram] or [Photos]),
  "needs": [{"need": string, "why": string, "source": "linkedin"|"instagram"|"both", "evidence": string}] (4-6 emotional/relationship needs, e.g. "A partner who respects 70-hour launch weeks", "Someone to explore new cities with"),
  "hobbies": [{"name": string, "source": string, "evidence": string}] (things they DO),
  "interests": [{"name": string, "source": string, "evidence": string}] (topics they care about / follow),
  "values": [string] (4-6),
  "personality": {"openness": 0-100, "conscientiousness": 0-100, "extraversion": 0-100, "agreeableness": 0-100, "emotional_stability": 0-100, "note": string},
  "lifestyle": [string] (5-8 short tags, e.g. "early riser", "weekend hiker", "city foodie", "homebody"),
  "career": {"field": string, "stage": string, "ambition": "steady"|"driven"|"very driven", "summary": string},
  "communication_style": string, "humor": string,
  "ideal_partner": string (2-3 sentences), "ideal_first_date": string,
  "green_flags": [string] (3-5), "potential_frictions": [string] (2-4, honest),
  "dealbreakers_likely": [string] (1-3),
  "conversation_starters": [string] (3),
  "voice": string (how this person probably talks: tone, energy, vocabulary, emoji use — so you can speak AS them on dates),
  "dating_card": string (60-90 word first-person dating bio, in their voice, that other agents will read),
  "confidence": 0-100, "confidence_note": string
}`;

function sourceDigest(li, ig, manual) {
  const parts = [];
  if (li) {
    parts.push('=== SOURCE 1: LINKEDIN (public profile) ===');
    parts.push(`Name: ${li.fullName || '?'}\nHeadline: ${li.headline || ''}\nLocation: ${li.location || ''}\nAbout: ${li.about || ''}`);
    if (li.experiences?.length) parts.push('Experience:\n' + li.experiences.map((e) => `- ${[e.title, e.company].filter(Boolean).join(' @ ')} ${e.duration ? `(${e.duration})` : ''}${e.description ? ' — ' + e.description.slice(0, 300) : ''}`).join('\n'));
    if (li.education?.length) parts.push('Education:\n' + li.education.map((e) => `- ${e.school}${e.degree ? ', ' + e.degree : ''} ${e.duration || ''}`).join('\n'));
    for (const k of ['skills', 'languages', 'certifications', 'volunteering', 'honors', 'awards', 'interests']) if (li[k]?.length) parts.push(`${k[0].toUpperCase() + k.slice(1)}: ${li[k].join(', ')}`);
    if (li.posts?.length) parts.push('Recent LinkedIn activity:\n' + li.posts.map((p) => '- ' + p.slice(0, 300)).join('\n'));
    if (li.visibleText) parts.push('Visible public page text (may be noisy):\n' + li.visibleText.slice(0, 4000));
  }
  if (manual?.linkedinText) parts.push('=== LINKEDIN (text copied from the public profile by the submitter) ===\n' + manual.linkedinText.slice(0, 6000));
  if (ig) {
    parts.push('=== SOURCE 2: INSTAGRAM (public profile) ===');
    parts.push(`@${ig.username} — ${ig.fullName || ''}\nBio: ${ig.bio || ''}\nLink: ${ig.externalUrl || ''}\nCategory: ${ig.category || ''}\nFollowers: ${ig.followers ?? '?'} · Following: ${ig.following ?? '?'} · Posts: ${ig.postsCount ?? '?'}`);
    if (ig.posts?.length) parts.push('Recent posts (newest first):\n' + ig.posts.map((p, i) => `#${i + 1} [${p.type || 'post'}${p.location ? ' @ ' + p.location : ''}${p.timestamp ? ', ' + p.timestamp.slice(0, 10) : ''}] ${p.caption?.slice(0, 400) || '(no caption)'}${p.alt ? `\n   alt-text: ${p.alt}` : ''}`).join('\n'));
  }
  if (manual?.instagramText) parts.push('=== INSTAGRAM (text copied from the public profile by the submitter) ===\n' + manual.instagramText.slice(0, 6000));
  return parts.join('\n\n');
}

export async function analyzePerson(space, id) {
  const db = load(space);
  const p = db.people[id];
  if (!p) return;
  p.status = 'analyzing'; p.error = null; p.log = [];
  const log = (msg, kind = 'info') => {
    p.log.push({ at: Date.now(), msg, kind });
    emit(space, { type: 'analysis', personId: id, msg, kind, status: p.status });
    save(space);
  };

  try {
    log('Agent assigned. Starting to read its person — only LinkedIn + Instagram allowed.', 'start');
    const [liRes, igRes] = await Promise.allSettled([
      scrapeLinkedIn(p.linkedin, log),
      scrapeInstagram(p.instagram, log),
    ]);
    const li = liRes.status === 'fulfilled' ? liRes.value : null;
    const ig = igRes.status === 'fulfilled' ? igRes.value : null;
    if (li) log(`LinkedIn read via ${li.via}: ${li.fullName || '?'} — ${li.headline || 'no headline'} (${li.experiences?.length || 0} roles, ${li.skills?.length || 0} skills)`, 'ok');
    else log('LinkedIn could not be scraped automatically' + (p.manual?.linkedinText ? ' — using text pasted from the profile.' : '.'), 'warn');
    if (ig) log(`Instagram read via ${ig.via}: @${ig.username}, ${ig.posts?.length || 0} recent posts, bio: "${(ig.bio || '').slice(0, 80)}"`, 'ok');
    else log('Instagram could not be scraped automatically' + (p.manual?.instagramText ? ' — using text pasted from the profile.' : '.'), 'warn');

    if (ig?.isPrivate) throw new Error(`@${ig.username} is a private Instagram account — Wingman only works with public profiles.`);
    if (!li && !ig && !p.manual?.linkedinText && !p.manual?.instagramText) {
      throw new Error([liRes.reason?.message, igRes.reason?.message].filter(Boolean).join(' · ') + ' — paste the visible profile text in “Scraper blocked?” and retry.');
    }
    p.sources = { linkedin: li, instagram: ig };

    // Photos: the agent literally looks at the person's Instagram.
    const images = [];
    if (ig) {
      log('Looking at their Instagram photos…');
      const pic = await fetchImage(ig.profilePicUrl);
      if (pic) p.avatar = storeImage(pic, `${space}_${id}_avatar`);
      const posts = ig.posts.filter((x) => x.imageUrl).slice(0, 9);
      const fetched = await Promise.all(posts.map((x) => fetchImage(x.imageUrl)));
      p.photos = [];
      fetched.forEach((img, i) => {
        if (!img) return;
        const url = storeImage(img, `${space}_${id}_post${i}`);
        p.photos.push({ url, caption: posts[i].caption?.slice(0, 140) || '', location: posts[i].location });
        if (images.length < 6) images.push({ mime: img.mime, data: img.data });
      });
      log(`Studied ${images.length} photos${p.avatar ? ' + profile picture' : ''}.`, 'ok');
    }
    if (!p.avatar && li?.profilePicUrl) {
      const pic = await fetchImage(li.profilePicUrl);
      if (pic) p.avatar = storeImage(pic, `${space}_${id}_avatar`);
    }

    log(`Analyzing the person with ${llmInfo.provider}/${llmInfo.model}…`);
    const digest = sourceDigest(li, ig, p.manual);
    let a;
    if (llmInfo.isMock) a = heuristicAnalysis(digest, li, ig);
    else {
      a = await chat({
        system: ANALYST_SYSTEM,
        messages: [{ role: 'user', images, text: `${images.length ? `Attached: ${images.length} of their most recent Instagram photos (in order #1..#${images.length}).\n\n` : ''}${digest}\n\nNow write the analysis JSON.` }],
        json: true, temperature: 0.6, maxTokens: 4096, think: true,
      });
    }
    p.analysis = a;
    p.name = a.name || li?.fullName || ig?.fullName || p.name;
    for (const note of a.reading_notes || []) log(note, 'note');
    p.status = 'ready';
    p.analyzedAt = Date.now();
    log(`Profile complete — ${a.needs?.length || 0} needs, ${a.hobbies?.length || 0} hobbies, ${a.interests?.length || 0} interests. Confidence ${a.confidence ?? '?'}%.`, 'done');
    emit(space, { type: 'person', personId: id, status: 'ready' });
  } catch (e) {
    p.status = 'error'; p.error = e.message;
    log(e.message, 'error');
    emit(space, { type: 'person', personId: id, status: 'error' });
  }
  save(space);
}

// ---------------------------------------------------------------- offline fallback (no API key)
export const TOPICS = {
  hiking: ['hike', 'hiking', 'trek', 'trail', 'mountain', 'summit', 'himalaya'], running: ['run', 'marathon', '5k', '10k', 'strava'],
  travel: ['travel', 'wanderlust', 'trip', 'explore', 'passport', 'abroad'], coffee: ['coffee', 'espresso', 'latte', 'cafe'],
  food: ['food', 'foodie', 'brunch', 'restaurant', 'cook', 'baking', 'recipe'], photography: ['photo', 'camera', 'shot on', 'lens'],
  music: ['music', 'concert', 'guitar', 'piano', 'gig', 'spotify', 'dj'], fitness: ['gym', 'fitness', 'workout', 'lift', 'crossfit'],
  yoga: ['yoga', 'meditat', 'mindful'], books: ['book', 'reading', 'novel', 'author'], art: ['art', 'paint', 'design', 'sketch', 'museum'],
  pets: ['dog', 'puppy', 'cat', 'pet'], gaming: ['gaming', 'gamer', 'playstation', 'xbox', 'esports'],
  startups: ['founder', 'startup', 'entrepreneur', 'venture', 'ceo', 'building'], tech: ['engineer', 'software', 'ai', 'machine learning', 'developer', 'data'],
  fashion: ['fashion', 'style', 'outfit', 'ootd'], sports: ['football', 'cricket', 'basketball', 'tennis', 'soccer', 'f1'],
  beach: ['beach', 'ocean', 'surf', 'sea', 'sunset'], cycling: ['cycling', 'bike', 'ride'], film: ['film', 'movie', 'cinema'],
};
export function topicsOf(text) {
  const t = String(text || '').toLowerCase();
  return Object.entries(TOPICS).filter(([, kws]) => kws.some((k) => t.includes(k))).map(([k]) => k);
}
function heuristicAnalysis(digest, li, ig) {
  const topics = topicsOf(digest);
  const name = li?.fullName || ig?.fullName || ig?.username || 'Unknown';
  const hobbies = topics.filter((t) => !['startups', 'tech'].includes(t));
  return {
    name, headline: li?.headline || ig?.category || '', location: li?.location || '',
    one_liner: `${name.split(' ')[0]} — ${li?.headline || 'a mystery worth unravelling'}${hobbies[0] ? `, happiest when ${hobbies[0]} is involved` : ''}.`,
    summary: `[Offline heuristic mode — set GEMINI_API_KEY or OPENAI_API_KEY for real analysis] ${name} works as ${li?.headline || 'an unknown role'}. Their Instagram bio reads "${ig?.bio || '—'}".`,
    reading_notes: [`[LinkedIn] Headline: ${li?.headline || 'n/a'}`, `[Instagram] ${ig?.posts?.length || 0} posts scanned for keywords`, `[Instagram] Topics detected: ${topics.join(', ') || 'none'}`],
    needs: [{ need: 'A partner who shares their pace of life', why: 'Inferred from overall activity level', source: 'both', evidence: 'keyword scan' }],
    hobbies: hobbies.map((h) => ({ name: h, source: 'instagram', evidence: 'keyword match' })),
    interests: topics.filter((t) => ['startups', 'tech', 'art', 'film', 'books'].includes(t)).map((h) => ({ name: h, source: 'both', evidence: 'keyword match' })),
    values: ['growth', 'curiosity'], personality: { openness: 60, conscientiousness: 60, extraversion: 50, agreeableness: 60, emotional_stability: 60, note: 'Default estimate (offline mode).' },
    lifestyle: hobbies.slice(0, 5), career: { field: li?.headline || '', stage: '', ambition: 'driven', summary: li?.headline || '' },
    communication_style: 'Unknown (offline mode)', humor: 'Unknown', ideal_partner: 'Someone who shares ' + (hobbies.slice(0, 2).join(' and ') || 'their curiosity') + '.',
    ideal_first_date: hobbies[0] ? `Something involving ${hobbies[0]}` : 'Coffee and a long walk', green_flags: [], potential_frictions: [], dealbreakers_likely: [],
    conversation_starters: hobbies.slice(0, 3).map((h) => `What got you into ${h}?`), voice: 'friendly, casual',
    dating_card: `Hi, I'm ${name.split(' ')[0]}. ${li?.headline || ''}. Into ${hobbies.join(', ') || 'good conversations'}.`, confidence: 20, confidence_note: 'Offline keyword heuristics only.',
    _topics: topics,
  };
}
