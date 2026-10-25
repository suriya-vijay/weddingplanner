import type { User } from "@supabase/supabase-js";

export type AppRole = "couple" | "vendor" | "admin";

/**
 * The ONE place a user's role is read from their auth record.
 *
 * `app_metadata` is writable only by the service role (and the 0017 signup
 * trigger), so it's trusted for every role. `user_metadata` is editable by the
 * user themselves (`supabase.auth.updateUser`), so it's only a fallback for
 * accounts created before 0017 backfilled app_metadata — and it can never
 * yield "admin".
 */
export function roleOf(user: Pick<User, "app_metadata" | "user_metadata"> | null | undefined): AppRole {
  const trusted = user?.app_metadata?.role;
  if (trusted === "couple" || trusted === "vendor" || trusted === "admin") return trusted;
  return user?.user_metadata?.role === "vendor" ? "vendor" : "couple";
}
