// Script to append 10 more high-quality dates to seed/demo.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DEMO_FILE = path.join(ROOT, 'seed', 'demo.json');

const data = JSON.parse(fs.readFileSync(DEMO_FILE, 'utf8'));

const MORE_DATES = [
  {
    id: 'd_austen_katrina',
    a: 'p_austen_allred',
    b: 'p_katrina_lake',
    venue: { venue: 'Squaw Valley Lodge & Firepit, Lake Tahoe', activity: 'hot cider & Tahoe ski stories', why: 'Both passionate about mountain snow, trail running, and rethinking education and retail' },
    transcript: [
      { speaker: 'p_austen_allred', kind: 'invite', text: 'Katrina! As two people who love mountain air and took non-traditional routes to building companies, want to grab hot cider by the outdoor firepit in Tahoe?' },
      { speaker: 'p_katrina_lake', kind: 'msg', text: 'Austen, après-ski hot cider after fresh powder is my absolute favorite. Count me in!' },
      { speaker: null, kind: 'scene', text: 'Act I · Arrival & first impressions' },
      { speaker: 'p_austen_allred', kind: 'msg', text: '*takes off ski gloves and warms hands by the fire* Nothing compares to Wasatch or Tahoe snow. You skied the back bowls today, right?' },
      { speaker: 'p_katrina_lake', kind: 'msg', text: '*grins* First chair this morning! When you are out on the ridge, work and emails do not exist. Did you snowboard?' },
      { speaker: 'p_austen_allred', kind: 'msg', text: 'Always snowboard. I will hike three miles with a splitboard just to find untracked powder. It reminds me of the early days sleeping in my Civic in Palo Alto.' },
      { speaker: 'p_katrina_lake', kind: 'msg', text: 'Living out of your car takes grit, Austen. When I was starting Stitch Fix, people kept telling me women would never trust an algorithm with their clothes.' },
      { speaker: null, kind: 'scene', text: 'Act II · Getting real' },
      { speaker: 'p_austen_allred', kind: 'msg', text: 'And you held your toddler on the NASDAQ podium when you proved them all wrong. That was one of the coolest moments in tech history. How do you balance being present with family while running boards?' },
      { speaker: 'p_katrina_lake', kind: 'msg', text: 'Strict boundaries and an equal partner who carries the weight together. If you do not have mutual respect at home, everything else crumbles. What do you look for in a partner?' },
      { speaker: 'p_austen_allred', kind: 'msg', text: 'Someone grounded and tough who loves being outside, does not get distracted by status, and knows how to laugh when the tent leaks on a camping trip.' },
      { speaker: 'p_katrina_lake', kind: 'msg', text: '*laughs warmly* I have had my share of leaky tents! That resilience is everything. You cannot fake that.' },
      { speaker: null, kind: 'scene', text: 'Act III · The wrap-up' },
      { speaker: 'p_austen_allred', kind: 'msg', text: 'This cider was great, but the conversation was even better. Next time you come to Utah, I am smoking a brisket for you and your family.' },
      { speaker: 'p_katrina_lake', kind: 'msg', text: 'You have a deal, pitmaster! Safe trip back to Salt Lake, Austen.' },
      { speaker: 'p_austen_allred', kind: 'msg', text: 'Thanks Katrina, great meeting you!' }
    ],
    verdicts: {
      p_austen_allred: {
        scores: { values: 92, lifestyle: 94, interests: 90, communication: 91, goals: 93, chemistry: 91 },
        overall: 92,
        second_date: true,
        headline: 'Mountain energy, mutual grit, and unpretentious leadership',
        highlight: 'Bonding over fresh powder and early founder rejection.',
        concern: 'Both manage busy family and board schedules.',
        note_to_human: 'Katrina is athletic, grounded, brilliant, and completely unbothered by status games. Definitely host her in Utah.'
      },
      p_katrina_lake: {
        scores: { values: 91, lifestyle: 93, interests: 89, communication: 90, goals: 91, chemistry: 90 },
        overall: 91,
        second_date: true,
        headline: 'Authentic, rugged mountain builder with real family warmth',
        highlight: 'His honesty about living in his car and his devotion to outdoor grit.',
        concern: 'He is deeply rooted in Utah while I am primarily Bay Area.',
        note_to_human: 'Austen is genuine, hard-working, and shares your passion for skiing and family values. Second date is a solid yes.'
      }
    }
  },
  {
    id: 'd_gary_jessica',
    a: 'p_gary_vaynerchuk',
    b: 'p_jessica_alba',
    venue: { venue: 'Gjelina & Venice Beach Boardwalk, Los Angeles', activity: 'crispy pizzas, fresh salads & talking clean consumer habits', why: 'Direct-to-consumer titans who built iconic consumer brands with personal authenticity' },
    transcript: [
      { speaker: 'p_gary_vaynerchuk', kind: 'invite', text: 'Jessica! You built Honest from your kitchen table fighting for safe products, and I grew up hauling wine cases in New Jersey. Let us grab wood-fired pizza and talk real talk in Venice.' },
      { speaker: 'p_jessica_alba', kind: 'msg', text: 'Gary, as long as we order plenty of fresh greens with the pizza, you have a deal! Venice at sunset is gorgeous.' },
      { speaker: null, kind: 'scene', text: 'Act I · Arrival & first impressions' },
      { speaker: 'p_gary_vaynerchuk', kind: 'msg', text: '*waves enthusiastically* Look at this outdoor patio! California has New York beat on weather, I will give you that. How was tennis this morning?' },
      { speaker: 'p_jessica_alba', kind: 'msg', text: '*smiles brightly* Incredible! Played two sets of doubles with friends. It clears my mind before entering product review mode. Do you ever take a full day off, Gary?' },
      { speaker: 'p_gary_vaynerchuk', kind: 'msg', text: 'Saturday mornings! 6 AM garage sales in New Jersey. Nobody recognizes me in a baseball cap rummaging through boxes of 80s action figures. Pure joy.' },
      { speaker: 'p_jessica_alba', kind: 'msg', text: '*laughs* That is so endearing! Finding treasures in unexpected places. For me, it is cooking homemade tacos from garden cilantro on Sunday nights.' },
      { speaker: null, kind: 'scene', text: 'Act II · Getting real' },
      { speaker: 'p_gary_vaynerchuk', kind: 'msg', text: 'When you started Honest, Hollywood told you to stick to acting. People do not realize how hard it is to overcome other people’s boxes. What drove you to fight through that?' },
      { speaker: 'p_jessica_alba', kind: 'msg', text: 'My kids had severe allergies, and nobody was transparent about toxic chemicals. When your why is protecting families, rejection becomes fuel. What is your why?' },
      { speaker: 'p_gary_vaynerchuk', kind: 'msg', text: 'Gratitude for my parents bringing me from Belarus with nothing. I feel like I am playing with house money every day. In relationships, I need someone who operates with that same gratitude—no complaining, just empathy and heart.' },
      { speaker: 'p_jessica_alba', kind: 'msg', text: 'Gratitude is everything. In my home, we teach our kids that privilege means responsibility to give back.' },
      { speaker: null, kind: 'scene', text: 'Act III · The wrap-up' },
      { speaker: 'p_gary_vaynerchuk', kind: 'msg', text: 'Jessica, you are the realest person in LA. I loved every second of this.' },
      { speaker: 'p_jessica_alba', kind: 'msg', text: 'Same here, Gary! Next time you are in town, we are playing doubles tennis. Deal?' },
      { speaker: 'p_gary_vaynerchuk', kind: 'msg', text: 'Deal, but warn your friends I dive for every ball! Take care, Jessica.' },
      { speaker: 'p_jessica_alba', kind: 'msg', text: 'Goodnight Gary!' }
    ],
    verdicts: {
      p_gary_vaynerchuk: {
        scores: { values: 91, lifestyle: 88, interests: 90, communication: 94, goals: 93, chemistry: 90 },
        overall: 91,
        second_date: true,
        headline: 'High-energy mutual respect, zero pretense, deep gratitude',
        highlight: 'Her story about starting Honest to protect her allergic kids.',
        concern: 'Coast-to-coast travel between New York and LA.',
        note_to_human: 'Jessica is sharp, family-focused, grounded, and has enormous heart. You two share the same immigrant work ethic and gratitude.'
      },
      p_jessica_alba: {
        scores: { values: 90, lifestyle: 86, interests: 89, communication: 93, goals: 92, chemistry: 89 },
        overall: 89,
        second_date: true,
        headline: 'Infectious energy, honest warmth, and great conversational hustle',
        highlight: 'His Saturday morning garage sale obsession and devotion to his parents.',
        concern: 'He has super high daily kinetic energy.',
        note_to_human: 'Gary is warm, genuine, and refreshingly direct. An easy yes to a friendly tennis rematch.'
      }
    }
  },
  {
    id: 'd_dharmesh_melanie',
    a: 'p_dharmesh_shah',
    b: 'p_melanie_perkins',
    venue: { venue: 'Botanical Garden Conservatory, Sydney', activity: 'flat whites, software democratisation & puzzle talk', why: 'Tech founders who built multi-billion dollar platforms on the premise of simplicity and kindness' },
    transcript: [
      { speaker: 'p_dharmesh_shah', kind: 'invite', text: 'Melanie, Canva’s focus on empowering everyone to create without gatekeeping matches everything I believe about software. If an extreme introvert may propose, would you like to share a flat white in the Sydney Conservatory?' },
      { speaker: 'p_melanie_perkins', kind: 'msg', text: 'Dharmesh, that is such a kind invite! As someone who loves quiet plants and big software dreams, the Conservatory is perfect.' },
      { speaker: null, kind: 'scene', text: 'Act I · Arrival & first impressions' },
      { speaker: 'p_dharmesh_shah', kind: 'msg', text: '*adjusts glasses and looks around the glass dome* These giant ferns are incredible. Plants are like clean algorithms—they grow with total efficiency without shouting.' },
      { speaker: 'p_melanie_perkins', kind: 'msg', text: '*smiles warmly* That is such a lovely programmer analogy! I love spaces where you can breathe and let your thoughts expand. How was the flight from Boston?' },
      { speaker: 'p_dharmesh_shah', kind: 'msg', text: 'Fourteen hours of blissful uninterrupted coding! I built a small AI word game in seat 4A. For an introvert, long flights are heaven.' },
      { speaker: 'p_melanie_perkins', kind: 'msg', text: '*laughs softly* Most people dread long flights, and you turned it into a hackathon. That is true maker spirit.' },
      { speaker: null, kind: 'scene', text: 'Act II · Getting real' },
      { speaker: 'p_dharmesh_shah', kind: 'msg', text: 'When you announced the Two-Step Plan—giving away Canva’s wealth to eliminate extreme poverty—it deeply moved me. In tech, too many people hoard status. What gave you that clarity early on?' },
      { speaker: 'p_melanie_perkins', kind: 'msg', text: 'When we got rejected by 100 VCs in Perth and Silicon Valley, Cliff and I promised each other: if we ever succeed, we will use it to do the most good possible. Money beyond what you need is just a responsibility. What is your guiding principle?' },
      { speaker: 'p_dharmesh_shah', kind: 'msg', text: 'Kindness as an operating system. The smartest person in the room is useless if they make everyone around them feel small. In a partner, gentle empathy is the only quality that truly endures.' },
      { speaker: 'p_melanie_perkins', kind: 'msg', text: 'Gentle empathy. I could not agree more. And having fun—we still build crazy cardboard costumes for our team celebrations!' },
      { speaker: null, kind: 'scene', text: 'Act III · The wrap-up' },
      { speaker: 'p_dharmesh_shah', kind: 'msg', text: 'Cardboard costumes! I would love to see photos of that. This was one of the most delightful afternoons of my year, Melanie.' },
      { speaker: 'p_melanie_perkins', kind: 'msg', text: 'It was wonderful, Dharmesh. Next time, I will teach you the basics of kitesurfing on the bay!' },
      { speaker: 'p_dharmesh_shah', kind: 'msg', text: '*smiles nervously* Kitesurfing may test my balance, but for you, I will try. Safe travels, Melanie.' },
      { speaker: 'p_melanie_perkins', kind: 'msg', text: 'Take care, Dharmesh!' }
    ],
    verdicts: {
      p_dharmesh_shah: {
        scores: { values: 96, lifestyle: 89, interests: 93, communication: 92, goals: 97, chemistry: 91 },
        overall: 93,
        second_date: true,
        headline: 'Shared ethical soul, magnificent philanthropic vision, pure kindness',
        highlight: 'Her reflection on Canva’s Two-Step Plan to solve global poverty.',
        concern: 'Huge physical distance between Boston and Sydney.',
        note_to_human: 'Melanie is extraordinarily humble, visionary, and kind. She embodies everything you admire about tech for good.'
      },
      p_melanie_perkins: {
        scores: { values: 96, lifestyle: 88, interests: 92, communication: 93, goals: 95, chemistry: 90 },
        overall: 92,
        second_date: true,
        headline: 'Gentle genius with profound integrity and zero corporate ego',
        highlight: 'His definition of kindness as an operating system.',
        concern: 'He is an indoor coder while I love the open ocean.',
        note_to_human: 'Dharmesh is a gentle gem of a human being—brilliant, deeply compassionate, and authentic. Second date is a clear yes.'
      }
    }
  },
  {
    id: 'd_andrew_arianna',
    a: 'p_andrew_ng',
    b: 'p_arianna_huffington',
    venue: { venue: 'The Mark Hotel Garden Courtyard, Manhattan', activity: 'espresso, Greek pastries & discussing humane AI and restorative rest', why: 'Intellectual leaders dedicated to human flourishing, education, and ending burnout' },
    transcript: [
      { speaker: 'p_andrew_ng', kind: 'invite', text: 'Arianna, while I study neural networks, your work on human biological rest is equally foundational. Would you join me for double espresso and Greek olive oil treats in Manhattan?' },
      { speaker: 'p_arianna_huffington', kind: 'msg', text: 'Andrew, my dear, the man who teaches the world AI wanting to talk about sleep! Nothing would give me greater pleasure. Let us meet at The Mark.' },
      { speaker: null, kind: 'scene', text: 'Act I · Arrival & first impressions' },
      { speaker: 'p_andrew_ng', kind: 'msg', text: '*smiles warmly and pours sparkling water* Thank you for making time, Arianna. Your calendar must be demanding.' },
      { speaker: 'p_arianna_huffington', kind: 'msg', text: '*laughs with rich Greek warmth* My calendar is full, Andrew, but my evenings are sacred! 8 hours of sleep, phones out of the bedroom. And you—do you practice what you preach about balance?' },
      { speaker: 'p_andrew_ng', kind: 'msg', text: 'I drink double espresso in the morning, but I take long walks with my children every evening in Palo Alto. If research stops you from playing with your kids, your priorities are inverted.' },
      { speaker: 'p_arianna_huffington', kind: 'msg', text: 'Bravo! You speak like an ancient Greek philosopher. Aristotle would have loved you.' },
      { speaker: null, kind: 'scene', text: 'Act II · Getting real' },
      { speaker: 'p_andrew_ng', kind: 'msg', text: 'People worry that AI will dehumanize society. But if we design AI to automate drudgery, it should give humans more time for literature, poetry, and sleep. Isn’t that the real opportunity?' },
      { speaker: 'p_arianna_huffington', kind: 'msg', text: 'Yes, exactly! But only if we refuse the cult of burnout. In Athens, we say "filoxenia"—the love of strangers and warm hospitality. Technology must serve human warmth, not replace it. What do you look for in companionship, Andrew?' },
      { speaker: 'p_andrew_ng', kind: 'msg', text: 'Patience, intellectual generosity, and emotional gentleness. Someone who can sit quietly over tea and read a book without needing continuous entertainment.' },
      { speaker: 'p_arianna_huffington', kind: 'msg', text: 'A man who appreciates quiet depth! That is rare in Silicon Valley, Andrew. You have a very tranquil presence.' },
      { speaker: null, kind: 'scene', text: 'Act III · The wrap-up' },
      { speaker: 'p_andrew_ng', kind: 'msg', text: 'Thank you, Arianna. Being in your presence is invigorating and soothing at the same time.' },
      { speaker: 'p_arianna_huffington', kind: 'msg', text: 'Next time, you come to Athens in the summer, and we will debate AI ethics overlooking the Aegean Sea. Safe travels back to California!' },
      { speaker: 'p_andrew_ng', kind: 'msg', text: 'I would be honored. Goodnight Arianna.' }
    ],
    verdicts: {
      p_andrew_ng: {
        scores: { values: 94, lifestyle: 91, interests: 93, communication: 95, goals: 93, chemistry: 90 },
        overall: 92,
        second_date: true,
        headline: 'Towering wisdom, Mediterranean warmth, and philosophical joy',
        highlight: 'Her reflections on Greek hospitality and sacred sleep boundaries.',
        concern: 'She lives an intensely public, social life in New York.',
        note_to_human: 'Arianna is captivating, deeply cultured, and shares your desire to use knowledge to uplift human dignity. An exceptional connection.'
      },
      p_arianna_huffington: {
        scores: { values: 95, lifestyle: 90, interests: 92, communication: 94, goals: 94, chemistry: 91 },
        overall: 92,
        second_date: true,
        headline: 'Gentle scholar with profound integrity and calming presence',
        highlight: 'His insistence that family walks take precedence over research papers.',
        concern: 'He is naturally very reserved.',
        note_to_human: 'Andrew is a rare gem—brilliant, gentle, respectful, and wise beyond his years. Definitely invite him to Greece.'
      }
    }
  },
  {
    id: 'd_rand_sallie',
    a: 'p_rand_fishkin',
    b: 'p_sallie_krawcheck',
    venue: { venue: 'Gramercy Tavern, New York City', activity: 'slow-braised ragu, heritage cider & honest truth-telling about money', why: 'Fiercely ethical truth-tellers who called out Wall Street and Silicon Valley hypocrisy' },
    transcript: [
      { speaker: 'p_rand_fishkin', kind: 'invite', text: 'Sallie, as someone who was fired on Wall Street for protecting clients and then built Ellevest, your integrity is legendary. Want to share braised ragu at Gramercy Tavern and talk real truth?' },
      { speaker: 'p_sallie_krawcheck', kind: 'msg', text: 'Rand, anyone with that magnificent mustache who wrote Lost and Founder is someone I have to meet! Let us do Gramercy Tavern.' },
      { speaker: null, kind: 'scene', text: 'Act I · Arrival & first impressions' },
      { speaker: 'p_rand_fishkin', kind: 'msg', text: '*pulls out a small strategy card game from coat pocket* I promise we will not play board games during dinner, but I had to bring Wingspan just in case there was a lull.' },
      { speaker: 'p_sallie_krawcheck', kind: 'msg', text: '*laughs with booming Southern charm* Honey, with the two of us, there will not be a single second of lull! Look at this bread basket, Gramercy never misses.' },
      { speaker: 'p_rand_fishkin', kind: 'msg', text: 'Carbs are my love language. I make handmade pasta in Seattle every Sunday.' },
      { speaker: 'p_sallie_krawcheck', kind: 'msg', text: 'A man who makes pasta from scratch! That is an automatic 20 points in your favor, Rand.' },
      { speaker: null, kind: 'scene', text: 'Act II · Getting real' },
      { speaker: 'p_rand_fishkin', kind: 'msg', text: 'When you refused to cover up toxic investments at Citi and Merrill and they pushed you out, that took guts. In tech, everyone spins their failures as strategic pivots. How did you handle the isolation?' },
      { speaker: 'p_sallie_krawcheck', kind: 'msg', text: 'I went for long runs in Central Park, drank some good wine, and realized that getting fired for your principles is a badge of honor. You wrote about your depression openly in your book. That takes just as much courage.' },
      { speaker: 'p_rand_fishkin', kind: 'msg', text: 'If we do not talk about the dark days, we trap other founders in shame. I value radical transparency above almost everything. What do you look for in a partner at this stage of life?' },
      { speaker: 'p_sallie_krawcheck', kind: 'msg', text: 'A secure man with zero fragile ego who loves real talk, laughs from his gut, and knows who he is. Life is too short for emotional tiptoeing.' },
      { speaker: null, kind: 'scene', text: 'Act III · The wrap-up' },
      { speaker: 'p_rand_fishkin', kind: 'msg', text: 'Amen to that. Sallie, this was one of the most refreshing, no-bullshit dinners I have ever had.' },
      { speaker: 'p_sallie_krawcheck', kind: 'msg', text: 'You are a delight, Rand. Next time, you bring that homemade pasta to New York, and I will bring the North Carolina BBQ sauce.' },
      { speaker: 'p_rand_fishkin', kind: 'msg', text: 'It is a contract! Safe travels, Sallie.' },
      { speaker: 'p_sallie_krawcheck', kind: 'msg', text: 'Goodnight Rand!' }
    ],
    verdicts: {
      p_rand_fishkin: {
        scores: { values: 96, lifestyle: 89, interests: 91, communication: 96, goals: 92, chemistry: 92 },
        overall: 93,
        second_date: true,
        headline: 'Electrifying moral clarity, fearless wit, and instant rapport',
        highlight: 'Her story about running Central Park after getting fired for her ethics.',
        concern: 'Seattle vs. New York distance.',
        note_to_human: 'Sallie has zero pretense, immense courage, and matches your standard of radical honesty with Southern charm. Second date is a no-brainer.'
      },
      p_sallie_krawcheck: {
        scores: { values: 95, lifestyle: 90, interests: 90, communication: 95, goals: 91, chemistry: 92 },
        overall: 92,
        second_date: true,
        headline: 'Brilliant, honest gentleman with authentic warmth and courage',
        highlight: 'His openness about mental health and love for handmade pasta.',
        concern: 'He lives in rainy Seattle.',
        note_to_human: 'Rand is wonderful—smart, grounded, kind, and completely secure in his own skin. Definitely schedule that pasta dinner.'
      }
    }
  },
  {
    id: 'd_levels_reshma',
    a: 'p_pieter_levels',
    b: 'p_reshma_saujani',
    venue: { venue: 'Public Hotel Rooftop, Lower East Side, NYC', activity: 'spicy street tacos, indie tech talk & discussing bravery over perfection', why: 'Contrarian solo coder meets civic activist who taught 500k girls to code' },
    transcript: [
      { speaker: 'p_pieter_levels', kind: 'invite', text: 'Reshma! You built Girls Who Code to get half a million women into coding, and I build software solo from Asian rooftops. Let us grab spicy tacos on the Lower East Side and debate the future of coding.' },
      { speaker: 'p_reshma_saujani', kind: 'msg', text: 'Pieter! The indie hacker legend himself. I love unconventional builders. Let us do it!' },
      { speaker: null, kind: 'scene', text: 'Act I · Arrival & first impressions' },
      { speaker: 'p_pieter_levels', kind: 'msg', text: '*looks over the Manhattan skyline with backpack on* New York energy is wild. Everyone is walking at 100 mph.' },
      { speaker: 'p_reshma_saujani', kind: 'msg', text: '*laughs warmly* That is NYC pace! You look like you just hopped off a flight from Lisbon with just a carry-on.' },
      { speaker: 'p_pieter_levels', kind: 'msg', text: 'Everything I own fits in this backpack, Reshma. Laptop, two black tees, noise-canceling headphones. Freedom is lightweight.' },
      { speaker: 'p_reshma_saujani', kind: 'msg', text: 'I admire that minimalism. But try having two young kids and running Moms First with just a carry-on!' },
      { speaker: null, kind: 'scene', text: 'Act II · Getting real' },
      { speaker: 'p_pieter_levels', kind: 'msg', text: '*grins* Fair point! But your TED talk on "Brave, Not Perfect" genuinely inspired me. When I launched 12 startups in 12 months, people called me crazy. Embracing public failure was the only way I broke through.' },
      { speaker: 'p_reshma_saujani', kind: 'msg', text: 'That is exactly what we teach girls. Boys are taught to be brave and take risks; girls are socialized to be perfect and safe. When you let go of perfection, you become unstoppable. But don’t you get lonely traveling solo all year?' },
      { speaker: 'p_pieter_levels', kind: 'msg', text: 'Honestly? Sometimes, yes. Rooftop pools in Bangkok are amazing, but coming home to someone who truly knows you and challenges your ideas... that is something software cannot replace.' },
      { speaker: 'p_reshma_saujani', kind: 'msg', text: 'That is very honest, Pieter. Real connection requires putting down roots somewhere in another person’s heart, even if your passport keeps moving.' },
      { speaker: null, kind: 'scene', text: 'Act III · The wrap-up' },
      { speaker: 'p_pieter_levels', kind: 'msg', text: 'That was profound, Reshma. You have an incredible ability to cut right to the human core.' },
      { speaker: 'p_reshma_saujani', kind: 'msg', text: 'And you have an infectious creative spark, Pieter. Next time you are in New York, I will cook you proper Indian food and chai.' },
      { speaker: 'p_pieter_levels', kind: 'msg', text: 'Deal! I will bring Dutch stroopwafels. Safe travels, Reshma.' },
      { speaker: 'p_reshma_saujani', kind: 'msg', text: 'Goodnight Pieter!' }
    ],
    verdicts: {
      p_pieter_levels: {
        scores: { values: 91, lifestyle: 85, interests: 92, communication: 93, goals: 94, chemistry: 89 },
        overall: 89,
        second_date: true,
        headline: 'Fierce purpose, deep emotional wisdom, and inspiring bravery',
        highlight: 'Her insight that connection means putting roots in someone’s heart.',
        concern: 'My nomadic lifestyle vs. her anchored NYC family foundation.',
        note_to_human: 'Reshma is inspiring, warm, and saw straight through your nomad armor. A second date over home-cooked chai is highly recommended.'
      },
      p_reshma_saujani: {
        scores: { values: 89, lifestyle: 84, interests: 91, communication: 91, goals: 90, chemistry: 88 },
        overall: 88,
        second_date: true,
        headline: 'Brilliant solo maker with refreshing candor and creative energy',
        highlight: 'His vulnerability about loneliness in nomadic travel.',
        concern: 'He lives out of a backpack across Europe and Asia.',
        note_to_human: 'Pieter is creative, self-made, and refreshingly vulnerable when the bravado drops. Definitely worth seeing again.'
      }
    }
  },
  {
    id: 'd_mark_whitney',
    a: 'p_mark_zuckerberg',
    b: 'p_whitney_wolfe_herd',
    venue: { venue: 'Lady Bird Lake Trail & Quiet Patio, Austin', activity: 'sunset paddleboarding & discussing privacy in modern networks', why: 'Social architecture pioneers with high-stakes platform leadership backgrounds' },
    transcript: [
      { speaker: 'p_mark_zuckerberg', kind: 'invite', text: 'Whitney, you have thought as much about social platform incentives as anyone in tech. Want to get out on the water at Lady Bird Lake and grab casual Texas dinner after?' },
      { speaker: 'p_whitney_wolfe_herd', kind: 'msg', text: 'Mark, being out on the water is the best way to escape screens. Let us do it!' },
      { speaker: null, kind: 'scene', text: 'Act I · Arrival & first impressions' },
      { speaker: 'p_mark_zuckerberg', kind: 'msg', text: '*balancing on the board with athletic ease* Water is completely calm tonight. How often do you get out here?' },
      { speaker: 'p_whitney_wolfe_herd', kind: 'msg', text: 'Two or three times a week. It clears out the noise of boardroom battles. You foil in Hawaii, right?' },
      { speaker: 'p_mark_zuckerberg', kind: 'msg', text: 'Yeah, hydrofoiling and Jiu-Jitsu. When someone is trying to choke you in BJJ or you are flying 25 mph over a reef, your brain cannot process work problems. It forces 100% presence.' },
      { speaker: 'p_whitney_wolfe_herd', kind: 'msg', text: '*smiles* That is extreme therapy, Mark! But I get it. High-intensity sports burn off executive cortisol.' },
      { speaker: null, kind: 'scene', text: 'Act II · Getting real' },
      { speaker: 'p_mark_zuckerberg', kind: 'msg', text: 'You have been under the spotlight since you were in your twenties, just like me. How do you decide who to trust in your personal circle?' },
      { speaker: 'p_whitney_wolfe_herd', kind: 'msg', text: 'Loyalty and consistency over time. People who are the same person in an empty kitchen as they are on stage. The moment someone cares about who else is looking in the room, I pull back.' },
      { speaker: 'p_mark_zuckerberg', kind: 'msg', text: 'That is my exact rule. Private sanctuary is sacred. When you find people who are genuinely loyal and unpretentious, you hold onto them for life.' },
      { speaker: 'p_whitney_wolfe_herd', kind: 'msg', text: 'Absolutely. It is the only way to build a real family and stay sane.' },
      { speaker: null, kind: 'scene', text: 'Act III · The wrap-up' },
      { speaker: 'p_mark_zuckerberg', kind: 'msg', text: 'This was great, Whitney. Peaceful and real. Next time, come out to Kauai and try foil surfing.' },
      { speaker: 'p_whitney_wolfe_herd', kind: 'msg', text: 'Only if you promise not to let me crash into the reef! Safe travels back to California, Mark.' },
      { speaker: 'p_mark_zuckerberg', kind: 'msg', text: 'Deal. Goodnight Whitney.' }
    ],
    verdicts: {
      p_mark_zuckerberg: {
        scores: { values: 93, lifestyle: 91, interests: 92, communication: 91, goals: 94, chemistry: 90 },
        overall: 91,
        second_date: true,
        headline: 'Shared scale understanding, mutual loyalty, and outdoor athleticism',
        highlight: 'Her rule on people being the same in an empty kitchen as on stage.',
        concern: 'Both carry enormous public security and media footprints.',
        note_to_human: 'Whitney understands the pressures of public leadership while prioritizing family sanctuary above all else. A very strong match.'
      },
      p_whitney_wolfe_herd: {
        scores: { values: 91, lifestyle: 90, interests: 91, communication: 90, goals: 93, chemistry: 89 },
        overall: 90,
        second_date: true,
        headline: 'Grounded, athletic, and fiercely loyal builder',
        highlight: 'His perspective on extreme sports as mental discipline and presence.',
        concern: 'Massive global security profile.',
        note_to_human: 'Mark is calm, thoughtful, and deeply respectful in private. Second date is a clear yes.'
      }
    }
  },
  {
    id: 'd_tan_emily',
    a: 'p_tan_france',
    b: 'p_emily_weiss',
    venue: { venue: 'The Met Cloisters & Garden Cafe, Upper Manhattan', activity: 'medieval textiles, afternoon tea & modern aesthetics', why: 'Style authorities who believe aesthetics should empower human comfort and individuality' },
    transcript: [
      { speaker: 'p_tan_france', kind: 'invite', text: 'Emily darling! As two people who believe true style is about making people feel loved in their own skin, want to wander through the medieval tapestries at The Cloisters and have warm tea?' },
      { speaker: 'p_emily_weiss', kind: 'msg', text: 'Tan! The Cloisters in autumn is magical. And having afternoon tea with you sounds divine. I will meet you by the herb garden!' },
      { speaker: null, kind: 'scene', text: 'Act I · Arrival & first impressions' },
      { speaker: 'p_tan_france', kind: 'msg', text: '*admires Emily’s tailored trench coat* Look at you! Effortless dewy skin and that tailored silhouette. You are the living embodiment of Glossier.' },
      { speaker: 'p_emily_weiss', kind: 'msg', text: '*laughs with joy* Coming from the king of the French Tuck, that is the ultimate compliment! And your silver hair against that wool coat is perfection.' },
      { speaker: 'p_tan_france', kind: 'msg', text: 'Darling, when nature gives you silver hair at 35, you lean all the way into it! Look at these stone arches.' },
      { speaker: 'p_emily_weiss', kind: 'msg', text: 'The peace up here is unreal. You can barely believe Midtown Manhattan is just a subway ride away.' },
      { speaker: null, kind: 'scene', text: 'Act II · Getting real' },
      { speaker: 'p_tan_france', kind: 'msg', text: 'When you started Into The Gloss and Glossier, you taught a whole generation that makeup is not a mask; it is celebrating who you already are. That is what we tried to do on Queer Eye. How has motherhood influenced your creative eye?' },
      { speaker: 'p_emily_weiss', kind: 'msg', text: 'It stripped away any need for perfection. You realize children don’t care about curated aesthetics; they care about warmth, joy, and laughter. How is family life in the Utah mountains?' },
      { speaker: 'p_tan_france', kind: 'msg', text: 'It is my whole world. I bake British pies, play with my boys in the snow, and breathe clean mountain air. Being famous is fine, but being a loving parent is everything.' },
      { speaker: 'p_emily_weiss', kind: 'msg', text: 'Amen to that. In a companion, I need that same heart—someone who takes pride in beauty, but loves family and kindness above all.' },
      { speaker: null, kind: 'scene', text: 'Act III · The wrap-up' },
      { speaker: 'p_tan_france', kind: 'msg', text: 'Emily, you are an absolute vision and a sweetheart. This tea was medicine for my soul.' },
      { speaker: 'p_emily_weiss', kind: 'msg', text: 'It was for mine too, Tan. Next time you are in town, we are doing vintage home decor shopping in Brooklyn.' },
      { speaker: 'p_tan_france', kind: 'msg', text: 'I would not miss it for the world, darling! Safe travels.' },
      { speaker: 'p_emily_weiss', kind: 'msg', text: 'Goodnight Tan!' }
    ],
    verdicts: {
      p_tan_france: {
        scores: { values: 95, lifestyle: 92, interests: 96, communication: 96, goals: 93, chemistry: 94 },
        overall: 94,
        second_date: true,
        headline: 'Exquisite aesthetic harmony, radiant warmth, and shared family values',
        highlight: 'Her view on motherhood stripping away the need for superficial perfection.',
        concern: 'Salt Lake City vs. NYC travel.',
        note_to_human: 'Emily is pure grace, stylish, deeply loving, and shares your devotion to family and aesthetic beauty. An absolute joy of a match.'
      },
      p_emily_weiss: {
        scores: { values: 94, lifestyle: 92, interests: 95, communication: 95, goals: 92, chemistry: 93 },
        overall: 93,
        second_date: true,
        headline: 'Charming, impeccably stylish gentleman with boundless empathy and heart',
        highlight: 'His stories about baking British pies for his boys in the Utah snow.',
        concern: 'He is based in Utah while I am in NYC.',
        note_to_human: 'Tan is magnetic, kind, hilarious, and brings pure joy into every space. Second date is an emphatic yes.'
      }
    }
  }
];

for (const d of MORE_DATES) {
  const sa = d.verdicts[d.a].overall;
  const sb = d.verdicts[d.b].overall;
  const match = Math.round((2 * sa * sb) / (sa + sb));
  const mutual = d.verdicts[d.a].second_date && d.verdicts[d.b].second_date;

  data.dates[d.id] = {
    id: d.id,
    a: d.a,
    b: d.b,
    status: 'done',
    createdAt: Date.now() - 3600000 * 20,
    endedAt: Date.now() - 3600000 * 19,
    venue: d.venue,
    transcript: d.transcript.map((t, idx) => ({ at: Date.now() - 3600000 * 20 + idx * 60000, ...t })),
    verdicts: d.verdicts,
    match,
    mutual
  };
}

fs.writeFileSync(DEMO_FILE, JSON.stringify(data, null, 2), 'utf8');
console.log(`Updated seed/demo.json: now has ${Object.keys(data.people).length} people and ${Object.keys(data.dates).length} dates.`);
