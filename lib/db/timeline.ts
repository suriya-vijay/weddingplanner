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

export async function addTimelineMilestone(
  weddingId: string,
  m: Omit<TimelineMilestone, "id">,
): Promise<TimelineMilestone | null> {
  const supabase = await createClient();
  // Place new milestones after existing ones.
  const { count } = await supabase
    .from("timeline_milestones")
    .select("id", { count: "exact", head: true })
    .eq("wedding_id", weddingId);
  const { data } = await supabase
    .from("timeline_milestones")
    .insert({
      wedding_id: weddingId,
      title: m.title,
      detail: m.detail,
      date: m.date || null,
      status: m.status,
      sort: count ?? 0,
    })
    .select("id, title, detail, date, status")
    .single();
  return data ? toMilestone(data as TimelineRow) : null;
}

export async function updateTimelineMilestone(
  id: string,
  patch: Partial<Omit<TimelineMilestone, "id">>,
): Promise<void> {
  const supabase = await createClient();
  // Map "" date → null for the DB.
  const dbPatch: Record<string, unknown> = { ...patch };
  if ("date" in dbPatch) dbPatch.date = (patch.date as string) || null;
  await supabase.from("timeline_milestones").update(dbPatch).eq("id", id);
}

export async function deleteTimelineMilestone(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("timeline_milestones").delete().eq("id", id);
}

/** Bulk insert (used by the AI "suggest a timeline" template). */
export async function addTimelineMilestones(
  weddingId: string,
  items: Omit<TimelineMilestone, "id">[],
): Promise<TimelineMilestone[]> {
  if (!items.length) return [];
  const supabase = await createClient();
  const { count } = await supabase
    .from("timeline_milestones")
    .select("id", { count: "exact", head: true })
    .eq("wedding_id", weddingId);
  const base = count ?? 0;
  const { data } = await supabase
    .from("timeline_milestones")
    .insert(
      items.map((m, i) => ({
        wedding_id: weddingId,
        title: m.title,
        detail: m.detail,
        date: m.date || null,
        status: m.status,
        sort: base + i,
      })),
    )
    .select("id, title, detail, date, status");
  return ((data ?? []) as TimelineRow[]).map(toMilestone);
}
