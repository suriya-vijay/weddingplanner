import { cn } from "@/lib/utils";

/**
 * Standard page header for the panels — eyebrow + fluid `.text-h1` heading +
 * lede + a gold hairline. Replaces the `font-serif text-3xl sm:text-4xl` string
 * that was copy-pasted across ~22 headers; the fluid scale glides across the
 * viewport instead of snapping at 640px, matching the marketing pages.
 */
export function PageHeader({
  eyebrow,
  title,
  children,
  actions,
}: {
  eyebrow?: string;
  title: string;
  /** Subtitle / lede text. */
  children?: React.ReactNode;
  /** Right-aligned action buttons. */
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 font-serif text-h1 text-ink">{title}</h1>
        {children && <p className="lede mt-1 max-w-2xl">{children}</p>}
        <div className="rule-gold mt-5 w-24" />
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

/** Section card — the standard ivory panel used across the dashboard. */
export function Panel({
  children,
  className,
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Adds a subtle press feedback for panels that are themselves clickable. */
  interactive?: boolean;
}) {
  return (
    <section
      className={cn(
        // Soft hover lift (refined & subtle — one step below the marketing
        // cards). transform/shadow/border only, no continuous motion.
        "rounded-2xl border border-border bg-ivory p-6 shadow-[var(--shadow-sm)]",
        "transition-[transform,box-shadow,border-color] duration-[var(--dur-base)] ease-[var(--ease-out)]",
        "hover:-translate-y-0.5 hover:border-gold-200 hover:shadow-[var(--shadow-md)]",
        interactive && "active:scale-[0.99]",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** A single stat tile (label, big value, sub-line, optional icon slot). */
export function StatTile({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-ivory p-5 shadow-[var(--shadow-sm)] transition-[transform,box-shadow,border-color] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-gold-200 hover:shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-soft">{label}</span>
        {icon && (
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest-100 text-forest-700">
            {icon}
          </span>
        )}
      </div>
      {/* tabular-nums keeps figures from jittering as values change (skill
          number-tabular). */}
      <p className="mt-3 font-serif text-3xl tabular-nums text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-faint">{sub}</p>}
    </div>
  );
}

/** A labelled horizontal progress bar (pure CSS, no chart lib). */
export function ProgressBar({
  value,
  className,
  tone = "gold",
}: {
  /** 0–100 (values above 100 clamp the bar but should use tone="over") */
  value: number;
  className?: string;
  /**
   * `over` = spent more than planned. Without it an over-budget bar clamps to
   * 100% and renders in the normal colour, so 125% spent looks like a healthy
   * "fully complete" bar — the opposite of the truth.
   */
  tone?: "gold" | "forest" | "over";
}) {
  const pct = Math.max(0, Math.min(100, value));
  const bar =
    tone === "over"
      ? "bg-destructive"
      : tone === "gold"
        ? "bg-gold-500"
        : "bg-forest-600";
  return (
    <div
      className={cn("h-2.5 w-full overflow-hidden rounded-full bg-cream-deep", className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full", bar)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/** A small circular progress ring (SVG, no animation). */
export function ProgressRing({
  value,
  size = 128,
  stroke = 10,
  children,
}: {
  /** 0–100 */
  value: number;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--cream-deep)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--gold-500)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        {children}
      </div>
    </div>
  );
}
