import { PanelPageSkeleton } from "@/components/ui/skeleton";

/**
 * Couple dashboard loading state. Shown while a route's server data resolves,
 * so navigation paints structure instantly instead of a blank column. Covers
 * nested routes (checklist/budget/guests/…) too — the shared shape is a header,
 * a stat row and a content panel.
 */
export default function Loading() {
  return <PanelPageSkeleton tiles={4} rows={5} />;
}
