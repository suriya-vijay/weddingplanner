"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { claimVendorForUser } from "@/lib/db/vendor-portal";
import { sendEmail } from "@/lib/email/client";
import { welcomeEmail } from "@/lib/email/templates";
import type { Role } from "@/components/auth/session";

type SignupInput = {
  email: string;
  password: string;
  role: Extract<Role, "couple" | "vendor">;
  displayName: string;
};

/**
 * Create a new account, pre-confirmed so the user can sign in immediately
 * (dev-friendly — no email round-trip). Role + display_name are stored in the
 * user metadata; the DB trigger creates the matching `profiles` row. Uses the
 * service-role client (server-only) — never exposed to the browser.
 *
 * Admins are never created here — admin is assigned manually in the DB.
 */
export async function signUpAction(input: SignupInput): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const { email, password, role, displayName } = input;

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { ok: false, error: "Please enter a valid email address." };
  if (password.length < 8)
    return { ok: false, error: "Password must be at least 8 characters." };

  const admin = createServiceClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role, display_name: displayName.trim() },
  });

  if (error) {
    // Most common: the email already exists.
    const msg = /already/i.test(error.message)
      ? "An account with that email already exists — try logging in."
      : error.message;
    return { ok: false, error: msg };
  }

  // A new vendor claims a seeded vendor profile so their portal has content.
  if (role === "vendor" && data.user) {
    await claimVendorForUser(data.user.id, displayName.trim());
  }

  // Welcome email — best-effort: the account is already created, so a mail
  // failure (or no RESEND_API_KEY) must never turn a good signup into an error.
  const { subject, html } = welcomeEmail({ name: displayName.trim(), role });
  await sendEmail({ to: email, subject, html });

  return { ok: true };
}
