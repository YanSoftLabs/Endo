# Vibe Coding Platform

AI-powered wirecoding platform that generates high-converting 3D landing pages.

## Setup

```bash
cd apps/builder
cp .env.example .env.local
# Add your OPENROUTER_API_KEY to .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features (Phase 1)

- 4-step business intake wizard
- OpenRouter AI pipeline (analyze → architect → assemble)
- User-selectable 3D styles: Full WebGL, Hybrid, CSS 3D
- Conversion sections: hero, testimonials, FAQ, pricing, blog, legal footer
- Split editor: chat + live preview
- Anonymous session persistence (SQLite)

## Environment

See `.env.example` for required variables.

Without `OPENROUTER_API_KEY`, the app uses local fallback templates (still generates a full site).

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/create` | Intake wizard |
| `/editor/[id]` | Chat + preview editor |
| `/preview/[id]` | Full-page preview |
