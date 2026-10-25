"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { claimVendorForUser } from "@/lib/db/vendor-portal";
import { acceptInvite, getInviteByToken, maskEmail } from "@/lib/db/collaborators";
import { sendEmail } from "@/lib/email/client";
import { welcomeEmail } from "@/lib/email/templates";
import type { Role } from "@/components/auth/session";

type SignupInput = {
  email: string;
  password: string;
  role: Extract<Role, "couple" | "vendor">;
  displayName: string;
  /** When set, links the new account as a collaborator on a shared wedding. */
  inviteToken?: string;
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
  const { email, password, displayName, inviteToken } = input;
  // Server actions are public endpoints — the TS type above isn't enforced at
  // runtime, so anything other than "vendor" (including "admin") is a couple.
  const role = input.role === "vendor" ? "vendor" : "couple";

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { ok: false, error: "Please enter a valid email address." };
  if (password.length < 8)
    return { ok: false, error: "Password must be at least 8 characters." };

  // Check a partner invite BEFORE creating the account, so a mismatched email
  // gets a clear error instead of an account that silently isn't linked.
  if (inviteToken) {
    const invite = await getInviteByToken(inviteToken);
    if (!invite || invite.status !== "pending")
      return {
        ok: false,
        error: "This invite has expired or was already used. Ask your partner to send a new one.",
      };
    if (invite.invitedEmail && invite.invitedEmail !== email.trim().toLowerCase())
      return {
        ok: false,
        error: `This invite was sent to ${maskEmail(invite.invitedEmail)} — please sign up with that email.`,
      };
  }

  const admin = createServiceClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role, display_name: displayName.trim() },
    // The trusted copy: only the service role can write app_metadata.
    app_metadata: { role },
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

  // Partner invite: link this new account as a collaborator on the shared
  // wedding, so getOrCreateWedding() resolves the inviter's wedding for them.
  if (inviteToken && role === "couple" && data.user) {
    await acceptInvite(inviteToken, data.user.id, email);
  }

  // Welcome email — best-effort: the account is already created, so a mail
  // failure (or no RESEND_API_KEY) must never turn a good signup into an error.
  const { subject, html } = welcomeEmail({ name: displayName.trim(), role });
  await sendEmail({ to: email, subject, html });

  return { ok: true };
}
