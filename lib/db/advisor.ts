import { createClient } from "@/lib/supabase/server";

/**
 * Advisor persistence (couple-owned, RLS-scoped). One running conversation per
 * couple for now — simplest UX; the schema supports multiple if we add them.
 */

export type AdvisorRole = "user" | "model";

export type AdvisorMessage = {
  id: string;
  role: AdvisorRole;
  content: string;
};

/** The couple's conversation id, creating it on first use. Null if not signed in. */
export async function getOrCreateConversation(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: existing } = await supabase
    .from("advisor_conversations")
    .select("id")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (existing) return (existing as { id: string }).id;

  const { data: created } = await supabase
    .from("advisor_conversations")
    .insert({ owner_id: user.id })
    .select("id")
    .single();
  return created ? (created as { id: string }).id : null;
}

/** Ordered messages for a conversation. */
export async function getMessages(
  conversationId: string,
): Promise<AdvisorMessage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("advisor_messages")
    .select("id, role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  return (data ?? []) as AdvisorMessage[];
}

/** Append a message. Returns its id (null on failure). */
export async function addMessage(
  conversationId: string,
  role: AdvisorRole,
  content: string,
): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("advisor_messages")
    .insert({ conversation_id: conversationId, role, content })
    .select("id")
    .single();
  return data ? (data as { id: string }).id : null;
}
