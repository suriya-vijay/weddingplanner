# Kalyanam & Co. — UX Bible

> The polish layer. Defines exactly *how every interaction feels*. Every component implements against this; every future page inherits it. Concrete values, not adjectives. Baseline rigor from `ui-ux-pro-max --domain ux`, elevated to Kalyanam's luxury bar (Apple / Airbnb / Notion calibre).

Motion tokens are real CSS variables in `app/globals.css` — components consume them, never hardcode ad-hoc durations.

---

## 0. Motion tokens (canonical)

| Token | Value | Use |
|-------|-------|-----|
| `--dur-fast` | 180ms | micro: hover color/opacity shifts, underline draw |
| `--dur-base` | 280ms | standard: state changes, card lift, header solidify |
| `--dur-slow` | 460ms | entrances, scroll reveals, overlays |
| `--ease-out` | `cubic-bezier(0.22,1,0.36,1)` | **entering** elements (settle, no bounce) |
| `--ease-in` | `cubic-bezier(0.4,0,1,1)` | **exiting** elements |
| `--ease-soft` | `cubic-bezier(0.4,0,0.2,1)` | default reversible UI transitions |
| Stagger | 40ms/item (cap ~6) | list/grid entrance |

**Global rules:** Animate transform/opacity only (never width/height/top/left). Max 1–2 key animated elements per view. Exit ≈ 60–70% of enter duration. **`prefers-reduced-motion: reduce`** disables all transitions/animations and reveals content immediately (handled globally in `globals.css`). Hover effects are enhancements only — every action also works on tap/click.

---

## 1. Buttons
Variants: **Primary** (gold fill), **Secondary** (forest outline), **Ghost** (text + gold underline), **Link**.

- **Rest → Hover** (`--dur-fast`, `--ease-soft`): Primary — brightness +4%, lift `translateY(-1px)`, shadow `sm→gold`. Secondary — fill forest-700 wash, text→cream. Ghost — gold underline draws left→right (`transform: scaleX(0)→1`, `transform-origin:left`).
- **Active/press:** `scale(0.98)`, shadow drops. Springs back on release.
- **Focus-visible:** gold ring, 2px, offset 3px (global). Never removed.
- **Disabled:** opacity 0.45, `cursor: not-allowed`, no hover/press.
- **Loading:** label dims, inline spinner fades in; button disabled; min-width locked so layout doesn't jump. Trigger when async >300ms.
- All clickable elements: `cursor: pointer`, min 44×44px hit area.

## 2. Cards (wedding / vendor / feature)
- **Hover** (`--dur-base`, `--ease-out`): lift `translateY(-6px)`, shadow `md→lg`; inner image `scale(1.04)` inside `overflow-hidden`; gold hairline or caption fades up. Cursor pointer.
- Press: `scale(0.99)`. Focus-visible: gold ring on the card wrapper.
- Image area always reserves aspect-ratio (no CLS). Skeleton = on-brand cream shimmer (`.skeleton`), never gray boxes.
- **Reveal on scroll:** fade + `translateY(22px)→0`, staggered 40ms across a row.

## 3. Page & section transitions
- **Section reveal:** `.reveal` class, toggled `.is-visible` by a shared IntersectionObserver hook (`useReveal`) at ~15% visibility, once. Fade + rise, `--dur-slow`/`--ease-out`. Children stagger via incremental `transition-delay`.
- **Route transitions (future):** crossfade + slight rise on the main region; forward = rise from below, back = settle from above.
- **Parallax:** sparing — hero motif drift only, small magnitude, disabled under reduced-motion.

## 4. Scroll behavior
- Smooth scrolling (CSS `scroll-behavior: smooth`, off under reduced-motion). Anchor links offset for the fixed header.
- **Header:** transparent over hero; past ~64px scrolled it solidifies — cream background, warm hairline border, `--shadow-sm`, slight height reduction — transition `--dur-base`/`--ease-soft`. Logo + links shift from cream/white text to ink.
- No nested scroll regions competing with the page.

## 5. Loading
- Skeletons (`.skeleton`) for content >300ms — shimmer in cream-deep with ivory sweep. Reserve final dimensions.
- Buttons: inline spinner (see §1). Avoid full-page blocking spinners.

## 6. Search (landing — visual + mock this phase)
- Pill-shaped, ivory, soft shadow. **Focus:** field expands subtly, shadow `sm→md`, gold ring; active segment highlighted blush-100.
- Suggestions dropdown: fades + rises `--dur-base`; items hover → cream-deep wash, gold leading icon. Clear (×) appears when text present. Submit → button shows loading state.

## 7. Navigation
- **Desktop links:** hover/active → gold underline draws (scaleX origin-left, `--dur-fast`); active route underline persists + ink-bold.
- **Mobile menu:** hamburger → full/!panel slides/fades in `--dur-base` `--ease-out`; backdrop scrim 45% forest-900; body scroll locked; close via × or scrim; focus trapped; Esc closes.
- Active location always visibly indicated. Nav placement identical across all pages.

## 8. Empty states (spec for future pages)
Centered, generous whitespace, a single lotus line-motif (not a stock illustration), Playfair one-liner + soft sub-copy, one clear primary action. Warm/encouraging tone ("Your story starts here"), never a blank panel.

## 9. Error states (future)
- **Inline field:** message below field, destructive color + small alert icon, fades in `--dur-fast`; field border→destructive; `aria-live="polite"` / `role="alert"`. On submit error, focus first invalid field.
- **Form-level:** summary card above form with anchor links to each error.
- **Toast error:** top-right, destructive accent, icon + cause + recovery action, does not steal focus, manual dismiss.
- Every error states cause **and** how to fix.

## 10. Success messages (future)
Confirmation: checkmark draw (stroke-dashoffset) + brief blush/gold flash, or toast with checkmark. Toasts auto-dismiss 3–5s, `aria-live="polite"`. Destructive/bulk actions offer Undo.

## 11. Form animations (future)
Floating label rises on focus/fill (`--dur-fast`). Focused field: gold ring + border-strong. **Inline validation on blur**, not per keystroke. Submit → loading → success choreography (§1, §10). Multi-step flows show progress + allow back. Long forms autosave drafts.

## 12. Vendor card interactions (spec for marketplace phase)
Hover lift+zoom (§2). Save/like: heart outline→fill with a gentle `scale(1)→1.2→1` pop + blush flash, optimistic. Quick-actions (view / save / enquire) fade up from card base on hover. Category tags hover → gold wash. Rating stars gold.

## 13. Mood board interactions (spec for inspiration phase)
Save-to-board: image → "+" overlay on hover; click → board picker popover (fade+rise). Masonry items reveal staggered. Drag: cursor `grab`→`grabbing`, dragged item lifts + shadow-lg + slight scale, others reflow smoothly. Collection cover hover → subtle cross-stack fan.

---

### Implemented in Phase 1 (landing)
§0 tokens, §1 buttons, §2 cards, §3 section reveals, §4 scroll/header, §5 skeletons (where used), §6 search (visual/mock), §7 nav (desktop + mobile).

### Documented now, implemented later
§8 empty, §9 error, §10 success, §11 forms, §12 vendor, §13 mood board — so dashboard/marketplace/gallery/auth phases inherit a consistent feel.
