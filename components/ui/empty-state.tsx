import { Panel } from "@/components/dashboard/ui";
import { Reveal } from "@/components/ui/reveal";
import { LotusMark } from "@/components/brand/motifs";
import { cn } from "@/lib/utils";

/**
 * The "you have no data yet" block.
 *
 * A brand-new couple/vendor used to land on naked table headers floating over
 * blank space (budget, guests, packages had no zero-state at all). An empty
 * state should say what the thing is, why it's empty, and give one obvious way
 * to fill it — so it reads as a starting point, not a broken page.
 *
 * Modelled on the couple-enquiries pattern: icon chip + guidance + one CTA.
 */
export function EmptyState({
  icon,
  title,
  children,
  action,
  className,
  bare = false,
}: {
  /** Optional override; defaults to a lotus line-motif (UX-Bible §8). */
  icon?: React.ReactNode;
  title: string;
  /** One or two short sentences of guidance. */
  children?: React.ReactNode;
  /** Usually a <Button>. */
  action?: React.ReactNode;
  className?: string;
  /** Render without the surrounding Panel (when already inside one). */
  bare?: boolean;
}) {
  const body = (
    <div
      className={cn(
        "flex flex-col items-center gap-3 py-10 text-center",
        className,
      )}
    >
      {icon ? (
        <span
          aria-hidden
          className="grid h-12 w-12 place-items-center rounded-2xl bg-forest-100 text-forest-700"
        >
          {icon}
        </span>
      ) : (
        // The UX-Bible asks for "a single lotus line-motif, not a stock
        // illustration." One-shot draw-in via .draw (dies under reduced-motion).
        <Reveal>
          <LotusMark className="draw h-12 w-12 text-gold-500" aria-hidden />
        </Reveal>
      )}
      <h3 className="font-serif text-lg text-ink">{title}</h3>
      {children && (
        <p className="max-w-sm text-sm text-ink-soft">{children}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );

  return bare ? body : <Panel>{body}</Panel>;
}
