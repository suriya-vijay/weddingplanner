import { PanelPageSkeleton } from "@/components/ui/skeleton";

/**
 * Vendor portal loading state — same shape as the Overview (header, 4 stat
 * tiles, a content panel), which also reads well for the nested routes.
 */
export default function Loading() {
  return <PanelPageSkeleton tiles={4} rows={4} />;
}
