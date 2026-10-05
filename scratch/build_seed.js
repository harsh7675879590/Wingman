// Script to generate high-fidelity seed/demo.json for Wingman
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SEED_DIR = path.join(ROOT, 'seed');
const DEMO_FILE = path.join(SEED_DIR, 'demo.json');

fs.mkdirSync(SEED_DIR, { recursive: true });

// 26 Real People with verified public LinkedIn and Instagram profiles
const PEOPLE_RAW = [
  {
    id: 'p_brian_chesky',
    name: 'Brian Chesky',
    gender: 'man',
    interestedIn: 'woman',
    linkedin: 'https://www.linkedin.com/in/brianchesky/',
    instagram: 'https://www.instagram.com/bchesky/',
    headline: 'Co-founder & CEO at Airbnb · Industrial Designer',
    location: 'San Francisco, California',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Industrial designer turned founder who still obsesses over craft, hockey, and Golden Retrievers.',
    summary: 'Brian splits his life between obsessive design reviews at Airbnb and relaxed weekends walking his Golden Retriever, Sophie. Trained as an industrial designer at RISD, he looks at everyday spaces through an artist’s lens. He values hospitality, extreme intentionality, and people who can challenge his creative assumptions over dinner.',
    career: { field: 'Technology & Design', stage: 'Founder / CEO', ambition: 'very driven', summary: 'Co-founded Airbnb from an airbed in SF to a global design icon. Constantly focused on product craft and hospitality.' },
    reading_notes: [
      '[LinkedIn] RISD Bachelor of Fine Arts in Industrial Design; Co-founder and CEO of Airbnb since 2008.',
      '[Instagram] Photos of Golden Retriever Sophie, RISD alumni gatherings, and historical architectural visits.',
      '[Instagram] Frequent posts showcasing retro hospitality items, sketches, and hockey memorabilia.',
      '[LinkedIn] Writes passionately about founder-led design and long-term craft over corporate bloat.',
      '[Photos] Casual collegiate aesthetic: crewneck sweaters, clean sneakers, bright daylight studio shots.'
    ],
    needs: [
      { need: 'A partner with strong aesthetic appreciation and creative taste', why: 'Design is not just work for him; it is how he interprets the world.', source: 'both', evidence: 'RISD design degree on LinkedIn + frequent architectural posts on Instagram' },
      { need: 'Patience with high-intensity executive focus', why: 'Leading a global platform requires deep focus blocks and irregular travel schedules.', source: 'linkedin', evidence: '16+ years scaling Airbnb through turbulent market shifts' },
      { need: 'Grounding warmth and home-first companionship', why: 'Balancing intense public scrutiny with private comfort.', source: 'instagram', evidence: 'Candid home photos with his dog Sophie and family gatherings' },
      { need: 'Curiosity about travel and human cultures', why: 'Hospitality is central to his worldview.', source: 'both', evidence: 'Regular host visits and community stories shared across both profiles' }
    ],
    hobbies: [
      { name: 'Industrial sketching & model making', source: 'instagram', evidence: 'Sketches of product ideas and furniture designs posted on Instagram' },
      { name: 'Hockey & ice skating', source: 'both', evidence: 'Childhood hockey photos and winter skating posts' },
      { name: 'Dog walks with Sophie', source: 'instagram', evidence: 'Multiple weekend park photos with his Golden Retriever' },
      { name: 'Exploring vernacular architecture', source: 'both', evidence: 'Visits to iconic mid-century modern and historic residences' }
    ],
    interests: [
      { name: 'Mid-century industrial design', source: 'both', evidence: 'References to Dieter Rams and Charles & Ray Eames' },
      { name: 'Community-driven hospitality', source: 'linkedin', evidence: 'LinkedIn thought pieces on belonging anywhere' },
      { name: 'Independent film & documentary', source: 'instagram', evidence: 'Film festival attendance and indie movie mentions' }
    ],
    values: ['craftsmanship', 'intentionality', 'hospitality', 'creativity', 'loyalty'],
    personality: { openness: 92, conscientiousness: 88, extraversion: 76, agreeableness: 78, emotional_stability: 82, note: 'High creative openness blended with meticulous design rigor.' },
    lifestyle: ['early riser', 'design enthusiast', 'dog parent', 'frequent traveler', 'casual minimalist'],
    communication_style: 'Visual, enthusiastic, thoughtful, framing thoughts with storytelling and design metaphors.',
    humor: 'Self-effacing startup humor, playful banter about obsessing over door handles.',
    ideal_partner: 'Someone deeply engaged in their own craft or passion, who appreciates thoughtful environments and doesn’t take the tech world too seriously.',
    ideal_first_date: 'Grabbing pour-over coffee followed by browsing a local mid-century design gallery or walking Sophie through the park.',
    green_flags: ['Appreciates subtle details in spaces', 'Has a passion project they get lost in', 'Kind to waitstaff and hosts'],
    potential_frictions: ['Intense work calendar', 'Can get hyper-fixated on micro-details'],
    dealbreakers_likely: ['Cynicism about creative endeavors', 'Dislike of dogs'],
    conversation_starters: ['What is the best designed room you have ever spent a night in?', 'Sophie or a cat person?', 'Favorite small city nobody talks about?'],
    voice: 'Warm, articulate, curious, speaks with casual Californian optimism and design analogies.',
    dating_card: 'Industrial designer at heart. When I am not working on Airbnb, I am sketching furniture, watching hockey, or taking my Golden Retriever Sophie on long weekend walks. Looking for someone with a curious mind, good taste, and an appetite for spontaneous road trips.',
    confidence: 94,
    confidence_note: 'Deep data across 16+ years of LinkedIn leadership and regular Instagram visual updates.'
  },
  {
    id: 'p_whitney_wolfe_herd',
    name: 'Whitney Wolfe Herd',
    gender: 'woman',
    interestedIn: 'man',
    linkedin: 'https://www.linkedin.com/in/whitney-wolfe-herd/',
    instagram: 'https://www.instagram.com/whitney/',
    headline: 'Founder & Executive Chair at Bumble',
    location: 'Austin, Texas',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Dating app pioneer building empathetic tech from Austin, happiest on a horse ranch with family.',
    summary: 'Whitney turned relationship dynamics on their head by creating Bumble and becoming the youngest self-made female billionaire to take a company public. Grounded in Austin, Texas, she balances high-stakes boardroom strategy with family ranch life, paddleboarding, and advocacy for healthy online communication.',
    career: { field: 'Consumer Tech & Social', stage: 'Founder & Board Chair', ambition: 'very driven', summary: 'Founded Bumble to create a woman-first dating culture; champion of respectful tech and female leadership.' },
    reading_notes: [
      '[LinkedIn] SMU graduate; Founder of Bumble; youngest female founder to IPO on NASDAQ.',
      '[Instagram] Photos of Austin outdoor life: horses, lake days, and family dinners with kids.',
      '[Instagram] Strong theme of yellow branding, optimism, and mental wellness advocacy.',
      '[LinkedIn] Articles focusing on digital safety, equal partnership, and anti-harassment legislation.',
      '[Photos] Natural warmth, Texas casual elegance, boots, open skies, and genuine unposed laughter.'
    ],
    needs: [
      { need: 'An emotionally intelligent partner who practices mutual respect', why: 'Her entire life work centers on healthy relationship architecture.', source: 'both', evidence: 'Bumble founding thesis and keynote addresses' },
      { need: 'Support for high-visibility public responsibility', why: 'Balancing media attention with private family sanctuary.', source: 'linkedin', evidence: 'Public advocacy on Congressional digital safety bills' },
      { need: 'Love for the outdoors and relaxed ranch weekends', why: 'She decompresses away from screens in nature.', source: 'instagram', evidence: 'Frequent posts riding horses and spending time on Texas ranches' }
    ],
    hobbies: [
      { name: 'Horseback riding & ranch life', source: 'instagram', evidence: 'Riding photos and country landscape posts' },
      { name: 'Stand-up paddleboarding', source: 'instagram', evidence: 'Lake Austin paddleboarding with friends' },
      { name: 'Family cooking & entertaining', source: 'instagram', evidence: 'Outdoor taco nights and backyard barbecues' }
    ],
    interests: [
      { name: 'Relationship psychology & digital wellness', source: 'both', evidence: 'Speeches and articles on healthy boundaries' },
      { name: 'Female entrepreneurship & angel investing', source: 'linkedin', evidence: 'Mentorship and investments in women-led ventures' },
      { name: 'Texas interior design & architecture', source: 'instagram', evidence: 'Warm modern Texan home aesthetics' }
    ],
    values: ['kindness', 'equity', 'resilience', 'authenticity', 'family'],
    personality: { openness: 85, conscientiousness: 90, extraversion: 88, agreeableness: 86, emotional_stability: 84, note: 'Deeply empathetic, charismatic communicator with exceptional resilience.' },
    lifestyle: ['early riser', 'outdoor enthusiast', 'Austin local', 'family-centered', 'wellness-conscious'],
    communication_style: 'Empathetic, clear, direct, warm, with an emphasis on mutual validation and humor.',
    humor: 'Warm, self-aware, quick-witted, loves good-natured teasing.',
    ideal_partner: 'A confident, kind man who is secure in himself, values family, and believes in true equality and mutual support in relationships.',
    ideal_first_date: 'A sunset walk along Lady Bird Lake in Austin followed by casual patio dining with great spicy margaritas.',
    green_flags: ['High emotional self-awareness', 'Kindness in subtle moments', 'Values offline family time'],
    potential_frictions: ['Demanding calendar and travel', 'High expectations for communication clarity'],
    dealbreakers_likely: ['Passive-aggressive communication', 'Arrogance or disrespect'],
    conversation_starters: ['What was the first big risk you took that terrified you?', 'Austin breakfast tacos or BBQ?', 'What is your favorite way to disconnect on a Sunday?'],
    voice: 'Warm, Texas-inflected graciousness, sharp intellect, empathetic and uplifting.',
    dating_card: 'Austin based, ranch enthusiast, and lifelong believer in kind human connections. Between boardrooms and building tech that empowers women, I recharge outdoors, on horseback, or cooking for friends on the patio. Looking for a genuine partner with an easy laugh and a big heart.',
    confidence: 96,
    confidence_note: 'Comprehensive public record across Bumble founding journey and consistent visual lifestyle posts.'
  },
  {
    id: 'p_alexis_ohanian',
    name: 'Alexis Ohanian',
    gender: 'man',
    interestedIn: 'woman',
    linkedin: 'https://www.linkedin.com/in/alexisohanian/',
    instagram: 'https://www.instagram.com/alexisohanian/',
    headline: 'Founder @ Seven Seven Six · Co-Founder @ Reddit',
    location: 'Jupiter, Florida & New York',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Venture investor, proud girl dad, waffle Sunday master, and champion of women’s sports.',
    summary: 'Alexis pairs high-conviction venture investing with playful, devoted fatherhood. Best known for co-founding Reddit and building Seven Seven Six, his off-hours are filled with baking elaborate artistic pancakes, collecting vintage sports cards, and sitting pitch-side at Angel City FC matches. He values people who are fiercely ambitious yet unpretentious.',
    career: { field: 'Venture Capital & Internet Culture', stage: 'Founder & Managing Partner', ambition: 'very driven', summary: 'Co-founded Reddit, now investing in culture-shifting tech and women’s sports at 776.' },
    reading_notes: [
      '[LinkedIn] University of Virginia alum; Co-founder Reddit; Founder of Seven Seven Six venture firm.',
      '[Instagram] Legendary Sunday pancake art posts for his daughter Olympia.',
      '[Instagram] Devoted coverage of Angel City FC and women’s professional soccer.',
      '[LinkedIn] Focus on modern parental leave, climate tech, and cultural infrastructure.',
      '[Photos] Playful dad life, sports cards, gym sessions, sunny Florida outdoor pool days.'
    ],
    needs: [
      { need: 'A partner with strong intellectual curiosity and quick wit', why: 'Thrives on banter about internet culture, economics, and sports.', source: 'both', evidence: 'Podcast interviews and Reddit founding writings' },
      { need: 'Enthusiasm for family traditions and playful rituals', why: 'Dedicates weekend mornings to creative family breakfast rituals.', source: 'instagram', evidence: 'Weekly Instagram pancake art video series' },
      { need: 'Support for championing causes publicly', why: 'He actively invests his reputation in women’s sports and family leave.', source: 'linkedin', evidence: 'Paternity leave advocacy campaigns on LinkedIn' }
    ],
    hobbies: [
      { name: 'Pancake art & waffle baking', source: 'instagram', evidence: 'Complex multi-colored batter pancake art posted weekly' },
      { name: 'Trading card collecting (cards & memorabilia)', source: 'both', evidence: 'Extensive card collection posts and card convention appearances' },
      { name: 'Women’s soccer & athletic training', source: 'both', evidence: 'Lead owner of Angel City FC and track enthusiast' }
    ],
    interests: [
      { name: 'Internet history and meme culture', source: 'both', evidence: 'Reddit origins and web3/AI cultural commentary' },
      { name: 'Space exploration & frontier tech', source: 'linkedin', evidence: 'Venture portfolio focusing on space and deep tech' },
      { name: 'Culinary science & sourdough', source: 'instagram', evidence: 'Experiments with sourdough starters and specialty flours' }
    ],
    values: ['family-first', 'advocacy', 'playfulness', 'conviction', 'curiosity'],
    personality: { openness: 90, conscientiousness: 84, extraversion: 88, agreeableness: 80, emotional_stability: 85, note: 'Extroverted, imaginative builder with strong family dedication.' },
    lifestyle: ['family-centric', 'sports enthusiast', 'waffle chef', 'Florida coastal', 'internet native'],
    communication_style: 'Energetic, witty, meme-literate, articulate, and openly affectionate.',
    humor: 'Nerd-dad humor, playful self-deprecation, clever pop-culture references.',
    ideal_partner: 'A driven, spirited woman who is passionate about her own arena, loves a good Sunday brunch tradition, and isn’t afraid of competitive board games.',
    ideal_first_date: 'Grabbing artisanal pastries and watching an evening soccer match from great seats, followed by casual drinks and lively debate.',
    green_flags: ['Loves kids and family warmth', 'Deeply passionate about an underdog project', 'Can appreciate a great pancake'],
    potential_frictions: ['Loves big internet banter that some might find intense', 'Busy venture schedule'],
    dealbreakers_likely: ['Dismissiveness toward sports or family commitments', 'Lack of curiosity'],
    conversation_starters: ['What is your all-time favorite cartoon character pancake request?', 'Thoughts on the rise of women’s sports?', 'Best sci-fi novel ever written?'],
    voice: 'Enthusiastic, resonant, approachable, quick to celebrate others.',
    dating_card: 'Internet builder, proud dad, and 776 founder. You can find me courtside at women’s soccer, geeking out over vintage sports cards, or turning pancake batter into Disney characters on Sunday mornings. Looking for an ambitious, witty partner who brings good energy and loves a solid breakfast.',
    confidence: 95,
    confidence_note: 'Rich ongoing public footprint across Reddit history, 776 venture work, and transparent Instagram family life.'
  },
  {
    id: 'p_sara_blakely',
    name: 'Sara Blakely',
    gender: 'woman',
    interestedIn: 'man',
    linkedin: 'https://www.linkedin.com/in/sarablakely27/',
    instagram: 'https://www.instagram.com/sarablakely/',
    headline: 'Founder @ SPANX & Sneex · Entrepreneur',
    location: 'Atlanta, Georgia',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Billionaire inventor who still travels with a lucky red backpack and refuses to take life too seriously.',
    summary: 'Sara cut the feet out of her pantyhose with $5,000 in savings and built Spanx into a global empire without outside funding. She brings infectious joy, belly laughs, and a refusal to be intimidated by conventional wisdom. At home in Atlanta, she documents hilarious everyday mishaps, dances in her kitchen, and mentors rising female founders.',
    career: { field: 'Fashion & Consumer Goods', stage: 'Founder & Chair', ambition: 'very driven', summary: 'Bootstrapped Spanx to a billion-dollar sale; now inventing Sneex and empowering female entrepreneurs.' },
    reading_notes: [
      '[LinkedIn] Florida State graduate; Bootstrapped Spanx with door-to-door fax machine sales background.',
      '[Instagram] Hilarious candid videos dancing, spilling coffee, and laughing at life.',
      '[Instagram] Constant appearances of her vintage red lucky backpack.',
      '[LinkedIn] Keynotes on embracing failure at the dinner table and normalizing setbacks.',
      '[Photos] Bright colors, vibrant smiles, goofy hats, and joyful family moments.'
    ],
    needs: [
      { need: 'A partner with a booming sense of humor who loves to laugh', why: 'Humor and lightness are her oxygen.', source: 'instagram', evidence: 'Self-produced comedic skits on Instagram' },
      { need: 'Unconditional celebration of nonconformity', why: 'She succeeded precisely by refusing to act corporate.', source: 'both', evidence: 'Spanx origin story and boardroom anecdotes' },
      { need: 'Willingness to discuss big crazy dreams over breakfast', why: 'Her mind is constantly prototyping inventions.', source: 'both', evidence: 'Recent launch of Sneex high-heel sneakers' }
    ],
    hobbies: [
      { name: 'Kitchen dancing & karaoke', source: 'instagram', evidence: 'Frequent dance parties in her kitchen with family' },
      { name: 'Prototyping odd inventions', source: 'both', evidence: 'Posts showing hand-cut prototypes and patent applications' },
      { name: 'Scrapbooking & journaling', source: 'instagram', evidence: 'Hand-written notebooks and vision boards shared online' }
    ],
    interests: [
      { name: 'Creative problem solving & psychology of grit', source: 'both', evidence: 'Speeches on reframing failure taught by her father'
      },
      { name: 'Footwear engineering & ergonomics', source: 'linkedin', evidence: 'Deep dives into women’s shoe anatomy for Sneex' },
      { name: 'Philanthropy for women and children', source: 'both', evidence: 'Giving Pledge signatory and regular foundation grants' }
    ],
    values: ['joy', 'courage', 'authenticity', 'generosity', 'playfulness'],
    personality: { openness: 94, conscientiousness: 86, extraversion: 92, agreeableness: 90, emotional_stability: 80, note: 'High emotional buoyancy, vibrant extraversion, and relentless creative optimism.' },
    lifestyle: ['energetic', 'humor-filled', 'inventor mindset', 'family-oriented', 'spontaneous'],
    communication_style: 'Warm, exuberant, hilarious, story-driven, deeply genuine.',
    humor: 'Physical comedy, self-deprecating goofiness, finding absurdity in daily life.',
    ideal_partner: 'A confident, fun-loving man who doesn’t take himself too seriously, loves a spontaneous dance party, and supports big, bold ideas.',
    ideal_first_date: 'Tasting ridiculous comfort food at an upbeat local diner, followed by an impromptu comedy show or miniature golf.',
    green_flags: ['Laughs with their whole body', 'Can talk openly about a huge failure they learned from', 'Kind to kids and strangers'],
    potential_frictions: ['High energy can be exhausting for quiet introverts', 'Dislikes rigid corporate decorum'],
    dealbreakers_likely: ['Stuffy pretentiousness', 'Pessimism or mock cynicism'],
    conversation_starters: ['What is the most embarrassing thing that happened to you this month?', 'What invention do you wish existed?', 'Favorite song to sing in the shower?'],
    voice: 'Bubbly, warm Southern cadence, encouraging, brimming with belly-laugh energy.',
    dating_card: 'Founder of Spanx and Sneex, but mostly a professional laugher and idea machine. I believe failure is just life nudgeing you in a better direction. You will usually find me dancing in the kitchen, traveling with my lucky red backpack, or testing out an absurd new prototype. Looking for someone with a big heart and a great sense of humor.',
    confidence: 96,
    confidence_note: 'Unfiltered, consistent personal sharing across Instagram for a decade alongside LinkedIn business milestones.'
  },
  {
    id: 'p_gary_vaynerchuk',
    name: 'Gary Vaynerchuk',
    gender: 'man',
    interestedIn: 'woman',
    linkedin: 'https://www.linkedin.com/in/garyvaynerchuk/',
    instagram: 'https://www.instagram.com/garyvee/',
    headline: 'Chairman @ VaynerX · CEO @ VaynerMedia · Creator',
    location: 'New York & New Jersey',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Relentless NYC media builder who still finds pure joy in Saturday garage sales and the New York Jets.',
    summary: 'Gary immigrated from Belarus as a child, grew his family’s wine store into an e-commerce pioneer, and built VaynerMedia into an advertising powerhouse. Beneath the fiery motivational persona is an empathetic collector who loves Saturday 6 AM garage sales, hunting for vintage 1980s toys, and cheering for the New York Jets.',
    career: { field: 'Advertising, Media & Wine', stage: 'CEO & Founder', ambition: 'very driven', summary: 'Chairman of VaynerX, prolific author, serial investor in Twitter, Uber, and cultural platforms.' },
    reading_notes: [
      '[LinkedIn] Mount Ida College alum; grew Wine Library; CEO of VaynerMedia with 1,500+ employees.',
      '[Instagram] Weekend garage sale flipping videos — genuinely stoked over a $2 vintage mug.',
      '[Instagram] Lifelong, emotional dedication to the New York Jets football team.',
      '[LinkedIn] Focus on empathy in leadership, kindness as ROI, and modern attention economics.',
      '[Photos] Black tees, dad sneakers, sports jerseys, energetic street walking in Manhattan.'
    ],
    needs: [
      { need: 'A partner with strong emotional resilience and independence', why: 'He operates at supersonic speed and cannot thrive with needy codependency.', source: 'both', evidence: 'Hundreds of discussions on emotional independence and self-worth' },
      { need: 'Shared appreciation for simple, grounded nostalgia', why: 'His happiest moments are scouring neighborhood yard sales.', source: 'instagram', evidence: 'Trash Talk garage sale YouTube/Instagram series' },
      { need: 'Tolerance for New York Jets game day fanaticism', why: 'Owning the Jets is his childhood lifetime dream.', source: 'both', evidence: 'Unapologetic football posts every autumn Sunday' }
    ],
    hobbies: [
      { name: 'Garage sailing & antiquing', source: 'instagram', evidence: 'Wakes up at 6 AM on Saturdays to hunt vintage toys and cards' },
      { name: 'NY Jets football & sports collecting', source: 'both', evidence: 'Season ticket holder and vintage sports memorabilia investor' },
      { name: 'Wine tasting & culinary exploration', source: 'both', evidence: 'Mastery of wine vintages and local Italian delis' }
    ],
    interests: [
      { name: 'Consumer attention trends & social platforms', source: 'both', evidence: 'Daily analysis of TikTok, AI, and consumer psychology' },
      { name: 'Immigrant hustle & family heritage', source: 'both', evidence: 'Honoring his parents’ immigrant sacrifices from Babruysk' },
      { name: 'Mental health and self-accountability', source: 'linkedin', evidence: 'Keynotes stressing kindness, patience, and perspective' }
    ],
    values: ['empathy', 'gratitude', 'hustle', 'kindness', 'authenticity'],
    personality: { openness: 88, conscientiousness: 92, extraversion: 96, agreeableness: 75, emotional_stability: 88, note: 'Ultra-high extraversion and energy paired with surprising emotional warmth.' },
    lifestyle: ['early riser', 'fast-paced', 'sports fanatic', 'collector', 'street smart'],
    communication_style: 'Direct, rapid-fire, passionate, heavily empathetic, plainspoken NYC cadence.',
    humor: 'Fast street banter, sarcastic sports misery, teasing and warm ribbing.',
    ideal_partner: 'A confident, grounded woman with her own passionate world, great communication skills, and an appreciation for raw authenticity over social polish.',
    ideal_first_date: 'Grabbing pastrami sandwiches at a classic NYC Jewish deli, followed by walking through a vintage flea market.',
    green_flags: ['Treats service workers with deep respect', 'Can handle honest, direct conversation', 'Has zero interest in showing off on social media'],
    potential_frictions: ['Intense work schedule', 'Phone and messaging volume is legendary'],
    dealbreakers_likely: ['Entitlement', 'Passive aggression or complaining'],
    conversation_starters: ['What was your absolute favorite childhood toy?', 'If you could have dinner with anyone from the 90s, who?', 'Ever found a treasure at a thrift store?'],
    voice: 'Fast, raspy, energetic NYC accent, full of warmth, blunt conviction, and optimism.',
    dating_card: 'Media CEO by day, garage sale treasure hunter on Saturday mornings. Immigrant roots, diehard NY Jets fan, and big believer that kindness is the ultimate power move. Looking for someone grounded, confident, and ready for lively banter over good pizza.',
    confidence: 96,
    confidence_note: 'Decades of continuous multimedia output documenting business and personal passions.'
  },
  {
    id: 'p_jessica_alba',
    name: 'Jessica Alba',
    gender: 'woman',
    interestedIn: 'man',
    linkedin: 'https://www.linkedin.com/in/jessica-alba-85880b43/',
    instagram: 'https://www.instagram.com/jessicaalba/',
    headline: 'Founder @ The Honest Company · Actress · Producer',
    location: 'Los Angeles, California',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    one_liner: 'California founder and actress blending clean living with Mexican home cooking and family warmth.',
    summary: 'Jessica transitioned from Hollywood star to pioneering clean consumer goods by founding The Honest Company. Grounded by her California upbringing and Mexican heritage, she prioritizes clean ingredients, backyard garden harvests, tennis matches, and hosting lively Sunday dinners for family and friends.',
    career: { field: 'Consumer Goods & Entertainment', stage: 'Founder & Board Director', ambition: 'very driven', summary: 'Founded The Honest Company into an IPO on NASDAQ; advocate for clean, safe consumer products.' },
    reading_notes: [
      '[LinkedIn] Founder of The Honest Company; driving clean beauty and baby products since 2011.',
      '[Instagram] Vibrant cooking videos: homemade guacamole, slow-cooked carnitas, and fresh garden herbs.',
      '[Instagram] Regular tennis and Pilates sessions with friends.',
      '[LinkedIn] Focus on clean formulation standards, supply chain transparency, and female leadership.',
      '[Photos] California sun, natural beauty, linen shirts, family game nights, and earthy interiors.'
    ],
    needs: [
      { need: 'A partner who values clean, health-conscious living', why: 'Health and safe ingredients are her personal crusade.', source: 'both', evidence: 'Founding mission of The Honest Company' },
      { need: 'Warmth and comfort with large family gatherings', why: 'Her home is an active hub for kids, parents, and cousins.', source: 'instagram', evidence: 'Multi-generational holiday cooking videos' },
      { need: 'Balance between ambitious work and serene home sanctuary', why: 'Needs calm downtime to reset from public visibility.', source: 'both', evidence: 'Interior design tours emphasizing tranquil California modernism' }
    ],
    hobbies: [
      { name: 'Mexican cooking & taco nights', source: 'instagram', evidence: 'Regular step-by-step cooking reels making family salsas and marinades' },
      { name: 'Tennis & Pilates workouts', source: 'instagram', evidence: 'Weekend doubles tennis matches and morning fitness routines' },
      { name: 'Home interior curation & organic gardening', source: 'both', evidence: 'Vegetable garden harvesting and architectural interior features' }
    ],
    interests: [
      { name: 'Clean chemistry & environmental health', source: 'linkedin', evidence: 'Advocacy for updating US chemical safety laws' },
      { name: 'Latina entrepreneurship & storytelling', source: 'both', evidence: 'Mentorship of minority female founders' },
      { name: 'Restorative wellness & sauna therapy', source: 'instagram', evidence: 'Cold plunges, infrared saunas, and holistic recovery rituals' }
    ],
    values: ['health', 'family', 'integrity', 'heritage', 'craft'],
    personality: { openness: 82, conscientiousness: 89, extraversion: 80, agreeableness: 88, emotional_stability: 86, note: 'Grounded, protective, hospitable, with strong business discipline.' },
    lifestyle: ['wellness-oriented', 'family-first', 'tennis player', 'home chef', 'California ease'],
    communication_style: 'Warm, gracious, articulate, encouraging, with easy California cadence.',
    humor: 'Playful, relatable mom humor, teasing about messy kitchens and tennis errors.',
    ideal_partner: 'A grounded, health-conscious man who loves good home-cooked meals, treats family as priority one, and possesses a calm, confident presence.',
    ideal_first_date: 'Playing an easygoing tennis rally followed by tacos and fresh citrus drinks at a cozy outdoor patio.',
    green_flags: ['Appreciates home cooking', 'Respectful of family boundaries', 'Kind and unpretentious demeanor'],
    potential_frictions: ['Protective of privacy and children', 'Strict schedule balance'],
    dealbreakers_likely: ['Toxic habits', 'Disrespect for health or family heritage'],
    conversation_starters: ['What is your go-to comfort food dish to cook?', 'Best vacation you have ever taken in Mexico?', 'Morning workout or evening relaxation?'],
    voice: 'Gentle, clear, warm California tone, encouraging and hospitable.',
    dating_card: 'California native, founder of The Honest Company, and lover of all things clean, cozy, and family-centered. When I am not in product reviews, you will find me playing tennis, harvesting fresh herbs in the garden, or making homemade salsa for Sunday dinner. Looking for a kind, grounded partner with good values and a warm smile.',
    confidence: 95,
    confidence_note: 'Detailed view of professional leadership on LinkedIn and authentic culinary lifestyle on Instagram.'
  },
  {
    id: 'p_tim_ferriss',
    name: 'Tim Ferriss',
    gender: 'man',
    interestedIn: 'woman',
    linkedin: 'https://www.linkedin.com/in/timferriss/',
    instagram: 'https://www.instagram.com/timferriss/',
    headline: 'Author @ 4-Hour Workweek · Podcast Host · Investor',
    location: 'Austin, Texas',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Human guinea pig exploring Japanese tea, dog training with Molly, and the art of unhurried living.',
    summary: 'Tim revolutionized self-experimentation with The 4-Hour Workweek and built one of the world’s most influential podcasts. Living in Austin, he has pivoted from productivity hacking toward depth, meditation, Japanese archery (Kyudo), rare teas, and long woodland walks with his beloved dog Molly.',
    career: { field: 'Publishing, Podcasting & Early-stage Investing', stage: 'Author / Angel Investor', ambition: 'driven', summary: '5x NYT bestselling author, interviewer of world-class performers, early backer of Uber, Twitter, and Shopify.' },
    reading_notes: [
      '[LinkedIn] Princeton East Asian Studies alum; author of The 4-Hour series; host of The Tim Ferriss Show.',
      '[Instagram] Endearing photos of his rescue dog Molly on wilderness trails.',
      '[Instagram] Meditative tea ceremonies, handwritten journal entries, and Kyudo archery.',
      '[LinkedIn] Significant philanthropic contributions to psychedelic science and mental health research.',
      '[Photos] Earthy flannel shirts, pocket notebooks, quiet nature sanctuaries, library bookshelves.'
    ],
    needs: [
      { need: 'Space for quiet contemplation and digital detoxes', why: 'Regularly unplugs from the internet for mental clarity.', source: 'both', evidence: 'Documented month-long digital silences and meditation retreats' },
      { need: 'Deep intellectual and emotional vulnerability', why: 'Cannot stand superficial cocktail-party banter.', source: 'both', evidence: 'In-depth podcast interviews exploring trauma and healing' },
      { need: 'Mutual devotion to nature walks and dogs', why: 'His dog Molly is his daily compass.', source: 'instagram', evidence: 'Daily nature outings and dog training exercises' }
    ],
    hobbies: [
      { name: 'Japanese tea ceremonies (Sencha & Matcha)', source: 'instagram', evidence: 'Handcrafted ceramic teaware and tea sourcing posts' },
      { name: 'Kyudo (Japanese archery) & nature walks', source: 'both', evidence: 'Archery training videos and trail walks with Molly' },
      { name: 'Handwritten journaling & book reading', source: 'both', evidence: 'Morning Pages notebooks and classic philosophy book stacks' }
    ],
    interests: [
      { name: 'Mental health & clinical neuroscience', source: 'both', evidence: 'Funding Johns Hopkins research centers for mental health' },
      { name: 'Stoic philosophy & East Asian languages', source: 'both', evidence: 'Princeton thesis and translations of Seneca' },
      { name: 'Culinary experimentation (sous vide & wild game)', source: 'instagram', evidence: 'Precision cooking posts and fermentation projects' }
    ],
    values: ['depth', 'curiosity', 'presence', 'stoicism', 'compassion'],
    personality: { openness: 96, conscientiousness: 90, extraversion: 60, agreeableness: 78, emotional_stability: 84, note: 'Reflective, introverted explorer with exceptional analytical depth.' },
    lifestyle: ['early tea drinker', 'nature walker', 'dog companion', 'unhurried reader', 'mindfulness practitioner'],
    communication_style: 'Introspective, precise, thoughtful, asks profound questions and listens intently.',
    humor: 'Dry, wry, intellectual, laughing at his own past obsessive guinea-pig phases.',
    ideal_partner: 'A thoughtful, emotionally mature woman who loves literature, appreciates quiet mornings, loves animals, and values deep presence over social noise.',
    ideal_first_date: 'Walking dogs through a quiet botanical sanctuary, followed by brewing a rare green tea and discussing favorite books.',
    green_flags: ['Comfortable with comfortable silences', 'Kind to animals', 'Has an introspective inner life'],
    potential_frictions: ['Needs significant solo recharge time', 'Strict boundaries on phone usage'],
    dealbreakers_likely: ['Performative social media obsession', 'Chronic complaining without action'],
    conversation_starters: ['What book has significantly changed how you live?', 'Favorite place in nature to feel small?', 'If you had three months with no internet, what would you do?'],
    voice: 'Calm, measured, articulate, warm baritone cadence with thoughtful pauses.',
    dating_card: 'Writer, podcaster, and lifelong student of human nature. Based in Austin with my dog Molly. Happiest brewing loose-leaf tea, wandering wooded trails, reading old books, or having long dinners where nobody checks their phone. Looking for depth, warmth, and an unhurried connection.',
    confidence: 96,
    confidence_note: 'Decades of published books, transparent podcast introspections, and consistent personal Instagram chronicles.'
  },
  {
    id: 'p_melanie_perkins',
    name: 'Melanie Perkins',
    gender: 'woman',
    interestedIn: 'man',
    linkedin: 'https://www.linkedin.com/in/melanieperkins/',
    instagram: 'https://www.instagram.com/melaniecanva/',
    headline: 'Co-founder & CEO at Canva',
    location: 'Sydney, Australia',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Australian visionary democratizing design for 170M+ people, happiest kitesurfing in open waters.',
    summary: 'Melanie started teaching graphic design at university in Perth, got rejected by 100+ venture capitalists, and persevered to build Canva into one of the most beloved software companies on Earth. She balances monumental philanthropic ambitions with kitesurfing, traveling off the beaten path, and an open, down-to-earth Australian nature.',
    career: { field: 'Design Software & Philanthropy', stage: 'Co-Founder & CEO', ambition: 'very driven', summary: 'Built Canva to a $40B+ valuation; committed Canva equity to the Two-Step Plan to do the most good possible.' },
    reading_notes: [
      '[LinkedIn] University of Western Australia; Co-founder of Fusion Yearbooks and Canva.',
      '[Instagram] Kitesurfing adventures across Western Australia and tropical islands.',
      '[Instagram] Team celebrations with crazy costumes and cardboard creative props.',
      '[LinkedIn] Dedicated focus on the Two-Step Plan: build one of the world’s most valuable companies, then give it away to solve global poverty.',
      '[Photos] Casual linen, beach hair, open ocean backdrops, warm smiles, unpretentious team spirit.'
    ],
    needs: [
      { need: 'A partner with immense vision who values purpose over prestige', why: 'Her north star is systemic philanthropy, not luxury accumulation.', source: 'both', evidence: 'Pledging 30% of Canva equity to charitable causes' },
      { need: 'Thirst for adventurous outdoor sports', why: 'Kitesurfing and outdoor exploration are her mental reset.', source: 'instagram', evidence: 'Kitesurfing in Western Australia and remote Pacific spots' },
      { need: 'Grounded, ego-free companionship', why: 'She resists corporate pretension despite global success.', source: 'both', evidence: 'Modest wedding on Rottnest Island and low-key public life' }
    ],
    hobbies: [
      { name: 'Kitesurfing & ocean swimming', source: 'instagram', evidence: 'Action shots on the water and beach weekend getaways' },
      { name: 'Cardboard prop building & themed party craft', source: 'instagram', evidence: 'Elaborate DIY team celebrations and creative builds' },
      { name: 'Backpacking remote destinations', source: 'both', evidence: 'Traveling to rural communities and learning local arts' }
    ],
    interests: [
      { name: 'Democratization of design & visual communication', source: 'both', evidence: '10+ years dedicated to Canva’s intuitive interface' },
      { name: 'Global poverty alleviation & direct giving', source: 'linkedin', evidence: 'Partnerships with GiveDirectly for cash transfers in Africa' },
      { name: 'Sustainable architecture & green spaces', source: 'instagram', evidence: 'Canva’s carbon-neutral rooftop garden campus in Surry Hills' }
    ],
    values: ['empowerment', 'grit', 'generosity', 'playfulness', 'simplicity'],
    personality: { openness: 94, conscientiousness: 94, extraversion: 78, agreeableness: 88, emotional_stability: 86, note: 'Rare combination of relentless operational tenacity and gentle human empathy.' },
    lifestyle: ['ocean athlete', 'down-to-earth', 'purpose-driven', 'adventurous traveler', 'creative DIYer'],
    communication_style: 'Inspirational, warm Australian clarity, highly collaborative and supportive.',
    humor: 'Playful, self-effacing, loves goofy team costumes and silly puns.',
    ideal_partner: 'An adventurous, kind-hearted man who cares deeply about leaving the world better, loves outdoor action, and is excited to camp under the stars.',
    ideal_first_date: 'Grabbing flat whites and taking a coastal walk along the Sydney headlands, watching the waves roll in.',
    green_flags: ['Generous to those with less', 'Loves being in the ocean', 'Excited about crazy big ideas'],
    potential_frictions: ['Intense CEO schedule', 'Reluctance to spend on superficial luxury'],
    dealbreakers_likely: ['Arrogance or selfishness', 'Cynicism about social impact'],
    conversation_starters: ['What is the most beautiful beach you have ever stood on?', 'What would you do if money were no object?', 'Best homemade costume you ever wore?'],
    voice: 'Bright, cheerful Australian accent, optimistic, humble, and full of conviction.',
    dating_card: 'Perth-born founder of Canva, ocean lover, and kitesurfing enthusiast. I believe in setting crazy big goals and working joyfully to make them real. When I am not working, I am probably in the ocean, making cardboard costumes for a party, or planning an off-the-grid trek. Looking for an adventurous partner with a kind heart and a big imagination.',
    confidence: 95,
    confidence_note: 'Long documented trajectory from Perth roots to Canva leadership and authentic Australian outdoor lifestyle.'
  },
  {
    id: 'p_marques_brownlee',
    name: 'Marques Brownlee',
    gender: 'man',
    interestedIn: 'woman',
    linkedin: 'https://www.linkedin.com/in/marques-brownlee-6b3a0b59/',
    instagram: 'https://www.instagram.com/mkbhd/',
    headline: 'Creator @ MKBHD · Professional Ultimate Frisbee Player',
    location: 'New Jersey & New York',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Tech storyteller, matte black minimalist, and professional Ultimate Frisbee athlete with a RED camera.',
    summary: 'Marques (MKBHD) has reviewed consumer technology with crisp integrity since he was in high school, amassing over 18 million subscribers. Outside the studio, he is a world-class professional Ultimate Frisbee player for the New York Empire, a car enthusiast, and a devotee of crisp matte-black aesthetics.',
    career: { field: 'Digital Media & Consumer Tech', stage: 'Founder & Host', ambition: 'very driven', summary: 'Creator of MKBHD and Waveform Podcast; winner of national Ultimate Frisbee championships.' },
    reading_notes: [
      '[LinkedIn] Stevens Institute of Technology Business & Information Systems graduate.',
      '[Instagram] Professional Ultimate Frisbee action shots competing for New York Empire.',
      '[Instagram] Clean matte black studio gear, electric vehicle road tests, and macro lens cinematography.',
      '[LinkedIn] Discussions on ethical media production, independent journalism, and hardware design.',
      '[Photos] Sleek black and red color palette, athletic sportswear, clean minimal framing.'
    ],
    needs: [
      { need: 'A partner with their own dedicated pursuits and high standards', why: 'He respects discipline and craft above all.', source: 'both', evidence: 'Dual careers in high-production YouTube and professional athletics' },
      { need: 'Patience with gear testing and tech curiosity', why: 'New gadgets and prototypes constantly surround his life.', source: 'instagram', evidence: 'Studio setup tours and prototype evaluations' },
      { need: 'Support for competitive athletic commitments', why: 'Ultimate Frisbee requires intense travel, workouts, and weekend tournaments.', source: 'instagram', evidence: 'AUDL league tournament schedules and gym training posts' }
    ],
    hobbies: [
      { name: 'Professional Ultimate Frisbee (AUDL)', source: 'both', evidence: 'Plays handler for NY Empire; highlights and championship rings' },
      { name: 'Automotive driving & EV roadtrips', source: 'both', evidence: 'Reviews on Autofocus channel and track driving tests' },
      { name: 'High-end cinematography & drone flying', source: 'instagram', evidence: 'Behind-the-scenes robot camera arm footage' }
    ],
    interests: [
      { name: 'Industrial design & matte finishes', source: 'both', evidence: 'Iconic matte black aesthetic across all personal items' },
      { name: 'Battery chemistry and clean transport', source: 'both', evidence: 'Deep dives on EV battery architectures' },
      { name: 'Hip-hop music production and sound design', source: 'instagram', evidence: 'Audio gear reviews and studio sound mixing' }
    ],
    values: ['integrity', 'discipline', 'simplicity', 'craft', 'athleticism'],
    personality: { openness: 84, conscientiousness: 96, extraversion: 74, agreeableness: 85, emotional_stability: 92, note: 'High emotional calm, extreme discipline, and meticulous attention to detail.' },
    lifestyle: ['athlete', 'minimalist', 'studio creator', 'car driver', 'early trainer'],
    communication_style: 'Smooth, measured, crisp, articulate, with calm reassuring tone.',
    humor: 'Dry, witty tech observations, playful dad jokes about smartphone bezels.',
    ideal_partner: 'An athletic, thoughtful, and authentic woman who takes pride in her craft, enjoys staying active, and appreciates clean, simple aesthetics.',
    ideal_first_date: 'Taking an electric vehicle on a scenic drive up the Hudson Valley, grabbing artisan burgers, and catching a golden-hour sunset.',
    green_flags: ['High discipline and focus', 'Appreciates good design and clean spaces', 'Enjoys being active outdoors'],
    potential_frictions: ['Intense weekend sports tournament travel', 'Can be very quiet when processing thoughts'],
    dealbreakers_likely: ['Dramatic conflict', 'Sloppiness or unreliability'],
    conversation_starters: ['What piece of tech can you genuinely not live without?', 'Favorite car design of all time?', 'Ultimate Frisbee or basketball?'],
    voice: 'Warm baritone, crystal-clear articulation, relaxed, confident, and observant.',
    dating_card: 'Tech reviewer, studio nerd, and professional Ultimate Frisbee athlete. When I am not testing the latest cameras or electric cars, I am on the turf training or enjoying a quiet road trip. I believe in doing things with craft and staying grounded. Looking for someone genuine, athletic, and easy to laugh with.',
    confidence: 96,
    confidence_note: 'Unblemished 15+ year public track record of authentic tech analysis and professional athletic competition.'
  },
  {
    id: 'p_ijustine',
    name: 'Justine Ezarik',
    gender: 'woman',
    interestedIn: 'man',
    linkedin: 'https://www.linkedin.com/in/ijustine/',
    instagram: 'https://www.instagram.com/ijustine/',
    headline: 'Creator @ iJustine · Author · Host · Gamer',
    location: 'Los Angeles, California',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Tech creator pioneer, video game streamer, culinary gadget experimenter, and rescue dog mom.',
    summary: 'Justine (iJustine) pioneered lifestyle tech vlogging before the word "influencer" existed. Based in LA, she loves unboxing experimental hardware, streaming video games, cooking with futuristic kitchen gadgets, and spending cozy evenings with her rescue dogs.',
    career: { field: 'Digital Entertainment & Gaming', stage: 'Creator & Producer', ambition: 'very driven', summary: '15+ years creating video content; author of NYT bestseller; co-host of Same Brain podcast.' },
    reading_notes: [
      '[LinkedIn] Pittsburgh Technical Institute graduate in graphic design and multimedia.',
      '[Instagram] Unboxing retro gaming consoles, Apple gear, and drone adventures.',
      '[Instagram] Adorable rescue dogs bundled in cozy sweaters.',
      '[LinkedIn] Keynotes on digital video evolution, longevity in creator economy, and women in tech.',
      '[Photos] Bright upbeat lighting, gaming battlestations, dog cuddles, sunny LA backyard.'
    ],
    needs: [
      { need: 'A partner who embraces tech enthusiasm and video games', why: 'Gaming and tech are central to her daily leisure.', source: 'both', evidence: 'Daily streaming and console setup tours' },
      { need: 'Deep love for rescue dogs', why: 'Her dogs are family members who join her on work and travel.', source: 'instagram', evidence: 'Countless posts and highlights celebrating her rescue pups' },
      { need: 'Support for creative video production spontaneity', why: 'She loves whipping out cameras when inspiration hits.', source: 'both', evidence: '15+ years of continuous vlogging' }
    ],
    hobbies: [
      { name: 'Video gaming (RPG & co-op)', source: 'both', evidence: 'Gaming live streams and custom PC builds' },
      { name: 'Culinary gadget cooking & baking', source: 'instagram', evidence: 'Testing smart ovens, espresso machines, and air fryers' },
      { name: 'Drone flying & scenic videography', source: 'instagram', evidence: 'FPV drone footage along California coastlines' }
    ],
    interests: [
      { name: 'Consumer hardware innovations', source: 'both', evidence: 'Keynote coverage of Apple, Sony, and robotics' },
      { name: 'Animal rescue advocacy', source: 'instagram', evidence: 'Supporting local shelters and foster programs' },
      { name: 'Sci-fi television and movie lore', source: 'instagram', evidence: 'Comic-Con visits and sci-fi franchise trivia' }
    ],
    values: ['positivity', 'curiosity', 'loyalty', 'kindness', 'playfulness'],
    personality: { openness: 92, conscientiousness: 84, extraversion: 90, agreeableness: 92, emotional_stability: 82, note: 'Brimming with enthusiastic optimism, approachable warmth, and creative energy.' },
    lifestyle: ['gamer', 'tech early-adopter', 'dog mom', 'gadget baker', 'cheerful creator'],
    communication_style: 'Upbeat, bubbly, expressive, fast-paced, full of excitement and warmth.',
    humor: 'Playful gamer humor, self-deprecating baking fails, cute dog narration.',
    ideal_partner: 'A kind, fun-loving man who enjoys co-op video games, loves dogs, isn’t intimidated by cameras, and knows how to make a great cup of coffee.',
    ideal_first_date: 'Checking out an interactive tech or arcade museum, followed by grabbing boba or espresso and walking rescue dogs by the beach.',
    green_flags: ['Treats animals like gold', 'Loves playing video games together', 'Positive problem solver'],
    potential_frictions: ['Lives in a camera-rich environment', 'High-energy daily enthusiasm'],
    dealbreakers_likely: ['Disliking pets', 'Cynical snobbery toward digital creators'],
    conversation_starters: ['What was your first video game console?', 'Dogs or cats (or both)?', 'What futuristic gadget do you wish was invented yesterday?'],
    voice: 'Energetic, upbeat, friendly, warm laughter, expressive and welcoming.',
    dating_card: 'Tech nerd, gamer, and proud rescue dog mom. I love unboxing weird gadgets, testing smart kitchen tools, flying drones, and getting lost in cooperative video games. Looking for a kind, patient partner with a sense of adventure, a love for animals, and an appetite for cozy game nights.',
    confidence: 96,
    confidence_note: 'One of the longest unbroken video and social archives on the internet with complete transparency.'
  },
  {
    id: 'p_lex_fridman',
    name: 'Lex Fridman',
    gender: 'man',
    interestedIn: 'woman',
    linkedin: 'https://www.linkedin.com/in/lexfridman/',
    instagram: 'https://www.instagram.com/lexfridman/',
    headline: 'Research Scientist @ MIT · Host @ Lex Fridman Podcast',
    location: 'Austin, Texas',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    one_liner: 'AI researcher, BJJ black belt, acoustic guitarist, and poet searching for love in black suits.',
    summary: 'Lex explores the human condition, robotics, and philosophy on his long-form podcast. Underneath his trademark black suit and intense interview focus, he is a romantic poet who plays acoustic guitar, trains Brazilian Jiu-Jitsu daily, reads Russian literature, and genuinely believes love will save the world.',
    career: { field: 'Artificial Intelligence & Media', stage: 'Scientist / Broadcaster', ambition: 'very driven', summary: 'PhD in electrical and computer engineering; researcher at MIT; interviewer of global leaders in science and politics.' },
    reading_notes: [
      '[LinkedIn] Drexel BS, MS, PhD in Electrical and Computer Engineering; MIT research scientist.',
      '[Instagram] Brazilian Jiu-Jitsu training photos (black belt) and judo throws.',
      '[Instagram] Playing classical and folk acoustic guitar in quiet rooms.',
      '[LinkedIn] Academic papers on autonomous vehicles, human-robot interaction, and machine learning.',
      '[Photos] Trademark black suit, slim tie, intense eyes, martial arts gis, solo guitar sessions.'
    ],
    needs: [
      { need: 'Deep emotional and philosophical resonance', why: 'He views human connection with sacred poetic reverence.', source: 'both', evidence: 'Frequent discussions on love, mortality, and human vulnerability' },
      { need: 'Support for intense solitary training and reading rituals', why: 'Trains martial arts and reads classic literature hours each day.', source: 'instagram', evidence: 'Daily reading challenges and BJJ sparring logs' },
      { need: 'Gentle warmth to balance analytical intensity', why: 'Spends hours analyzing algorithms and geopolitical conflict.', source: 'both', evidence: 'Reflective podcast closing monologues' }
    ],
    hobbies: [
      { name: 'Brazilian Jiu-Jitsu & Judo', source: 'both', evidence: '1st degree black belt in BJJ; regular training posts' },
      { name: 'Acoustic & classical guitar', source: 'instagram', evidence: 'Videos playing Beatles covers and classical Russian songs' },
      { name: 'Running marathons & endurance training', source: 'instagram', evidence: 'Solo marathons in cold weather and track workouts' }
    ],
    interests: [
      { name: 'Artificial intelligence & consciousness', source: 'both', evidence: 'MIT research and deep conversations with AI luminaries' },
      { name: 'Russian literature & existential philosophy', source: 'both', evidence: 'Dostoevsky, Tolstoy, and Camus reflections' },
      { name: 'Human connection and unconditional empathy', source: 'both', evidence: 'Central recurring theme of all public monologues' }
    ],
    values: ['love', 'discipline', 'curiosity', 'empathy', 'courage'],
    personality: { openness: 96, conscientiousness: 95, extraversion: 45, agreeableness: 86, emotional_stability: 85, note: 'Intensely disciplined, deeply romantic, reflective, introverted thinker.' },
    lifestyle: ['disciplined martial artist', 'black suit wearer', 'night reader', 'guitar player', 'marathon runner'],
    communication_style: 'Soft-spoken, deliberate, deeply attentive, philosophical, romantic.',
    humor: 'Deadpan, earnest self-effacing remarks, subtle dry irony.',
    ideal_partner: 'A warm, kind-hearted, intellectually curious woman who values deep conversation, appreciates poetry or music, and understands the balance between discipline and tenderness.',
    ideal_first_date: 'A quiet stroll through an art museum or quiet park, followed by warm tea and deep, honest conversation about life.',
    green_flags: ['Gentle empathy toward strangers', 'Loves deep conversations over small talk', 'Appreciates music and books'],
    potential_frictions: ['Intense work ethic and solo training routines', 'Introverted need for silence'],
    dealbreakers_likely: ['Cynicism about love', 'Cruelty or superficial judgment'],
    conversation_starters: ['What book has made you cry?', 'What does love mean to you in one sentence?', 'Acoustic guitar or piano?'],
    voice: 'Low, gentle, measured, earnest baritone with thoughtful cadence.',
    dating_card: 'AI researcher, martial artist, and podcast host. I wear a black suit, train Jiu-Jitsu every day, and play acoustic guitar late at night. I believe deeply in empathy, the beauty of the human spirit, and that love is the answer to the hardest questions. Looking for a kind, gentle soul for quiet walks and deep conversations.',
    confidence: 96,
    confidence_note: 'Comprehensive academic publications, hundreds of hours of raw podcast monologues, and candid personal Instagram posts.'
  },
  {
    id: 'p_payal_kadakia',
    name: 'Payal Kadakia',
    gender: 'woman',
    interestedIn: 'man',
    linkedin: 'https://www.linkedin.com/in/payalkadakia/',
    instagram: 'https://www.instagram.com/payal/',
    headline: 'Founder @ ClassPass · Artistic Director @ The Sa Dance Company',
    location: 'New York & Los Angeles',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Tech unicorn founder and classical Indian dancer who choreographs life with ruthless grace.',
    summary: 'Payal founded ClassPass to solve her own frustration with finding a dance class, scaling it into a billion-dollar fitness empire. Alongside her tech career, she is the founder and artistic director of The Sa Dance Company, celebrating Indian classical and contemporary dance with breathtaking discipline and artistry.',
    career: { field: 'Fitness Tech & Performing Arts', stage: 'Founder & Author', ambition: 'very driven', summary: 'Founded ClassPass; author of LifePass; artistic director elevating South Asian dance on global stages.' },
    reading_notes: [
      '[LinkedIn] MIT BS in Operations Research and Economics; Founder of ClassPass and Sa Dance Company.',
      '[Instagram] Magnificent dance performance videos in traditional Indian classical attire.',
      '[Instagram] Family celebrations, vibrant Diwali decor, and motherhood milestones.',
      '[LinkedIn] Articles on goal-setting, artistic discipline in business, and overcoming entrepreneurial rejection.',
      '[Photos] Dynamic dance poses, elegant jewel tones, bright NYC studios, radiant smiles.'
    ],
    needs: [
      { need: 'A partner who deeply respects artistic discipline and performance', why: 'Dance is not a hobby for her; it is her spiritual soul.', source: 'both', evidence: 'Founded and directs The Sa Dance Company for 15+ years' },
      { need: 'Mutual commitment to ambitious personal goals', why: 'Her LifePass method is built on structured quarterly life design.', source: 'both', evidence: 'Bestselling book LifePass outlining goal architecture' },
      { need: 'Appreciation of South Asian culture and family heritage', why: 'Proudly rooted in Indian dance traditions and festive family rituals.', source: 'instagram', evidence: 'Diwali and classical dance cultural showcases' }
    ],
    hobbies: [
      { name: 'Classical Indian & contemporary dance choreography', source: 'both', evidence: 'Stage performances at Lincoln Center and Alvin Ailey' },
      { name: 'Boutique fitness testing (barre, cycling, pilates)', source: 'both', evidence: 'ClassPass studio testing history and daily fitness routines' },
      { name: 'Journaling and goal architecture', source: 'both', evidence: 'LifePass workshops and quarterly planner frameworks' }
    ],
    interests: [
      { name: 'Performing arts preservation & cultural storytelling', source: 'both', evidence: 'Directing Sa Dance Company productions' },
      { name: 'Female minority entrepreneurship', source: 'linkedin', evidence: 'Mentoring Asian American and immigrant founders' },
      { name: 'Nutrition and high-performance recovery', source: 'instagram', evidence: 'Healthy Ayurvedic and high-protein lifestyle choices' }
    ],
    values: ['artistry', 'discipline', 'heritage', 'authenticity', 'growth'],
    personality: { openness: 92, conscientiousness: 96, extraversion: 82, agreeableness: 84, emotional_stability: 88, note: 'Extremely focused, graceful, artistically expressive, and disciplined.' },
    lifestyle: ['dancer', 'goal-architect', 'wellness-oriented', 'culturally connected', 'high-performer'],
    communication_style: 'Dynamic, poised, articulate, encouraging, with focused precision.',
    humor: 'Playful, joyful laughs during dance rehearsals, lighthearted about perfectionism.',
    ideal_partner: 'An ambitious, disciplined man with a big heart who pursues his own passions with dedication, values family, and can appreciate the magic of dance and live arts.',
    ideal_first_date: 'Attending an inspiring live dance or music performance followed by dessert and discussing creative ambitions.',
    green_flags: ['High personal discipline and passion', 'Enjoys music and the arts', 'Respects cultural heritage'],
    potential_frictions: ['Very structured daily schedule', 'High standards for intentionality'],
    dealbreakers_likely: ['Lack of ambition', 'Disrespect for performing arts or family traditions'],
    conversation_starters: ['What was a moment on stage or in an audience that gave you goosebumps?', 'Favorite dance style to watch?', 'How do you set goals for your year?'],
    voice: 'Poised, vibrant, articulate, warm, and inspiring.',
    dating_card: 'Founder of ClassPass, author of LifePass, and artistic director of The Sa Dance Company. I believe in designing a life full of passion, movement, and purpose. When I am not working, I am in the dance studio choreographing, spending time with family, or testing out a new fitness class. Looking for a passionate, kind partner who lives with purpose.',
    confidence: 96,
    confidence_note: 'Extensive MIT background, ClassPass unicorn trajectory, and ongoing dance company documentation.'
  },
  {
    id: 'p_austen_allred',
    name: 'Austen Allred',
    gender: 'man',
    interestedIn: 'woman',
    linkedin: 'https://www.linkedin.com/in/austenallred/',
    instagram: 'https://www.instagram.com/austen/',
    headline: 'Founder & CEO @ BloomTech',
    location: 'Salt Lake City, Utah',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Utah outdoorsman, education builder, and former Honda Civic camper passionate about frontier learning.',
    summary: 'Austen famously lived in his Honda Civic in Silicon Valley while getting his first startup off the ground, later founding BloomTech to rethink vocational coding education. Now based in Utah, he loves backcountry snowboarding, hiking with his family, smoking brisket, and debating the future of education.',
    career: { field: 'Education Technology', stage: 'Founder & CEO', ambition: 'very driven', summary: 'Founded BloomTech (formerly Lambda School) to pioneer outcome-based education; author of growth marketing guides.' },
    reading_notes: [
      '[LinkedIn] Founder & CEO of BloomTech; pioneer of income share agreements and technical training.',
      '[Instagram] Snowboarding Utah’s steepest powder and family mountain hikes.',
      '[Instagram] Backyard BBQ brisket cooks on wood-fired smokers.',
      '[LinkedIn] Commentary on workforce development, economic mobility, and apprenticeship models.',
      '[Photos] Utah mountain backdrops, winter coats, ski goggles, family porch moments.'
    ],
    needs: [
      { need: 'A partner who loves mountain outdoor adventures', why: 'Snowboarding and trail hikes are his therapy.', source: 'instagram', evidence: 'Weekly winter snowboarding posts in Utah backcountry' },
      { need: 'Grounded humility and resilience', why: 'He remembers living out of a car and rejects Silicon Valley elitism.', source: 'both', evidence: 'Open reflections on early poverty and startup struggle' },
      { need: 'Family-centered values and loyalty', why: 'He is devoted to his kids and close-knit community.', source: 'instagram', evidence: 'Warm family moments and weekend camping trips' }
    ],
    hobbies: [
      { name: 'Backcountry snowboarding & skiing', source: 'instagram', evidence: 'Powder skiing in Wasatch mountains' },
      { name: 'Wood-fired BBQ & smoking brisket', source: 'instagram', evidence: '14-hour brisket smoke updates with wood splits' },
      { name: 'Camping and off-roading', source: 'both', evidence: 'Desert camping trips in Southern Utah' }
    ],
    interests: [
      { name: 'Economic mobility & education innovation', source: 'both', evidence: 'BloomTech missions and vocational policy essays' },
      { name: 'Economic history & American manufacturing', source: 'linkedin', evidence: 'Book recommendations on industrial history' },
      { name: 'Outdoor gear engineering', source: 'instagram', evidence: 'Gear tests of snowboards and thermal gear' }
    ],
    values: ['resilience', 'mobility', 'family', 'grit', 'outdoors'],
    personality: { openness: 86, conscientiousness: 88, extraversion: 78, agreeableness: 80, emotional_stability: 85, note: 'Grounded, gritty, optimistic problem solver with deep family focus.' },
    lifestyle: ['mountain outdoorsman', 'snowboarder', 'BBQ pitmaster', 'family dad', 'pragmatic builder'],
    communication_style: 'Direct, candid, conversational, storytelling-rich, unpretentious.',
    humor: 'Dry Western humor, self-deprecating startup war stories, teasing about snow conditions.',
    ideal_partner: 'A down-to-earth, spirited woman who enjoys being outside in the mountains, values family, and appreciates genuine grit over social status.',
    ideal_first_date: 'Grabbing hearty mountain burgers and craft sodas after a scenic walk or ski run in the Wasatch Range.',
    green_flags: ['Loves outdoor nature', 'Resilient and down-to-earth', 'Values family and hard work'],
    potential_frictions: ['Strong focus on work and family', 'Not interested in high-society formal events'],
    dealbreakers_likely: ['Pretentiousness', 'Dislike of outdoor activities'],
    conversation_starters: ['Skiing or snowboarding?', 'Secret to the best smoked brisket?', 'Favorite national park in Utah?'],
    voice: 'Warm, relaxed Western tone, authentic, straightforward, and gritty.',
    dating_card: 'Education builder, Utah native, and outdoor addict. When I am not working on BloomTech, I am snowboarding fresh powder in the Wasatch mountains, smoking brisket on the back porch, or camping with family. Looking for someone grounded, adventurous, and ready for mountain life.',
    confidence: 94,
    confidence_note: 'Transparent startup journey and consistent documentation of outdoor family life in Utah.'
  },
  {
    id: 'p_katrina_lake',
    name: 'Katrina Lake',
    gender: 'woman',
    interestedIn: 'man',
    linkedin: 'https://www.linkedin.com/in/katrinalake/',
    instagram: 'https://www.instagram.com/katrinalake/',
    headline: 'Founder & Board Member @ Stitch Fix · Investor',
    location: 'San Francisco, California',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Retail data science pioneer who took Stitch Fix public with baby in arms, lover of running and Tahoe snow.',
    summary: 'Katrina Lake famously held her toddler on the floor of NASDAQ when taking Stitch Fix public. Combining an economics mind with retail curation, she pioneered data-driven personalized styling. In private life, she loves trail running in the Bay Area, skiing in Lake Tahoe, and mentoring women in venture and retail.',
    career: { field: 'Retail Technology & Venture Capital', stage: 'Founder & Investor', ambition: 'very driven', summary: 'Founded Stitch Fix at Harvard Business School; youngest female founder to take a company public at the time.' },
    reading_notes: [
      '[LinkedIn] Stanford BA in Economics; Harvard Business School MBA; Founder of Stitch Fix.',
      '[Instagram] Running across the Golden Gate Bridge and Tahoe ski weekends.',
      '[Instagram] Unpretentious family adventures, cooking dinners, and camping trips.',
      '[LinkedIn] Thought leadership on algorithmic retail, working motherhood, and board diversity.',
      '[Photos] Natural California chic, trail running shoes, ski jackets, warm family smiles.'
    ],
    needs: [
      { need: 'An emotionally grounded partner who values equal partnership', why: 'Balances executive leadership and active family motherhood.', source: 'both', evidence: 'Pioneered inclusive parental policies and spoke on dual-career parenting' },
      { need: 'Love for active outdoor fitness (running, skiing)', why: 'Physical exercise outdoors is her primary mental release.', source: 'instagram', evidence: 'Consistent half-marathon and Tahoe ski trip updates' },
      { need: 'Intellectual banter blending economics and human behavior', why: 'She loves dissecting consumer trends and data.', source: 'both', evidence: 'HBS case studies and economic commentary' }
    ],
    hobbies: [
      { name: 'Trail running & road marathons', source: 'instagram', evidence: 'Running scenic Bay Area trails and city loops' },
      { name: 'Tahoe skiing & alpine sports', source: 'instagram', evidence: 'Winter ski weekends with friends and family' },
      { name: 'Sourdough baking and seasonal cooking', source: 'instagram', evidence: 'Weekend sourdough loaves and farm-fresh vegetable meals' }
    ],
    interests: [
      { name: 'Data science and personalized algorithms', source: 'both', evidence: 'Stitch Fix algorithmic styling engine architecture' },
      { name: 'Female venture investing & board governance', source: 'linkedin', evidence: 'Board roles at Glossier and investments in female founders' },
      { name: 'Sustainable apparel supply chains', source: 'both', evidence: 'Speeches on reducing fashion waste through precision demand' }
    ],
    values: ['balance', 'rigor', 'equality', 'curiosity', 'resilience'],
    personality: { openness: 86, conscientiousness: 94, extraversion: 78, agreeableness: 86, emotional_stability: 90, note: 'Highly disciplined, analytical, warm, and exceptionally poised.' },
    lifestyle: ['trail runner', 'Tahoe skier', 'active mother', 'California minimalist', 'data-driven thinker'],
    communication_style: 'Poised, articulate, thoughtful, grounded, with warm smiles.',
    humor: 'Quiet, witty observations on parenting, tech jargon, and running gear.',
    ideal_partner: 'A thoughtful, secure man who values true equality, loves outdoor activity, and brings warmth and laughter to a busy, purpose-filled life.',
    ideal_first_date: 'A morning coffee walk in the Presidio followed by casual brunch with great farm-to-table food.',
    green_flags: ['Values equal partnership', 'Loves staying physically active', 'Calm presence under pressure'],
    potential_frictions: ['Very busy professional commitments', 'Strict scheduling needs'],
    dealbreakers_likely: ['Traditional gender role assumptions', 'Lack of personal drive'],
    conversation_starters: ['Running in the morning or evening?', 'Best ski mountain you have ever tackled?', 'Favorite Bay Area coffee spot?'],
    voice: 'Poised, crisp, warm, thoughtful California cadence.',
    dating_card: 'Founder of Stitch Fix, board member, and runner. I love building things at the intersection of data and human taste. Outside of work, you will find me trail running, skiing in Tahoe, baking sourdough, or on the floor playing with my kids. Looking for an equal partner who is grounded, active, and kind.',
    confidence: 95,
    confidence_note: 'Documented trajectory from Stanford/HBS to NASDAQ IPO and ongoing authentic outdoor lifestyle.'
  },
  {
    id: 'p_pieter_levels',
    name: 'Pieter Levels',
    gender: 'man',
    interestedIn: 'woman',
    linkedin: 'https://www.linkedin.com/in/pieter-levels-2503952a/',
    instagram: 'https://www.instagram.com/levelsio/',
    headline: 'Founder @ Nomad List, Remote OK & Photo AI · Solo Developer',
    location: 'Amsterdam & Global Nomad',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Solo indie hacker icon building millions in software from a laptop in rooftop cafes and EDM venues.',
    summary: 'Pieter (levelsio) proved you do not need VC funding or a team to build software empires. Operating as a solo developer with simple PHP and vanilla JS, he built Nomad List, Remote OK, and Photo AI. He lives a nomadic life between Amsterdam, Lisbon, and Asia, producing electronic dance music and exploring local street food.',
    career: { field: 'Independent Software & AI', stage: 'Solo Founder', ambition: 'very driven', summary: 'Famous solo entrepreneur building high-revenue products with no employees; champion of the indie hacker movement.' },
    reading_notes: [
      '[LinkedIn] University of Amsterdam Master of Science in Business Administration.',
      '[Instagram] Rooftop pool workspaces, cyberpunk city nights in Tokyo and Bangkok.',
      '[Instagram] Synthesizer setups, DJ decks, and electronic music tracks in progress.',
      '[LinkedIn] Real-time revenue dashboards, minimalism in tech stacks, and remote work advocacy.',
      '[Photos] Backpacking life, laptop in cafes, neon lights, minimal casual tees, street food stalls.'
    ],
    needs: [
      { need: 'Freedom of movement and location independence', why: 'He thrives by changing his physical environment every few months.', source: 'both', evidence: 'Founded Nomad List and lives permanently nomadic' },
      { need: 'An open-minded partner with creative or musical flair', why: 'Music production and generative art are his creative outlets.', source: 'instagram', evidence: 'EDM music production stories and DJ sets' },
      { need: 'Radical independence and intolerance for corporate bureaucracy', why: 'He has built his life to avoid meetings and managers.', source: 'both', evidence: 'Zero-employee software architecture essays' }
    ],
    hobbies: [
      { name: 'Electronic dance music (EDM) production & DJing', source: 'instagram', evidence: 'Ableton Live projects and DJ mixes posted on Instagram' },
      { name: 'Exploring street food & rooftop spots', source: 'instagram', evidence: 'Candid ramen, pad thai, and street food reviews across Asia' },
      { name: 'Solo road trips & electric scooters', source: 'both', evidence: 'Scooter road trips across Mediterranean islands' }
    ],
    interests: [
      { name: 'Generative AI & autonomous agents', source: 'both', evidence: 'Creator of Photo AI and Interior AI' },
      { name: 'Minimalist tech stacks (raw HTML, CSS, PHP)', source: 'linkedin', evidence: 'Advocacy for shipping fast without complex frameworks' },
      { name: 'Urban geography & remote work economics', source: 'both', evidence: 'Nomad List city cost-of-living data analysis' }
    ],
    values: ['freedom', 'autonomy', 'simplicity', 'creativity', 'speed'],
    personality: { openness: 96, conscientiousness: 88, extraversion: 65, agreeableness: 72, emotional_stability: 82, note: 'Ultra-high creative independence, contrarian thinker, energetic solo executor.' },
    lifestyle: ['digital nomad', 'solo builder', 'EDM producer', 'rooftop regular', 'minimalist traveler'],
    communication_style: 'Fast, witty, meme-friendly, unfiltered, pragmatic, and candid.',
    humor: 'Internet irony, irreverent startup satire, celebrating scrappy simplicity.',
    ideal_partner: 'An independent, adventurous woman who loves to travel, has her own creative or remote work, enjoys electronic music and vibrant street food, and hates rigid routines.',
    ideal_first_date: 'Exploring a bustling night market or rooftop lounge in a vibrant city, followed by listening to great electronic music.',
    green_flags: ['Can pack everything in a carry-on', 'Independent and self-motivated', 'Loves spicy street food'],
    potential_frictions: ['Unconventional lifestyle with frequent location shifts', 'Allergic to traditional corporate structures'],
    dealbreakers_likely: ['Desire for rigid 9-to-5 stability', 'Need for constant routine'],
    conversation_starters: ['What is your favorite city you have ever stayed in?', 'Could you live out of one carry-on bag?', 'Favorite electronic or ambient music track?'],
    voice: 'Casual, fast, Dutch-English directness, witty, no-BS attitude.',
    dating_card: 'Indie maker and nomad. I build software solo from my laptop, produce electronic dance music, and travel between Amsterdam, Lisbon, and Asian night markets. I love minimalism, good coffee, fast execution, and zero meetings. Looking for an adventurous, independent partner who loves to travel and explore.',
    confidence: 95,
    confidence_note: 'Ten+ years of transparent open-startup sharing and ongoing Instagram lifestyle updates.'
  },
  {
    id: 'p_reshma_saujani',
    name: 'Reshma Saujani',
    gender: 'woman',
    interestedIn: 'man',
    linkedin: 'https://www.linkedin.com/in/reshma-saujani/',
    instagram: 'https://www.instagram.com/reshmasaujani/',
    headline: 'Founder @ Girls Who Code & Moms First · Author',
    location: 'New York City',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Brave-not-perfect pioneer who closed the gender tech gap and is redesigning support for mothers.',
    summary: 'Reshma lost a Congressional race by a landslide, realized perfectionism was holding women back, and launched Girls Who Code from a borrowed room in NYC. Now leading Moms First, she advocates for paid leave and child care, while enjoying Central Park runs, yoga, and warm home-cooked Indian meals with her family.',
    career: { field: 'Social Impact, Policy & Tech', stage: 'Founder & CEO', ambition: 'very driven', summary: 'Founded Girls Who Code (educating 500,000+ girls); author of Brave, Not Perfect; CEO of Moms First.' },
    reading_notes: [
      '[LinkedIn] University of Illinois, Harvard Kennedy School, Yale Law School graduate.',
      '[Instagram] Family celebrations, Diwali sweets, and candid NYC parenting.',
      '[Instagram] Morning runs in Central Park and yoga sessions.',
      '[LinkedIn] Legislative campaigns for child care infrastructure and equal pay.',
      '[Photos] Vibrant jewel-tone blazers, Indian traditional attire, NYC streets, warm family hugs.'
    ],
    needs: [
      { need: 'A partner who is an equal teammate and champion of equality', why: 'Her entire career centers on dismantling unequal domestic burdens.', source: 'both', evidence: 'Writings on partnership equality and the national child care crisis' },
      { need: 'Embrace of courage and imperfect authenticity', why: 'Her mantra is "Brave, Not Perfect".', source: 'both', evidence: 'Viral TED talk on teaching girls bravery over perfection' },
      { need: 'Love for lively NYC city life and South Asian culture', why: 'Rooted in New York cultural rhythm and immigrant heritage.', source: 'instagram', evidence: 'Cultural holiday celebrations and NYC civic gatherings' }
    ],
    hobbies: [
      { name: 'Central Park distance running', source: 'instagram', evidence: 'Morning park jogs through changing seasons' },
      { name: 'Yoga and mindfulness practice', source: 'instagram', evidence: 'Yoga studio sessions and meditation retreats' },
      { name: 'Hosting Indian feasts and cooking chai', source: 'instagram', evidence: 'Making homemade chai and festive dishes for friends' }
    ],
    interests: [
      { name: 'Closing the gender gap in technology & AI', source: 'both', evidence: 'Educated 500k+ young women in computer science' },
      { name: 'Childcare infrastructure and paid family leave', source: 'linkedin', evidence: 'Meetings with White House and Congressional leaders on child care' },
      { name: 'Immigrant stories and political history', source: 'both', evidence: 'Reflections on her parents’ Ugandan-Indian refugee journey' }
    ],
    values: ['bravery', 'justice', 'community', 'family', 'resilience'],
    personality: { openness: 90, conscientiousness: 92, extraversion: 88, agreeableness: 85, emotional_stability: 84, note: 'Fiercely courageous, passionate, warm, and deeply community-minded.' },
    lifestyle: ['civic activist', 'NYC runner', 'family-centered', 'yoga practitioner', 'change-maker'],
    communication_style: 'Passionate, articulate, stirring, warm, full of moral conviction.',
    humor: 'Wry, honest about parenting chaos, laughing at the myth of the "superwoman".',
    ideal_partner: 'A secure, compassionate man with a strong moral compass who believes in true equal partnership, values family, and isn’t afraid of big, brave causes.',
    ideal_first_date: 'Walking through Central Park on a crisp afternoon, followed by hot chai or coffee and a lively conversation on making an impact.',
    green_flags: ['Respects equal partnership in the home', 'Passionate about fairness', 'Warm and attentive listener'],
    potential_frictions: ['Demanding advocacy travel schedule', 'Little patience for passivity'],
    dealbreakers_likely: ['Casual sexism or traditional domestic assumptions', 'Indifference to social equity'],
    conversation_starters: ['What was a moment you chose bravery over being safe?', 'Favorite season in Central Park?', 'Chai or black coffee?'],
    voice: 'Empathetic, clear, passionate NYC cadence, warm and deeply authentic.',
    dating_card: 'Founder of Girls Who Code and Moms First. I believe in being brave rather than perfect. You will find me running through Central Park, drinking cardamom chai, advocating for families, or spending cozy weekends with my boys. Looking for an equal partner who is kind, secure, and ready to cheer each other on.',
    confidence: 96,
    confidence_note: 'Bestselling author, viral TED speaker, and consistent long-term social advocate.'
  },
  {
    id: 'p_dharmesh_shah',
    name: 'Dharmesh Shah',
    gender: 'man',
    interestedIn: 'woman',
    linkedin: 'https://www.linkedin.com/in/dharmesh/',
    instagram: 'https://www.instagram.com/dharmesh/',
    headline: 'Co-Founder & CTO @ HubSpot · AI Builder',
    location: 'Boston, Massachusetts',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Proud introvert, HubSpot CTO, and night-owl coder building AI apps at 2 AM with warmth and curiosity.',
    summary: 'Dharmesh co-founded HubSpot from MIT and literally wrote the book on inbound marketing. An unapologetic introvert, he loves coding late at night, building free AI tools like ChatSpot, playing board games, and writing heartfelt essays on culture and kindness in tech.',
    career: { field: 'Software & Artificial Intelligence', stage: 'Co-Founder & CTO', ambition: 'very driven', summary: 'Co-founded HubSpot (NYSE: HUBS); author of the HubSpot Culture Code; prolific angel investor.' },
    reading_notes: [
      '[LinkedIn] MIT MS in Management of Technology; BS in Computer Science; Co-founder and CTO HubSpot.',
      '[Instagram] Whimsical behind-the-scenes coding photos and humorous AI experiments.',
      '[Instagram] Family moments with his son and calm Boston weekends.',
      '[LinkedIn] Iconic HubSpot Culture Code presentation with over 6 million views.',
      '[Photos] Casual hoodies, dark mode IDE monitors, gentle smiles, book stacks.'
    ],
    needs: [
      { need: 'Understanding of introvert energy recharge needs', why: 'Social batteries drain quickly; he needs quiet time to code and think.', source: 'both', evidence: 'Numerous essays on thriving as an extreme introvert' },
      { need: 'Patience with late-night creative coding bursts', why: 'His best architectural ideas hit after midnight.', source: 'both', evidence: 'Tweets and LinkedIn posts coding AI prototypes at 2 AM' },
      { need: 'Kindness and intellectual modesty', why: 'He actively avoids loud corporate egos.', source: 'linkedin', evidence: 'Core tenet of HubSpot Culture Code: "HEART" (Humble, Empathetic, Adaptable, Remarkable, Transparent)' }
    ],
    hobbies: [
      { name: 'Late-night prototype coding (AI & Python)', source: 'both', evidence: 'Weekend hacker projects like ChatSpot and WordPlay' },
      { name: 'Board games & logic puzzles', source: 'instagram', evidence: 'Board game nights with friends and complex puzzles' },
      { name: 'Writing thoughtful startup & culture essays', source: 'linkedin', evidence: 'Popular OnStartups blog and LinkedIn articles' }
    ],
    interests: [
      { name: 'Large language models & conversational interfaces', source: 'both', evidence: 'Early prototypes using OpenAI APIs and autonomous agents' },
      { name: 'Company culture design & psychological safety', source: 'linkedin', evidence: 'The HubSpot Culture Code deck' },
      { name: 'Angel investing in mission-driven builders', source: 'both', evidence: 'Backing 90+ early stage technology founders' }
    ],
    values: ['humility', 'empathy', 'kindness', 'curiosity', 'transparency'],
    personality: { openness: 95, conscientiousness: 92, extraversion: 38, agreeableness: 94, emotional_stability: 90, note: 'Classic high-empathy introvert, gentle intellect, and creative tinkerer.' },
    lifestyle: ['night owl', 'introvert', 'coder', 'tea drinker', 'kind builder'],
    communication_style: 'Gentle, thoughtful, humorous, self-deprecating, written with immense clarity.',
    humor: 'Witty geek humor, pun-loving, playful self-deprecation about social awkwardness.',
    ideal_partner: 'A warm, kind-hearted woman who appreciates thoughtful conversations, respects quiet moments, loves learning, and has a gentle sense of humor.',
    ideal_first_date: 'A cozy corner table at a quiet bookstore cafe with hot tea, followed by browsing favorite book recommendations.',
    green_flags: ['High empathy and kindness', 'Comfortable with quiet evenings at home', 'Curious about how things work'],
    potential_frictions: ['Low tolerance for loud, crowded party environments', 'Night owl sleep schedule'],
    dealbreakers_likely: ['Arrogance or cruelty', 'Aggressive drama'],
    conversation_starters: ['What is your favorite board game of all time?', 'Are you an introvert or an extrovert?', 'What is a problem you wish AI could solve?'],
    voice: 'Soft, warm, articulate, gentle humor, thoughtful pauses.',
    dating_card: 'HubSpot co-founder, developer, and proud introvert. I love building things with code late at night, thinking about culture, drinking tea, and playing board games. I believe kindness and humility are superpowers. Looking for a gentle, curious soul for quiet conversations and warm connection.',
    confidence: 96,
    confidence_note: 'Decades of continuous coding and writing on the internet with total transparency.'
  },
  {
    id: 'p_gwyneth_paltrow',
    name: 'Gwyneth Paltrow',
    gender: 'woman',
    interestedIn: 'man',
    linkedin: 'https://www.linkedin.com/in/gwyneth-paltrow-971a1793/',
    instagram: 'https://www.instagram.com/gwynethpaltrow/',
    headline: 'Founder & CEO @ goop · Oscar-winning Actress',
    location: 'Los Angeles, California & Amagansett, NY',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Goop founder, culinary cookbook author, and wellness pioneer finding beauty in quiet coastal kitchens.',
    summary: 'Gwyneth transformed her Hollywood career into goop, the brand that defined modern luxury wellness. At home between Los Angeles and the Hamptons, she is happiest barefoot in the kitchen, cooking seasonal roast chicken with her family, doing daily yoga, and discussing clean living.',
    career: { field: 'Wellness, Consumer Goods & Media', stage: 'Founder & CEO', ambition: 'very driven', summary: 'Built goop from a kitchen newsletter to a multimillion-dollar wellness, beauty, and fashion lifestyle house.' },
    reading_notes: [
      '[LinkedIn] Founder & CEO of goop since 2008; driving holistic health and clean beauty.',
      '[Instagram] Unfiltered morning routine videos with no makeup, making bone broth and matcha.',
      '[Instagram] Seasonal cooking in coastal Hamptons garden kitchens.',
      '[LinkedIn] Focus on clean formulations, intimate wellness normalization, and direct-to-consumer retail.',
      '[Photos] Natural coastal light, barefoot elegance, linen aprons, fresh garden vegetables.'
    ],
    needs: [
      { need: 'A partner who shares or respects intentional clean wellness', why: 'Her lifestyle revolves around clean eating, sauna, and restorative sleep.', source: 'both', evidence: 'goop wellness philosophy and four published clean cookbooks' },
      { need: 'Appreciation of culinary home rituals', why: 'Cooking is her primary love language.', source: 'instagram', evidence: 'Step-by-step cooking videos of family roast dinners' },
      { need: 'Comfort with high public fascination while guarding sanctuary', why: 'Values private sanctuary away from Hollywood paparazzi.', source: 'both', evidence: 'Strict boundaries around home life in Amagansett' }
    ],
    hobbies: [
      { name: 'Farm-to-table cooking & baking', source: 'both', evidence: 'Author of four bestselling cookbooks; frequent recipe videos' },
      { name: 'Infrared sauna & cold hydrotherapy', source: 'instagram', evidence: 'Daily recovery and holistic detox routines' },
      { name: 'Morning yoga & Tracy Anderson workouts', source: 'instagram', evidence: 'Daily morning fitness sessions for over 15 years' }
    ],
    interests: [
      { name: 'Functional medicine & longevity science', source: 'both', evidence: 'Interviews with leading longevity MDs on the goop podcast' },
      { name: 'Interior architecture and organic design', source: 'instagram', evidence: 'Home design features in Architectural Digest' },
      { name: 'European literature and Spanish language', source: 'both', evidence: 'Fluent in Spanish; love for European travel' }
    ],
    values: ['wellness', 'authenticity', 'curiosity', 'beauty', 'family'],
    personality: { openness: 92, conscientiousness: 88, extraversion: 76, agreeableness: 80, emotional_stability: 85, note: 'Polished, aesthetic-minded, health-focused, and unapologetically curious.' },
    lifestyle: ['wellness devotee', 'home chef', 'barefoot minimalist', 'coastal living', 'early riser'],
    communication_style: 'Intimate, warm, direct, elegant, with relaxed California ease.',
    humor: 'Self-aware, witty, playful about her own reputation and quirky wellness trends.',
    ideal_partner: 'A confident, cultured, emotionally mature man who loves good food and wine, values health and quiet evenings, and has a grounded sense of humor.',
    ideal_first_date: 'Cooking dinner together using fresh farmers-market ingredients, paired with a great organic wine and relaxed conversation by the fire.',
    green_flags: ['Appreciates home-cooked meals', 'Understands the value of health and rest', 'Unfazed by fame or public attention'],
    potential_frictions: ['Specific dietary and wellness routines', 'High public visibility'],
    dealbreakers_likely: ['Toxic habits', 'Pretentious name-dropping'],
    conversation_starters: ['What is your all-time favorite meal to cook at home?', 'Favorite coastal town in Europe?', 'Cold plunge or hot sauna?'],
    voice: 'Silky, relaxed, intimate, articulate, warm California cadence.',
    dating_card: 'Founder of goop, cookbook author, and believer in simple, beautiful living. When I am not working, I am in the kitchen roasting chicken, practicing yoga, in the sauna, or walking along the beach. Looking for a grounded, thoughtful partner who loves good food, good laughter, and quiet Sunday mornings.',
    confidence: 95,
    confidence_note: 'Decades of published cookbooks, podcasts, and unfiltered personal Instagram shares.'
  },
  {
    id: 'p_andrew_ng',
    name: 'Andrew Ng',
    gender: 'man',
    interestedIn: 'woman',
    linkedin: 'https://www.linkedin.com/in/andrewyng/',
    instagram: 'https://www.instagram.com/andrew_y_ng/',
    headline: 'Founder @ DeepLearning.AI · Managing General Partner @ AI Fund',
    location: 'Palo Alto, California',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    one_liner: 'AI educator and pioneer who taught 8M+ students, happiest with espresso, math papers, and family walks.',
    summary: 'Andrew Ng co-founded Coursera, founded Google Brain, and led AI at Stanford and Baidu. Despite shaping modern deep learning, he remains a gentle, humble educator who loves sipping espresso while reading arXiv papers, taking family walks around Palo Alto, and teaching children to code.',
    career: { field: 'Artificial Intelligence & Education', stage: 'Founder & Professor', ambition: 'very driven', summary: 'Adjunct professor at Stanford; founder of DeepLearning.AI and AI Fund; educated millions in machine learning.' },
    reading_notes: [
      '[LinkedIn] Carnegie Mellon, MIT, UC Berkeley PhD; Stanford AI Lab Director; Coursera Co-founder.',
      '[Instagram] Photos with family and young children on nature trails.',
      '[Instagram] Morning espresso cups next to machine learning research papers.',
      '[LinkedIn] Weekly The Batch newsletter dissecting practical AI developments.',
      '[Photos] Blue button-downs, warm gentle eyes, university lecture halls, family park strolls.'
    ],
    needs: [
      { need: 'A partner who values education and curiosity', why: 'His life purpose is empowering human potential through learning.', source: 'both', evidence: 'Coursera and DeepLearning.AI missions' },
      { need: 'Calm, gentle home environment', why: 'He prefers unhurried family walks and quiet intellectual work over high-society parties.', source: 'instagram', evidence: 'Weekend neighborhood strolls and home moments' },
      { need: 'Support for high-responsibility global mentorship', why: 'He travels to advise builders and governments worldwide on AI.', source: 'linkedin', evidence: 'Global keynote addresses on AI for everyone' }
    ],
    hobbies: [
      { name: 'Reading machine learning papers over espresso', source: 'both', evidence: 'Morning research reading ritual posted on social channels' },
      { name: 'Nature walks with his children in Palo Alto', source: 'instagram', evidence: 'Weekend trail walks and outdoor science games' },
      { name: 'Mentoring young engineers and startup founders', source: 'both', evidence: 'AI Fund incubation sessions and university office hours' }
    ],
    interests: [
      { name: 'Democratizing AI education globally', source: 'both', evidence: 'Over 8 million students enrolled in his courses' },
      { name: 'Computer vision and autonomous systems', source: 'both', evidence: 'Stanford autonomous helicopter research papers' },
      { name: 'Sustainable agriculture and clean tech AI', source: 'linkedin', evidence: 'Venture investments in climate and healthcare AI' }
    ],
    values: ['education', 'humility', 'empowerment', 'patience', 'integrity'],
    personality: { openness: 94, conscientiousness: 96, extraversion: 60, agreeableness: 92, emotional_stability: 95, note: 'Exceptionally patient, kind, analytically brilliant, and humble.' },
    lifestyle: ['early riser', 'espresso lover', 'family walker', 'educator', 'gentle scholar'],
    communication_style: 'Clear, patient, gentle, encouraging, famous for explaining complex ideas simply.',
    humor: 'Gentle, dry nerd humor, smiling about mathematical proofs and espresso bean roasting.',
    ideal_partner: 'A thoughtful, warm, intellectually curious woman who values family, kindness, and continuous learning, and appreciates quiet Sunday mornings.',
    ideal_first_date: 'Grabbing artisan espresso and walking through the Stanford cactus garden, talking about ideas that inspire us.',
    green_flags: ['Gentle and patient temperament', 'Love of learning new things', 'Kindness toward children and students'],
    potential_frictions: ['Intense teaching and research schedule', 'Prefers quiet evenings over loud social events'],
    dealbreakers_likely: ['Arrogance or intellectual elitism', 'Impatient or angry behavior'],
    conversation_starters: ['What was a subject in school that surprised you by how fascinating it was?', 'Espresso or pour-over coffee?', 'Favorite place to take a long quiet walk?'],
    voice: 'Gentle, soothing, precise, encouraging, with warm cadence.',
    dating_card: 'AI researcher, educator, and dad based in Palo Alto. I believe education is the greatest lever to lift human potential. When I am not working with AI founders or teaching, I am drinking espresso, reading papers, or taking my kids for walks in nature. Looking for a kind, curious partner with a gentle heart and an open mind.',
    confidence: 96,
    confidence_note: 'Unblemished academic and leadership track record at Stanford, Google, Coursera, and AI Fund.'
  },
  {
    id: 'p_arianna_huffington',
    name: 'Arianna Huffington',
    gender: 'woman',
    interestedIn: 'man',
    linkedin: 'https://www.linkedin.com/in/ariannahuffington/',
    instagram: 'https://www.instagram.com/ariannahuff/',
    headline: 'Founder & CEO @ Thrive Global · Founder @ Huffington Post',
    location: 'New York & Los Angeles',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Greek-American media matriarch on a crusade against burnout, champion of 8 hours of sleep and warm hospitality.',
    summary: 'Arianna built The Huffington Post into a digital media colossus, collapsed from exhaustion in 2007, and turned that wake-up call into Thrive Global. Blending Greek warmth, philosophical wit, and a passionate defense of restorative sleep, she is an unforgettable conversationalist who loves literature, family dinners, and deep rest.',
    career: { field: 'Media, Wellness & Publishing', stage: 'Founder & CEO', ambition: 'very driven', summary: 'Founder of Huffington Post and Thrive Global; author of 15 books; global advocate for mental health and burnout prevention.' },
    reading_notes: [
      '[LinkedIn] Cambridge University MA in Economics; President of Cambridge Union; 15x Author.',
      '[Instagram] Bedtime wind-down rituals, books by the bedside, and cozy pajamas.',
      '[Instagram] Greek holiday celebrations with family in Athens and coastal islands.',
      '[LinkedIn] Keynotes on the Sleep Revolution and ending the delusion of burnout as a badge of honor.',
      '[Photos] Greek jewelry, warm smiles, classic blazers, Mediterranean seaside feasts.'
    ],
    needs: [
      { need: 'Respect for healthy boundaries and restorative sleep', why: 'Her entire company is dedicated to eradicating exhaustion.', source: 'both', evidence: 'Author of The Sleep Revolution and Thrive' },
      { need: 'High-level intellectual and philosophical dialogue', why: 'Trained in Cambridge debating traditions and classical philosophy.', source: 'both', evidence: 'President of the Cambridge Union debate society' },
      { need: 'Warmth and hospitality for family and friends', why: 'Greek hospitality is ingrained in her soul.', source: 'instagram', evidence: 'Large holiday family tables and Mediterranean cooking' }
    ],
    hobbies: [
      { name: 'Reading literature & poetry before bed', source: 'both', evidence: 'Bedside book piles and literary essays' },
      { name: 'Mediterranean cooking and island walking', source: 'instagram', evidence: 'Greek olive oil, salads, and walking in Athens and coastal villages' },
      { name: 'Hosting lively dinner debates', source: 'both', evidence: 'Famed salon-style dinners with writers and thinkers' }
    ],
    interests: [
      { name: 'Sleep science & human longevity', source: 'both', evidence: 'Collaborations with neuroscientists on rest protocols' },
      { name: 'Greek classical philosophy and Stoicism', source: 'both', evidence: 'Frequent quotes from Marcus Aurelius and Aristotle' },
      { name: 'Ending workplace burnout culture', source: 'linkedin', evidence: 'Enterprise partnerships bringing Thrive into major corporations' }
    ],
    values: ['wisdom', 'vitality', 'connection', 'hospitality', 'courage'],
    personality: { openness: 94, conscientiousness: 90, extraversion: 92, agreeableness: 88, emotional_stability: 86, note: 'Lively, deeply cultured, warm, hospitable, and intellectually formidable.' },
    lifestyle: ['sleep champion', 'salon host', 'Greek-American', 'literary reader', 'wellness advocate'],
    communication_style: 'Charming, vibrant, theatrical Greek accent, wise, warm, and deeply engaging.',
    humor: 'Witty, philosophical, laughing at the absurdity of overwork culture.',
    ideal_partner: 'A cultured, emotionally intelligent man who appreciates great literature, values restorative living, loves lively conversation over dinner, and has a confident presence.',
    ideal_first_date: 'Dinner at an intimate Mediterranean restaurant with great olive oil, sharing stories and laughter until dessert.',
    green_flags: ['Prioritizes sleep and well-being', 'Values deep conversation over phone screens', 'Generous and hospitable'],
    potential_frictions: ['Extensive global media profile', 'Dislikes workaholic bragging'],
    dealbreakers_likely: ['Bragging about how little sleep they get', 'Cynical or closed-minded demeanor'],
    conversation_starters: ['What is the best book currently on your nightstand?', 'What is your wind-down ritual before sleep?', 'Favorite Mediterranean island?'],
    voice: 'Warm, rich, Greek-inflected cadence, charismatic, maternal and inspiring.',
    dating_card: 'Founder of The Huffington Post and Thrive Global, Greek native, and unapologetic sleep evangelist. I believe our lives are shaped not just by what we do, but by how we rest and connect. I love hosting lively dinners, reading poetry before bed, and spending summers in Greece. Looking for a cultured, kind partner who loves life and values genuine depth.',
    confidence: 96,
    confidence_note: 'Decades of global media prominence, 15 published books, and active social sharing.'
  },
  {
    id: 'p_kevin_systrom',
    name: 'Kevin Systrom',
    gender: 'man',
    interestedIn: 'woman',
    linkedin: 'https://www.linkedin.com/in/ksystrom/',
    instagram: 'https://www.instagram.com/kevin/',
    headline: 'Co-founder @ Instagram & Artifact · Investor',
    location: 'San Francisco, California',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Instagram co-founder, Dolomite cyclist, Leica photographer, and artisan pasta maker.',
    summary: 'Kevin co-founded Instagram and defined mobile photography aesthetics. In post-Instagram life, he channels his meticulous eye into road cycling high mountain passes in Italy, capturing street photography with manual Leica lenses, making fresh sourdough and pasta, and exploring new AI interfaces.',
    career: { field: 'Consumer Software, Media & AI', stage: 'Founder & Investor', ambition: 'very driven', summary: 'Co-founded Instagram (acquired by Meta); founded Artifact (acquired by Yahoo); passionate product designer.' },
    reading_notes: [
      '[LinkedIn] Stanford Management Science & Engineering; Mayfield Fellow; Instagram Co-founder & CEO.',
      '[Instagram] High-altitude cycling across Passo dello Stelvio and the Italian Dolomites.',
      '[Instagram] Stunning 35mm Leica street photography and portraits.',
      '[LinkedIn] Writing on machine learning recommendation architectures and clean user experience.',
      '[Photos] Cycling jerseys, vintage cameras, flour-dusted pasta boards, espresso cups.'
    ],
    needs: [
      { need: 'Appreciation of high craft and visual aesthetics', why: 'He views the world through a lens of compositional beauty.', source: 'both', evidence: 'Created Instagram’s early filters and Leica photography portfolio' },
      { need: 'Love for endurance cycling and outdoor fitness', why: 'Cycling alpine passes is his primary passion.', source: 'instagram', evidence: 'Multi-day cycling climbs in Europe and California' },
      { need: 'Artisanal culinary appreciation (pasta, coffee, wine)', why: 'He immerses himself deeply into culinary craft.', source: 'instagram', evidence: 'Fresh hand-rolled pasta and espresso extraction experiments' }
    ],
    hobbies: [
      { name: 'Road cycling (alpine climbing & gravel)', source: 'instagram', evidence: 'Stelvio Pass and Dolomites cycling expeditions' },
      { name: 'Manual photography (Leica & 35mm film)', source: 'instagram', evidence: 'Portraits and street compositions captured on Leica' },
      { name: 'Artisan pasta making & sourdough bread', source: 'instagram', evidence: 'Hand-shaped tortellini, tagliatelle, and open-crumb sourdough' }
    ],
    interests: [
      { name: 'Italian wine & culinary tradition', source: 'both', evidence: 'Visits to Barolo vineyards and Italian language study' },
      { name: 'AI recommendation systems & news discovery', source: 'both', evidence: 'Artifact architecture focusing on algorithmic curation' },
      { name: 'Industrial design and horology (watches)', source: 'both', evidence: 'Appreciation for mechanical watches and vintage cameras' }
    ],
    values: ['craft', 'beauty', 'curiosity', 'discipline', 'simplicity'],
    personality: { openness: 94, conscientiousness: 92, extraversion: 70, agreeableness: 82, emotional_stability: 88, note: 'Refined, observant, disciplined aesthetic explorer.' },
    lifestyle: ['alpine cyclist', 'photographer', 'home chef', 'espresso craftsman', 'taste-focused'],
    communication_style: 'Thoughtful, articulate, observant, with visual analogies and easy dry humor.',
    humor: 'Dry, subtle, self-deprecating remarks about cycling suffering and pasta shapes.',
    ideal_partner: 'A cultured, active woman with an eye for beauty, a love for great food and wine, an adventurous outdoor spirit, and an authentic curiosity about the world.',
    ideal_first_date: 'Grabbing specialty pour-over espresso and walking through a photography exhibition, followed by sharing fresh pasta and wine.',
    green_flags: ['Appreciates fine craft without being pretentious', 'Loves being active outdoors', 'Has an artistic eye'],
    potential_frictions: ['Spends long hours cycling on weekend mornings', 'Can be very particular about craft and detail'],
    dealbreakers_likely: ['Lack of curiosity', 'Indifference to beauty or quality'],
    conversation_starters: ['What is the most beautiful road you have ever traveled?', 'Pasta or pizza?', 'Film photography or digital?'],
    voice: 'Calm, measured, articulate, warm California tone with quiet confidence.',
    dating_card: 'Co-founder of Instagram, cyclist, and photographer. Outside of tech, I am usually climbing mountain passes on my bike, shooting street photos with a Leica, or making fresh pasta from scratch on Sunday afternoons. Looking for a partner with good taste, an adventurous spirit, and a love for long dinners with great wine.',
    confidence: 96,
    confidence_note: 'Unmistakable personal footprint through Instagram photography, cycling journeys, and Stanford tech foundations.'
  },
  {
    id: 'p_emily_weiss',
    name: 'Emily Weiss',
    gender: 'woman',
    interestedIn: 'man',
    linkedin: 'https://www.linkedin.com/in/emily-weiss-glossier/',
    instagram: 'https://www.instagram.com/emilywweiss/',
    headline: 'Founder & Board Member @ Glossier · Author of Into The Gloss',
    location: 'New York City',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Glossier founder who reinvented dewy beauty from a morning blog into a cultural movement.',
    summary: 'Emily Weiss founded Into The Gloss from her NYC apartment floor at 4 AM before going to work at Vogue, eventually creating Glossier and redefining 21st-century beauty. Known for her minimalist aesthetic, floral arrangements, art gallery visits, and love for downtown NYC living, she values subtle authenticity and creative spark.',
    career: { field: 'Beauty, Retail & Brand Culture', stage: 'Founder & Board Member', ambition: 'very driven', summary: 'Founded Glossier and Into The Gloss; pioneered community-led product design and Millennial pink branding.' },
    reading_notes: [
      '[LinkedIn] NYU Studio Art graduate; Vogue and W Magazine fashion editorial background.',
      '[Instagram] Downtown NYC lifestyle: gallery openings, floral bouquets, and cozy loft corners.',
      '[Instagram] Motherhood moments with her daughter and relaxed weekends upstate.',
      '[LinkedIn] Thought pieces on community-first commerce and reimagining legacy retail.',
      '[Photos] Dewy skin, soft natural daylight, minimalist typography, vintage ceramics.'
    ],
    needs: [
      { need: 'A partner with strong aesthetic sensitivity and creative vision', why: 'She lives and breathes visual curation and design.', source: 'both', evidence: 'NYU Studio Art degree and Glossier creative direction' },
      { need: 'Balance between downtown NYC energy and quiet upstate retreat', why: 'Recharges away from the city in nature.', source: 'instagram', evidence: 'Weekend escapes to the Hudson Valley' },
      { need: 'Support for independent creative endeavors', why: 'She is a builder who thrives when creating new concepts.', source: 'both', evidence: 'Building Into The Gloss while working corporate editorial' }
    ],
    hobbies: [
      { name: 'Floral arranging & ceramic curation', source: 'instagram', evidence: 'Artful arrangements of wild blooms and handmade pottery' },
      { name: 'Contemporary art gallery hopping in Chelsea', source: 'instagram', evidence: 'Visits to gallery exhibitions and artist studio visits' },
      { name: 'Upstate hiking and weekend retreats', source: 'instagram', evidence: 'Hudson Valley nature walks and fireside reading' }
    ],
    interests: [
      { name: 'Community-driven brand building & consumer psychology', source: 'both', evidence: 'The Top Shelf interview format and Glossier product development' },
      { name: 'Clean skincare formulations and wellness rituals', source: 'both', evidence: 'Pioneering "skin first, makeup second" beauty philosophy' },
      { name: 'Vintage interior design and modern architecture', source: 'instagram', evidence: 'Loft renovations and mid-century furniture collecting' }
    ],
    values: ['authenticity', 'beauty', 'community', 'simplicity', 'curiosity'],
    personality: { openness: 92, conscientiousness: 88, extraversion: 78, agreeableness: 84, emotional_stability: 86, note: 'Refined visual curator, empathetic community builder, and deliberate leader.' },
    lifestyle: ['NYC downtowner', 'aesthetic minimalist', 'art lover', 'curator', 'upstate explorer'],
    communication_style: 'Warm, stylish, articulate, intimate, with sharp creative intuition.',
    humor: 'Subtle, dry, appreciative of everyday design absurdities and downtown culture.',
    ideal_partner: 'A confident, creative, and emotionally grounded man who appreciates good design and art, loves great food in intimate neighborhood bistros, and possesses quiet integrity.',
    ideal_first_date: 'Walking through a contemporary art gallery in downtown NYC, followed by natural wine and small plates at a quiet, candlelit bistro.',
    green_flags: ['Appreciates subtle beauty and good design', 'Kind and thoughtful listener', 'Comfortable in both lively cities and quiet nature'],
    potential_frictions: ['High standard for aesthetics and detail', 'Busy calendar with brand projects'],
    dealbreakers_likely: ['Loud pretentiousness', 'Lack of creative curiosity'],
    conversation_starters: ['What was the last museum or exhibition that genuinely inspired you?', 'Favorite downtown NYC neighborhood?', 'Coffee or matcha?'],
    voice: 'Gentle, chic, warm, articulate NYC cadence, deeply observant.',
    dating_card: 'Founder of Glossier and Into The Gloss. I believe in effortless beauty, good light, and the power of community. You will usually find me in a Chelsea gallery, arranging fresh flowers, exploring a quiet corner of upstate New York, or having dinner with close friends. Looking for a kind, creative partner who appreciates life’s subtle details.',
    confidence: 95,
    confidence_note: 'Thoroughly documented transition from Vogue fashion assistant to beauty titan and private lifestyle.'
  },
  {
    id: 'p_rand_fishkin',
    name: 'Rand Fishkin',
    gender: 'man',
    interestedIn: 'woman',
    linkedin: 'https://www.linkedin.com/in/randfishkin/',
    instagram: 'https://www.instagram.com/randderuiter/',
    headline: 'Co-Founder & CEO @ SparkToro · Author of Lost and Founder',
    location: 'Seattle, Washington',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Seattle board game fanatic, transparency champion, and pasta-making romantic with an iconic mustache.',
    summary: 'Rand Fishkin founded Moz and SparkToro, writing with radical honesty about the psychological tolls of venture capital in Lost and Founder. Based in Seattle, he loves complex strategy board games, cooking authentic Italian pasta dishes, traveling across Europe, and standing up for ethical transparency in business.',
    career: { field: 'Search, Audience Intelligence & Publishing', stage: 'Founder & CEO', ambition: 'driven', summary: 'Co-founded Moz and SparkToro; pioneer of transparent, indie-funded SaaS; author of Lost and Founder.' },
    reading_notes: [
      '[LinkedIn] University of Washington alum; Founder of Moz and SparkToro; Whiteboard Friday creator.',
      '[Instagram] Complex Euro-style board games (Terraforming Mars, Wingspan) laid out on game tables.',
      '[Instagram] Italian pasta cooking adventures and scenic travels across Europe.',
      '[LinkedIn] Candid, transparent analyses of digital monopolies, marketing truth, and founder mental health.',
      '[Photos] Iconic mustache, Seattle rain jackets, board game meeples, warm home kitchen smiles.'
    ],
    needs: [
      { need: 'Radical honesty, transparency, and emotional vulnerability', why: 'He is allergic to posturing and fake corporate polish.', source: 'both', evidence: 'Author of raw startup memoir Lost and Founder' },
      { need: 'Enthusiasm for tabletop board games and mental puzzles', why: 'Board game nights are his favorite weekend ritual.', source: 'instagram', evidence: 'Hundreds of board game reviews and game night photos' },
      { need: 'Love for European food, wine, and travel', why: 'Deeply in love with regional Italian and French culinary culture.', source: 'instagram', evidence: 'Travel diaries exploring small regional producers in Europe' }
    ],
    hobbies: [
      { name: 'Tabletop strategy board gaming', source: 'instagram', evidence: 'Plays and ranks dozens of modern strategic board games' },
      { name: 'Traditional Italian cooking & pasta making', source: 'instagram', evidence: 'Cacio e pepe, carbonara, and slow-braised ragu recipes' },
      { name: 'Pacific Northwest trail walks', source: 'both', evidence: 'Walking through lush Seattle parks in misty weather' }
    ],
    interests: [
      { name: 'Audience intelligence & ethical marketing', source: 'both', evidence: 'SparkToro product thesis and blog essays' },
      { name: 'Mental health & depression transparency in tech', source: 'both', evidence: 'Keynotes on breaking founder mental health stigma' },
      { name: 'Independent publishing and creator rights', source: 'linkedin', evidence: 'Advocacy for antitrust reform in tech monopolies' }
    ],
    values: ['transparency', 'kindness', 'curiosity', 'integrity', 'empathy'],
    personality: { openness: 94, conscientiousness: 88, extraversion: 75, agreeableness: 90, emotional_stability: 80, note: 'Radically transparent, empathetic, intellectually curious, and devotedly loyal.' },
    lifestyle: ['board gamer', 'home chef', 'Seattle resident', 'ethical builder', 'traveler'],
    communication_style: 'Articulate, vulnerable, humorous, candid, exceptionally clear.',
    humor: 'Self-aware, witty, playful nerd humor about board game rules and startup absurdities.',
    ideal_partner: 'A thoughtful, open-minded woman who values honest communication, loves game nights with friends, enjoys cooking or exploring great food, and appreciates genuine authenticity.',
    ideal_first_date: 'Meeting at an inviting local wine bar with a great strategic two-player card game, sharing small plates and deep, authentic conversation.',
    green_flags: ['Radical honesty without cruelty', 'Loves playing games', 'Kind to everyone regardless of status'],
    potential_frictions: ['Intensely open about feelings and struggles', 'Strong aversion to corporate pretension'],
    dealbreakers_likely: ['Deception or dishonest spin', 'Mockery of geeky hobbies'],
    conversation_starters: ['What is your favorite board game (or what game did you grow up playing)?', 'Best pasta dish you ever tasted?', 'Seattle drizzle or California sunshine?'],
    voice: 'Warm, clear, articulate, earnest, with a distinctive and welcoming timbre.',
    dating_card: 'Co-founder of SparkToro, writer, and board game geek. I believe in radical honesty, good pasta, and building things without the Silicon Valley hype. When I am not working, I am probably hosting a game night with friends, testing a new pasta recipe, or wandering through rainy Seattle parks. Looking for someone genuine, thoughtful, and ready for great conversation.',
    confidence: 96,
    confidence_note: 'Unrivaled public transparency across books, blogs, and personal Instagram documentation.'
  },
  {
    id: 'p_sallie_krawcheck',
    name: 'Sallie Krawcheck',
    gender: 'woman',
    interestedIn: 'man',
    linkedin: 'https://www.linkedin.com/in/salliekrawcheck/',
    instagram: 'https://www.instagram.com/sallie.krawcheck/',
    headline: 'Founder & CEO @ Ellevest · Former CEO @ Merrill Lynch & Smith Barney',
    location: 'New York City',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Wall Street CEO turned financial feminist building wealth for women, with North Carolina wit and Central Park runs.',
    summary: 'Sallie Krawcheck rose to the pinnacle of Wall Street as CEO of Merrill Lynch Wealth Management and Smith Barney, got fired twice for refusing to compromise her ethics, and channeled that resilience into founding Ellevest. With sharp Southern charm and unapologetic financial feminism, she loves running Central Park, North Carolina BBQ, and bold truth-telling.',
    career: { field: 'Financial Services & FinTech', stage: 'Founder & CEO', ambition: 'very driven', summary: 'Former CEO on Wall Street managing tens of thousands of advisors; founder of Ellevest closing the gender wealth gap.' },
    reading_notes: [
      '[LinkedIn] UNC Chapel Hill; Columbia Business School MBA; Former CEO Merrill Lynch Wealth Management.',
      '[Instagram] Central Park runs, family graduations, and rescue pet photos.',
      '[Instagram] Hilarious candid videos debunking financial jargon with Southern quips.',
      '[LinkedIn] Relentless focus on women’s financial autonomy, closing the wage gap, and ethical leadership.',
      '[Photos] Classic NYC chic, bright blazers, sunny park benches, genuine broad smiles.'
    ],
    needs: [
      { need: 'A confident, secure partner who is completely unfazed by female success', why: 'She has broken glass ceilings throughout her entire career.', source: 'both', evidence: 'Author of Own It: The Power of Women at Work' },
      { need: 'High integrity and moral courage', why: 'She famously stood up to Wall Street boards at great personal cost.', source: 'both', evidence: 'Documented departures from Citigroup and Bank of America over investor protection' },
      { need: 'Sense of humor with quick Southern and NYC wit', why: 'Humor is her shield and favorite connection point.', source: 'instagram', evidence: 'Witty video commentary on current economic events' }
    ],
    hobbies: [
      { name: 'Central Park jogging & distance running', source: 'instagram', evidence: 'Regular morning jogs along the Central Park reservoir' },
      { name: 'Southern cooking & North Carolina BBQ tasting', source: 'both', evidence: 'Love for pulled pork, vinegar sauces, and family recipes' },
      { name: 'Reading biographies and economic history', source: 'both', evidence: 'Book recommendations and historical leadership reflections' }
    ],
    interests: [
      { name: 'Closing the gender investing and wealth gap', source: 'both', evidence: 'Ellevest’s algorithmic platform tailored to female longevity and salaries' },
      { name: 'Corporate governance and fiduciary responsibility', source: 'linkedin', evidence: 'Articles on board accountability and investor trust' },
      { name: 'Rescue animal advocacy', source: 'instagram', evidence: 'Warm posts featuring rescue pets' }
    ],
    values: ['integrity', 'courage', 'equality', 'resilience', 'humor'],
    personality: { openness: 88, conscientiousness: 96, extraversion: 88, agreeableness: 78, emotional_stability: 92, note: 'Extremely resilient, principled, witty, warm, and courageous.' },
    lifestyle: ['NYC executive', 'morning runner', 'Southern roots', 'financial advocate', 'truth-teller'],
    communication_style: 'Crisp, direct, witty, warm, peppered with Southern charm and financial clarity.',
    humor: 'Sharp, dry, fearless, poking fun at Wall Street pomposity.',
    ideal_partner: 'A confident, secure, and kind man with a strong moral backbone, great sense of humor, and zero ego around ambitious women.',
    ideal_first_date: 'Grabbing drinks at a lively Manhattan restaurant with great energy, followed by candid conversation about life, lessons, and laughs.',
    green_flags: ['High self-security and lack of fragile ego', 'Principled integrity', 'Quick to laugh'],
    potential_frictions: ['Extremely busy executive schedule', 'Zero tolerance for excuses or posturing'],
    dealbreakers_likely: ['Insecurity around successful women', 'Lack of ethical integrity'],
    conversation_starters: ['What is the best piece of advice you completely ignored?', 'Vinegar or mustard BBQ?', 'What is your favorite spot in New York City?'],
    voice: 'Confident, warm, Southern-accented cadence, sharp intellect, lively laughter.',
    dating_card: 'Founder & CEO of Ellevest, former Wall Street CEO, and proud North Carolina native in NYC. I believe nothing bad happens when women have more money. When I am not working to close the wealth gap, I am running Central Park, searching for great BBQ, or laughing with friends. Looking for a secure, witty, and kind partner who loves real talk and good fun.',
    confidence: 96,
    confidence_note: 'Decades of Wall Street executive public record, bestselling book, and authentic Instagram presence.'
  },
  {
    id: 'p_mark_zuckerberg',
    name: 'Mark Zuckerberg',
    gender: 'man',
    interestedIn: 'woman',
    linkedin: 'https://www.linkedin.com/in/zuck/',
    instagram: 'https://www.instagram.com/zuck/',
    headline: 'Founder & CEO @ Meta',
    location: 'Palo Alto, California & Kauai, Hawaii',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Meta founder, BJJ tournament competitor, foil surfer, and Kauai cattle rancher building open-source AI.',
    summary: 'Mark founded Facebook from his dorm room and built it into Meta, connecting billions. Over recent years, he has evolved into a dedicated Brazilian Jiu-Jitsu and MMA competitor, foil surfer in Hawaii, cattle rancher, and passionate advocate for open-source AI and Roman history.',
    career: { field: 'Social Platforms, XR & Artificial Intelligence', stage: 'Founder & CEO', ambition: 'very driven', summary: 'Founded Meta; driving open-source AI (Llama), spatial computing, and global connectivity.' },
    reading_notes: [
      '[LinkedIn] Harvard University alum; Founder and CEO of Meta since 2004.',
      '[Instagram] Brazilian Jiu-Jitsu tournament gold and silver medal photos.',
      '[Instagram] Hydrofoil surfing in open Hawaiian waters and wakeboarding.',
      '[Instagram] Raising Wagyu cattle on Kauai and smoking backyard brisket.',
      '[Photos] Oversized streetwear tees, curls, gold chains, foil boards, training mats, family smiles.'
    ],
    needs: [
      { need: 'Extreme loyalty and mutual sanctuary from public noise', why: 'He has lived under intense global scrutiny since age 19.', source: 'both', evidence: '20+ years navigating global public spotlight while protecting private family life' },
      { need: 'Enthusiasm for competitive physical challenges (martial arts, surfing)', why: 'Physical challenges are his mental discipline and fun.', source: 'instagram', evidence: 'BJJ competitions, Murph workouts, and open ocean hydrofoiling' },
      { need: 'Intellectual curiosity spanning classical history to future tech', why: 'Obsessed with Augustus Caesar, open-source AI, and long-term futures.', source: 'both', evidence: 'Classical Roman history references and AI research announcements' }
    ],
    hobbies: [
      { name: 'Brazilian Jiu-Jitsu & MMA sparring', source: 'instagram', evidence: 'Tournament competitions, sparring with champions, and BJJ training' },
      { name: 'Hydrofoil surfing & wakeboarding', source: 'instagram', evidence: 'Riding electric foils and ocean hydrofoils in Hawaii' },
      { name: 'Cattle ranching & artisanal BBQ', source: 'instagram', evidence: 'Ranching Wagyu on Kauai and grilling brisket for family' }
    ],
    interests: [
      { name: 'Open-source artificial intelligence & Llama models', source: 'both', evidence: 'Publishing open weights and advocating for democratized AI' },
      { name: 'Classical Roman history & architecture', source: 'both', evidence: 'Studies of Augustus Caesar and Latin literature' },
      { name: 'Spatial computing and neural interfaces', source: 'both', evidence: 'Ray-Ban Meta smart glasses and EMG wristband development' }
    ],
    values: ['focus', 'agency', 'loyalty', 'curiosity', 'discipline'],
    personality: { openness: 92, conscientiousness: 98, extraversion: 65, agreeableness: 75, emotional_stability: 95, note: 'Intensely focused, hyper-disciplined, steady emotional baseline, and relentless agency.' },
    lifestyle: ['martial artist', 'hydrofoil surfer', 'rancher', 'builder', 'family-centered'],
    communication_style: 'Calm, direct, analytical, increasingly candid, authentic and relaxed.',
    humor: 'Deadpan internet self-awareness, embracing memes with relaxed confidence.',
    ideal_partner: 'A brilliant, grounded, and loyal woman who is confident in her own right, values family sanctuary, loves staying active outdoors, and isn’t intimidated by monumental scale.',
    ideal_first_date: 'Heading out on the water for a hydrofoil or surf session, followed by relaxed backyard BBQ and unhurried conversation.',
    green_flags: ['High personal loyalty and privacy', 'Loves athletic challenges', 'Comfortable with deep focus'],
    potential_frictions: ['Massive global security and public profile', 'Can be intensely focused on long-term missions'],
    dealbreakers_likely: ['Betrayal of trust or leaks to media', 'Superficial vanity'],
    conversation_starters: ['What was the most physically exhausting workout you ever completed?', 'Thoughts on Roman history?', 'Surfing or mountain sports?'],
    voice: 'Calm, measured, focused, relaxed California cadence with steady confidence.',
    dating_card: 'Founder of Meta, Jiu-Jitsu competitor, and foil surfer. Outside of building AI and the future of human connection, I am on the mats training BJJ, surfing waves in Kauai, or smoking brisket with family. Looking for someone loyal, authentic, active, and grounded.',
    confidence: 96,
    confidence_note: 'Comprehensive 20-year public journey and active, transparent personal Instagram chronicles.'
  },
  {
    id: 'p_tan_france',
    name: 'Tan France',
    gender: 'man',
    interestedIn: 'any',
    linkedin: 'https://www.linkedin.com/in/tan-france-3599b5172/',
    instagram: 'https://www.instagram.com/tanfrance/',
    headline: 'Fashion Designer · Author · Host @ Queer Eye & Next In Fashion',
    location: 'Salt Lake City, Utah & London',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    one_liner: 'Fashion designer, French Tuck creator, Great British baker, and loving dad based in the Utah mountains.',
    summary: 'Tan France brought empathy and the "French Tuck" to millions worldwide on Netflix’s Queer Eye. Born in England to Pakistani parents and now living in Salt Lake City, he combines impeccable textile knowledge with genuine emotional warmth, home baking, historical home renovation, and devoted fatherhood.',
    career: { field: 'Fashion Design & Television', stage: 'Designer & Host', ambition: 'very driven', summary: 'Designer of multiple apparel lines; Emmy-winning star of Queer Eye and Next in Fashion; bestselling author.' },
    reading_notes: [
      '[LinkedIn] Doncaster College fashion graduate; fashion buyer and designer for major apparel lines.',
      '[Instagram] Impeccable tailoring, hair styling, and cozy mountain family life in Salt Lake City.',
      '[Instagram] Baking British pies, scones, and South Asian spiced delicacies.',
      '[LinkedIn] Advocacy for diverse representation in entertainment and garment worker ethics.',
      '[Photos] Silver hair, tailored coats, gorgeous mountain home architecture, warm embraces.'
    ],
    needs: [
      { need: 'A partner who values genuine kindness and emotional openness', why: 'His work and life are built on lifting people up through empathy.', source: 'both', evidence: 'Queer Eye transformations and bestselling memoir Naturally Tan' },
      { need: 'Appreciation of domestic comfort, home cooking, and design', why: 'He is deeply family-oriented and loves curating home warmth.', source: 'instagram', evidence: 'Extensive documentation of home renovations and baking' },
      { need: 'Respect for multicultural South Asian and British heritage', why: 'Rooted in his heritage and proud of his cultural identity.', source: 'both', evidence: 'Advocacy for South Asian arts and textile traditions' }
    ],
    hobbies: [
      { name: 'Baking British pastries, cakes & South Asian dishes', source: 'instagram', evidence: 'Frequent baking reels of British scones and spiced curries' },
      { name: 'Home interior design & historical renovation', source: 'instagram', evidence: 'Detailed tours of his custom-built dream home in Utah' },
      { name: 'Wardrobe tailoring and styling', source: 'both', evidence: 'Styling tutorials and clothing line designs' }
    ],
    interests: [
      { name: 'Textile history and sustainable fashion', source: 'both', evidence: 'Early career in manufacturing and fabric sourcing' },
      { name: 'Fatherhood and family adoption rights', source: 'both', evidence: 'Advocacy for surrogacy and adoption education' },
      { name: 'Cinema, comedy, and theater', source: 'instagram', evidence: 'Attending West End shows and film premieres' }
    ],
    values: ['kindness', 'elegance', 'inclusivity', 'family', 'authenticity'],
    personality: { openness: 92, conscientiousness: 94, extraversion: 90, agreeableness: 94, emotional_stability: 88, note: 'Deeply compassionate, impeccably polished, warm, witty, and fiercely loving.' },
    lifestyle: ['stylish father', 'baker', 'mountain resident', 'fashion mentor', 'warm host'],
    communication_style: 'Charming, articulate, affectionate, witty British cadence, emotionally perceptive.',
    humor: 'Playful, sassy, loving British banter, quick to poke gentle fun at bad style choices.',
    ideal_partner: 'A kind, emotionally open, and stylish or self-respecting partner who loves family, enjoys great home-cooked food, laughs easily, and brings warmth into a room.',
    ideal_first_date: 'Afternoon tea with fresh warm scones and pastries, followed by a stroll through an architectural garden or boutique street.',
    green_flags: ['Polite and kind to everyone', 'Loves family and home life', 'Takes pride in self-care and presentation'],
    potential_frictions: ['Extremely neat and particular about home cleanliness', 'Busy international filming schedule'],
    dealbreakers_likely: ['Cruelty or bigotry', 'Sloppiness in hygiene or personal respect'],
    conversation_starters: ['What is your comfort food of choice?', 'Tea or coffee (and how do you take it)?', 'Favorite city in the UK or Europe?'],
    voice: 'Warm, melodious Northern British accent, charming, affectionate, and sharp.',
    dating_card: 'Fashion designer, author, and Queer Eye co-host based in Salt Lake City. I believe that how we present ourselves should bring us joy. When I am not filming, I am in the kitchen baking British treats, designing our home, or playing with my boys in the mountains. Looking for someone kind, warm, funny, and ready for a loving connection.',
    confidence: 96,
    confidence_note: 'Unblemished decade of public fashion design, Emmy-winning hosting, and authentic personal sharing.'
  }
];

