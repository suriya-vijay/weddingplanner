import { cn } from "@/lib/utils";

/**
 * Cultural pattern library — STATIC SVG only (no animation, no filters).
 * Indian-luxury motifs: paisley (buta), mandala corners, kalash dividers.
 * Decorative → aria-hidden. Color via currentColor so callers set tone.
 *
 * Performance contract (see plan M1.5): nothing here animates or blurs;
 * tile-able motifs are small and rasterized once by the browser.
 */

/** Single paisley / mango (buta) motif — the signature Indian form. */
export function Paisley({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={cn("h-8 w-8", className)}>
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {/* outer teardrop with curled tip */}
        <path d="M40 6c12 6 16 22 8 34-7 10-22 12-30 4-7-7-6-19 2-24 6-4 14-3 17 3 2 4 1 9-3 11-3 1-6 0-7-3" />
        {/* inner echo */}
        <path d="M37 18c5 3 6 11 1 16-4 4-11 4-14-1" opacity="0.7" />
        {/* seed dots */}
        <circle cx="33" cy="40" r="1.4" fill="currentColor" stroke="none" opacity="0.8" />
        <circle cx="28" cy="34" r="1.1" fill="currentColor" stroke="none" opacity="0.6" />
      </g>
    </svg>
  );
}

/** Ornate corner flourish (quarter-mandala + paisley) for hero / CTA corners. */
export function MandalaCorner({ className }: { className?: string }) {
  const rays = Array.from({ length: 7 });
  return (
    <svg viewBox="0 0 160 160" fill="none" aria-hidden="true" className={cn("h-40 w-40", className)}>
      <g stroke="currentColor" strokeWidth="1.1" fill="none">
        {/* concentric arcs radiating from the corner (0,0) */}
        <path d="M0 44A44 44 0 0 1 44 0" opacity="0.55" />
        <path d="M0 72A72 72 0 0 1 72 0" opacity="0.4" />
        <path d="M0 104A104 104 0 0 1 104 0" opacity="0.28" />
        <path d="M0 140A140 140 0 0 1 140 0" opacity="0.16" />
        {/* petal rays between the first two arcs */}
        {rays.map((_, i) => {
          const a = (Math.PI / 2) * (i / (rays.length - 1));
          const r1 = 46;
          const r2 = 70;
          const x1 = Math.cos(a) * r1;
          const y1 = Math.sin(a) * r1;
          const x2 = Math.cos(a) * r2;
          const y2 = Math.sin(a) * r2;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity="0.4" />
          );
        })}
        {/* tiny lotus bud at the inner corner */}
        <path
          d="M8 8c5 1 9 5 10 10-5-1-9-5-10-10Zm0 0c1 5 5 9 10 10C17 13 13 9 8 8Z"
          opacity="0.6"
        />
      </g>
    </svg>
  );
}

/**
 * Kalash / temple-arch divider ornament — richer than the plain hairline.
 * A central kalash (sacred pot) flanked by paisleys and gold rules.
 */
export function KalashDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center gap-4 text-gold-500", className)}
      aria-hidden="true"
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400 sm:w-28" />
      <Paisley className="h-5 w-5 -scale-x-100 opacity-80" />
      <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none">
        <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          {/* kalash pot */}
          <path d="M14 18c0 6 2 11 6 11s6-5 6-11" />
          <path d="M12 18h16" />
          {/* neck + coconut */}
          <path d="M16 18c0-2 1-3 4-3s4 1 4 3" />
          <circle cx="20" cy="11" r="3" />
          {/* mango leaves */}
          <path d="M20 14c-3-1-6 0-7 3 3 1 6 0 7-3Zm0 0c3-1 6 0 7 3-3 1-6 0-7-3Z" opacity="0.8" />
        </g>
      </svg>
      <Paisley className="h-5 w-5 opacity-80" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400 sm:w-28" />
    </div>
  );
}

/**
 * Paisley border strip — a thin horizontal run of alternating buta motifs.
 * Used as a top border on the footer. Static, repeats via flex (few nodes).
 */
export function PaisleyBorder({ className }: { className?: string }) {
  const count = 7;
  return (
    <div
      className={cn("flex items-center justify-center gap-6 text-gold-400/70", className)}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <Paisley
          key={i}
          className={cn("h-4 w-4", i % 2 === 1 && "-scale-x-100")}
        />
      ))}
    </div>
  );
}
