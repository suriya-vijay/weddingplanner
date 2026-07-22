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
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  if (!name || !email || !message) return { ok: false };

  const ok = await createContactSubmission({
    name,
    email,
    interest: input.interest,
    message,
  });
  return { ok };
}
