# Kalyanam & Co.

> The luxury operating system for Indian weddings. — _Where Forever Takes Shape_

A premium wedding-planning platform that brings inspiration, vetted vendors,
planning tools and AI assistance into one elegant place — for Indian weddings
across the United States.

## Status

**Live backend.** Supabase auth, Postgres + row-level security, storage and the
Gemini-backed AI advisor are all wired up (see `supabase/migrations/`). Three
roles ship: **couple** (dashboard, checklist, budget, guests, seating, timeline,
messages, AI advisor), **vendor** (portal, packages, enquiries) and **admin**
(inspiration, vendors, people, enquiries, messages).

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme` tokens) · re-skinned **shadcn/ui** primitives
- **lucide-react** icons
- **Supabase** — auth, Postgres + RLS, storage · **Google Gemini** — AI advisor

## Design

- **Brand:** Forest Green (primary) · Gold (secondary) · Blush (accent). Light mode only.
- **Type:** Playfair Display (headings) + Inter (body).
- **Feel:** luxury, editorial, non-boxy; subtle lotus/mandala motifs; Apple-level micro-interactions.
- `design-system/MASTER.md` — tokens, palette, type, anti-patterns.
- `design-system/UX-BIBLE.md` — exact interaction spec (motion, buttons, cards, nav, forms…).

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

Copy `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY`. The last two are **server-only** —
never prefix them with `NEXT_PUBLIC_`.

Run the files in `supabase/migrations/` in numeric order in the Supabase SQL editor.

## Making someone an admin

There is deliberately no self-serve path — `signUpAction` only accepts
`couple | vendor`. Promotion is a manual DB edit, and it needs **two writes**,
because the middleware reads the role from **auth metadata** while RLS reads it
from **`profiles`** (via `my_role()`). Update only one and the account
half-works: metadata-only reaches `/admin` but every RLS-gated write fails
silently; `profiles`-only passes RLS but gets bounced at the door.

```sql
-- 1. the profiles row (what RLS checks)
update public.profiles set role = 'admin' where id = '<user-uuid>';

-- 2. the auth metadata (what the proxy/middleware checks)
update auth.users
   set raw_user_meta_data = raw_user_meta_data || '{"role":"admin"}'::jsonb
 where id = '<user-uuid>';
```

Sign out and back in afterwards so the session picks up the new metadata.

## Structure

```
app/                  Routes (landing page, root layout, global tokens)
components/
  brand/              Logo + lotus/mandala/divider SVG motifs
  layout/             Scroll-aware header, footer
  sections/           Landing sections (hero, search, weddings, vendors, …)
  ui/                 Re-skinned primitives (button, card, accordion, badge, reveal)
lib/                  cn() util, mock data, scroll-reveal hook
design-system/        MASTER.md + UX-BIBLE.md
```
