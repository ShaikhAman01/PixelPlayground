<div align="center">

# PixelPlayground

**A cozy lofi mini-game arcade for the browser.**

Play, chill, and climb the leaderboards — with lofi beats, ambient sounds, and a Pomodoro timer on the side.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Hono](https://img.shields.io/badge/Hono-Workers-E36002?logo=hono&logoColor=white)](https://hono.dev)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-D1-F38020?logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/d1/)
[![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg)](LICENSE)

**[Live Demo](https://pixelplayground.shaikhaman.dev)** · [Features](#-key-features) · [Setup](#-local-setup) · [Deployment](#-deployment)

</div>

---

## About

PixelPlayground is a full-stack arcade of six single-player mini-games wrapped in a warm, lofi aesthetic.
Scores sync to an edge backend with guest accounts, server-validated submissions, and per-game leaderboards — and everything degrades gracefully offline.

## Key Features

- **Six games** — 2048, Wordle, Connect 4, Tic Tac Toe, Slide Puzzle, Color Memory
- **Guest-first auth** — play instantly; upgrade to a real account later without losing stats
- **Leaderboards & streaks** — server-side validation, cheat-resistant scoring, daily Wordle streaks
- **Chill Mode** — lofi playlist, ambient sound mixer, wallpapers, and a Pomodoro timer
- **Offline-friendly** — games stay fully playable when the API is unreachable
- **Accessible** — keyboard navigation, visible focus rings, reduced-motion support
- **Fast** — per-game code splitting; each game ships in its own chunk

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling & Motion | Tailwind CSS 4, Framer Motion, Sonner |
| State | Zustand (with persistence) |
| Backend | Hono on Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) + Drizzle ORM |
| Auth | JWT + WebCrypto PBKDF2 password hashing |
| Validation | Zod (per-game score schemas) |

## Architecture

```
┌─────────────────┐      REST /api/v1       ┌──────────────────┐      ┌────────────┐
│   Next.js app   │ ──────────────────────▶ │  Hono Worker     │ ───▶ │  D1 (SQL)  │
│  (games, UI)    │   JWT auth · JSON       │  (edge runtime)  │      │  Drizzle   │
└─────────────────┘                         └──────────────────┘      └────────────┘
        │                                            │
   Zustand stores                          auth · scores · stats
   (offline fallback)                      leaderboards · rate limits
```

- The frontend never blocks on the network — scores submit fire-and-forget.
- The backend is the source of truth: plausibility bounds per game, streaks computed server-side.

## Project Structure

```
PixelPlayground/
├── frontend/               # Next.js app
│   └── src/
│       ├── app/            # Routes (home, game/[gameId], about…)
│       ├── components/     # Game, UI, auth, chill-mode components
│       ├── games/          # Game host + per-game dynamic imports
│       ├── store/          # Zustand stores (auth, audio, games)
│       └── lib/            # API client, score sync
└── backend/                # Cloudflare Worker
    ├── migrations/         # D1 SQL migrations (drizzle-kit)
    └── src/
        ├── db/             # Drizzle schema + client
        ├── routes/         # auth, users, scores, stats, leaderboard
        ├── services/       # Business logic
        └── middleware/     # JWT auth, rate limiting
```

## Local Setup

**Prerequisites:** Node 20+, npm

```bash
# 1. Clone
git clone https://github.com/ShaikhAman01/PixelPlayground.git
cd PixelPlayground

# 2. Backend (terminal 1)
cd backend
npm install
echo 'JWT_SECRET="dev-only-secret-change-me"' > .dev.vars
npx wrangler d1 migrations apply DB --local
npm run dev                        # → http://localhost:8787

# 3. Frontend (terminal 2)
cd frontend
npm install
cp .env.local.example .env.local
npm run dev                        # → http://localhost:3000
```

## Environment Variables

| Variable | Where | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `frontend/.env.local` | Backend base URL (default `http://localhost:8787`) |
| `JWT_SECRET` | `backend/.dev.vars` / Worker secret | Token signing key |
| `ALLOWED_ORIGIN` | `backend/wrangler.toml` | CORS origin for the frontend |

## Deployment

```bash
# Backend → Cloudflare Workers
cd backend
npx wrangler d1 create pixelplayground     # paste database_id into wrangler.toml
npx wrangler d1 migrations apply DB --remote
npx wrangler secret put JWT_SECRET         # set ALLOWED_ORIGIN in wrangler.toml
npm run deploy
```

Frontend → deploy `frontend/` to [Vercel](https://vercel.com) (or Cloudflare Pages) with `NEXT_PUBLIC_API_URL` pointing at the deployed Worker.

## 📄 License

[MIT](LICENSE) — game music and wallpapers are CC0 / freely licensed, credited in-app.

---

<div align="center">
Made with ☕ and lofi beats by <a href="https://github.com/ShaikhAman01">Shaikh Aman</a>
</div>
