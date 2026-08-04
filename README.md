# PixelPlayground

A cozy lofi mini-game arcade for the browser - play, chill, and climb the leaderboards.

**[Live Demo](https://pixelplayground.shaikhaman.dev)**

## Features

- **Six games** — 2048, Wordle, Connect 4, Tic Tac Toe, Slide Puzzle, Color Memory
- **Guest-first auth** — play instantly, upgrade to an account later without losing stats
- **Leaderboards & streaks** — server-validated scores, daily Wordle streaks
- **Chill Mode** — lofi playlist, ambient sounds, wallpapers, and a Pomodoro timer
- **Offline-friendly** — games stay playable when the API is unreachable

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Zustand
- **Backend:** Hono on Cloudflare Workers, Cloudflare D1 (SQLite), Drizzle ORM, Zod
- **Auth:** JWT with PBKDF2 password hashing

## Local Setup

Requires Node 20+.

```bash
git clone https://github.com/ShaikhAman01/PixelPlayground.git
cd PixelPlayground

# Backend (terminal 1)
cd backend
npm install
echo 'JWT_SECRET="dev-only-secret-change-me"' > .dev.vars
npx wrangler d1 migrations apply DB --local
npm run dev        # → http://localhost:8787

# Frontend (terminal 2)
cd frontend
npm install
cp .env.local.example .env.local
npm run dev        # → http://localhost:3000
```

## Deployment

- **Backend:** `cd backend && npm run deploy` (create a D1 database, apply migrations with `--remote`, and set the `JWT_SECRET` secret first)
- **Frontend:** deploy `frontend/` to Vercel or Cloudflare Pages with `NEXT_PUBLIC_API_URL` pointing at the Worker

## License

[MIT](LICENSE) — music and wallpapers are CC0 / freely licensed, credited in-app.