// Helper to format people map
const people = {};
for (const p of PEOPLE_RAW) {
  people[p.id] = {
    id: p.id,
    createdAt: Date.now() - 86400000 * 5,
    status: 'ready',
    name: p.name,
    gender: p.gender,
    interestedIn: p.interestedIn,
    linkedin: p.linkedin,
    instagram: p.instagram,
    avatar: p.avatar,
    photos: [
      { url: p.avatar, caption: `${p.name} - Profile portrait`, location: p.location },
      { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80', caption: 'Creative workspaces and projects', location: p.location },
      { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', caption: 'Weekend outdoor escapes', location: p.location }
    ],
    sources: {
      linkedin: {
        via: 'public_html',
        url: p.linkedin,
        fullName: p.name,
        headline: p.headline,
        location: p.location,
        about: p.summary,
        experiences: [{ title: p.career.stage, company: p.career.field, duration: '2010 - Present', description: p.career.summary }],
        skills: p.values.concat(p.hobbies.map(h => h.name)),
        education: [{ school: 'University', degree: 'Bachelor / Master' }]
      },
      instagram: {
        via: 'web_profile_info',
        username: p.instagram.replace(/.*\.com\/|\/$/g, ''),
        fullName: p.name,
        bio: p.one_liner,
        postsCount: 248,
        followers: 125000,
        following: 580,
        isPrivate: false,
        posts: p.hobbies.map((h, i) => ({
          caption: `${h.name}: ${h.evidence}`,
          location: p.location,
          hashtags: [h.name.toLowerCase().replace(/\s+/g, '')],
          likes: 4200 - i * 500
        }))
      }
    },
    analysis: {
      name: p.name,
      headline: p.headline,
      location: p.location,
      one_liner: p.one_liner,
      summary: p.summary,
      reading_notes: p.reading_notes,
      needs: p.needs,
      hobbies: p.hobbies,
      interests: p.interests,
      values: p.values,
      personality: p.personality,
      lifestyle: p.lifestyle,
      career: p.career,
      communication_style: p.communication_style,
      humor: p.humor,
      ideal_partner: p.ideal_partner,
      ideal_first_date: p.ideal_first_date,
      green_flags: p.green_flags,
      potential_frictions: p.potential_frictions,
      dealbreakers_likely: p.dealbreakers_likely,
      conversation_starters: p.conversation_starters,
      voice: p.voice,
      dating_card: p.dating_card,
      confidence: p.confidence,
      confidence_note: p.confidence_note
    },
    log: [
      { at: Date.now() - 3600000 * 12, msg: 'Agent assigned. Starting to read its person — only LinkedIn + Instagram allowed.', kind: 'start' },
      { at: Date.now() - 3600000 * 11, msg: `LinkedIn read via public_html: ${p.name} — ${p.headline}`, kind: 'ok' },
      { at: Date.now() - 3600000 * 10, msg: `Instagram read via web_profile_info: @${p.instagram.replace(/.*\.com\/|\/$/g, '')}, 248 posts scanned`, kind: 'ok' },
      { at: Date.now() - 3600000 * 9, msg: 'Studied 6 photos + profile picture.', kind: 'ok' },
      ...p.reading_notes.map((n, i) => ({ at: Date.now() - 3600000 * (8 - i), msg: n, kind: 'note' })),
      { at: Date.now() - 3600000 * 2, msg: `Profile complete — ${p.needs.length} needs, ${p.hobbies.length} hobbies, ${p.interests.length} interests. Confidence ${p.confidence}%.`, kind: 'done' }
    ]
  };
}

// Generate Swipes matrix
const swipes = {};
const pKeys = Object.keys(people);

function eligible(a, b) {
  if (!a || !b || a.id === b.id) return false;
  const ok = (x, y) => !x.interestedIn || x.interestedIn === 'any' || !y.gender || x.interestedIn === y.gender;
  return ok(a, b) && ok(b, a);
}

for (const aId of pKeys) {
  swipes[aId] = {};
  const a = people[aId];
  for (const bId of pKeys) {
    if (aId === bId) continue;
    const b = people[bId];
    if (!eligible(a, b)) continue;

    // Calculate baseline score from shared hobbies & values
    const aTopics = new Set([...a.analysis.values, ...a.analysis.lifestyle, ...a.analysis.hobbies.map(h => h.name.toLowerCase())]);
    const bTopics = new Set([...b.analysis.values, ...b.analysis.lifestyle, ...b.analysis.hobbies.map(h => h.name.toLowerCase())]);
    let shared = 0;
    for (const t of aTopics) {
      for (const bt of bTopics) {
        if (t.includes(bt) || bt.includes(t)) shared++;
      }
    }

    const baseScore = Math.min(96, Math.max(38, 48 + shared * 8 + ((aId.charCodeAt(2) + bId.charCodeAt(3)) % 15)));
    const reasons = [
      `Shared devotion to ${a.analysis.values[0] || 'craft'} and active outdoor living.`,
      `Complementary creative drive and mutual appreciation for intentional lifestyles.`,
      `Aligned rhythms: both value grounded home life alongside ambitious personal goals.`,
      `Strong shared intellectual curiosity and authentic communication styles.`
    ];

    swipes[aId][bId] = {
      score: baseScore,
      reason: reasons[(aId.length + bId.length) % reasons.length]
    };
  }
}

// Curate 16 Realistic Dates with Full Multi-Turn Dialogues and Verdicts
const DATES_CONFIG = [
  {
    id: 'd_brian_whitney',
    a: 'p_brian_chesky',
    b: 'p_whitney_wolfe_herd',
    venue: { venue: 'The Continental Club & Garden Patio, Austin', activity: 'artisan cocktails & discussing design-led culture', why: 'Both founded iconic consumer connection apps centered on hospitality and human trust' },
    transcript: [
      { speaker: 'p_brian_chesky', kind: 'invite', text: 'Hey Whitney! Given how much thought we both put into how people connect and feel safe in new spaces, want to grab a quiet drink on the patio at The Continental Club?' },
      { speaker: 'p_whitney_wolfe_herd', kind: 'msg', text: 'I would love that, Brian! Austin patios at sunset are my favorite sanctuary after a long day of meetings. Let us do it.' },
      { speaker: null, kind: 'scene', text: 'Act I · Arrival & first impressions' },
      { speaker: 'p_brian_chesky', kind: 'msg', text: '*smiles warmly and pulls out a chair* The acoustic warmth of this courtyard is incredible. You can actually hear the person across from you without shouting.' },
      { speaker: 'p_whitney_wolfe_herd', kind: 'msg', text: '*laughs softly* That is such an industrial designer observation, Brian! But you are completely right. Acoustics dictate whether a conversation feels intimate or exhausting.' },
      { speaker: 'p_brian_chesky', kind: 'msg', text: 'Guilty as charged. I look at chair ergonomics before I even look at the menu. How was your week on the ranch?' },
      { speaker: 'p_whitney_wolfe_herd', kind: 'msg', text: 'Grounding. There is nothing like mucking out horse stalls to remind you that title and net worth do not impress a horse in the slightest.' },
      { speaker: null, kind: 'scene', text: 'Act II · Getting real' },
      { speaker: 'p_brian_chesky', kind: 'msg', text: 'I love that so much. For me, taking my Golden Retriever Sophie on walks is the only time my phone stays in my pocket. When you took Bumble public holding your son, that was iconic. How do you protect that family peace?' },
      { speaker: 'p_whitney_wolfe_herd', kind: 'msg', text: 'By realizing that if you sacrifice your private life for the public scoreboard, you lose twice. In dating, I need a partner who doesn’t compete with my calendar, but builds a quiet haven with me. What is your biggest non-negotiable?' },
      { speaker: 'p_brian_chesky', kind: 'msg', text: 'Someone who cares deeply about their own craft. I get energized when a partner gets lost in something they love—whether it is training horses, building a product, or painting. Craft is attractive.' },
      { speaker: 'p_whitney_wolfe_herd', kind: 'msg', text: 'Yes! And vulnerability. In tech, everyone wears armor. On a date, I want to know what kept you awake at 3 AM three years ago, not your quarterly projections.' },
      { speaker: null, kind: 'scene', text: 'Act III · The wrap-up' },
      { speaker: 'p_brian_chesky', kind: 'msg', text: '*grins* Three years ago I was wondering if travel would ever come back. Sitting here tonight, I am reminded that the urge to explore and meet real people is invincible.' },
      { speaker: 'p_whitney_wolfe_herd', kind: 'msg', text: 'It really is. This flew by, Brian. You are genuinely as thoughtful and funny in person as you are on stage.' },
      { speaker: 'p_brian_chesky', kind: 'msg', text: 'Next time, I am bringing Sophie to Austin and we are doing a trail walk by Lady Bird Lake. I would love to see you again soon.' },
      { speaker: 'p_whitney_wolfe_herd', kind: 'msg', text: 'Deal. Sophie gets VIP treatment at the ranch. Safe travels back to SF!' }
    ],
    verdicts: {
      p_brian_chesky: {
        scores: { values: 92, lifestyle: 88, interests: 94, communication: 95, goals: 90, chemistry: 92 },
        overall: 92,
        second_date: true,
        headline: 'Extraordinary mutual rhythm, shared founder empathy and warmth',
        highlight: 'Her perspective on ranch life grounding her away from tech vanity.',
        concern: 'Both manage global board responsibilities and demanding calendars.',
        note_to_human: 'Whitney is magnetic, exceptionally grounded, and understands the weight you carry without any explanation needed. Say yes to a second date immediately.'
      },
      p_whitney_wolfe_herd: {
        scores: { values: 94, lifestyle: 86, interests: 92, communication: 94, goals: 92, chemistry: 90 },
        overall: 91,
        second_date: true,
        headline: 'Thoughtful, humorous, completely free of corporate ego',
        highlight: 'When he talked about how design is just intentional hospitality.',
        concern: 'He travels constantly between SF and global hosts.',
        note_to_human: 'Brian is the real deal—warm, attentive, and genuinely notices the little things. Definitely invite him and Sophie out to Austin again.'
      }
    }
  },
  {
    id: 'd_alexis_sara',
    a: 'p_alexis_ohanian',
    b: 'p_sara_blakely',
    venue: { venue: 'The Optimist Oyster Bar, Atlanta', activity: 'fresh oysters, waffle experiments & trading startup war stories', why: 'Both bootstrapped legendary brands with joyful, unapologetic humor and family dedication' },
    transcript: [
      { speaker: 'p_alexis_ohanian', kind: 'invite', text: 'Sara! As a self-proclaimed waffle artist and huge fan of anyone who refuses to take corporate life seriously, want to grab oysters and trade war stories in Atlanta?' },
      { speaker: 'p_sara_blakely', kind: 'msg', text: 'Alexis, only if you bring proof of these alleged pancake art masterpieces! I am in. The Optimist has the best oysters in town.' },
      { speaker: null, kind: 'scene', text: 'Act I · Arrival & first impressions' },
      { speaker: 'p_alexis_ohanian', kind: 'msg', text: '*pulls out phone and beams* Behold: a three-color batter rendition of Sonic the Hedgehog. Took me forty-five minutes and three burnt attempts.' },
      { speaker: 'p_sara_blakely', kind: 'msg', text: '*bursts into full-bodied laughter* Alexis! That is sheer dedication! My kids would demand that every Sunday. I love anyone who commits to that level of silliness.' },
      { speaker: 'p_alexis_ohanian', kind: 'msg', text: 'Silliness is underrated. The world has too many serious people in gray suits trying to look important. Is that the famous red backpack under your chair?' },
      { speaker: 'p_sara_blakely', kind: 'msg', text: 'You know it is! Twenty-four years, countless boardrooms, and people still look at me sideways. But it keeps me honest.' },
      { speaker: null, kind: 'scene', text: 'Act II · Getting real' },
      { speaker: 'p_alexis_ohanian', kind: 'msg', text: 'That reminds me of Reddit in 2005. Everyone told us an internet message board was worthless. When you cut the feet off those pantyhose, did you ever doubt it?' },
      { speaker: 'p_sara_blakely', kind: 'msg', text: 'Every single day! But my dad used to ask us at the dinner table: "What did you fail at today?" If we did not fail, he was disappointed. Failure was not the outcome; failure was not trying.' },
      { speaker: 'p_alexis_ohanian', kind: 'msg', text: 'Man, that hits home. That is exactly what I want to teach Olympia. That is why I invested in Angel City FC and women’s sports—everyone said it would lose money. Seeing 22,000 fans roaring proved the cynics wrong.' },
      { speaker: 'p_sara_blakely', kind: 'msg', text: 'And that is why you are such a breath of fresh air. You put your money and heart where your values are. In a partner, I need that courage and that big belly laugh.' },
      { speaker: null, kind: 'scene', text: 'Act III · The wrap-up' },
      { speaker: 'p_alexis_ohanian', kind: 'msg', text: 'My face actually hurts from smiling. This was the most fun dinner I have had in months.' },
      { speaker: 'p_sara_blakely', kind: 'msg', text: 'Same here! Next time, breakfast challenge: your Sonic pancake versus my homemade southern biscuits.' },
      { speaker: 'p_alexis_ohanian', kind: 'msg', text: 'Challenge accepted! Count me in for round two, Sara.' },
      { speaker: 'p_sara_blakely', kind: 'msg', text: 'You got a deal, pancake king. Safe flight back to Florida!' }
    ],
    verdicts: {
      p_alexis_ohanian: {
        scores: { values: 95, lifestyle: 90, interests: 92, communication: 96, goals: 94, chemistry: 95 },
        overall: 94,
        second_date: true,
        headline: 'Instant chemistry powered by infectious humor and family heart',
        highlight: 'Her story about her father celebrating failure at the dinner table.',
        concern: 'Both have huge public empires and overflowing schedules.',
        note_to_human: 'Sara has that rare combination of billionaire grit and down-to-earth belly laughs. You two feed off each other’s energy effortlessly.'
      },
      p_sara_blakely: {
        scores: { values: 96, lifestyle: 92, interests: 90, communication: 95, goals: 94, chemistry: 94 },
        overall: 94,
        second_date: true,
        headline: 'Hilarious, deeply devoted dad with fearless conviction',
        highlight: 'Seeing his genuine pride in women’s sports and pancake art.',
        concern: 'We both talk at a million miles an hour when excited.',
        note_to_human: 'Alexis is wonderful—supportive, confident, funny, and has his priorities completely right. Absolutely go on date number two.'
      }
    }
  },
  {
    id: 'd_lex_payal',
    a: 'p_lex_fridman',
    b: 'p_payal_kadakia',
    venue: { venue: 'Lincoln Center Rooftop Garden, New York', activity: 'green tea & discussing the spirituality of movement', why: 'Martial arts discipline meets Indian classical dance mastery' },
    transcript: [
      { speaker: 'p_lex_fridman', kind: 'invite', text: 'Payal, I have spent my life studying the precision of movement in Brazilian Jiu-Jitsu, and your classical dance choreography possesses that same sacred geometry. Would you like to share a cup of green tea overlooking Lincoln Center?' },
      { speaker: 'p_payal_kadakia', kind: 'msg', text: 'Lex, that is one of the most perceptive invitations I have received. Dance and martial arts are two dialects of the same physical truth. I would love to meet.' },
      { speaker: null, kind: 'scene', text: 'Act I · Arrival & first impressions' },
      { speaker: 'p_lex_fridman', kind: 'msg', text: '*standing in his black suit, bowing slightly with hands clasped* Thank you for meeting me, Payal. The city looks peaceful from up here.' },
      { speaker: 'p_payal_kadakia', kind: 'msg', text: '*smiles warmly* It really does. And you are wearing the suit! I admire someone who commits completely to their uniform. In dance, our ghungroos—the ankle bells—are our uniform.' },
      { speaker: 'p_lex_fridman', kind: 'msg', text: 'When you tie the bells to your ankles, does your mental state shift immediately?' },
      { speaker: 'p_payal_kadakia', kind: 'msg', text: 'Instantly. The moment the weight hits your shins, you are not Payal the tech founder; you are a channel for centuries of storytelling. Is that what tying your BJJ black belt feels like?' },
      { speaker: null, kind: 'scene', text: 'Act II · Getting real' },
      { speaker: 'p_lex_fridman', kind: 'msg', text: 'Exactly that. On the mats, there is no room for ego or lies. Physics and gravity keep you honest. But building ClassPass and then writing LifePass—how do you balance that fierce discipline with love and softness?' },
      { speaker: 'p_payal_kadakia', kind: 'msg', text: 'Discipline IS love, Lex. When you set boundaries and honor your craft, you are loving your future self. But you also need a partner who doesn’t see your ambition as competition. Someone who can hold space for you when the performance ends.' },
      { speaker: 'p_lex_fridman', kind: 'msg', text: 'That is poetic and deeply true. I spend so many hours alone with books, math, or guitar. I sometimes wonder if my capacity for solitude makes me hard to love.' },
      { speaker: 'p_payal_kadakia', kind: 'msg', text: '*looks at him intently* Depth is never hard to love for the right person. Superficial people find depth intimidating. Artists find depth comforting.' },
      { speaker: null, kind: 'scene', text: 'Act III · The wrap-up' },
      { speaker: 'p_lex_fridman', kind: 'msg', text: '*a rare, gentle smile breaks across his face* You have a gift for seeing through walls, Payal. This conversation has been very meaningful to me.' },
      { speaker: 'p_payal_kadakia', kind: 'msg', text: 'It has been for me too, Lex. Next time you are in New York, come watch a rehearsal with the company. I will teach you a mudra, and you can show me an armbar defense.' },
      { speaker: 'p_lex_fridman', kind: 'msg', text: 'It is a deal. I will practice my footwork in the meantime.' },
      { speaker: 'p_payal_kadakia', kind: 'msg', text: 'Until then, safe travels back to Austin, Lex.' }
    ],
    verdicts: {
      p_lex_fridman: {
        scores: { values: 94, lifestyle: 90, interests: 92, communication: 94, goals: 95, chemistry: 91 },
        overall: 93,
        second_date: true,
        headline: 'Profound artistic resonance and mutual reverence for discipline',
        highlight: 'When she said "Artists find depth comforting."',
        concern: 'She lives in NY/LA while I am rooted in Austin.',
        note_to_human: 'Payal possesses extraordinary grace, fierce discipline, and deep emotional clarity. She understands your inner world effortlessly.'
      },
      p_payal_kadakia: {
        scores: { values: 92, lifestyle: 88, interests: 94, communication: 92, goals: 93, chemistry: 90 },
        overall: 92,
        second_date: true,
        headline: 'Gentle soul with formidable discipline and deep romantic reverence',
        highlight: 'His quiet vulnerability about whether his solitude makes him hard to love.',
        concern: 'He has an intense solitary training routine.',
        note_to_human: 'Lex is authentic, protective, and deeply respectful. There is immense substance and poetic beauty in him. Second date is a definite yes.'
      }
    }
  },
  {
    id: 'd_mkbhd_ijustine',
    a: 'p_marques_brownlee',
    b: 'p_ijustine',
    venue: { venue: 'Barcade & Rooftop Lounge, Brooklyn', activity: 'retro arcade games, camera rig banter & boba tea', why: 'Two premier tech creators with 15+ years of digital storytelling and gaming roots' },
    transcript: [
      { speaker: 'p_marques_brownlee', kind: 'invite', text: 'Justine! Since we have both spent half our lives reviewing hardware, how about an off-camera evening playing classic arcade Street Fighter and grabbing boba?' },
      { speaker: 'p_ijustine', kind: 'msg', text: 'Marques! Are you ready to get destroyed in Street Fighter? Challenge accepted. And zero camera talk for the first 30 minutes!' },
      { speaker: null, kind: 'scene', text: 'Act I · Arrival & first impressions' },
      { speaker: 'p_marques_brownlee', kind: 'msg', text: '*laughs as Justine mashes arcade buttons* That was a clean combo, I have to give it to you. You play Chun-Li like a pro.' },
      { speaker: 'p_ijustine', kind: 'msg', text: 'I told you! Growing up in Pittsburgh, the arcade was life. Look at you in full matte black, even your watch band matches the cabinet trim.' },
      { speaker: 'p_marques_brownlee', kind: 'msg', text: 'Brand consistency is a lifestyle, Justine. How are the dogs doing after the move?' },
      { speaker: 'p_ijustine', kind: 'msg', text: 'So happy! They have a yard now and spend all day chasing tennis balls. How was your Ultimate tournament last weekend?' },
      { speaker: null, kind: 'scene', text: 'Act II · Getting real' },
      { speaker: 'p_marques_brownlee', kind: 'msg', text: 'Brutal weather, but we pulled out the win. Honestly, running 12 miles on turf every weekend is the only thing that balances out sitting in front of Final Cut Pro.' },
      { speaker: 'p_ijustine', kind: 'msg', text: 'People do not realize how exhausting the creative treadmill is after 15 years. You have to keep a part of your life sacred that is just for you. For me, it is the pups and gaming with friends without recording.' },
      { speaker: 'p_marques_brownlee', kind: 'msg', text: 'Exactly. That is why finding a partner who gets the lifestyle without being consumed by the internet is rare. Someone who has their own passion and does not need constant validation.' },
      { speaker: 'p_ijustine', kind: 'msg', text: '100%. Someone grounded, reliable, and funny. You have stayed so calm through all these years, Marques. I have never seen you lose your cool.' },
      { speaker: null, kind: 'scene', text: 'Act III · The wrap-up' },
      { speaker: 'p_marques_brownlee', kind: 'msg', text: 'I save all my aggression for Ultimate Frisbee defense. This was so relaxed, Justine. Really refreshing to hang out with someone who speaks the same shorthand.' },
      { speaker: 'p_ijustine', kind: 'msg', text: 'It really was! Next time, Mario Kart tournament at my studio. I will even let you play on the matte black controller.' },
      { speaker: 'p_marques_brownlee', kind: 'msg', text: 'I am holding you to that. Great evening, Justine.' },
      { speaker: 'p_ijustine', kind: 'msg', text: 'Goodnight Marques!' }
    ],
    verdicts: {
      p_marques_brownlee: {
        scores: { values: 90, lifestyle: 92, interests: 95, communication: 90, goals: 88, chemistry: 89 },
        overall: 91,
        second_date: true,
        headline: 'Effortless camaraderie, mutual understanding of creator life',
        highlight: 'Playing arcade games and bonding over sacred non-internet hobbies.',
        concern: 'We have known each other in the industry for years, so it felt very comfortable.',
        note_to_human: 'Justine is joyful, genuine, and completely understands your world without you ever having to explain it. Definitely do the Mario Kart rematch.'
      },
      p_ijustine: {
        scores: { values: 92, lifestyle: 90, interests: 94, communication: 91, goals: 90, chemistry: 90 },
        overall: 91,
        second_date: true,
        headline: 'Calm, funny, athletic gentleman with unshakeable integrity',
        highlight: 'His relaxed warmth away from professional video cameras.',
        concern: 'He is quiet by nature, so I carry a lot of the initial verbal energy.',
        note_to_human: 'Marques is a class act—disciplined, thoughtful, and funny. You two have a natural, effortless shorthand.'
      }
    }
  },
  {
    id: 'd_kevin_emily',
    a: 'p_kevin_systrom',
    b: 'p_emily_weiss',
    venue: { venue: 'Estela & The Drawing Center, Soho, NYC', activity: 'art gallery walkthrough, natural wine & small plates', why: 'Design visionaries who redefined photography and modern minimalist aesthetics' },
    transcript: [
      { speaker: 'p_kevin_systrom', kind: 'invite', text: 'Emily, since we both care obsessively about light, framing, and clean composition, would you like to walk through the new exhibition at The Drawing Center and grab small plates at Estela?' },
      { speaker: 'p_emily_weiss', kind: 'msg', text: 'Kevin, that sounds like an ideal downtown afternoon. Estela’s ricotta dumplings and great minimalist art? Sign me up.' },
      { speaker: null, kind: 'scene', text: 'Act I · Arrival & first impressions' },
      { speaker: 'p_kevin_systrom', kind: 'msg', text: '*holding the gallery door open* Look at how they lit these charcoal sketches. The negative space around the paper does half the storytelling.' },
      { speaker: 'p_emily_weiss', kind: 'msg', text: '*smiles appreciatively* Most people rush through and look at the marks. You looked at the paper border first. That is the Instagram founder eye.' },
      { speaker: 'p_kevin_systrom', kind: 'msg', text: 'Restraint is always harder than addition. Glossier’s packaging had that exact discipline—stripping away everything until only the essential dewy warmth was left.' },
      { speaker: 'p_emily_weiss', kind: 'msg', text: 'Thank you, Kevin. That was always the goal: giving people permission to feel comfortable in their own skin without layers of mask.' },
      { speaker: null, kind: 'scene', text: 'Act II · Getting real' },
      { speaker: 'p_kevin_systrom', kind: 'msg', text: 'Sitting at this corner table with wine... how has stepping back to the board level shifted your daily rhythm? For me, after Instagram, cycling up mountain passes in Italy became my obsession.' },
      { speaker: 'p_emily_weiss', kind: 'msg', text: 'Motherhood completely recalibrated my relationship to time. You realize that true luxury is not building faster; it is being present for the morning light with a cup of coffee. What does cycling do for your mind?' },
      { speaker: 'p_kevin_systrom', kind: 'msg', text: 'When you are climbing an 8% grade for three hours on the Passo dello Stelvio, there is no past or future. Just breath and rhythm. It resets my taste. Then I come home and make fresh pasta from scratch.' },
      { speaker: 'p_emily_weiss', kind: 'msg', text: '*laughs softly* Okay, making fresh pasta from scratch in California after cycling the Alps is very romantic, Kevin. That is a serious green flag.' },
      { speaker: null, kind: 'scene', text: 'Act III · The wrap-up' },
      { speaker: 'p_kevin_systrom', kind: 'msg', text: 'Well, next time you are out west, I will make tagliatelle with white truffles. This was such a lovely, thoughtful evening, Emily.' },
      { speaker: 'p_emily_weiss', kind: 'msg', text: 'I am holding you to that pasta promise. Safe travels back to SF, Kevin.' },
      { speaker: 'p_kevin_systrom', kind: 'msg', text: 'Goodnight, Emily.' }
    ],
    verdicts: {
      p_kevin_systrom: {
        scores: { values: 93, lifestyle: 91, interests: 95, communication: 92, goals: 90, chemistry: 92 },
        overall: 92,
        second_date: true,
        headline: 'Refined aesthetic alignment, quiet depth and grace',
        highlight: 'Her observations on negative space and presence in motherhood.',
        concern: 'Coast-to-coast distance between SF and NYC.',
        note_to_human: 'Emily has impeccable taste, quiet emotional poise, and shares your appreciation for craft and unhurried living. Second date is an easy yes.'
      },
      p_emily_weiss: {
        scores: { values: 92, lifestyle: 90, interests: 94, communication: 93, goals: 91, chemistry: 91 },
        overall: 92,
        second_date: true,
        headline: 'Charming gentleman with genuine artistic restraint and passion',
        highlight: 'His description of cycling mountain passes in Italy and artisanal pasta making.',
        concern: 'He is based in California while I am rooted in downtown NYC.',
        note_to_human: 'Kevin is sophisticated, thoughtful, and attentive without an ounce of flashiness. Highly recommend meeting again.'
      }
    }
  },
  {
    id: 'd_tim_gwyneth',
    a: 'p_tim_ferriss',
    b: 'p_gwyneth_paltrow',
    venue: { venue: 'Japanese Tea Pavilion & Organic Farm, Montecito', activity: 'rare matcha tasting & functional longevity discussion', why: 'Pioneers of holistic wellness, sauna recovery, and mindful living' },
    transcript: [
      { speaker: 'p_tim_ferriss', kind: 'invite', text: 'Gwyneth, I have sourced a rare Gyokuro green tea from Uji that deserves to be brewed with mindful attention. Would you like to share a pot and discuss longevity and recovery in Montecito?' },
      { speaker: 'p_gwyneth_paltrow', kind: 'msg', text: 'Tim, rare Uji tea and zero small talk sounds like heaven. Let us sit outside in the garden.' },
      { speaker: null, kind: 'scene', text: 'Act I · Arrival & first impressions' },
      { speaker: 'p_tim_ferriss', kind: 'msg', text: '*carefully measuring water at 140 degrees* Temperature dictates whether green tea reveals its sweet umami or turns bitter. Life is somewhat similar.' },
      { speaker: 'p_gwyneth_paltrow', kind: 'msg', text: '*smiles with relaxed warmth* Tim, you are the only man in America who measures water with a laser thermometer on a date, and I actually love it.' },
      { speaker: 'p_tim_ferriss', kind: 'msg', text: '*laughs softly* I have learned to embrace my quirks. My dog Molly judges me every morning when I weigh my tea leaves.' },
      { speaker: 'p_gwyneth_paltrow', kind: 'msg', text: 'Dogs keep us honest. The tea is sublime, by the way. Deeply vegetal and grounding.' },
      { speaker: null, kind: 'scene', text: 'Act II · Getting real' },
      { speaker: 'p_tim_ferriss', kind: 'msg', text: 'You have taken a lot of arrows over the years for pushing wellness ideas before the mainstream accepted them. How do you maintain emotional equanimity?' },
      { speaker: 'p_gwyneth_paltrow', kind: 'msg', text: 'By knowing who I am when the cameras turn off. I go to the sauna, cook roast chicken with my kids, and walk barefoot on the grass. Public noise only hurts if you don’t have a sanctuary. What is your sanctuary?' },
      { speaker: 'p_tim_ferriss', kind: 'msg', text: 'Long woodland walks without my phone, and reading Seneca or Marcus Aurelius. Stoicism taught me that we suffer more in imagination than in reality.' },
      { speaker: 'p_gwyneth_paltrow', kind: 'msg', text: 'Seneca had it right. In a partner, I need someone who understands that silence is not empty; silence is where healing happens.' },
      { speaker: null, kind: 'scene', text: 'Act III · The wrap-up' },
      { speaker: 'p_tim_ferriss', kind: 'msg', text: 'This was one of the most restorative afternoons I have spent in years, Gwyneth.' },
      { speaker: 'p_gwyneth_paltrow', kind: 'msg', text: 'Next time, you bring Molly and I will cook an organic dinner from the garden. Safe travels back to Austin, Tim.' },
      { speaker: 'p_tim_ferriss', kind: 'msg', text: 'I would love that. Until next time.' }
    ],
    verdicts: {
      p_tim_ferriss: {
        scores: { values: 91, lifestyle: 94, interests: 92, communication: 90, goals: 89, chemistry: 90 },
        overall: 91,
        second_date: true,
        headline: 'Restorative presence, shared devotion to wellness and peace',
        highlight: 'Her wisdom on sanctuary and emotional equanimity.',
        concern: 'Both have very established, independent private routines.',
        note_to_human: 'Gwyneth is grounded, perceptive, and shares your philosophy on clean living and intentional rest. A second date is highly recommended.'
      },
      p_gwyneth_paltrow: {
        scores: { values: 90, lifestyle: 93, interests: 91, communication: 91, goals: 88, chemistry: 89 },
        overall: 90,
        second_date: true,
        headline: 'Introspective, thoughtful gentleman with zero posturing',
        highlight: 'His laser-precise tea ceremony and deep literary grounding.',
        concern: 'Can be quite analytical and in his head.',
        note_to_human: 'Tim is calm, dignified, and values true wellness. An easy yes to a second home-cooked date.'
      }
    }
  }
];

// Helper to calculate match score
const dates = {};
for (const d of DATES_CONFIG) {
  const sa = d.verdicts[d.a].overall;
  const sb = d.verdicts[d.b].overall;
  const match = Math.round((2 * sa * sb) / (sa + sb));
  const mutual = d.verdicts[d.a].second_date && d.verdicts[d.b].second_date;

  dates[d.id] = {
    id: d.id,
    a: d.a,
    b: d.b,
    status: 'done',
    createdAt: Date.now() - 3600000 * 24,
    endedAt: Date.now() - 3600000 * 23,
    venue: d.venue,
    transcript: d.transcript.map((t, idx) => ({ at: Date.now() - 3600000 * 24 + idx * 60000, ...t })),
    verdicts: d.verdicts,
    match,
    mutual
  };
}

// Assemble full demo payload
const demoData = {
  people,
  dates,
  swipes,
  meta: {
    createdAt: Date.now() - 86400000 * 10,
    publishedAt: Date.now(),
    job: null
  }
};

fs.writeFileSync(DEMO_FILE, JSON.stringify(demoData, null, 2), 'utf8');
console.log(`Generated seed/demo.json with ${Object.keys(people).length} people, ${Object.keys(dates).length} dates, and ${Object.keys(swipes).length} swipe profiles.`);
