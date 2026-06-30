import { cn } from "@/lib/utils";

/**
 * Subtle & refined cultural motifs — lotus + mandala line-art.
 * Used as accents and dividers, never ornate backgrounds.
 * All decorative SVGs are aria-hidden.
 */

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
