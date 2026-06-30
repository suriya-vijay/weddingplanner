# Kalyanam & Co.

> The luxury operating system for Indian weddings. — _Where Forever Takes Shape_

A premium wedding-planning platform that brings inspiration, vendors, planning
tools, AI assistance, and a dedicated human wedding planner into one elegant
place — for luxury Indian weddings anywhere in the world.

## Status

**Phase 1 — Landing page + design-system foundation** (current).
Built with mock data; backend (Supabase), auth, and the AI assistant are future
phases. See `design-system/` and the full PRD for the broader MVP scope.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme` tokens) · re-skinned **shadcn/ui** primitives
- **lucide-react** icons · **embla-carousel**
- Backend: **Supabase** _(planned)_

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
