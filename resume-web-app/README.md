# Dylan Albert — Digital Resume

An interactive, dark-themed single-page web application serving as a living digital resume. Built to showcase AI/cloud engineering experience more expressively than a static PDF — with scroll-triggered animations, a light/dark mode toggle, and a data-driven content layer that makes updates trivial.

**Live (Phase 1):** Deploy to Vercel in one click — `vercel.json` is already configured.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Sections & Components](#sections--components)
- [Data Layer](#data-layer)
- [Light / Dark Mode](#light--dark-mode)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

---

## Project Overview

**Phase 1 (current):** Fully static SPA. All resume content is bundled as JSON — no backend calls, no API keys required. The goal was to ship a polished, animated, mobile-responsive resume site quickly.

**Phase 2 (planned):** Add an AI chat widget ("ask Dylan's resume anything") powered by a FastAPI backend, OpenAI Responses API, Redis rate limiting, and SSE streaming. The backend scaffold is already in the repo so Phase 2 requires no structural rewrite.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| UI Framework | React 18 + Vite 5 | Fast HMR, modern ESM builds, no CRA bloat |
| Styling | Tailwind CSS v3 | Utility-first dark theme with custom design tokens |
| Animation | Framer Motion 11 | Scroll-triggered entrances and layout transitions |
| Icons | Lucide React | Consistent SVG icon set |
| Backend (Phase 2) | FastAPI (Python) | Async, Python-native, ideal for SSE streaming |
| Deployment | Vercel (frontend) | Zero-config static hosting with `vercel.json` |
| Phase 2 Hosting | Railway (backend) | $5/mo hobby plan for FastAPI + Redis |

---

## Architecture

```
dylan-resume/
├── frontend/          # React + Vite SPA (Phase 1 — ships standalone)
│   ├── src/
│   │   ├── data/      # JSON content files — edit these to update resume content
│   │   ├── components/ # One component per resume section
│   │   ├── context/   # ThemeContext (light/dark)
│   │   └── hooks/     # useInView (scroll detection), useCountUp (animated stats)
│   └── ...
├── backend/           # FastAPI scaffold (dormant in Phase 1, active in Phase 2)
│   ├── main.py        # App entry point, CORS, health endpoint
│   └── routers/       # resume.py — placeholder Phase 2 endpoints
├── docker-compose.yml # Full-stack local development (Phase 2)
└── vercel.json        # Vercel deploy config pointing to frontend/dist
```

**Key decision:** Resume data lives entirely in `frontend/src/data/` as JSON. Content updates (new jobs, skills, projects) require only editing JSON files — no component changes needed.

---

## Project Structure

```
frontend/src/
├── data/
│   ├── experience.json    # Work history with bullets and skill tags
│   ├── skills.json        # Skill categories with context tooltips
│   ├── highlights.json    # Key project highlight cards with metrics
│   └── education.json     # Degrees and certifications
├── components/
│   ├── Nav.jsx            # Sticky top nav with smooth scroll links + theme toggle
│   ├── Hero.jsx           # Full-viewport intro section
│   ├── About.jsx          # Bio, animated stat counters
│   ├── Experience.jsx     # Timeline of work history
│   ├── ExperienceCard.jsx # Individual role card with collapsible bullets
│   ├── Skills.jsx         # Skill grid by category
│   ├── SkillCategory.jsx  # Category group with hover-tooltip chips
│   ├── Highlights.jsx     # Featured project highlight cards
│   ├── HighlightCard.jsx  # Problem → Approach → Result layout
│   ├── Education.jsx      # Education section
│   ├── Contact.jsx        # Contact links and CTA
│   └── StatCounter.jsx    # Animated count-up number display
├── context/
│   └── ThemeContext.jsx   # Dark/light mode state, persisted to localStorage
└── hooks/
    ├── useInView.js       # IntersectionObserver hook for scroll animations
    └── useCountUp.js      # Animates a number from 0 to target on scroll entry
```

---

## Design System

All color tokens are defined in `tailwind.config.js` under `theme.extend.colors`:

| Token | Value | Usage |
|---|---|---|
| `bg` | `#0a0a0f` | Page background (dark) |
| `surface` | `#111118` | Card backgrounds |
| `surface-2` | `#1a1a24` | Elevated card surfaces |
| `border` | `#2a2a3a` | Dividers and card borders |
| `accent` | `#6366f1` | Primary CTA, links, active states (indigo) |
| `accent-2` | `#22d3ee` | Secondary highlights (cyan) |
| `text-primary` | `#f1f5f9` | Main body text |
| `text-secondary` | `#94a3b8` | Muted labels, metadata |
| `metric` | `#34d399` | Success metrics, stat counters (emerald) |

**Typography:**
- Headings + Body: **Inter**
- Skill chips / code tags: **JetBrains Mono**

Both fonts are loaded via Google Fonts in `frontend/index.html`.

---

## Sections & Components

### Hero
Full-viewport opening section with name, title, and a brief one-liner. Framer Motion entrance animation on load.

### About
Bio paragraph with three animated stat counters (years of experience, projects shipped, etc.) that count up from zero when scrolled into view. Stats are powered by `useCountUp` + `useInView` hooks.

### Experience
Chronological timeline driven entirely by `experience.json`. Each role renders as an `ExperienceCard` with:
- Title, company, team, period, location
- Summary line
- Bullet points (expandable)
- Skill tag chips

### Skills
Five skill categories rendered as grids of chips. Each chip has a `context` tooltip (defined in `skills.json`) that shows on hover — explaining *where* and *how* the skill was applied, not just that it exists.

Categories: AI / LLM Engineering · Cloud & Infrastructure · Backend Development · DevOps & Tooling · Observability & Evaluation

### Highlights
Four feature cards showcasing the highest-impact projects from Oracle:
1. **RAG Accuracy Overhaul** — +30% answer correctness (50% → 80%)
2. **Knowledge Management AI App** — Solo-built, shipped to production customer portal
3. **RAG Evaluation Framework** — 5-dimension golden-dataset testing (relevancy, correctness, completeness, faithfulness, hallucination rate)
4. **Custom Open Web UI Deployment** — Multi-business-unit internal AI platform

Each card follows a **Problem → Approach → Result** layout with a headline metric.

### Education
Degree and institution information from `education.json`.

### Contact
Links to email, LinkedIn, and GitHub with a call-to-action.

---

## Data Layer

All resume content lives in `frontend/src/data/`. To update content, edit the JSON files — no component code needs to change.

### `experience.json`
Array of role objects:
```json
{
  "id": "oracle-ai",
  "title": "Cloud Software Developer",
  "company": "Oracle",
  "team": "Data Intelligence Services — AI Services Team",
  "period": "Oct 2024 – Mar 2026",
  "location": "Remote",
  "current": false,
  "summary": "...",
  "bullets": ["..."],
  "tags": ["RAG", "LLM Evaluation", "Python", "FastAPI"]
}
```

### `skills.json`
Array of category objects, each with a `skills` array:
```json
{
  "category": "AI / LLM Engineering",
  "icon": "Brain",
  "skills": [
    { "name": "RAG Pipelines & Architecture", "context": "Tooltip text shown on hover" }
  ]
}
```
Icons map to Lucide React icon names.

### `highlights.json`
Array of highlight card objects:
```json
{
  "id": "rag-accuracy",
  "title": "RAG Accuracy Overhaul",
  "metric": "+30%",
  "metricLabel": "Answer Correctness",
  "icon": "TrendingUp",
  "problem": "...",
  "approach": "...",
  "result": "..."
}
```

### `education.json`
Array of education entries (degree, institution, year, notes).

---

## Light / Dark Mode

Implemented via `ThemeContext` (`frontend/src/context/ThemeContext.jsx`):

- **Default:** Dark mode
- **Persistence:** User preference saved to `localStorage` under key `theme`
- **Mechanism:** Toggles the `dark` class on `<html>` — Tailwind's `darkMode: 'class'` strategy
- **Toggle UI:** Sun/moon icon button in the Nav

The theme toggle is accessible via the sticky navigation bar on every scroll position.

---

## Running Locally

### Phase 1 — Frontend only (recommended)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Phase 2 — Full stack (when backend is active)

```bash
docker-compose up
# Frontend → http://localhost:5173
# Backend  → http://localhost:8000
# API docs → http://localhost:8000/docs
```

### Available frontend scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `frontend/dist/` |
| `npm run preview` | Preview production build locally |

---

## Deployment

### Vercel (Phase 1)

`vercel.json` at the repo root configures the build:
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": null
}
```

Deploy via Vercel CLI or connect the GitHub repo in the Vercel dashboard. No environment variables required for Phase 1.

### Phase 2 Architecture (planned)

| Service | Platform | Cost |
|---|---|---|
| Frontend | Vercel | Free |
| FastAPI backend | Railway | ~$5/mo |
| Redis (rate limiting) | Railway | ~$5/mo |

**Planned domain:** `dylanmalbert.dev`

---

## Roadmap

### Phase 1 — Complete
- [x] Full SPA with all resume sections
- [x] Dark theme with custom Tailwind design tokens
- [x] Light/dark mode toggle with localStorage persistence
- [x] Scroll-triggered Framer Motion animations
- [x] Animated stat counters (useCountUp + useInView)
- [x] JSON data layer — content updates without code changes
- [x] Profile photo in Hero
- [x] Highlight cards with Problem → Approach → Result layout
- [x] Skill chips with hover context tooltips
- [x] Vercel deploy configuration

### Phase 2 — Planned
- [ ] AI chat widget: "Ask Dylan's resume anything"
- [ ] FastAPI backend with OpenAI Responses API integration
- [ ] SSE streaming for real-time chat responses
- [ ] Redis rate limiting
- [ ] Custom domain (`dylanmalbert.dev`)
