import { createClient } from "@/lib/supabase/server";
import type { ChecklistItem } from "@/lib/mock-data";

type ChecklistRow = {
  id: string;
  task: string;
  phase: string;
  category: string;
  done: boolean;
};

const toItem = (r: ChecklistRow): ChecklistItem => ({
  id: r.id,
  task: r.task,
  phase: r.phase as ChecklistItem["phase"],
  category: r.category,
  done: r.done,
});

export async function getChecklist(weddingId: string): Promise<ChecklistItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("checklist_items")
    .select("id, task, phase, category, done")
    .eq("wedding_id", weddingId)
    .order("sort");
  return ((data ?? []) as ChecklistRow[]).map(toItem);
}

export async function setChecklistDone(
  id: string,
  done: boolean,
): Promise<void> {
  const supabase = await createClient();
  await supabase.from("checklist_items").update({ done }).eq("id", id);
}
