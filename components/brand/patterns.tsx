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
 * MandalaCornerSoft — a refined corner flourish. Where MandalaCorner uses
 * straight ray lines (which can read as stray marks against a plain ground),
 * this uses delicate concentric arcs with small curved lotus-petals and a bud,
 * so it reads as intentional ornament. Static; driven by `currentColor`.
 */
export function MandalaCornerSoft({ className }: { className?: string }) {
  const petals = Array.from({ length: 5 });
  return (
    <svg viewBox="0 0 160 160" fill="none" aria-hidden="true" className={cn("h-40 w-40", className)}>
      <g stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* soft concentric arcs radiating from the corner (0,0) */}
        <path d="M0 40A40 40 0 0 1 40 0" strokeWidth="1.2" opacity="0.5" />
        <path d="M0 66A66 66 0 0 1 66 0" strokeWidth="0.9" opacity="0.32" />
        <path d="M0 96A96 96 0 0 1 96 0" strokeWidth="0.7" opacity="0.2" />
        {/* small curved lotus petals sitting on the inner arc */}
        {petals.map((_, i) => {
          const a = (Math.PI / 2) * ((i + 0.5) / petals.length);
          const r = 40;
          const cx = Math.cos(a) * r;
          const cy = Math.sin(a) * r;
          const dx = Math.cos(a) * 12;
          const dy = Math.sin(a) * 12;
          // teardrop petal pointing outward from the arc
          return (
            <path
              key={i}
              d={`M${cx} ${cy} q ${dx * 0.5 - dy * 0.4} ${dy * 0.5 + dx * 0.4} ${dx} ${dy} q ${-dx * 0.5 - dy * 0.4} ${-dy * 0.5 + dx * 0.4} ${-dx} ${-dy}`}
              strokeWidth="0.9"
              opacity="0.4"
            />
          );
        })}
        {/* lotus bud at the inner corner */}
        <path
          d="M10 10c6 1 11 6 12 12-6-1-11-6-12-12Zm0 0c1 6 6 11 12 12C21 16 16 11 10 10Z"
          strokeWidth="0.9"
          opacity="0.55"
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

/**
 * LeafVine — a trailing gold creeper: one long curving stem with alternating
 * teardrop leaves and small buds. Sized wide (viewBox 400×48) so it runs as a
 * horizontal divider/edge band; mirror with `-scale-x-100`. Static line-art.
 */
export function LeafVine({ className }: { className?: string }) {
  // A gentle S-curve stem; leaves alternate above/below along it.
  const stem = "M4 24 C 60 8, 120 40, 180 24 S 300 8, 396 24";
  const leaves = Array.from({ length: 9 });
  return (
    <svg
      viewBox="0 0 400 48"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
      className={cn("h-6 w-full", className)}
    >
      <g stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={stem} strokeWidth="1.2" opacity="0.75" />
        {leaves.map((_, i) => {
          const x = 24 + i * 44;
          const up = i % 2 === 0;
          const y = 24 + (up ? -2 : 2);
          const ty = up ? -13 : 13;
          // teardrop leaf + center vein, curving away from the stem
          return (
            <g key={i} opacity="0.7">
              <path
                d={`M${x} ${y} q ${up ? 7 : -7} ${ty * 0.5} 2 ${ty} q ${up ? -9 : 9} ${-ty * 0.6} -2 ${-ty}Z`}
                strokeWidth="1"
              />
              <path d={`M${x} ${y} l 1 ${ty * 0.8}`} strokeWidth="0.7" opacity="0.6" />
              {/* small bud between leaves */}
              {i < leaves.length - 1 && (
                <circle cx={x + 22} cy={24} r="1.4" fill="currentColor" stroke="none" opacity="0.5" />
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/**
 * TempleArch — a stylized mandap / temple archway (two columns + a scalloped
 * ogee arch). Used low-opacity behind a section heading as the "old India"
 * focal ornament. Static line-art; color via currentColor.
 */
export function TempleArch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" fill="none" aria-hidden="true" className={cn("h-48 w-56", className)}>
      <g stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
        {/* ogee / cusped arch across the top */}
        <path
          d="M40 84 C 40 46, 80 30, 120 30 C 160 30, 200 46, 200 84"
          opacity="0.7"
        />
        {/* inner scalloped arch line (echo) */}
        <path
          d="M52 86 C 52 56, 86 42, 120 42 C 154 42, 188 56, 188 86"
          opacity="0.4"
          strokeWidth="0.9"
        />
        {/* small cusp dots along the arch */}
        {Array.from({ length: 7 }).map((_, i) => {
          const t = i / 6;
          const x = 40 + t * 160;
          const y = 84 - Math.sin(Math.PI * t) * 52;
          return <circle key={i} cx={x} cy={y} r="1.4" fill="currentColor" stroke="none" opacity="0.5" />;
        })}
        {/* left column: shaft, capital, base */}
        <path d="M46 84 v96" opacity="0.7" />
        <path d="M58 84 v96" opacity="0.7" />
        <path d="M42 84 h20" opacity="0.6" />
        <path d="M42 92 h20" opacity="0.4" />
        <path d="M40 180 h24" opacity="0.7" />
        <path d="M38 188 h28" opacity="0.5" />
        {/* right column (mirror) */}
        <path d="M182 84 v96" opacity="0.7" />
        <path d="M194 84 v96" opacity="0.7" />
        <path d="M178 84 h20" opacity="0.6" />
        <path d="M178 92 h20" opacity="0.4" />
        <path d="M176 180 h24" opacity="0.7" />
        <path d="M174 188 h28" opacity="0.5" />
        {/* tiny finial / kalash at the arch apex */}
        <path d="M120 30 v-10" opacity="0.6" />
        <circle cx="120" cy="16" r="3" opacity="0.6" />
      </g>
    </svg>
  );
}

/**
 * DiyaRow — a horizontal row of oil lamps (diya) each with a teardrop flame.
 * A warm, traditional wedding accent band. Static line-art via currentColor;
 * flames can be tinted separately by the caller if wanted (kept single-color).
 */
export function DiyaRow({ className, count = 5 }: { className?: string; count?: number }) {
  return (
    <div
      className={cn("flex items-end justify-center gap-6 text-gold-400", className)}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 32 34" fill="none" className="h-8 w-8">
          <g stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* flame */}
            <path
              d="M16 4 c 3 5, 3 9, 0 12 c -3 -3, -3 -7, 0 -12Z"
              strokeWidth="1.1"
              opacity="0.9"
            />
            {/* flame glow dot */}
            <circle cx="16" cy="13" r="1" fill="currentColor" stroke="none" opacity="0.7" />
            {/* lamp bowl */}
            <path d="M6 22 c 0 5, 5 8, 10 8 s 10 -3 10 -8" strokeWidth="1.2" opacity="0.85" />
            <path d="M4 22 h24" strokeWidth="1.2" opacity="0.85" />
            {/* little spout on the right */}
            <path d="M26 22 l 4 1" strokeWidth="1.1" opacity="0.7" />
          </g>
        </svg>
      ))}
    </div>
  );
}
