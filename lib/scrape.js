// Scrapers for the only two allowed sources: a public LinkedIn profile and a public Instagram profile.
//
// Strategy (first that works wins):
//   Instagram: 1) Apify `apify/instagram-profile-scraper`  2) Instagram's public web_profile_info JSON endpoint
//   LinkedIn:  1) Apify LinkedIn profile actor (configurable) 2) public profile HTML -> JSON-LD + og: meta + visible text
//   Both:      3) text the user copy-pasted from that same public profile (still the same source)
import fs from 'fs';
import path from 'path';
import { MEDIA_DIR } from './db.js';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const APIFY = process.env.APIFY_TOKEN;
const IG_ACTOR = process.env.INSTAGRAM_ACTOR || 'apify~instagram-profile-scraper';
const LI_ACTOR = process.env.LINKEDIN_ACTOR || 'dev_fusion~linkedin-profile-scraper';

export function parseInstagram(url) {
  const m = String(url || '').trim().match(/(?:instagram\.com\/)?@?([A-Za-z0-9._]{1,30})\/?(?:\?.*)?$/);
  if (!m) return null;
  const u = m[1].toLowerCase();
  if (['p', 'reel', 'reels', 'stories', 'explore', 'accounts'].includes(u)) return null;
  return u;
}

export function parseLinkedIn(url) {
  const m = String(url || '').trim().match(/linkedin\.com\/in\/([^/?#]+)/i);
  return m ? decodeURIComponent(m[1]).replace(/\/$/, '') : null;
}

async function apifyRun(actor, input) {
  const r = await fetch(`https://api.apify.com/v2/acts/${actor}/run-sync-get-dataset-items?token=${APIFY}&timeout=180`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input),
  });
  if (!r.ok) throw new Error(`Apify ${actor} ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const items = await r.json();
  if (!Array.isArray(items) || !items.length) throw new Error(`Apify ${actor} returned no items`);
  return items[0];
}

const hashtagsOf = (s) => [...String(s || '').matchAll(/#([\p{L}\p{N}_]+)/gu)].map((m) => m[1].toLowerCase());

// ---------------------------------------------------------------- Instagram
export async function scrapeInstagram(url, log = () => {}) {
  const username = parseInstagram(url);
  if (!username) throw new Error('Not a valid Instagram profile URL');
  const errors = [];

  if (APIFY) {
    try {
      log(`Instagram: running Apify actor ${IG_ACTOR} for @${username}`);
      const d = await apifyRun(IG_ACTOR, { usernames: [username], resultsLimit: 12 });
      if (d.error) throw new Error(d.error);
      return {
        via: 'apify', username, url: `https://www.instagram.com/${username}/`,
        fullName: d.fullName, bio: d.biography, externalUrl: d.externalUrl, category: d.businessCategoryName,
        followers: d.followersCount, following: d.followsCount, postsCount: d.postsCount,
        isPrivate: !!d.private, isVerified: !!d.verified, profilePicUrl: d.profilePicUrlHD || d.profilePicUrl,
        posts: (d.latestPosts || []).slice(0, 12).map((p) => ({
          caption: p.caption || '', hashtags: p.hashtags?.length ? p.hashtags : hashtagsOf(p.caption),
          location: p.locationName || null, type: p.type, imageUrl: p.displayUrl, alt: p.alt || null,
          likes: p.likesCount, timestamp: p.timestamp,
        })),
      };
    } catch (e) { errors.push(e.message); log('Instagram: Apify failed — ' + e.message); }
  }

  try {
    log(`Instagram: reading public profile JSON for @${username}`);
    const r = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      headers: { 'User-Agent': UA, 'x-ig-app-id': '936619743392459', Accept: '*/*', 'Accept-Language': 'en-US,en;q=0.9', Referer: `https://www.instagram.com/${username}/` },
    });
    if (r.status === 404) throw new Error(`@${username} does not exist`);
    if (!r.ok) throw new Error(`Instagram responded ${r.status}`);
    const u = (await r.json())?.data?.user;
    if (!u) throw new Error('Instagram returned no user');
    return {
      via: 'web_profile_info', username, url: `https://www.instagram.com/${username}/`,
      fullName: u.full_name, bio: u.biography, externalUrl: u.external_url, category: u.category_name || u.business_category_name,
      followers: u.edge_followed_by?.count, following: u.edge_follow?.count, postsCount: u.edge_owner_to_timeline_media?.count,
      isPrivate: !!u.is_private, isVerified: !!u.is_verified, profilePicUrl: u.profile_pic_url_hd || u.profile_pic_url,
      posts: (u.edge_owner_to_timeline_media?.edges || []).slice(0, 12).map(({ node: n }) => {
        const caption = n.edge_media_to_caption?.edges?.[0]?.node?.text || '';
        return {
          caption, hashtags: hashtagsOf(caption), location: n.location?.name || null,
          type: n.is_video ? 'Video' : n.__typename === 'GraphSidecar' ? 'Sidecar' : 'Image',
          imageUrl: n.display_url || n.thumbnail_src, alt: n.accessibility_caption || null,
          likes: n.edge_liked_by?.count ?? n.edge_media_preview_like?.count, timestamp: n.taken_at_timestamp ? new Date(n.taken_at_timestamp * 1000).toISOString() : null,
        };
      }),
    };
  } catch (e) { errors.push(e.message); log('Instagram: public JSON failed — ' + e.message); }

  const err = new Error('Instagram scrape failed: ' + errors.join(' | '));
  err.sourceErrors = errors;
  throw err;
}

// ---------------------------------------------------------------- LinkedIn
const arr = (x) => (Array.isArray(x) ? x : x ? [x] : []);
const str = (x) => (x == null ? '' : typeof x === 'string' ? x : x.text || x.name || x.title || '');

