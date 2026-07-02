"use server";

import { createServiceClient } from "@/lib/supabase/server";
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
  const { error } = await admin.auth.admin.createUser({
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

  return { ok: true };
}
