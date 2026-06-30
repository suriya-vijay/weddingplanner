# Kalyanam & Co. — Design System (MASTER)

> Global source of truth for the Kalyanam & Co. platform. Page-specific overrides live in `design-system/pages/`. The interaction layer lives in `UX-BIBLE.md`. Tokens are implemented in `app/globals.css`.

## Brand
- **Name:** Kalyanam & Co. — **Tagline:** Where Forever Takes Shape
- **Personality:** Luxury · Elegant · Classy · Minimal · Premium · Desi/Hindu-inspired (subtle)
- **References:** Airbnb, Pinterest, luxury hotel sites, Booking.com — editorial "luxury wedding magazine" feel.
- **Mandate:** Custom-designed, agency-quality. No generic SaaS layouts, no default shadcn styling. Whitespace + typography lead.

## Color
Light mode only. No dark mode.

| Role | Token | Hex |
|------|-------|-----|
| Primary (Forest Green) | `--forest-700` | `#1B4332` |
| Forest mid | `--forest-600` | `#2D6A4F` |
| Forest text/deep | `--forest-900` | `#0F2C1F` |
| Secondary (Gold) | `--gold-500` | `#C9A227` |
| Gold (AA on light) | `--gold-600` | `#A98729` |
| Accent (Blush) | `--blush-500` | `#E8B4B8` |
| Background (Cream) | `--cream` | `#FBF8F3` |
| Sunken surface | `--cream-deep` | `#F4EEE3` |
| Card | `--ivory` | `#FFFFFF` |
| Text primary | `--ink` | `#16241C` |
| Text secondary | `--ink-soft` | `#4A5A50` |
| Border (warm hairline) | `--border` | `#E8E0D2` |
| Focus ring | `--ring` (gold) | `#C9A227` |

**Usage rules:** Forest = primary actions, headers, deep accents. Gold = secondary CTAs, fine rules, highlights, eyebrows (use `--gold-600` for text to hold 4.5:1). Blush = soft accents/backgrounds, never primary CTA. Functional color (error/success) always pairs with icon/text, never color-alone.

## Typography
- **Headings:** Playfair Display (`--font-serif`), weight 400–600, tight tracking (-0.01em), line-height ~1.08.
- **Body:** Inter (`--font-sans`), 400/500/600, line-height 1.65, body ≥16px.
- **Eyebrow/kicker:** Inter 600, uppercase, letter-spacing 0.22em, gold-600 (`.eyebrow`).
- **Fluid type scale:** `--step--1 … --step-5` (clamp-based). Display headlines use `--step-4/5`.
- Loaded via `next/font/google` (self-hosted, `display: swap`).

## Layout & spacing
- **Container:** `.container-luxe` (max 1280px, fluid gutters 1.25rem→3.5rem).
- **Section rhythm:** `.section` vertical padding clamps 4.5rem→9rem — generous.
- **Non-boxy:** asymmetric/editorial layouts, curved SVG dividers, organic shapes. Avoid equal 3-col icon-grids and default card shadows.
- **Radii:** generous — lg 1rem, xl 1.5rem, 2xl 2rem, 3xl 2.75rem, plus pills.
- **Breakpoints:** 375 / 768 / 1024 / 1440. Mobile-first.

## Elevation (shadows)
Soft, warm, gold-tinted — never harsh black. `--shadow-sm/md/lg` for cards/overlays; `--shadow-gold` for hero/primary emphasis. Consistent scale only.

## Motifs (subtle & refined)
Lotus + mandala **line-art** as accents and section dividers — not ornate backgrounds. Implemented as inline SVG in `components/brand/motifs.tsx`. Gold/forest strokes, low opacity. One or two per view max.

## Iconography
Lucide (SVG), consistent stroke (1.5px), no emoji as icons.

## Accessibility (always)
Contrast ≥4.5:1 body / 3:1 large. Visible gold focus ring (`:focus-visible`, never removed). Sequential headings. Alt text on meaningful imagery. `prefers-reduced-motion` honored globally. Touch targets ≥44px.

## Anti-patterns (avoid)
Pink-dominant palette (engine default — rejected); default shadcn zinc styling; boxy stacked rectangles; harsh shadows; cheap/fast animations; emoji icons; template SaaS hero with product screenshot; equal centered feature grids.

## Stack
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 (`@theme` tokens) · shadcn/ui primitives (re-skinned) · lucide-react · embla-carousel. Backend (Supabase) and AI assistant are future phases.
