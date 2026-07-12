import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TimelineView } from "@/components/dashboard/timeline-view";
import { getOrCreateWedding } from "@/lib/db/weddings";
import { getTimeline } from "@/lib/db/timeline";

export const metadata: Metadata = {
  title: "Timeline · Kalyanam & Co.",
};

export default async function TimelinePage() {
  const wedding = await getOrCreateWedding();
  if (!wedding) notFound();
  const timelineMilestones = await getTimeline(wedding.id);

  return (
    <TimelineView
      initialItems={timelineMilestones}
      weddingDate={wedding.date}
    />
  );
}
