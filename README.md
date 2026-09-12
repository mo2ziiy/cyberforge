# CyberForge

A free, open **cybersecurity knowledge platform** — tools, cheat sheets, roadmaps, labs, quizzes, writeups, certifications, a glossary, and news for every security domain.

Built with **Next.js (App Router)** and **Tailwind CSS**, shipped as a fully **static site** (no backend, no accounts, no database). Everything is driven by content files under `src/data/`, and global search runs entirely in the browser.

**Live:** https://mo2ziiy.github.io/cyberforge/

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Produces a static export in `out/`.

## Project structure

- `src/app/` — pages (tracks, tools, cheat sheets, roadmaps, labs, writeups, quiz, resources, news, glossary, certificates, search).
- `src/data/` — all content (the single source of truth for every section).
- `src/components/` — UI components.
- `src/lib/` — helpers, including `search.ts` (client-side global search).

## Deployment

Every push to `main` is built and deployed to GitHub Pages by
`.github/workflows/deploy.yml`. The production build uses a `/cyberforge`
base path (see `next.config.ts`).

---

Developed by [mo2ziiiy](https://mo2ziiy.github.io/mo2ziiiy/).
