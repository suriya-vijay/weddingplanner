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

/** Eight-petal lotus, line-art. The Kalyanam mark. */
export function LotusMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn("h-6 w-6", className)}
    >
      <g
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* center petal */}
        <path d="M24 7c3.4 4 3.4 12 0 17-3.4-5-3.4-13 0-17Z" />
        {/* inner side petals */}
        <path d="M24 24c-4-3-9-3.5-13-2 2.6 3.4 7.6 5 13 2Z" />
        <path d="M24 24c4-3 9-3.5 13-2-2.6 3.4-7.6 5-13 2Z" />
        {/* outer side petals */}
        <path d="M24 24c-5.5-1-11 .5-15 4 4 2.4 10 2.4 15-4Z" opacity="0.7" />
        <path d="M24 24c5.5-1 11 .5 15 4-4 2.4-10 2.4-15-4Z" opacity="0.7" />
        {/* base */}
        <path d="M9 30c4 4 11 5 15 5s11-1 15-5" opacity="0.55" />
      </g>
    </svg>
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
}: {
  className?: string;
  flip?: boolean;
  fill?: string;
}) {
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
        <path
          d="M0 64C240 16 480 16 720 48s480 64 720 16v56H0V64Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
