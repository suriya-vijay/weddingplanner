"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut } from "lucide-react";
import { useSession, initialsOf } from "@/components/auth/session";

/**
 * Footer block for the admin & dashboard sidebars: shows the signed-in (mock)
 * identity, a "Back to site" link, and a Sign out action. If there's no mock
 * session (e.g. arrived by typing the URL), it shows a subtle demo hint instead.
 */
export function SidebarAccount() {
  const { user, signOut } = useSession();
  const router = useRouter();

  return (
    <div className="mt-auto hidden flex-col gap-1 lg:flex">
      {user ? (
        <div className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5">
          <span
            aria-hidden
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-500 text-xs font-semibold text-forest-900"
          >
            {initialsOf(user.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-cream">{user.name}</p>
            <p className="text-[0.65rem] capitalize text-cream/50">
              {user.role} · demo
            </p>
          </div>
        </div>
      ) : (
        <p className="mb-1 rounded-xl bg-cream/[0.06] px-3 py-2.5 text-xs text-cream/50">
          Demo preview — not signed in.
        </p>
      )}

      <Link
        href="/"
        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-cream/55 transition-colors hover:text-cream"
      >
        <ArrowLeft className="h-4 w-4" /> Back to site
      </Link>

      {user && (
        <button
          type="button"
          onClick={() => {
            signOut();
            router.push("/");
          }}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-cream/55 transition-colors hover:text-cream"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      )}
    </div>
  );
}
