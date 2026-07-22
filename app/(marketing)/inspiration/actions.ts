"use server";

import { revalidatePath } from "next/cache";
import { toggleSavedInspiration } from "@/lib/db/saved-inspiration";

/**
 * Save / unsave an inspiration item to the signed-in couple's mood board.
 * Returns the new saved state, or null when the caller has no wedding (e.g. a
 * signed-out visitor or a vendor) so the UI can prompt them to sign in.
 */
export async function toggleSavedInspirationAction(
  inspirationId: string,
): Promise<{ saved: boolean | null }> {
  const saved = await toggleSavedInspiration(inspirationId);
  // The dashboard's "Saved inspiration" strip reads this.
  if (saved !== null) revalidatePath("/dashboard");
  return { saved };
}
