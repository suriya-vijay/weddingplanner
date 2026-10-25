"use server";

import { createContactSubmission } from "@/lib/db/contact";

/**
 * Store a contact-form submission. Previously the form faked a network call
 * with setTimeout and threw the message away.
 */
export async function sendContactMessageAction(input: {
  name: string;
  email: string;
  interest: string;
  message: string;
}): Promise<{ ok: boolean }> {
  // Re-validate here: the form's checks are client-side only, and this action
  // is a public endpoint. Limits match the 0017 insert policy.
  const name = String(input.name ?? "").trim().slice(0, 200);
  const email = String(input.email ?? "").trim().slice(0, 320);
  const message = String(input.message ?? "").trim().slice(0, 5000);
  const interest = String(input.interest ?? "").trim().slice(0, 100);
  if (!name || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { ok: false };

  const ok = await createContactSubmission({ name, email, interest, message });
  return { ok };
}
