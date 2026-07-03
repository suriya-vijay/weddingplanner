import { createClient } from "@/lib/supabase/server";
import type { TimelineMilestone } from "@/lib/mock-data";

type TimelineRow = {
  id: string;
  title: string;
  detail: string;
  date: string | null;
  status: string;
};

const toMilestone = (r: TimelineRow): TimelineMilestone => ({
  id: r.id,
  title: r.title,
  detail: r.detail,
  date: r.date ?? "",
  status: r.status as TimelineMilestone["status"],
});

export async function getTimeline(
  weddingId: string,
): Promise<TimelineMilestone[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("timeline_milestones")
    .select("id, title, detail, date, status")
    .eq("wedding_id", weddingId)
    .order("sort");
  return ((data ?? []) as TimelineRow[]).map(toMilestone);
}
