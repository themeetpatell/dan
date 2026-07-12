# Dan

Dan — the AI analyst for your business data. A Next.js (App Router) workspace that
answers business questions from connected sources, surfaces risks and opportunities
in a business feed, and produces dashboards, reports, and presentations as artifacts.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript
- A token-based design system (light/dark) in `src/app/globals.css`, `components.css`, `app.css`
- Chat backed by Anthropic or any OpenAI-compatible provider (`src/app/api/chat/route.ts`)

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in a provider key (see below)
npm run dev
```

Open http://localhost:3000.

## Environment

Configure one provider in `.env.local` (never commit this file):

```bash
# Option 1 — Anthropic (takes precedence when set)
ANTHROPIC_API_KEY=sk-ant-...

# Option 2 — any OpenAI-compatible API (Groq, OpenRouter, Zhipu, …)
LLM_API_KEY=...
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=moonshotai/kimi-k2-instruct-0905
```

With neither set, chat falls back to the built-in scripted demo replies.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — lint
