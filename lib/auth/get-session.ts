import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/components/auth/session";
import { roleOf } from "@/lib/auth/role";

export type SessionUser = { name: string; role: Role };

/**
 * Resolve the current signed-in user + role for server components/layouts.
 * Reads role/display_name from the auth user metadata (set at signup), so this
 * is a single revalidated auth call with no extra DB round-trip. Returns null
 * when signed out.
 *
 * Wrapped in React.cache so the root layout, the panel layout and the page all
 * share ONE auth round-trip per request instead of each re-fetching it.
 */
export const getSessionUser = cache(async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const role: Role = roleOf(user);
  const name =
    (user.user_metadata?.display_name as string | undefined)?.trim() ||
    user.email ||
    "Member";

  return { name, role };
});

/**
 * Server-action guard: the signed-in user if they have `role`, else null.
 * Layouts gate pages, but server actions are public endpoints — every
 * privileged action must check for itself.
 */
export async function requireRole(role: Role): Promise<SessionUser | null> {
  const user = await getSessionUser();
  return user?.role === role ? user : null;
}
