"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { acceptInviteAction } from "./actions";

/** "Join" for a partner who already has an account and is signed in. */
export function AcceptInviteButton({ token }: { token: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function accept() {
    setPending(true);
    setError(null);
    // On success the action redirects to /dashboard and never resolves here.
    const res = await acceptInviteAction(token).catch(() => ({
      ok: false as const,
      error: "Something went wrong. Please try again.",
    }));
    setPending(false);
    setError(res.error);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Button type="button" variant="primary" size="lg" loading={pending} onClick={accept}>
        Join the shared dashboard
      </Button>
      {error && (
        <p role="alert" className="max-w-sm text-sm text-blush-100">
          {error}
        </p>
      )}
    </div>
  );
}
