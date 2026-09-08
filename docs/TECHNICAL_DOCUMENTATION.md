# PixelPlayground — Technical Documentation

> **Purpose:** Developer documentation. This explains what was built, **why each decision was made**, and the trade-offs involved — not a file-by-file reference.
>
> **Live:** https://pixelplayground.shaikhaman.in · **Repo:** https://github.com/ShaikhAman01/PixelPlayground

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Authentication Flow](#5-authentication-flow)
6. [Database Schema](#6-database-schema)
7. [API Documentation](#7-api-documentation)
8. [Leaderboard System](#8-leaderboard-system)
9. [Score Validation](#9-score-validation)
10. [Game Persistence](#10-game-persistence)
11. [State Management](#11-state-management)
12. [Folder Structure](#12-folder-structure)
13. [Deployment](#13-deployment)
14. [Security Considerations](#14-security-considerations)
15. [Performance Optimizations](#15-performance-optimizations)
16. [Challenges Faced](#16-challenges-faced)
17. [Design Decisions](#17-design-decisions)
18. [Future Improvements](#18-future-improvements)

---

## 1. Project Overview

### What it is

PixelPlayground is a browser arcade of **six single-player mini-games** — 2048, Wordle, Connect 4, Tic Tac Toe, Slide Puzzle, and Color Memory — wrapped in a cozy "lofi" aesthetic. Alongside the games there is a **Chill Mode**: a lofi music player, an ambient sound mixer (rain, fireplace, café…), switchable wallpapers, and a Pomodoro timer.

### What makes it more than a games demo

The games are the visible surface. The engineering substance is underneath:

- A real **edge backend** (Cloudflare Workers) with a real database (D1/SQLite).
- **Guest-first authentication**: you can play instantly with zero friction, and later upgrade to a username/password account **without losing your stats**.
- **Server-authoritative scoring**: the server validates every score submission, computes Wordle streaks itself, and builds leaderboards from aggregate stats.
- **Offline resilience**: if the API is down, every game still works. Persistence is a layer on top of the game, never a dependency of it.

### In one paragraph

PixelPlayground is a full-stack mini-game arcade running on Cloudflare's edge. The interesting parts are guest-to-registered account migration that preserves stats, server-side score validation with per-game plausibility rules, cheat-resistant daily streaks for Wordle, and per-game code splitting so each game loads in its own chunk. The frontend never blocks on the network — the backend is a sync layer, not a requirement.

---

## 2. Architecture

### The big picture

```
┌──────────────────┐        HTTPS / JSON        ┌───────────────────┐       ┌─────────────┐
│    Next.js 16    │ ─────────────────────────▶ │    Hono Worker    │ ────▶ │ Cloudflare  │
│  React 19 + TS   │    REST /api/v1 + JWT      │ (Cloudflare edge) │       │ D1 (SQLite) │
│  Zustand stores  │ ◀───────────────────────── │  Zod validation   │ ◀──── │ Drizzle ORM │
└──────────────────┘                            └───────────────────┘       └─────────────┘
      │                                                  │
  localStorage                                  auth · scores · stats
  (offline source of truth)                     leaderboards · rate limiting
```

Two independent apps in one repo:

| App | Runs on | Responsibility |
| --- | --- | --- |
| `frontend/` | Vercel (Node/static) | All game logic, UI, local persistence |
| `backend/` | Cloudflare Workers (V8 isolates) | Identity, score validation, stats, leaderboards |

### The one principle that shapes everything

**The game never waits for the server.** Every game is fully playable offline. Score submission is *fire-and-forget*: when a game ends, the client sends the result and immediately moves on. If the request fails, the player loses nothing — local state (best scores, streaks) is kept in localStorage as a fallback.

**Why this matters:** it forces thinking about failure modes. Most apps like this break when the backend is down; this one degrades to exactly what it would be as a purely client-side app.

### Why an edge backend at all?

- Games are latency-sensitive to *feel*, and the audience is global. Workers run in 300+ locations, so the API responds from near the player.
- Workers + D1 have generous free tiers — a portfolio project should cost ~$0 to run.
- The constraint (no Node.js APIs, strict CPU limits) forced interesting engineering decisions (see PBKDF2 story in [Challenges](#16-challenges-faced)).

---

## 3. Frontend Architecture

### Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Zustand · Framer Motion · Sonner (toasts).

### Route structure

| Route | Type | What it does |
| --- | --- | --- |
| `/` | Static | Home: grid of six `GameCard`s + Chill Mode |
| `/game/[gameId]` | Dynamic | Validates the slug server-side, renders the game |
| `/about`, `/privacy`, `/terms` | Static | Info pages |

### Layered component design

```
app/layout.tsx
 ├─ SessionBootstrap   → creates/restores the session silently on load
 ├─ MotionProvider     → MotionConfig reducedMotion="user" (accessibility)
 ├─ ThemedToaster      → custom lofi-styled Sonner toasts
 └─ page
     └─ GameHost (client, dynamic imports)
         └─ GameShell (shared frame: title, controls, difficulty, leaderboard)
             └─ <Game/> (WordleGame, Game2048, …)
```

**`GameShell` is the key reuse decision.** All six games share one frame that provides the title bar, restart/new-game buttons, difficulty dropdown, status display, and the leaderboard panel. Each game only implements its board and rules. Adding a seventh game means writing the board, registering a slug, and adding a dynamic import — the shell, persistence, and leaderboard come for free.

### Code splitting (the headline frontend decision)

The route `/game/[gameId]` is one Next.js route serving six games. Naively importing all six components meant **every player downloaded every game** — including Wordle's 14,907-word dictionary — even to play Tic Tac Toe.

The fix has two parts:

1. **`games/gameIds.ts`** — a tiny server-safe list of valid slugs. The server component uses it to `notFound()` bad URLs without touching any game code.
2. **`games/GameHost.tsx`** — a client component where each game is a `next/dynamic` import with a themed loading placeholder.

Result: each game is its own chunk (~24–44 KB), and the Wordle dictionary sits in a separate **124 KB chunk that only loads on the Wordle page**.

**Why two files?** A React Server Component cannot read values out of a `"use client"` module (client module exports become opaque references). So slug validation data had to live in a module with no client dependency — a subtle but real App Router boundary.

### Accessibility (quick hits worth mentioning)

- Global `:focus-visible` ring (violet, theme-aware) — keyboard users can always see where they are.
- `prefers-reduced-motion` respected twice: `MotionConfig reducedMotion="user"` for Framer Motion, plus a CSS media query that disables decorative CSS animations.
- Wordle's on-screen keys are min 44px tall (touch target guideline) and show per-letter state (green/amber/grey).
- The difficulty dropdown closes on outside-click and Escape, and carries `role="menu"` / `aria-expanded` / `aria-current`.

---

## 4. Backend Architecture

### Stack

Hono (web framework) · Cloudflare Workers (runtime) · D1 (SQLite at the edge) · Drizzle ORM · Zod (validation) · `hono/jwt` (tokens).

### Why each piece

| Choice | Why |
| --- | --- |
| **Hono** | Express-like ergonomics but built for Workers: tiny, fast, first-class TypeScript, ships its own JWT middleware. |
| **D1** | Real SQL (joins, unique indexes, transactions) with zero infrastructure. Leaderboards are relational queries — a KV store would have made them painful. |
| **Drizzle** | Types flow from the schema definition to every query. `drizzle-kit` generates SQL migrations from the schema, so schema and DB can't drift. Very thin — you can read the SQL it produces. |
| **Zod** | Every request body is parsed with `safeParse` → invalid input becomes a clean `400`, never a `500`. |

### Layered structure (simple, not "enterprise")

```
routes/       → URL + middleware wiring (auth required? rate limited?)
controllers/  → parse request, call service, shape the response envelope
services/     → all business logic (auth rules, streaks, leaderboard math)
db/           → Drizzle schema + client factory
middleware/   → JWT verification, rate limiting
schemas/      → Zod request schemas
lib/          → password hashing, per-game rules/constants
```

**Why bother with layers in a small app?** One honest answer for interviews: the *logic* lives in services that take a DB handle and plain data — no HTTP objects. That makes the interesting code (streak computation, leaderboard ranking) unit-testable without spinning up a server, and it keeps controllers boring.

### Response envelope

Every endpoint returns the same shape:

```json
{ "success": true,  "data": { ... } }
{ "success": false, "error": { "message": "..." } }
```

The frontend API client unwraps this once, so components never see raw HTTP details.

---

## 5. Authentication Flow

### The design goal

**Nobody should ever see a login wall in an arcade.** So identity is built in two tiers:

1. **Guest (automatic).** On first visit the frontend silently calls `POST /auth/guest`. The server creates a real user row with a generated name like *"Cozy Fox 3921"*, `is_guest = true`, no password — and returns a JWT. The player never notices.
2. **Account (opt-in).** Later, the player can pick a username + password. `POST /auth/upgrade` sets credentials **on the same user row** and flips `is_guest` to false. Because the user ID never changes, every score, stat, and streak carries over automatically. No data migration needed — that's the elegance worth pointing out.

### Flow diagram

```
First visit                     Later visits                  Upgrade
───────────                     ────────────                  ───────
load app                        load app                      user picks name+password
  │                               │                             │
POST /auth/guest                GET /auth/me (stored JWT)     POST /auth/upgrade (JWT)
  │                               │                             │
JWT (30d) + guest user          200 → continue                same row: +password_hash,
stored in localStorage          401 → new guest session       is_guest=false, new JWT
                                network fail → offline mode   stats untouched ✓
```

### Token details

- **JWT, HS256, 30-day expiry**, signed with `JWT_SECRET` (a Worker secret, never in the repo — locally it lives in gitignored `.dev.vars`).
- Payload: user ID + expiry. Verified by middleware on protected routes; invalid/missing token → `401`.
- **Why JWT and not sessions?** Workers are stateless isolates across hundreds of locations. A server-side session store would need a DB read on every request; a signed token needs none. For this threat model (game scores, no payments/PII), 30-day non-revocable tokens are a reasonable trade — and I can name the trade-off: instant revocation would need a denylist or short-lived tokens with refresh.

### Password hashing

bcrypt is the "default answer" for passwords, but **bcryptjs blows through the Workers CPU budget** — it's pure JS doing heavy math in a runtime designed for requests that finish in milliseconds.

The fix: **PBKDF2 via the WebCrypto API** (`crypto.subtle.deriveBits`), which Workers implement natively (the hashing runs in optimized native code, not JS):

- SHA-256, **100,000 iterations**, 16-byte random salt.
- Stored as a self-describing string: `pbkdf2$100000$<salt-b64>$<hash-b64>` — the iteration count is stored *with* the hash, so it can be raised later without breaking existing users.
- Verification uses a **constant-time comparison** (XOR-accumulate over all bytes) to avoid timing side channels.

### Other auth details worth knowing

- Usernames are **case-insensitively unique** (`COLLATE NOCASE` unique index) — "Aman" and "aman" can't coexist. Login lookup uses the same collation.
- Guest creation retries up to 5 times on a name collision.
- Rename (`PATCH /users/me`) re-issues a fresh JWT so the client's token always matches current identity.
- Login failure is a generic `401` — it never reveals whether the username or the password was wrong.

---

## 6. Database Schema

Three tables. Deliberately minimal.

### `users`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | text (UUID) PK | Generated server-side; never changes across guest→account upgrade |
| `username` | text, **unique COLLATE NOCASE** | Display name and login handle |
| `password_hash` | text, **nullable** | `NULL` = guest. One nullable column instead of a separate guests table |
| `is_guest` | boolean | Shown on leaderboards (guests get a subtle marker) |
| `created_at` | integer (ms epoch) | |

### `scores` — append-only history

| Column | Type | Notes |
| --- | --- | --- |
| `id` | integer PK autoincrement | |
| `user_id` | text FK → users, **ON DELETE CASCADE** | |
| `game_id` | text | e.g. `"wordle"` |
| `outcome` | text | `win` / `loss` / `draw` / `completed` |
| `score`, `time_secs`, `moves`, `difficulty` | mixed, mostly nullable | Only the fields that game uses |
| `created_at` | integer (ms epoch) | |

### `game_stats` — one row per (user, game), the "hot" table

| Column | Notes |
| --- | --- |
| `user_id` + `game_id` | **Composite primary key** |
| `plays`, `wins`, `losses`, `draws` | Running counters |
| `best_score`, `best_time_secs`, `best_moves` | Nullable — `NULL` means "never set" |
| `current_streak`, `best_streak` | Wordle daily streaks (server-computed) |
| `last_played_day` | `YYYY-MM-DD`; powers streak logic + same-day resubmit protection |
| `updated_at` | Also used as the leaderboard tie-breaker |

### The key schema decision: history vs. aggregates

Every submission does two writes: **append** to `scores` (immutable log) and **upsert** into `game_stats` (via `INSERT … ON CONFLICT DO UPDATE` on the composite key).

**Why both?**
- Leaderboards and profile panels only ever read `game_stats` — one small indexed table, no `GROUP BY` over a growing log.
- `scores` keeps raw history cheaply (recent-games list now; charts or anomaly detection later).

This is the classic *write-time aggregation* pattern: pay a tiny extra cost on write (rare) to make reads (frequent) trivial.

**One honest migration detail:** drizzle-kit cannot express `COLLATE NOCASE` on an index, so the generated migration was hand-patched with a comment explaining why. Real-world ORMs have gaps; the migration documents this one instead of hiding it.

---

## 7. API Documentation

Base path: `/api/v1`. Auth = `Authorization: Bearer <jwt>`.

### Auth

| Method & path | Auth | Rate limit | Purpose |
| --- | --- | --- | --- |
| `POST /auth/guest` | — | 10/min | Create guest user, return JWT + user |
| `POST /auth/signup` | — | 10/min | Create full account |
| `POST /auth/login` | — | 15/min | Verify credentials, return JWT + user |
| `POST /auth/upgrade` | ✅ (guest) | — | Add username+password to the guest row, keep stats |
| `GET /auth/me` | ✅ | — | Current user (session restore on page load) |

### Users

| Method & path | Auth | Purpose |
| --- | --- | --- |
| `PATCH /users/me` | ✅ | Rename; re-issues JWT |

### Scores & stats

| Method & path | Auth | Purpose |
| --- | --- | --- |
| `POST /scores` | ✅ | Submit a finished game (discriminated union payload, see §9). Returns updated stats + `newBest` flag |
| `GET /scores/me?gameId=&limit=` | ✅ | Recent score history |
| `GET /stats/me` | ✅ | All `game_stats` rows for the caller |

### Leaderboard

| Method & path | Auth | Purpose |
| --- | --- | --- |
| `GET /leaderboard/:gameId?limit=` | optional | Top N + caller's own rank if authenticated (even outside top N) |

### Example: submit a Wordle result

```http
POST /api/v1/scores
Authorization: Bearer <jwt>

{ "gameId": "wordle", "outcome": "win", "guesses": 4, "day": "2026-07-05" }
```

```json
{
  "success": true,
  "data": {
    "stats": { "plays": 12, "wins": 9, "currentStreak": 5, "bestStreak": 7, "...": "..." },
    "newBest": false
  }
}
```

**Conventions:** consistent envelope; Zod `safeParse` → `400` with message; missing/bad token → `401`; unknown game → `404`; rate limited → `429`. CORS is locked to a single configured origin.

---

## 8. Leaderboard System

### Each game ranks by a different metric

| Game | Metric | Direction | Why |
| --- | --- | --- | --- |
| 2048 | `best_score` | high wins | Natural score chase |
| Color Memory | `best_score` (level) | high wins | Furthest level reached |
| Slide Puzzle | `best_time_secs` | **low wins** | Speedrun-style |
| Wordle | `best_streak` | high wins | Consistency > one lucky guess |
| Tic Tac Toe / Connect 4 | `wins` vs CPU | high wins | Only sensible metric vs. AI |

A small config map (`LEADERBOARD_METRICS`) holds `{ column, direction }` per game — one generic query serves all six games. Adding a game = one config line.

### How the query works (all against `game_stats`)

1. **Qualification filter** — `NULL` bests and zero wins/streaks are "hasn't set a score yet", not rank material. Without this, time-ascending boards would be topped by empty rows.
2. **Order** by the metric, **tie-break by `updated_at` ascending** — whoever reached the value *first* ranks higher. Deterministic and fair.
3. **Top N** (default 5 in the UI).
4. **"You" row** — if the caller isn't in the top N, one `COUNT(*)` of rows strictly better than theirs gives their exact rank (`count + 1`). That's O(1) queries, not a scan of all ranks.

### Why leaderboards read `game_stats` and never `scores`

Ranking from raw history would need "best per user" (`GROUP BY user_id + MAX(...)`) over an ever-growing table on **every leaderboard view**. Because bests are maintained at write time, the leaderboard is a simple indexed `ORDER BY … LIMIT N`. Same answer, a fraction of the cost.

### UI behavior

The `LeaderboardPanel` in each game's shell shows top 5 + a highlighted "(you)" row. It has three derived states — loading skeleton, ready, and a friendly offline state — and refetches whenever the local `statsVersion` counter bumps (i.e., right after your own submission succeeds), so your new rank appears without a page refresh.

---

## 9. Score Validation

### Threat model — be honest about it

This is a single-player game where the **client computes the result**. Without replaying every move server-side, perfect anti-cheat is impossible. So the goal is honest and proportionate:

> Make cheating require *deliberate effort* (crafting API calls), keep obviously impossible values out of the leaderboard, and structurally prevent the *accidental* exploits (double-submits, streak farming).

The code says so in a comment: *"These are sanity gates, not anti-cheat."* The trade-off is documented rather than hidden.

### Layer 1 — shape validation (Zod discriminated union)

One schema, discriminated on `gameId`, so each game has its own required fields and **plausibility bounds**:

| Game | Rules enforced |
| --- | --- |
| Tic Tac Toe | outcome ∈ {win, loss, draw}; moves 3–9 (can't win in fewer than 3) |
| Connect 4 | moves 7–42 (7 = fastest possible win; 42 = full board) |
| 2048 | score 4 – 4,000,000 (beyond theoretical reach) |
| Wordle | guesses 1–6; `day` must match `YYYY-MM-DD` |
| Color Memory | level 1–200 |
| Slide Puzzle | time 1s–24h; moves 1–10,000 |

A payload claiming a 2-move Tic Tac Toe win or a 50-guess Wordle is rejected with a `400` before any business logic runs. The discriminated union also gives full TypeScript narrowing — after parsing, `payload.guesses` only exists when `gameId === "wordle"`.

### Layer 2 — semantic rules in the service

- **Wordle same-day resubmission:** if `last_played_day` equals the submitted day, the row is logged to history but **plays and streaks don't move**. Refreshing and resubmitting today's win cannot farm streaks.
- **Streaks are never client-supplied.** The client sends only outcome + day; the server derives the streak (see §10).
- **Bests only move in the right direction** — a lower 2048 score or slower puzzle time never overwrites your best.

### Layer 3 — structural protections

- Auth required — every score is tied to a real user row.
- Server-side timestamps — clients cannot backdate.
- Bounded rate limiting on auth endpoints chokes bulk account creation.

---

## 10. Game Persistence

### Two layers, by design

| Layer | Where | What | Why |
| --- | --- | --- | --- |
| Local | localStorage via Zustand `persist` | 2048 best score, audio prefs, wallpaper choice, session token | Instant, works offline, survives refresh |
| Server | D1 via `POST /scores` | History, aggregate stats, streaks, leaderboards | Cross-device, comparable, tamper-resistant |

Local is the **experience** layer; the server is the **record** layer. Neither blocks the other.

### When each game submits

Each game calls one shared `submitScore(payload)` helper at its natural end — and only then:

| Game | Trigger | Payload |
| --- | --- | --- |
| 2048 | Board dead (game over) | final score |
| Wordle | Word solved or 6 guesses used | win/loss + guess count + local day |
| Slide Puzzle | Puzzle solved | seconds + moves |
| Color Memory | Sequence failed | level reached |
| TTT / Connect 4 | Round ends | win/loss/draw + difficulty + moves |

### Fire-and-forget, with feedback

`submitScore` never throws into the game. On success it bumps a `statsVersion` counter (leaderboard panels re-fetch) and, if the server says `newBest: true`, shows a small 🏆 toast. On failure it fails silently — the game already gave its own feedback, and local bests are safe.

**Why silent failure?** An error toast for a background sync the player never asked for is noise. The philosophy: *persistence problems are never the player's problem.*

### The double-submission bug

Tic Tac Toe and Connect 4 share a Zustand store, but each mount creates a fresh game engine. Navigating away mid-game and returning could leave **stale store state pointing at a fresh engine**, which could re-fire the game-end effect and submit the same result twice. Two fixes: store reset in the unmount cleanup, plus a guard that only submits when *the engine itself* (not just the store) reports a finished game. Lesson learned: *when state lives in two places, transitions must be validated against the source of truth, not the mirror.*

---

## 11. State Management

### Why Zustand (and not Redux or Context)

- ~1 KB, no providers, no boilerplate — a store is a plain hook.
- Components subscribe to **slices**, so a volume change doesn't re-render a game board.
- Plain Context would re-render every consumer on any change; Redux's ceremony buys nothing at this scale. Global client state here is small and well-bounded — Zustand matches the size of the problem.

### The stores

| Store | Persisted? | Holds |
| --- | --- | --- |
| `auth.store` | token + user only | Session status: `loading / ready / offline` |
| `audio.store` | volume, track index | Playlist position, play state |
| `game2048.store` | best score only | Board, score |
| solo-games store | no | TTT/Connect4 round state |
| `useStatsSync` | no | `statsVersion` counter that triggers leaderboard refetches |

### Three persistence details worth mentioning

1. **`partialize`** — only fields that *should* survive a refresh are persisted. The 2048 board state, `isPlaying`, and session status stay ephemeral; persisting them causes weird resurrection bugs.
2. **`version` + `migrate`** — the audio store clamps a persisted `trackIndex` that may point past the end after a playlist edit. Persisted state is a *schema*, and schemas need migrations.
3. **Idempotent session bootstrap** — `ensureSession()` stores its in-flight promise in a module-level variable, so React 19 double-effects or multiple callers can never create two guest accounts. Token present → validate via `/auth/me`; absent/invalid → silent guest creation; network down → `offline` status that the UI (profile menu, leaderboards) renders gracefully with a retry.

### Server state

Deliberately **no React Query/SWR** — server data here is a handful of simple fetches (leaderboard, stats) with one invalidation trigger (`statsVersion` after submission). A caching library would be another dependency solving a problem this app doesn't have. Right-sizing dependencies is itself a design decision.

---

## 12. Folder Structure

```
PixelPlayground/
├── frontend/
│   └── src/
│       ├── app/                    # Routes: /, /game/[gameId], /about, …
│       ├── components/
│       │   ├── game/               # GameShell + the six games + LeaderboardPanel
│       │   ├── auth/               # ProfileMenu (login/signup/rename UI)
│       │   ├── chill/              # ChillDashboard (music, ambient, pomodoro)
│       │   ├── music/              # Audio player + credits modal
│       │   ├── layout/             # TopBar, nav
│       │   └── providers/          # SessionBootstrap, MotionProvider, ThemedToaster
│       ├── games/                  # GameHost (dynamic imports) + gameIds (server-safe)
│       ├── store/                  # Zustand stores
│       ├── lib/                    # api.ts (typed client), scoreSync.ts
│       └── data/                   # Wordle word list, wallpaper catalog
└── backend/
    ├── migrations/                 # Generated SQL migrations (drizzle-kit)
    └── src/
        ├── index.ts                # Hono app: CORS + route mounting
        ├── routes/                 # auth, users, scores, stats, leaderboard
        ├── controllers/            # request/response shaping
        ├── services/               # business logic (auth, scores)
        ├── db/                     # schema.ts + client.ts
        ├── middleware/             # JWT auth, rate limit
        ├── schemas/                # Zod request schemas
        └── lib/                    # password.ts, gameRules.ts
```

**Organizing principle:** frontend by *feature* (all Wordle code sits together), backend by *layer* (routes → controllers → services). Each is the natural shape for its kind of codebase.

---

## 13. Deployment

### Backend → Cloudflare Workers

```bash
cd backend
npx wrangler d1 create pixelplayground      # paste database_id into wrangler.toml
npx wrangler d1 migrations apply DB --remote
npx wrangler secret put JWT_SECRET          # encrypted secret, never in the repo
npm run deploy                              # wrangler deploy --minify
```

### Frontend → Vercel

Point Vercel at `frontend/` with one env var: `NEXT_PUBLIC_API_URL` = the deployed Worker URL. On the Worker side, set `ALLOWED_ORIGIN` to the frontend's production URL so CORS locks to it.

### Environments in one table

| Concern | Local | Production |
| --- | --- | --- |
| Database | miniflare's local SQLite (via `wrangler dev`) | real D1 |
| `JWT_SECRET` | gitignored `.dev.vars` | `wrangler secret put` |
| Migrations | `apply DB --local` | `apply DB --remote` |
| CORS origin | `http://localhost:3000` | production domain |

**Worth mentioning:** local dev runs the *actual Workers runtime* (workerd) with a local D1 — not a Node simulation. What runs locally is what runs in production, including migrations, which are plain versioned SQL files applied by wrangler.

---

## 14. Security Considerations

Guiding principle: security scoped to the actual threat model — *a game leaderboard, not a bank.*

| Area | What's done | The honest caveat |
| --- | --- | --- |
| Passwords | PBKDF2-SHA256, 100k iterations, per-user salt, constant-time compare, self-describing hash format | Iterations can be raised later thanks to the stored count |
| Tokens | HS256 JWT, 30-day expiry, secret only in Worker secrets / gitignored `.dev.vars` | No revocation list — a stolen token is valid until expiry. Fine for scores; wrong for payments |
| Input | Zod `safeParse` on every body; per-game bounds; invalid → 400 | Plausibility gates, not proof of play |
| SQL injection | Impossible by construction — Drizzle parameterizes everything; zero string-built SQL | |
| CORS | Locked to one configured origin | Doesn't stop non-browser clients (nothing does) |
| Rate limiting | Fixed-window counters on auth endpoints (10–15/min) | **In-memory per isolate** — resets on cold start, not shared across locations. The code comments say exactly this. Production-grade would use Durable Objects or Cloudflare's rate-limit rules |
| Enumeration | Login errors don't reveal which field was wrong | |
| Data minimization | No email, no PII — just a username and a hash. Cascade delete wipes a user's data with the row | Best breach protection is not holding data |
| Secrets hygiene | A dev secret that leaked into generated build artifacts was caught and rotated during development | Good story: check what your *build output* contains, not just your source |

---

## 15. Performance Optimizations

### 1. Per-game code splitting (biggest win)

- Before: one route bundle carrying all six games, including a **14,907-word** Wordle dictionary, shipped to everyone.
- After: `next/dynamic` per game → each game is a ~24–44 KB chunk; the dictionary is a **124 KB chunk fetched only on the Wordle page**.

### 2. Backend query design

- Leaderboards/stats read the pre-aggregated `game_stats` table — `ORDER BY + LIMIT` on indexed columns, never `GROUP BY` over history.
- Caller's rank = one `COUNT(*)`, not a ranked scan.
- Upserts via `ON CONFLICT DO UPDATE` — one statement, no read-modify-write race.

### 3. Asset discipline

- Wallpapers: reviewed, cropped, recompressed — each ~350–725 KB at 2000px.
- Music: CC0 tracks re-encoded from 320 kbps to ~165 kbps VBR — roughly half the bytes, no audible loss for lofi.
- Removed a 13.7-minute audio outlier and every unused asset.

### 4. Dependency diet

Frontend runtime deps cut **13 → 7** (removed unused `radix-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `shadcn` plus the dead component folder that used them). Backend has exactly three runtime deps: `hono`, `drizzle-orm`, `zod`.

### 5. Render hygiene

- `GameCard` memoized (primitive props — the six home-page cards skip re-renders).
- Zustand slice subscriptions keep hot paths (2048 moves, audio ticks) from re-rendering unrelated UI.
- Fire-and-forget submission means zero input latency added by networking.

### 6. Platform-level

Workers run at the edge (no cold-start region hops); D1 sits next to the Worker; static frontend served from CDN.

---

## 16. Challenges Faced

Each follows the same arc: problem → constraint → solution → lesson.

### 1. bcrypt vs. Workers CPU limits

Standard advice says bcrypt, but bcryptjs (pure JS) exceeds Workers' CPU budget. Switched to **PBKDF2 via WebCrypto** — natively accelerated, designed for exactly this. *Lesson: know your runtime; "best practice" is contextual.*

### 2. The stale-store double-submission bug

Fresh game engine per mount + shared persistent store = a desync where returning to Tic Tac Toe could double-count a finished game. Fixed with unmount cleanup + submitting only on the engine's own verdict. *Lesson: two copies of state need transitions validated against the source of truth.*

### 3. Wordle streaks that can't be farmed

Client-computed streaks = editable localStorage = fake streaks. Moved the computation server-side keyed on `last_played_day`: same-day resubmits don't count, consecutive-day wins increment, gaps reset. Client only reports *what happened*, never *what the streak is*. *Lesson: derive competitive values server-side from facts, don't accept them from clients.*

### 4. Wordle duplicate-letter coloring

Naive per-letter comparison mis-colors repeats (guess "SPEED" vs answer "ERASE"). Implemented the standard **two-pass algorithm** — greens first, then ambers limited by remaining letter counts — and reused the same function for keyboard-key coloring. *Lesson: edge cases in "simple" games are where correctness lives.*

### 5. Connect 4 AI diagonal bug

The minimax evaluation indexed one diagonal window incorrectly, so the AI systematically undervalued diagonal threats. Fixed the indexing and added terminal win/loss scores (`±100000 ± depth`) so the AI prefers faster wins and slower losses. *Lesson: subtle indexing bugs don't crash — they just make behavior quietly wrong; you find them by testing behavior, not by reading green checkmarks.*

### 6. React Server Components vs. the game registry

Couldn't read a slug list out of a `"use client"` module inside a server component. Split into a server-safe `gameIds.ts` + client `GameHost.tsx`. *Lesson: the RSC boundary is a real architectural line, not a folder convention.*

### 7. React 19's stricter effect lint

`react-hooks/set-state-in-effect` flagged legitimate-looking patterns. Instead of suppressing, refactored: derived state where possible, unmount-cleanup resets where not. *Lesson: strict lint rules usually point at a better design, not at the need for an ignore comment.*

### 8. Asset licensing done properly

"Free wallpaper" sites turned out to be rip sites (one image literally had a watermark). Replaced everything with Unsplash-License photos and CC0 music from the Internet Archive — *filtering by license metadata*, because most "free lofi" is actually CC BY-NC-ND. Credits shipped in-app. *Lesson: license diligence is an engineering task like any other.*

---

## 17. Design Decisions

A summary of the "why X over Y" choices.

| Decision | Over | Because |
| --- | --- | --- |
| **Guest-first auth** | Login wall / no accounts | Zero-friction play *and* persistent identity; upgrade keeps the same user ID so stats survive by construction |
| **D1 (SQL)** | KV / external Postgres | Leaderboards are relational; KV can't rank. Postgres adds cost + a network hop + connection management for no benefit at this scale |
| **Drizzle** | Prisma / raw SQL | Prisma's engine is heavy for Workers; raw SQL loses types. Drizzle is thin, typed, and its migrations are readable SQL |
| **JWT** | Server sessions | Stateless fits an edge runtime with no shared memory; no DB read per request |
| **Write-time aggregates** (`game_stats`) | Computing from history per read | Reads outnumber writes enormously; leaderboards become trivial indexed queries |
| **Fire-and-forget submission** | Blocking/retrying sync | The game must never feel broken because the network is; local persistence covers the gap |
| **Zustand** | Redux / Context | Matches the actual size of client state; slice subscriptions for hot paths |
| **No React Query** | Adding it | A counter-triggered refetch covers 100% of current needs; fewer deps |
| **Static game catalog in code** | Games table in DB | Adding a game requires code anyway — a DB catalog is fake flexibility |
| **Dropped multiplayer entirely** | Half-finished WebSockets | The UI had been deliberately removed; orphaned Durable Object code was pure liability. Scope cutting is a feature — polished single-player beats broken multiplayer in a portfolio |
| **Monorepo, two apps** | Separate repos / one Next.js app with API routes | Shared context, atomic changes; but the backend must run on Workers (D1 binding), so it can't just be Next API routes on Vercel |
| **Honest in-memory rate limiting** | Pretending it's distributed | The comment in the code states its limits; the upgrade path (Durable Objects) is known and named |

---

## 18. Future Improvements

Ordered by priority.

1. **Unit tests for the core logic** — streak computation (day boundaries, same-day resubmits), the Wordle two-pass scorer, score plausibility schemas, Connect 4 win detection. These are pure functions; high value per test. *This is the project's biggest current gap.*
2. **Durable Object rate limiting** — replace the per-isolate counters with a globally consistent limiter.
3. **Short-lived tokens + refresh** — enables revocation; the right move if anything sensitive is ever stored.
4. **Daily challenges** — a shared daily seed per game (everyone gets the same 2048 spawn sequence / puzzle shuffle) with a daily leaderboard. The schema barely changes; huge replay value.
5. **PWA** — the app is already offline-tolerant; a service worker + manifest makes it installable.
6. **More games** — the marginal cost is one component + one config line + one schema branch, which is itself evidence the architecture is right.
7. **Cloudflare Turnstile on signup** — bot protection beyond rate limits.
8. **E2E smoke tests (Playwright)** — play each game to completion against a local backend in CI.

---

## Appendix: Design FAQ

**"What happens when a Wordle game finishes?"**
> The game component detects win/loss and calls a shared submit helper with `{ outcome, guesses, day }`. It's fire-and-forget — the UI never waits. The Worker validates the payload with Zod, checks it's not a same-day resubmit, updates the streak by comparing the stored last-played day with the submitted day, appends to score history, and upserts the aggregate stats row in one conflict-handling statement. The response includes a `newBest` flag — if true, the client shows a small trophy toast and bumps a version counter that makes the leaderboard panel refetch.

**"How do you stop cheating?"**
> Honestly: for a client-authoritative single-player game you can't fully — so I did what's proportionate. Per-game plausibility bounds reject impossible values, streaks are computed server-side from reported facts, same-day resubmits can't farm streaks, everything is authenticated and rate-limited, and timestamps are server-side. The code comments call these "sanity gates, not anti-cheat" — I'd rather own the trade-off than pretend.

**"Why Cloudflare Workers instead of a Node server?"**
> Global low latency for a global audience, zero cost at portfolio scale, and no servers to manage. The trade-off was real: no Node APIs, strict CPU budgets — which forced the PBKDF2-over-bcrypt decision and taught me more than a plain Express app would have.

**"What would you do differently?"**
> Write tests alongside the backend rather than after — the streak logic and score validation are pure functions that were begging for them. And I'd introduce the aggregate-stats table from day one instead of discovering the need when designing leaderboards.
