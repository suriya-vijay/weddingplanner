import { createServiceClient } from "@/lib/supabase/server";

/**
 * Who is signed up. The site owner previously had NO way to see their own
 * users — there is no admin select policy on `profiles` (only
 * `profiles_select_own`, 0001), and emails live in `auth.users`, not
 * `profiles`. So this uses the service-role client plus the auth admin API.
 *
 * Server-only; the /admin routes are role-gated in the layout and the proxy.
 */
export type Person = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  /** Their wedding (couples) or business (vendors), when they have one. */
  context: string;
};

export async function getPeople(): Promise<Person[]> {
  const admin = createServiceClient();

  const [{ data: profiles }, authRes, { data: weddings }, { data: vendors }] =
    await Promise.all([
      admin.from("profiles").select("id, role, display_name, created_at"),
      admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
      admin.from("weddings").select("owner_id, couple_names"),
      admin.from("vendors").select("owner_id, name"),
    ]);

  const emailById = new Map<string, string>();
  for (const u of authRes.data?.users ?? []) {
    if (u.id) emailById.set(u.id, u.email ?? "");
  }
  const weddingByOwner = new Map<string, string>();
  for (const w of (weddings ?? []) as { owner_id: string; couple_names: string }[]) {
    if (w.owner_id) weddingByOwner.set(w.owner_id, w.couple_names);
  }
  const vendorByOwner = new Map<string, string>();
  for (const v of (vendors ?? []) as { owner_id: string | null; name: string }[]) {
    if (v.owner_id) vendorByOwner.set(v.owner_id, v.name);
  }

  return (
    (profiles ?? []) as {
      id: string;
      role: string;
      display_name: string;
      created_at: string;
    }[]
  )
    .map((p) => ({
      id: p.id,
      name: p.display_name || "—",
      email: emailById.get(p.id) ?? "—",
      role: p.role,
      createdAt: p.created_at,
      context:
        weddingByOwner.get(p.id) ?? vendorByOwner.get(p.id) ?? "",
    }))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
