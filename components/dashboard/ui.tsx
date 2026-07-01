import { cn } from "@/lib/utils";

/** Section card — the standard ivory panel used across the dashboard. */
export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-ivory p-6 shadow-[var(--shadow-sm)]",
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
    <div className="rounded-2xl border border-border bg-ivory p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-soft">{label}</span>
        {icon && (
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest-100 text-forest-700">
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 font-serif text-3xl text-ink">{value}</p>
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
  /** 0–100 */
  value: number;
  className?: string;
  tone?: "gold" | "forest";
}) {
  const pct = Math.max(0, Math.min(100, value));
  const bar = tone === "gold" ? "bg-gold-500" : "bg-forest-600";
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
