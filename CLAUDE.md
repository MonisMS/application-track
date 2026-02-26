# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint

# Database (all require .env.local to be populated)
npm run db:generate  # Generate migration from schema changes
npm run db:migrate   # Apply migrations to Neon
npm run db:studio    # Open Drizzle Studio UI
```

`drizzle-kit` does not read `.env.local` automatically — all `db:*` scripts are prefixed with `dotenv -e .env.local --` to inject env vars.

## Architecture

**Stack:** Next.js 16 App Router · TypeScript · Drizzle ORM · Neon (PostgreSQL) · NextAuth v5 · Tailwind CSS v4

### Data flow

```
db/schema.ts         — Drizzle table definitions + pgEnum types
lib/db.ts            — Neon WebSocket pool + Drizzle client (neon-serverless driver)
lib/queries.ts       — All read functions (server-only)
lib/actions.ts       — All mutations ("use server"), each calls revalidatePath("/") after write
app/page.tsx         — Fetches session + stats + followUps + apps in parallel via Promise.all
```

Mutations always redirect to `/` after completion. Edit page calls `notFound()` for missing records.

### Auth

Two-file split required by Next.js proxy (middleware) constraints:

- `auth.config.ts` — Lightweight config (no DB adapter). Used by `proxy.ts`. Contains JWT strategy, `authorized` callback, and session/JWT callbacks.
- `auth.ts` — Full config. Spreads `authConfig`, adds DrizzleAdapter. Used by API routes and server components.
- `proxy.ts` — Exports `auth as proxy`. Protects all routes except `/login`, `/api/auth/*`, and static assets.

Session strategy is **JWT** (not database sessions). The DrizzleAdapter only handles user/account creation on first sign-in — sessions live in cookies.

### Key patterns

- **Server components by default.** Only interactive components get `"use client"`.
- **`$dynamic()` queries** — `lib/queries.ts` uses `db.select().$dynamic()` to conditionally add WHERE clauses.
- **Reusable form** — `ApplicationForm` receives an `action` prop. Create page passes `createApplicationAction`; edit page passes `updateApplicationAction.bind(null, app.id)`.
- **Client interactivity** — `StatusSelect` uses `useTransition()` to fire `updateStatusAction` without a form submit. `DeleteButton` is a separate `"use client"` file to allow `confirm()` inside a server-rendered table.
- **`ThemeToggleClient`** wraps `ThemeToggle` in a dynamic import with `ssr: false` to avoid hydration mismatch from `localStorage`.

### Database schema notes

- `appliedDate` and `followUpDate` are stored as **text** (`YYYY-MM-DD`), not timestamps.
- `stage` and `status` are **pgEnum** — access values via `.enumValues` (e.g. `statusEnum.enumValues`), not by iterating the enum directly.
- Auth tables (`user`, `account`, `session`, `verificationToken`) live in the same schema file as `applications`.
- No per-user data isolation — queries don't filter by logged-in user (single-user tool).

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `AUTH_SECRET` | JWT signing secret (`openssl rand -base64 32`) |
| `AUTH_URL` | App base URL (`http://localhost:3000` in dev) |

NextAuth v5 uses `AUTH_*` prefix — not the v4 `NEXTAUTH_*` names.
