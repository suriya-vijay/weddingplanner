"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { roleOf } from "@/lib/auth/role";
import { acceptInvite } from "@/lib/db/collaborators";

/** A signed-in couple accepts a partner invite with their existing account. */
export async function acceptInviteAction(
  token: string,
): Promise<{ ok: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { ok: false, error: "Please log in first." };
  if (roleOf(user) !== "couple")
    return { ok: false, error: "Only couple accounts can join a wedding." };

  const res = await acceptInvite(token, user.id, user.email);
  if (!res.ok) return res;
  redirect("/dashboard");
}
