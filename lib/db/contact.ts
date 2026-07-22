import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * Contact-form submissions.
 *
 * Writes go through the caller's own client (the public insert policy in 0012
 * allows anonymous submits). Admin reads use the SERVICE-ROLE client for the
 * same reason `admin-stats.ts` does — the admin screens are route-gated, and
 * this avoids depending on `my_role()` resolving for every read.
 */
export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  interest: string;
  message: string;
  handled: boolean;
  createdAt: string;
};

type Row = {
  id: string;
  name: string;
  email: string;
  interest: string;
  message: string;
  handled: boolean;
  created_at: string;
};

const toSubmission = (r: Row): ContactSubmission => ({
  id: r.id,
  name: r.name,
  email: r.email,
  interest: r.interest,
  message: r.message,
  handled: r.handled,
  createdAt: r.created_at,
});

/** Store a submission. Returns false if the table isn't there yet (pre-0012). */
export async function createContactSubmission(input: {
  name: string;
  email: string;
  interest: string;
  message: string;
}): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    name: input.name,
    email: input.email,
    interest: input.interest,
    message: input.message,
  });
  return !error;
}

/** Every submission, newest first (admin inbox). */
export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const admin = createServiceClient();
  const { data, error } = await admin
    .from("contact_submissions")
    .select("id, name, email, interest, message, handled, created_at")
    .order("created_at", { ascending: false });
  if (error || !data) return []; // pre-migration → empty inbox, no crash
  return (data as Row[]).map(toSubmission);
}

/** Mark a submission handled (or un-handled). */
export async function setContactHandled(
  id: string,
  handled: boolean,
): Promise<boolean> {
  const admin = createServiceClient();
  const { error } = await admin
    .from("contact_submissions")
    .update({ handled })
    .eq("id", id);
  return !error;
}
