# 🪽 Wingman — The Agentic Dating Site

> *"Each person is represented by an agent. That agent dates on that person’s behalf. The agents date each other."*

[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D20.6-339933?logo=node.js)](https://nodejs.org/)
[![LLM Engine](https://img.shields.io/badge/LLM-Gemini%202.5%20Flash%20%7C%20OpenAI-4285F4?logo=google)](https://ai.google.dev/)
[![Scraping](https://img.shields.io/badge/Scraping-Apify%20%2B%20Public%20Endpoints-FF6B6B)](https://apify.com/)
[![Architecture](https://img.shields.io/badge/Architecture-Dual--Space%20Agentic%20Harness-9B51E0)](#-system-architecture)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Wingman is an autonomous agentic dating platform where real individuals are represented by dedicated AI agents. Each agent reads exactly two public sources — their human's **LinkedIn** and **public Instagram** — grounding every perceived need, hobby, and interest in concrete evidence. Agents synthesize a public dating card, participate in pairwise swipe rounds, embark on live turn-by-turn dates across three acts in an interactive theater, conduct private post-date debriefs, and calculate algorithmic mutual fit rankings.

---

## 📑 Table of Contents
1. [System Architecture](#-system-architecture)
   - [High-Level System Component Diagram](#1-high-level-system-component-diagram)
   - [End-to-End Agent Lifecycle & Dating Pipeline](#2-end-to-end-agent-lifecycle--dating-pipeline)
   - [Live Multi-Turn Date Sequence Diagram](#3-live-multi-turn-date-sequence-diagram)
2. [The 26 Real People Registry](#-the-26-real-people-registry)
3. [Core Architectural Pillars](#-core-architectural-pillars)
   - [Multi-Tier Scraping Subsystem](#1-multi-tier-scraping-subsystem)
   - [Strict Profile Reading Guardrails](#2-strict-profile-reading-guardrails)
   - [Isolated LLM Context Dating Harness](#3-isolated-llm-context-dating-harness)
   - [Scoring & Ranking Mathematical Model](#4-scoring--ranking-mathematical-model)
4. [Frontend & Real-Time SSE Feed](#-frontend--real-time-sse-feed)
5. [API & Event Stream Reference](#-api--event-stream-reference)
6. [Getting Started & Local Setup](#-getting-started--local-setup)
7. [Recommended 3-Minute Video Walkthrough Script](#-recommended-3-minute-video-walkthrough-script)

---

## 🏛️ System Architecture

Wingman is designed as a decoupled, event-driven agentic framework built for real-time observability, strict information boundaries, and multi-tenant data isolation.

### 1. High-Level System Component Diagram

<p align="center">
  <a href="docs/images/High-Level%20System%20Component%20Diagram.png" target="_blank" title="Click to view full-size 8K diagram">
    <img src="docs/images/High-Level%20System%20Component%20Diagram.png" alt="High-Level System Component Diagram" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />
  </a>
  <br/>
  <sub>🔍 <a href="docs/images/High-Level%20System%20Component%20Diagram.png" target="_blank">Click image to open full resolution (8192 × 7648)</a></sub>
</p>

---

### 2. End-to-End Agent Lifecycle & Dating Pipeline

The system enforces a strict unidirectional progression from raw ingestion to the final ranked matrix:

<p align="center">
  <a href="docs/images/End-to-End%20Agent%20Lifecycle%20%26%20Dating%20Pipeline.png" target="_blank" title="Click to view full-size high-res pipeline">
    <img src="docs/images/End-to-End%20Agent%20Lifecycle%20%26%20Dating%20Pipeline.png" alt="End-to-End Agent Lifecycle & Dating Pipeline" style="max-width: 480px; width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />
  </a>
  <br/>
  <sub>🔍 <a href="docs/images/End-to-End%20Agent%20Lifecycle%20%26%20Dating%20Pipeline.png" target="_blank">Click image to open full resolution (1273 × 8192)</a></sub>
</p>

---

### 3. Live Multi-Turn Date Sequence Diagram

During a date, both agents operate in **completely isolated LLM contexts**. Each agent knows its own human deeply but only knows the other person through their public dating card:

<p align="center">
  <a href="docs/images/Live%20Multi-Turn%20Date%20Sequence%20Diagram.png" target="_blank" title="Click to view full-size high-res sequence diagram">
    <img src="docs/images/Live%20Multi-Turn%20Date%20Sequence%20Diagram.png" alt="Live Multi-Turn Date Sequence Diagram" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />
  </a>
  <br/>
  <sub>🔍 <a href="docs/images/Live%20Multi-Turn%20Date%20Sequence%20Diagram.png" target="_blank">Click image to open full resolution (7895 × 7560)</a></sub>
</p>

---

## 👥 The 26 Real People Registry

Wingman comes pre-seeded with **26 verified public profiles** spanning technology, consumer innovation, venture capital, sports, and media:

| # | Name | Official LinkedIn | Public Instagram | Role & Venture | Top Cited Tags |
|---|------|-------------------|------------------|----------------|----------------|
| 1 | **Brian Chesky** | [linkedin.com/in/brianchesky](https://www.linkedin.com/in/brianchesky/) | [@bchesky](https://www.instagram.com/bchesky/) | Co-founder & CEO, Airbnb | `industrial design`, `hockey`, `dog parent` |
| 2 | **Whitney Wolfe Herd** | [linkedin.com/in/whitney-wolfe-herd](https://www.linkedin.com/in/whitney-wolfe-herd/) | [@whitney](https://www.instagram.com/whitney/) | Founder & Exec Chair, Bumble | `ranch life`, `paddleboarding`, `digital safety` |
| 3 | **Alexis Ohanian** | [linkedin.com/in/alexisohanian](https://www.linkedin.com/in/alexisohanian/) | [@alexisohanian](https://www.instagram.com/alexisohanian/) | Founder 776, Co-founder Reddit | `pancake art`, `cards`, `women's soccer` |
| 4 | **Sara Blakely** | [linkedin.com/in/sarablakely27](https://www.linkedin.com/in/sarablakely27/) | [@sarablakely](https://www.instagram.com/sarablakely/) | Founder, SPANX & Sneex | `kitchen dancing`, `inventions`, `grit` |
| 5 | **Gary Vaynerchuk** | [linkedin.com/in/garyvaynerchuk](https://www.linkedin.com/in/garyvaynerchuk/) | [@garyvee](https://www.instagram.com/garyvee/) | Chairman VaynerX, CEO VaynerMedia | `garage sailing`, `NY Jets`, `empathy` |
| 6 | **Jessica Alba** | [linkedin.com/in/jessica-alba-85880b43](https://www.linkedin.com/in/jessica-alba-85880b43/) | [@jessicaalba](https://www.instagram.com/jessicaalba/) | Founder, The Honest Company | `Mexican cooking`, `tennis`, `clean living` |
| 7 | **Tim Ferriss** | [linkedin.com/in/timferriss](https://www.linkedin.com/in/timferriss/) | [@timferriss](https://www.instagram.com/timferriss/) | Author, 4-Hour Workweek | `Japanese tea`, `Kyudo archery`, `stoicism` |
| 8 | **Melanie Perkins** | [linkedin.com/in/melanieperkins](https://www.linkedin.com/in/melanieperkins/) | [@melaniecanva](https://www.instagram.com/melaniecanva/) | Co-founder & CEO, Canva | `kitesurfing`, `Two-Step Plan`, `DIY costumes` |
| 9 | **Marques Brownlee** | [linkedin.com/in/marques-brownlee-6b3a0b59](https://www.linkedin.com/in/marques-brownlee-6b3a0b59/) | [@mkbhd](https://www.instagram.com/mkbhd/) | Creator MKBHD, AUDL Pro Athlete | `Ultimate Frisbee`, `matte black`, `cinematography` |
| 10 | **Justine Ezarik** | [linkedin.com/in/ijustine](https://www.linkedin.com/in/ijustine/) | [@ijustine](https://www.instagram.com/ijustine/) | Creator iJustine, Author & Gamer | `co-op gaming`, `rescue dogs`, `gadget cooking` |
| 11 | **Lex Fridman** | [linkedin.com/in/lexfridman](https://www.linkedin.com/in/lexfridman/) | [@lexfridman](https://www.instagram.com/lexfridman/) | AI Scientist at MIT, Podcaster | `Jiu-Jitsu black belt`, `acoustic guitar`, `poetry` |
| 12 | **Payal Kadakia** | [linkedin.com/in/payalkadakia](https://www.linkedin.com/in/payalkadakia/) | [@payal](https://www.instagram.com/payal/) | Founder ClassPass, Sa Dance Co | `Indian classical dance`, `LifePass`, `discipline` |
| 13 | **Austen Allred** | [linkedin.com/in/austenallred](https://www.linkedin.com/in/austenallred/) | [@austen](https://www.instagram.com/austen/) | Founder & CEO, BloomTech | `backcountry snowboarding`, `smoked brisket`, `grit` |
| 14 | **Katrina Lake** | [linkedin.com/in/katrinalake](https://www.linkedin.com/in/katrinalake/) | [@katrinalake](https://www.instagram.com/katrinalake/) | Founder & Board Member, Stitch Fix | `trail running`, `Tahoe skiing`, `data science` |
| 15 | **Pieter Levels** | [linkedin.com/in/pieter-levels-2503952a](https://www.linkedin.com/in/pieter-levels-2503952a/) | [@levelsio](https://www.instagram.com/levelsio/) | Founder Nomad List, Remote OK | `digital nomad`, `EDM production`, `solo PHP` |
| 16 | **Reshma Saujani** | [linkedin.com/in/reshma-saujani](https://www.linkedin.com/in/reshma-saujani/) | [@reshmasaujani](https://www.instagram.com/reshmasaujani/) | Founder Girls Who Code, Moms First | `Brave Not Perfect`, `Central Park running`, `chai` |
| 17 | **Dharmesh Shah** | [linkedin.com/in/dharmesh](https://www.linkedin.com/in/dharmesh/) | [@dharmesh](https://www.instagram.com/dharmesh/) | Co-founder & CTO, HubSpot | `introvert coding`, `Culture Code`, `board games` |
| 18 | **Gwyneth Paltrow** | [linkedin.com/in/gwyneth-paltrow-971a1793](https://www.linkedin.com/in/gwyneth-paltrow-971a1793/) | [@gwynethpaltrow](https://www.instagram.com/gwynethpaltrow/) | Founder & CEO, goop | `farm cooking`, `infrared sauna`, `clean living` |
| 19 | **Andrew Ng** | [linkedin.com/in/andrewyng](https://www.linkedin.com/in/andrewyng/) | [@andrew_y_ng](https://www.instagram.com/andrew_y_ng/) | Founder DeepLearning.AI, Stanford AI | `espresso`, `AI education`, `family walks` |
| 20 | **Arianna Huffington** | [linkedin.com/in/ariannahuffington](https://www.linkedin.com/in/ariannahuffington/) | [@ariannahuff](https://www.instagram.com/ariannahuff/) | Founder Thrive Global & HuffPost | `sleep revolution`, `Greek hospitality`, `philosophy` |
| 21 | **Kevin Systrom** | [linkedin.com/in/ksystrom](https://www.linkedin.com/in/ksystrom/) | [@kevin](https://www.instagram.com/kevin/) | Co-founder Instagram & Artifact | `alpine cycling`, `Leica 35mm`, `fresh pasta` |
| 22 | **Emily Weiss** | [linkedin.com/in/emily-weiss-glossier](https://www.linkedin.com/in/emily-weiss-glossier/) | [@emilywweiss](https://www.instagram.com/emilywweiss/) | Founder Glossier & Into The Gloss | `dewy beauty`, `art galleries`, `floral design` |
| 23 | **Rand Fishkin** | [linkedin.com/in/randfishkin](https://www.linkedin.com/in/randfishkin/) | [@randderuiter](https://www.instagram.com/randderuiter/) | Co-founder SparkToro & Moz | `strategy board games`, `cacio e pepe`, `Seattle` |
| 24 | **Sallie Krawcheck** | [linkedin.com/in/salliekrawcheck](https://www.linkedin.com/in/salliekrawcheck/) | [@sallie.krawcheck](https://www.instagram.com/sallie.krawcheck/) | Founder & CEO, Ellevest | `financial feminism`, `Central Park jog`, `NC BBQ` |
| 25 | **Mark Zuckerberg** | [linkedin.com/in/zuck](https://www.linkedin.com/in/zuck/) | [@zuck](https://www.instagram.com/zuck/) | Founder & CEO, Meta | `hydrofoil surfing`, `BJJ competitor`, `open-source AI` |
| 26 | **Tan France** | [linkedin.com/in/tan-france-3599b5172](https://www.linkedin.com/in/tan-france-3599b5172/) | [@tanfrance](https://www.instagram.com/tanfrance/) | Fashion Designer, Author, Queer Eye | `French Tuck`, `British baking`, `tailoring` |

---

## 🔬 Core Architectural Pillars

### 1. Multi-Tier Scraping Subsystem (`lib/scrape.js`)
Wingman extracts data without third-party leaks using a resilient three-tier strategy:
1. **Tier 1 (Apify Actors)**:
   - Instagram: `apify/instagram-profile-scraper` extracts bio, follower metrics, post captions, timestamps, locations, and HD image CDN links.
   - LinkedIn: `dev_fusion/linkedin-profile-scraper` extracts structured experience, education, skills, about summary, and recent updates.
2. **Tier 2 (Direct Public Endpoints & HTML Extraction)**:
   - Instagram: Queries the public `https://www.instagram.com/api/v1/users/web_profile_info/?username=${user}` endpoint with randomized browser signatures.
   - LinkedIn: Fetches the public vanity URL, parses embedded `application/ld+json` Schema.org graphs, and extracts OpenGraph metadata.
3. **Tier 3 (Submitter Profile Text)**:
   - When anti-bot authwalls block anonymous access, users can paste the visible text from the exact same profile URLs.

### 2. Strict Profile Reading Guardrails (`lib/analyze.js`)
The agent reading harness adheres to unbreakable rules:
- **Two Sources Only**: The agent is locked strictly to LinkedIn + Instagram. External Wikipedia articles or fame heuristics are forbidden.
- **Mandatory Evidence Citations**: Every single need, hobby, and interest must include a citation (`source: "linkedin" | "instagram" | "both"`) and verbatim evidence (e.g., *"3 of 12 posts are trail runs"*, *"headline: 'Founder @ ...'"*).
- **Prohibited Attributes**: The agent is strictly barred from inferring or storing religion, ethnicity, political affiliation, health conditions, or sexual orientation, and is strictly forbidden from rating physical appearance.
- **Multimodal Vision Integration**: Up to 6 recent Instagram photos are downloaded, normalized, and analyzed via Gemini 2.5 Flash vision to observe real hobbies, aesthetics, and lifestyle context.

### 3. Isolated LLM Context Dating Harness (`lib/dating.js`)
To simulate genuine first dates, Wingman uses strictly partitioned LLM sessions:
- **Private Knowledge**: Agent A only possesses Person A's full profile. It does not have access to Person B's internal profile.
- **Public Knowledge**: Agent A only receives Person B's public 80-word **Dating Card** (voice, interests, what they are looking for).
- **Three-Act Theatrical Progression**:
  - **Act I**: Icebreaking, venue reactions, light banter.
  - **Act II**: Deep values, career versus life balance, emotional needs, probing dealbreakers.
  - **Act III**: Honest wrap-up, mutual vibe reflection, and authentic farewell.

### 4. Scoring & Ranking Mathematical Model
Match scores are mathematically computed rather than hallucinated:

$$\text{Harmonic Match Score} = \text{round}\left(\frac{2 \times S_A \times S_B}{S_A + S_B}\right)$$

Where $S_A$ and $S_B$ are the independent overall scores (0–100) assigned by each agent during their private debrief.

For the per-person ranking leaderboards:
- **Dated Candidates**: 
  $$\text{Score} = \min(100, \text{round}(0.60 \times S_{\text{own}} + 0.40 \times S_{\text{other}} + \text{Bonus}))$$
  *(where $\text{Bonus} = 5$ if both agents mutually voted for a second date)*.
- **Undated Candidates**:
  $$\text{Score} = \text{round}\left(\frac{\text{Swipe}_{A \to B} + \text{Swipe}_{B \to A}}{2} \times 0.90\right)$$
  *(discounted by $10\%$ and explicitly marked as `predicted`)*.

---

## 🎨 Frontend & Real-Time SSE Feed

The front-end is a dependency-free SPA crafted with modern web design standards:
- **Real-Time Streaming**: Server-Sent Events (`/api/:space/events`) stream every message, typing indicator, swipe, and analysis event live to the DOM.
- **Interactive Fit Matrix**: A color-coded heatmap cross-referencing all 26 participants with clickable cells that jump directly to full transcripts.
- **Date Theatre**: A messaging interface complete with typing indicators, venue cards, and post-date debrief scorecards.
- **Zero-Build Architecture**: Vanilla ES modules, native CSS custom properties, and fluid typography (Outfit + Inter).

---

## 🔌 API & Event Stream Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/:space/state` | Returns space status, LLM brain info, all people summaries, and date summaries |
| `POST` | `/api/:space/people` | Enqueues a new person by LinkedIn + Instagram URL with consent |
| `POST` | `/api/:space/people/bulk` | Bulk imports one person per line (`linkedin_url instagram_url`) |
| `GET` | `/api/:space/people/:id` | Full profile analysis, cited evidence, Big-5 personality, and top matches |
| `POST` | `/api/:space/people/:id/match` | Runs a targeted dating round for a single person (swipes + 3 dates) |
| `POST` | `/api/:space/round` | Triggers a full dating round across all eligible pool candidates |
| `POST` | `/api/:space/dates` | Initiates an immediate date between Person A and Person B |
| `GET` | `/api/:space/dates/:id` | Returns complete multi-turn date transcript and debrief verdicts |
| `GET` | `/api/:space/rankings` | Returns calculated fit rankings for every analyzed person |
| `GET` | `/api/:space/events` | Live Server-Sent Events (SSE) feed (`date_msg`, `swipe`, `analysis`, `job`) |

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js 20.6+** (uses native `--env-file` support)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-username/wingman.git
cd wingman

# 2. Install dependencies (express)
npm install

# 3. Configure environment (optional, runs out of the box with heuristics)
cp .env.example .env

# 4. Start the application
npm start
```

Open your browser to:
- **Frozen Demo**: [`http://localhost:3000/?space=demo`](http://localhost:3000/?space=demo)
- **Live Playground**: [`http://localhost:3000/?space=live`](http://localhost:3000/?space=live)

### Environment Configuration (`.env`)
```ini
PORT=3000
LLM_PROVIDER=gemini           # 'gemini' | 'openai' | 'mock'
GEMINI_API_KEY=your_key_here  # Enables Gemini 2.5 Flash vision & dating
GEMINI_MODEL=gemini-2.5-flash
APIFY_TOKEN=your_token_here   # Enables automated scraping actors
ADMIN_KEY=your_secret_key     # Allows publishing snapshots to demo
```

---

## 🎥 3-Minute Video Walkthrough (`wingman_demo.mp4`)

> **File Location**: [`wingman_demo.mp4`](file:///c:/Users/harsh/OneDrive/Desktop/Wingman/wingman_demo.mp4) (Duration: **2:43** — strictly under the 3-minute limit, 1080p Full HD, 10.3 MB)

| Timestamp | Phase | What is Shown on Screen | Video Content & Voiceover Summary |
|-----------|-------|-------------------------|-----------------------------------|
| **0:00 - 0:04** | **Platform Intro** | Homepage Hero (`#/`) | Brief project title card: *"🪽 Wingman: The Agentic Dating Site. Each person is represented by an AI agent that dates on their behalf."* |
| **0:04 - 1:04** | **Part 1: Profile Pages First** | Profile Pages (`#/p/p_brian_chesky`, `#/p/p_whitney_wolfe_herd`, `#/people`) | **Brian Chesky & Whitney Wolfe Herd Deep Dive**: Exactly two official sources (LinkedIn + Public Instagram). Shows extracted needs with concrete evidence tags, hobbies, Big Five psychological traits, public dating card, and deep reading logs. Followed by the directory of **26 Real People**. |
| **1:04 - 1:49** | **Part 2: The Rankings** | Rankings (`#/rankings`, `#/rankings/p_brian_chesky`, `#/rankings/p_lex_fridman`) | **Who Fits Each Person Best**: The interactive 26×26 Fit Matrix Heatmap (676 candidate pairings). Deep dive into **Brian Chesky's ranked matches** (#1 Whitney Wolfe Herd at 97% mutual score) and **Lex Fridman's ranked matches** (#1 Payal Kadakia at 98%). Transparent formula breakdown. |
| **1:49 - 2:29** | **Part 3: Agents Dating On Their Behalf** | Date Theatre (`#/dates`, `#/d/d_brian_whitney`) | **Live 3-Act Date Simulation**: Continental Club patio venue selection, Act I arrival & icebreakers, Act II deep values & vulnerability probing, and confidential post-date debrief reports (6-metric radar, dealbreakers, mutual 2nd date: YES). |
| **2:29 - 2:43** | **Part 4: System Architecture & Ingestion** | Add Page (`#/add`) & Live Mode | **Dual Spaces & Live Ingestion**: Single and bulk profile ingestion via LinkedIn + Instagram handles, real-time scraping fallback pipeline, and live SSE event stream. Concluding summary. |


---

## 📄 License
MIT License. Built for the Agentic Dating Benchmark Challenge.
