# Dylan Albert — Digital Resume

## Project Overview
Interactive single-page web application serving as a living digital resume. Dark-themed, modern, built to showcase AI/cloud engineering experience more expressively than a traditional PDF.

## Design Decisions

### Architecture
- **Frontend-first for Phase 1:** Resume data lives in JSON files bundled with the React app. No backend calls needed until Phase 2 (AI chat feature).
- **FastAPI backend scaffolded but dormant in Phase 1:** Kept in repo so it's ready for Phase 2 without a rewrite.
- **Static JSON data layer:** All resume content (experience, skills, highlights, education) lives in `frontend/src/data/`. Easy to update without touching components.

### Tech Choices
- **React + Vite:** Fast dev server, modern ESM build tooling, no CRA bloat.
- **Tailwind CSS v3:** Utility-first dark theme. Custom color tokens defined in `tailwind.config.js`.
- **Framer Motion:** Scroll-triggered entrance animations and layout transitions.
- **FastAPI (Phase 2):** Chosen for Python alignment with Dylan's background; async, great for SSE streaming (needed for chat).

### Dark Theme
- Background: `#0a0a0f`
- Surface/Cards: `#111118` / `#1a1a24`
- Border: `#2a2a3a`
- Primary Accent: `#6366f1` (indigo)
- Secondary Accent: `#22d3ee` (cyan)
- Text Primary: `#f1f5f9`
- Text Secondary: `#94a3b8`
- Metric/Success: `#34d399` (emerald)
- Font: Inter (headings + body), JetBrains Mono (skill chips/code tags)

### Deployment Plan
- **Phase 1:** Vercel (frontend only, free tier). `vercel.json` config included.
- **Phase 2:** Add Railway backend ($5/mo hobby plan) for FastAPI + Redis.
- **Domain:** `dylanmalbert.dev` (to be acquired)

## Phase Roadmap
- **Phase 1 (current):** Static SPA — all sections, dark theme, animations, no backend calls
- **Phase 2:** AI chat widget ("ask Dylan's resume anything") — FastAPI + OpenAI Responses API + Redis rate limiting + SSE streaming

## Running Locally
```bash
# Frontend only (Phase 1)
cd frontend
npm install
npm run dev

# Full stack (Phase 2)
docker-compose up
```

## Content Updates
All resume content is in `frontend/src/data/`. Edit the JSON files to update experience, skills, highlights, or education. No component changes needed for content-only updates.
