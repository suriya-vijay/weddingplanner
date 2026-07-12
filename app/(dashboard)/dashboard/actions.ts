"use server";

import { revalidatePath } from "next/cache";
import { getOrCreateWedding, updateWedding } from "@/lib/db/weddings";
import * as guestsDb from "@/lib/db/guests";
import * as budgetDb from "@/lib/db/budget";
import * as checklistDb from "@/lib/db/checklist";
import * as timelineDb from "@/lib/db/timeline";
import { saveVenueLayout, type VenueData } from "@/lib/db/venue";
import { sendEnquiryMessage, type EnquiryMessage } from "@/lib/db/enquiry-chat";
import { buildAdvisorSystemPrompt } from "@/lib/ai/system-prompt";
import { generateTimelineMilestones } from "@/lib/ai/gemini";
import type {
  Guest,
  BudgetItem,
  ChecklistItem,
  TimelineMilestone,
} from "@/lib/mock-data";

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

export async function addChecklistItemAction(
  item: Pick<ChecklistItem, "task" | "phase" | "category">,
): Promise<ChecklistItem | null> {
  const weddingId = await myWeddingId();
  if (!weddingId) return null;
  return checklistDb.addChecklistItem(weddingId, item);
}

export async function deleteChecklistItemAction(id: string): Promise<void> {
  await checklistDb.deleteChecklistItem(id);
}

// ── Timeline ────────────────────────────────────────────────────
export async function addTimelineAction(
  m: Omit<TimelineMilestone, "id">,
): Promise<TimelineMilestone | null> {
  const weddingId = await myWeddingId();
  if (!weddingId) return null;
  return timelineDb.addTimelineMilestone(weddingId, m);
}

export async function updateTimelineAction(
  id: string,
  patch: Partial<Omit<TimelineMilestone, "id">>,
): Promise<void> {
  await timelineDb.updateTimelineMilestone(id, patch);
}

export async function deleteTimelineAction(id: string): Promise<void> {
  await timelineDb.deleteTimelineMilestone(id);
}

/**
 * AI: generate a starter timeline tuned to the couple's wedding and insert the
 * milestones (editable afterward). Degrades gracefully if the AI key/quota is
 * unavailable — returns { ok:false } and the UI keeps the existing list.
 */
export async function suggestTimelineAction(): Promise<{
  ok: boolean;
  milestones?: TimelineMilestone[];
  error?: string;
}> {
  const weddingId = await myWeddingId();
  if (!weddingId) return { ok: false, error: "No wedding found." };

  const context = await buildAdvisorSystemPrompt();
  if (!context) return { ok: false, error: "No wedding context." };

  let generated;
  try {
    generated = await generateTimelineMilestones(context);
  } catch (err) {
    const msg =
      err instanceof Error && /GEMINI_API_KEY/.test(err.message)
        ? "The AI timeline isn't configured (missing GEMINI_API_KEY)."
        : "The AI timeline is unavailable right now.";
    return { ok: false, error: msg };
  }
  if (!generated.length)
    return { ok: false, error: "The AI didn't return any milestones." };

  const milestones = await timelineDb.addTimelineMilestones(
    weddingId,
    generated.map((m) => ({
      title: m.title,
      detail: m.detail,
      date: m.date,
      status: "upcoming" as const,
    })),
  );
  revalidatePath("/dashboard/timeline");
  return { ok: true, milestones };
}

// ── Venue layout ────────────────────────────────────────────────
export async function saveVenueAction(
  data: VenueData,
): Promise<{ ok: boolean }> {
  const weddingId = await myWeddingId();
  if (!weddingId) return { ok: false };
  return saveVenueLayout(weddingId, data);
}

// ── Enquiry chat (couple side) ──────────────────────────────────
export async function sendCoupleMessageAction(
  enquiryId: string,
  body: string,
): Promise<EnquiryMessage | null> {
  const text = body.trim();
  if (!text) return null;
  return sendEnquiryMessage(enquiryId, "couple", text);
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
