import { Resend } from "resend";

/**
 * Transactional email via Resend (server-only). ALWAYS best-effort: if
 * RESEND_API_KEY is missing (e.g. before you've set it, or in a preview build)
 * this logs a warning and no-ops instead of throwing, so nothing that sends
 * email (signup, admin actions) can ever break because email isn't configured.
 *
 * SETUP: get a free key at https://resend.com (3,000 emails/mo, no card) and set
 *   RESEND_API_KEY=...        (server-only — never NEXT_PUBLIC_)
 *
 * FROM address: the Resend TEST sender below works immediately but can only
 * deliver to YOUR OWN Resend account email until you verify a domain. At launch,
 * verify a domain in Resend and change FROM to e.g. "Kalyanam & Co. <hello@yourdomain>".
 */
const FROM = "Kalyanam & Co. <onboarding@resend.dev>";

let client: Resend | null = null;
function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; skipped?: boolean }> {
  const resend = getClient();
  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY not set — skipped "${subject}" to ${to}`,
    );
    return { ok: false, skipped: true };
  }
  if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return { ok: false, skipped: true };
  }
  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html });
    if (error) {
      console.error("[email] send failed:", error);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] send threw:", err);
    return { ok: false };
  }
}
