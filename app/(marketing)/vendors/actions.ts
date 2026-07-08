"use server";

import { createEnquiry, type NewEnquiry } from "@/lib/db/enquiries";

/** Submit a couple → vendor enquiry (lead). RLS scopes it to the couple. */
export async function sendEnquiryAction(
  input: NewEnquiry,
): Promise<{ ok: boolean; error?: string }> {
  const res = await createEnquiry(input);
  return res.ok ? { ok: true } : { ok: false, error: res.error };
}
