import { createClient } from "@/lib/supabase/server";
import type { BudgetItem } from "@/lib/mock-data";

type BudgetRow = {
  id: string;
  category: string;
  label: string;
  estimated: number;
  spent: number;
  status: string;
};

const toItem = (r: BudgetRow): BudgetItem => ({
  id: r.id,
  category: r.category,
  label: r.label,
  estimated: Number(r.estimated),
  spent: Number(r.spent),
  status: r.status as BudgetItem["status"],
});

export async function getBudgetItems(weddingId: string): Promise<BudgetItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("budget_items")
    .select("id, category, label, estimated, spent, status")
    .eq("wedding_id", weddingId)
    .order("created_at");
  return ((data ?? []) as BudgetRow[]).map(toItem);
}

export async function addBudgetItem(
  weddingId: string,
  item: Omit<BudgetItem, "id">,
): Promise<BudgetItem | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("budget_items")
    .insert({ wedding_id: weddingId, ...item })
    .select("id, category, label, estimated, spent, status")
    .single();
  return data ? toItem(data as BudgetRow) : null;
}

export async function updateBudgetItem(
  id: string,
  patch: Partial<Omit<BudgetItem, "id">>,
): Promise<void> {
  const supabase = await createClient();
  await supabase.from("budget_items").update(patch).eq("id", id);
}

export async function deleteBudgetItem(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("budget_items").delete().eq("id", id);
}
