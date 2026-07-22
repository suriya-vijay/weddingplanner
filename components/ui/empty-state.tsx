import { Panel } from "@/components/dashboard/ui";
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
  /** A lucide icon element, e.g. <Wallet className="h-6 w-6" /> */
  icon: React.ReactNode;
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
      <span
        aria-hidden
        className="grid h-12 w-12 place-items-center rounded-2xl bg-forest-100 text-forest-700"
      >
        {icon}
      </span>
      <h3 className="font-serif text-lg text-ink">{title}</h3>
      {children && (
        <p className="max-w-sm text-sm text-ink-soft">{children}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );

  return bare ? body : <Panel>{body}</Panel>;
}
