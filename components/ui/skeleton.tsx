import { cn } from "@/lib/utils";

/**
 * Loading skeletons — the shapes a route shows while its data resolves.
 *
 * MOTION NOTE: the `.skeleton` pulse is CONDITIONAL motion (opacity-only). A
 * skeleton only exists while a route is loading and React unmounts it the
 * moment the real content arrives, so it never runs on a settled page and does
 * not count against the ambient-motion cap. Reduced-motion makes it static via
 * the global block in globals.css.
 *
 * Mirror the real component's shape (same rounding/padding/height) so the swap
 * to real content doesn't shift the layout.
 */

/** A single grey block. Set size/rounding with Tailwind classes. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("skeleton rounded-lg", className)} />;
}

/** Matches <StatTile> from components/dashboard/ui.tsx. */
export function StatTileSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-ivory p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="mt-3 h-8 w-20" />
      <Skeleton className="mt-2 h-3 w-16" />
    </div>
  );
}

/** Matches <Panel> — an ivory card with a title and `rows` list lines. */
export function PanelSkeleton({
  rows = 3,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-ivory p-6 shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      <Skeleton className="h-5 w-40" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

/** The page header block (eyebrow + title + subtitle) every panel page has. */
export function PageHeaderSkeleton() {
  return (
    <div>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-3 h-9 w-56" />
      <Skeleton className="mt-2 h-4 w-72" />
    </div>
  );
}

/**
 * The default panel page shell: header + a stat row + a content panel. Used by
 * most `loading.tsx` files; compose the pieces directly for bespoke pages.
 */
export function PanelPageSkeleton({
  tiles = 4,
  rows = 4,
}: {
  tiles?: number;
  rows?: number;
}) {
  return (
    <div className="space-y-8" role="status" aria-label="Loading">
      <PageHeaderSkeleton />
      {tiles > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: tiles }).map((_, i) => (
            <StatTileSkeleton key={i} />
          ))}
        </div>
      )}
      <PanelSkeleton rows={rows} />
    </div>
  );
}