function normalizeLinkedInApify(d, url) {
  const exps = arr(d.experiences || d.experience || d.positions).map((e) => ({
    title: e.title || e.position || '', company: e.subtitle || e.companyName || e.company || '',
    duration: e.caption || e.duration || [e.startDate, e.endDate].filter(Boolean).join(' – '),
    location: e.metadata || e.location || '',
    description: str(e.description) || arr(e.subComponents).flatMap((s) => arr(s.description).map(str)).join(' ') || '',
  }));
  const edus = arr(d.educations || d.education).map((e) => ({
    school: e.title || e.schoolName || e.school || '', degree: e.subtitle || e.degreeName || e.degree || '',
    duration: e.caption || e.period || '',
  }));
  return {
    via: 'apify', url,
    fullName: d.fullName || [d.firstName, d.lastName].filter(Boolean).join(' ') || d.name,
    headline: d.headline || d.occupation || d.jobTitle, about: d.about || d.summary || '',
    location: d.addressWithCountry || d.location || d.geoLocationName || d.addressWithoutCountry || '',
    profilePicUrl: d.profilePicHighQuality || d.profilePic || d.profilePicture,
    experiences: exps.slice(0, 12), education: edus.slice(0, 6),
    skills: arr(d.skills).map(str).filter(Boolean).slice(0, 40),
    languages: arr(d.languages).map(str).filter(Boolean),
    certifications: arr(d.licenseAndCertificates || d.certifications).map(str).filter(Boolean).slice(0, 10),
    volunteering: arr(d.volunteerAndAwards || d.volunteering).map(str).filter(Boolean).slice(0, 10),
    honors: arr(d.honorsAndAwards || d.honors).map(str).filter(Boolean).slice(0, 10),
    interests: arr(d.interests).map(str).filter(Boolean).slice(0, 20),
    posts: arr(d.updates || d.posts || d.activity).map((p) => str(p.postText || p.text || p)).filter(Boolean).slice(0, 8),
  };
}

function decodeEntities(s) {
  return String(s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
}

export async function scrapeLinkedIn(url, log = () => {}) {
  const slug = parseLinkedIn(url);
  if (!slug) throw new Error('Not a valid LinkedIn /in/ profile URL');
  const clean = `https://www.linkedin.com/in/${slug}/`;
  const errors = [];

  if (APIFY) {
    try {
      log(`LinkedIn: running Apify actor ${LI_ACTOR} for /in/${slug}`);
      const d = await apifyRun(LI_ACTOR, { profileUrls: [clean], urls: [clean], queries: [clean] });
      if (d.error || d.succeeded === false) throw new Error(d.error || 'actor failed');
      return normalizeLinkedInApify(d, clean);
    } catch (e) { errors.push(e.message); log('LinkedIn: Apify failed — ' + e.message); }
  }

  try {
    log(`LinkedIn: reading public profile page /in/${slug}`);
    const r = await fetch(clean, { headers: { 'User-Agent': UA, Accept: 'text/html', 'Accept-Language': 'en-US,en;q=0.9' }, redirect: 'follow' });
    if (r.status === 999 || /authwall|login/.test(r.url)) throw new Error(`LinkedIn blocked anonymous access (status ${r.status})`);
    if (!r.ok) throw new Error(`LinkedIn responded ${r.status}`);
    const html = await r.text();
    const meta = (p) => decodeEntities(html.match(new RegExp(`<meta[^>]+(?:property|name)="${p}"[^>]+content="([^"]*)"`, 'i'))?.[1]);
    let person = null;
    for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
      try {
        const j = JSON.parse(m[1]);
        const graph = arr(j['@graph'] || j);
        person = graph.find((g) => g['@type'] === 'Person') || person;
      } catch {}
    }
    const visible = decodeEntities(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    if (!person && !meta('og:title')) throw new Error('No public profile data found');
    return {
      via: 'public_html', url: clean,
      fullName: person?.name || meta('og:title')?.split(' - ')[0],
      headline: arr(person?.jobTitle).join(', ') || meta('og:title')?.split(' - ').slice(1).join(' - '),
      about: person?.description || meta('og:description') || meta('description'),
      location: person?.address?.addressLocality ? [person.address.addressLocality, person.address.addressCountry].filter(Boolean).join(', ') : '',
      profilePicUrl: person?.image?.contentUrl || meta('og:image'),
      experiences: arr(person?.worksFor).map((w) => ({ title: '', company: w.name, duration: '', description: w.member?.description || '' })),
      education: arr(person?.alumniOf).map((a) => ({ school: a.name, degree: '', duration: '' })),
      skills: [], languages: arr(person?.knowsLanguage).map(str),
      awards: arr(person?.awards), posts: [],
      visibleText: visible.slice(0, 6000),
    };
  } catch (e) { errors.push(e.message); log('LinkedIn: public page failed — ' + e.message); }

  const err = new Error('LinkedIn scrape failed: ' + errors.join(' | '));
  err.sourceErrors = errors;
  throw err;
}

// ---------------------------------------------------------------- media
export async function fetchImage(url) {
  if (!url) return null;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, Referer: 'https://www.instagram.com/' } });
    if (!r.ok) return null;
    const mime = (r.headers.get('content-type') || 'image/jpeg').split(';')[0];
    if (!mime.startsWith('image/')) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length > 4_000_000) return null;
    return { mime, buf, data: buf.toString('base64') };
  } catch { return null; }
}

export function storeImage(img, name) {
  if (!img) return null;
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
  const ext = img.mime.includes('png') ? 'png' : img.mime.includes('webp') ? 'webp' : 'jpg';
  const file = `${name}.${ext}`;
  fs.writeFileSync(path.join(MEDIA_DIR, file), img.buf);
  return `/media/${file}`;
}
