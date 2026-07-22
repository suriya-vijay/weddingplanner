import { createServiceClient } from "@/lib/supabase/server";

/**
 * Admin dashboard aggregates.
 *
 * These are cross-tenant counts (every couple's saves, every vendor's views),
 * so they use the SERVICE-ROLE client: `saved_inspiration` is guarded by an
 * owner-only policy (`saved_owner`, 0002) with no admin policy, so an admin's
 * own session would legitimately count 0. Server-only — the route that calls
 * this is already admin-gated by the proxy/middleware.
 *
 * Every figure here is a real query. No invented numbers ship.
 */
export type AdminStats = {
  /** Total inspiration items saved to mood boards, across all couples. */
  totalSaves: number;
  /** Sum of every vendor's real profile-view counter (0010). */
  profileViews: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  const admin = createServiceClient();

  const [saves, views] = await Promise.all([
    admin
      .from("saved_inspiration")
      .select("wedding_id", { count: "exact", head: true }),
    admin.from("vendors").select("profile_views"),
  ]);

  const profileViews = ((views.data ?? []) as { profile_views?: number }[])
    .reduce((sum, v) => sum + (v.profile_views ?? 0), 0);

  return { totalSaves: saves.count ?? 0, profileViews };
}
