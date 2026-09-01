import { cn } from "@/lib/utils";

/**
 * Subtle & refined cultural motifs — lotus + mandala line-art.
 * Used as accents and dividers, never ornate backgrounds.
 * All decorative SVGs are aria-hidden.
 */

/**
 * MandalaBloom — a jewelled hero mandala. Where MandalaRing is a single thin
 * stroke ("drawn on paper"), this layers concentric rings of varied weight, two
 * offset petal rings, a scalloped band and a lotus core, drawn with a soft gold
 * gradient stroke. Reads as intricate Indian ornament, not line-art. Still one
 * static SVG (the slow rotation lives on the wrapper via .ambient-spin).
 */
export function MandalaBloom({ className }: { className?: string }) {
  const outer = Array.from({ length: 24 });
  const inner = Array.from({ length: 12 });
  const scallop = Array.from({ length: 36 });
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id="mandala-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6c66e" />
          <stop offset="50%" stopColor="#c99a3a" />
          <stop offset="100%" stopColor="#e8b4b8" />
        </linearGradient>
      </defs>
      <g stroke="url(#mandala-gold)" fill="none" strokeLinecap="round">
        {/* Concentric rings, varied weight for depth */}
        <circle cx="100" cy="100" r="26" strokeWidth="1.4" opacity="0.85" />
        <circle cx="100" cy="100" r="40" strokeWidth="0.7" opacity="0.55" />
        <circle cx="100" cy="100" r="62" strokeWidth="1.1" opacity="0.6" />
        <circle cx="100" cy="100" r="80" strokeWidth="0.6" opacity="0.4" />
        <circle cx="100" cy="100" r="96" strokeWidth="1.2" opacity="0.5" />

        {/* Scalloped band between the outer rings */}
        {scallop.map((_, i) => (
          <circle
            key={`s${i}`}
            cx="100"
            cy="12"
            r="3.2"
            strokeWidth="0.7"
            opacity="0.4"
            transform={`rotate(${(360 / scallop.length) * i} 100 100)`}
          />
        ))}

        {/* Outer petal ring */}
        {outer.map((_, i) => (
          <path
            key={`o${i}`}
            d="M100 40c6 10 6 26 0 40-6-14-6-30 0-40Z"
            strokeWidth="0.8"
            opacity="0.5"
            transform={`rotate(${(360 / outer.length) * i} 100 100)`}
          />
        ))}

        {/* Inner petal ring, offset half a step, filled faintly */}
        {inner.map((_, i) => (
          <path
            key={`i${i}`}
            d="M100 62c5 7 5 16 0 24-5-8-5-17 0-24Z"
            strokeWidth="1"
            fill="url(#mandala-gold)"
            fillOpacity="0.06"
            opacity="0.7"
            transform={`rotate(${(360 / inner.length) * i + 15} 100 100)`}
          />
        ))}

        {/* Lotus core */}
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={`c${i}`}
            d="M100 84c3 5 3 11 0 16-3-5-3-11 0-16Z"
            strokeWidth="1"
            fill="url(#mandala-gold)"
            fillOpacity="0.1"
            transform={`rotate(${45 * i} 100 100)`}
          />
        ))}
        <circle cx="100" cy="100" r="5" strokeWidth="1.2" opacity="0.9" />
      </g>
    </svg>
  );
}

/**
 * LotusMark — the Kalyanam brand mark: the real gold lotus-diya logo, extracted
 * onto transparency from the source artwork (public/brand/lotus-gold.png) so it
 * sits cleanly on any surface (green sidebars, the header, cream panels). It's a
 * fixed-gold raster (no currentColor tint), which is fine — gold reads on both
 * dark and light, and the mark is never placed on a gold surface. `className`
 * keeps the same sizing contract as before (h-6 w-6 default, overridable).
 */
export function LotusMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/lotus-gold.png"
      alt=""
      aria-hidden="true"
      className={cn("h-6 w-6 object-contain", className)}
    />
  );
}

/** Concentric mandala ring — hero/section ornament. Very low opacity. */
export function MandalaRing({ className }: { className?: string }) {
  const petals = Array.from({ length: 16 });
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    >
      <g stroke="currentColor" strokeWidth="1" fill="none">
        <circle cx="100" cy="100" r="34" opacity="0.6" />
        <circle cx="100" cy="100" r="52" opacity="0.45" />
        <circle cx="100" cy="100" r="78" opacity="0.3" />
        <circle cx="100" cy="100" r="96" opacity="0.18" />
        {petals.map((_, i) => (
          <g key={i} transform={`rotate(${(360 / petals.length) * i} 100 100)`}>
            <path
              d="M100 22c5 8 5 20 0 30-5-10-5-22 0-30Z"
              opacity="0.35"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Elegant horizontal divider: gold hairline + tiny center lotus. */
export function DividerOrnament({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center gap-4", className)}
      aria-hidden="true"
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400 sm:w-28" />
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold-500" fill="none">
        <path
          d="M12 4c1.7 2 1.7 6 0 9-1.7-3-1.7-7 0-9Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M12 13c-2-1.5-4.5-1.8-6.5-1 1.3 1.7 3.8 2.5 6.5 1Zm0 0c2-1.5 4.5-1.8 6.5-1-1.3 1.7-3.8 2.5-6.5 1Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400 sm:w-28" />
    </div>
  );
}

/**
 * Curved section divider — soft organic wave to avoid boxy stacked rectangles.
 * `flip` mirrors it; `fill` sets the color of the wave (match the next section).
 */
export function CurveDivider({
  className,
  flip = false,
  fill = "var(--cream)",
  textured = false,
}: {
  className?: string;
  flip?: boolean;
  fill?: string;
  /** Fill the wave with the saree brocade (matches a textured forest section). */
  textured?: boolean;
}) {
  // Textured dividers share one brocade pattern per orientation (identical
  // fills, so a shared id is safe and keeps this a server component).
  const pid = flip ? "saree-flip" : "saree-up";
  const wave = "M0 64C240 16 480 16 720 48s480 64 720 16v56H0V64Z";
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none leading-[0]", flip && "rotate-180", className)}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-[60px] w-full sm:h-[90px]"
      >
        {textured ? (
          <>
            <defs>
              <pattern
                id={pid}
                patternUnits="userSpaceOnUse"
                width="300"
                height="120"
                /* flip the tile back upright when the divider is rotated */
                patternTransform={flip ? "scale(1,-1)" : undefined}
              >
                <rect width="300" height="120" fill="var(--forest-900)" />
                <image
                  href="/brand/saree-tile.png"
                  x="0"
                  y="-90"
                  width="300"
                  height="300"
                  opacity="0.7"
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>
            </defs>
            <path d={wave} fill={`url(#${pid})`} />
          </>
        ) : (
          <path d={wave} fill={fill} />
        )}
      </svg>
    </div>
  );
}
