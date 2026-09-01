import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LotusMark, DividerOrnament } from "@/components/brand/motifs";
import { getInviteByToken } from "@/lib/db/collaborators";

export const metadata = {
  title: "You're invited · Kalyanam & Co.",
};

/**
 * Public partner-invite landing (no login needed). Looks up the invite by its
 * unguessable token via the service client, then invites the partner to create
 * their OWN account — which links them to the shared wedding (via ?invite=).
 */
export default async function PartnerInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await getInviteByToken(token);

  const valid = invite && invite.status !== "expired";
  const inviter = invite?.coupleNames?.trim() || "Your partner";

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-forest-900 px-6 py-16 text-center">
      <div className="relative mx-auto max-w-lg">
        <LotusMark className="draw mx-auto mb-6 h-12 w-12 text-gold-400" />
        {valid ? (
          <>
            <p className="eyebrow text-gold-400">You&rsquo;re invited</p>
            <h1 className="mt-4 font-serif text-h1 text-cream">
              Plan your wedding
              <span className="italic text-gold-400"> together</span>
            </h1>
            <p className="lede mx-auto mt-5 text-cream/75">
              <strong className="text-cream">{inviter}</strong> has invited you
              to co-plan on Kalyanam &amp; Co. Create your own private login and
              you&rsquo;ll share the same dashboard — checklist, budget, guests,
              timeline and seating — no passwords shared.
            </p>
            <DividerOrnament className="mx-auto my-9 text-gold-400" />
            <div className="flex flex-col items-center gap-4">
              <Button
                href={`/signup?invite=${encodeURIComponent(token)}`}
                variant="primary"
                size="lg"
              >
                Accept &amp; create your account
              </Button>
              <Link
                href={`/login?next=/dashboard`}
                className="text-sm text-cream/70 underline-offset-4 hover:text-gold-400 hover:underline"
              >
                Already have an account? Log in
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-4 font-serif text-h1 text-cream">
              This invite isn&rsquo;t valid
            </h1>
            <p className="lede mx-auto mt-5 text-cream/75">
              The link may have expired or already been used. Ask your partner to
              send a fresh invite from their wedding settings.
            </p>
            <div className="mt-8">
              <Button href="/" variant="primary" size="lg">
                Back to Kalyanam &amp; Co.
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
