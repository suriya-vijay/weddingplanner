import { createClient } from "@/lib/supabase/server";
import { getOrCreateWedding } from "@/lib/db/weddings";

/**
 * Couple → vendor enquiries (leads). The couple inserts a lead scoped to their
 * own wedding; RLS (`enq_couple_insert`) enforces that `from_wedding_id` belongs
 * to them. The vendor reads these via getMyEnquiries() in vendor-portal.ts.
 */

export type NewEnquiry = {
  vendorId: string;
  eventDate?: string; // yyyy-mm-dd or ""
  city?: string;
  functions?: string;
  budget?: string;
  message?: string;
};

export async function createEnquiry(
  input: NewEnquiry,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in to send an enquiry." };

  // Only couples enquire; resolve (or provision) their wedding for the lead.
  const wedding = await getOrCreateWedding();
  if (!wedding)
    return { ok: false, error: "Only couples can send enquiries." };

  const { error } = await supabase.from("vendor_enquiries").insert({
    vendor_id: input.vendorId,
    from_wedding_id: wedding.id,
    couple: wedding.coupleNames || "A couple",
    event_date: input.eventDate || null,
    city: input.city ?? "",
    functions: input.functions ?? "",
    budget: input.budget ?? "",
    message: input.message ?? "",
    status: "New",
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
