"use server";

import { revalidatePath } from "next/cache";
import { getOrCreateWedding, updateWedding } from "@/lib/db/weddings";
import * as guestsDb from "@/lib/db/guests";
import * as budgetDb from "@/lib/db/budget";
import * as checklistDb from "@/lib/db/checklist";
import type { Guest, BudgetItem } from "@/lib/mock-data";

/**
 * Dashboard mutations. Each resolves the caller's own wedding (RLS-scoped) so a
 * couple can only ever mutate their own data. Returns the saved row where the
 * client needs the new id.
 */

async function myWeddingId(): Promise<string | null> {
  const w = await getOrCreateWedding();
  return w?.id ?? null;
}

// ── Guests ──────────────────────────────────────────────────────
export async function addGuestAction(
  g: Omit<Guest, "id">,
): Promise<Guest | null> {
  const weddingId = await myWeddingId();
  if (!weddingId) return null;
  return guestsDb.addGuest(weddingId, g);
}

export async function updateGuestAction(
  id: string,
  patch: Partial<Omit<Guest, "id">>,
): Promise<void> {
  await guestsDb.updateGuest(id, patch);
}

export async function deleteGuestAction(id: string): Promise<void> {
  await guestsDb.deleteGuest(id);
}

// ── Budget ──────────────────────────────────────────────────────
export async function addBudgetItemAction(
  item: Omit<BudgetItem, "id">,
): Promise<BudgetItem | null> {
  const weddingId = await myWeddingId();
  if (!weddingId) return null;
  return budgetDb.addBudgetItem(weddingId, item);
}

export async function updateBudgetItemAction(
  id: string,
  patch: Partial<Omit<BudgetItem, "id">>,
): Promise<void> {
  await budgetDb.updateBudgetItem(id, patch);
}

export async function deleteBudgetItemAction(id: string): Promise<void> {
  await budgetDb.deleteBudgetItem(id);
}

// ── Checklist ───────────────────────────────────────────────────
export async function setChecklistDoneAction(
  id: string,
  done: boolean,
): Promise<void> {
  await checklistDb.setChecklistDone(id, done);
}

// ── Wedding profile (settings) ──────────────────────────────────
export async function updateWeddingAction(patch: {
  couple_names?: string;
  partner_a?: string;
  partner_b?: string;
  date?: string | null;
  city?: string;
  venue?: string;
  tradition?: string;
  guest_estimate?: number;
  total_budget?: number;
}): Promise<{ ok: boolean }> {
  const weddingId = await myWeddingId();
  if (!weddingId) return { ok: false };
  await updateWedding(weddingId, patch);
  // Refresh every dashboard page so the countdown/budget/name update.
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}
