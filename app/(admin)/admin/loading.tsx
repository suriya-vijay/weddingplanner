import { PanelPageSkeleton } from "@/components/ui/skeleton";

/** Admin panel loading state (header + stat row + content panel). */
export default function Loading() {
  return <PanelPageSkeleton tiles={4} rows={4} />;
}
