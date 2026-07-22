import { createServiceClient } from "@/lib/supabase/server";

/**
 * Every enquiry plus its message thread, for moderation.
 *
 * `enq_admin` (0002) and `enq_msg_admin` (0006) already grant admins full
 * access — the permission was written and the screen was never built, so an
 * abuse report had nowhere to be actioned. Uses the service-role client for
 * the same reason as the other admin reads (route-gated, avoids depending on
 * my_role() resolving per query).
 */
export type AdminEnquiry = {
  id: string;
  couple: string;
  vendorName: string;
  city: string;
  functions: string;
  budget: string;
  status: string;
  message: string;
  createdAt: string;
  messages: { id: string; sender: string; body: string; createdAt: string }[];
};

export async function getAllEnquiries(): Promise<AdminEnquiry[]> {
  const admin = createServiceClient();

  const { data: rows, error } = await admin
    .from("vendor_enquiries")
    .select(
      "id, couple, city, functions, budget, status, message, created_at, vendors ( name )",
    )
    .order("created_at", { ascending: false });
  if (error || !rows) return [];

  const ids = (rows as { id: string }[]).map((r) => r.id);
  const { data: msgs } = ids.length
    ? await admin
        .from("enquiry_messages")
        .select("id, enquiry_id, sender, body, created_at")
        .in("enquiry_id", ids)
        .order("created_at")
    : { data: [] };

  const byEnquiry = new Map<
    string,
    { id: string; sender: string; body: string; createdAt: string }[]
  >();
  for (const m of (msgs ?? []) as {
    id: string;
    enquiry_id: string;
    sender: string;
    body: string;
    created_at: string;
  }[]) {
    const list = byEnquiry.get(m.enquiry_id) ?? [];
    list.push({
      id: m.id,
      sender: m.sender,
      body: m.body,
      createdAt: m.created_at,
    });
    byEnquiry.set(m.enquiry_id, list);
  }

  return (
    rows as unknown as {
      id: string;
      couple: string;
      city: string;
      functions: string;
      budget: string;
      status: string;
      message: string;
      created_at: string;
      vendors: { name: string } | { name: string }[] | null;
    }[]
  ).map((r) => {
    const v = Array.isArray(r.vendors) ? r.vendors[0] : r.vendors;
    return {
      id: r.id,
      couple: r.couple || "—",
      vendorName: v?.name ?? "—",
      city: r.city,
      functions: r.functions,
      budget: r.budget,
      status: r.status,
      message: r.message,
      createdAt: r.created_at,
      messages: byEnquiry.get(r.id) ?? [],
    };
  });
}
