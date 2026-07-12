import { createClient } from "@/lib/supabase/server";
import { getOrCreateWedding } from "@/lib/db/weddings";

/**
 * Enquiry chat: a message thread per vendor enquiry. RLS (0006) lets only the
 * enquiry's couple + owning vendor read/post. `sender` is derived server-side
 * from the caller's role — never trusted from the client.
 */

export type EnquiryMessage = {
  id: string;
  sender: "couple" | "vendor";
  body: string;
  createdAt: string;
};

/** A couple's own enquiry (they can now SELECT their rows via 0006). */
export type CoupleEnquiry = {
  id: string;
  vendorName: string;
  vendorSlug: string;
  status: string;
  city: string;
  functions: string;
  budget: string;
  message: string;
  date: string;
};

export async function getEnquiryMessages(
  enquiryId: string,
): Promise<EnquiryMessage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("enquiry_messages")
    .select("id, sender, body, created_at")
    .eq("enquiry_id", enquiryId)
    .order("created_at");
  return (data ?? []).map(
    (m: { id: string; sender: string; body: string; created_at: string }) => ({
      id: m.id,
      sender: m.sender as "couple" | "vendor",
      body: m.body,
      createdAt: m.created_at,
    }),
  );
}

export async function sendEnquiryMessage(
  enquiryId: string,
  sender: "couple" | "vendor",
  body: string,
): Promise<EnquiryMessage | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("enquiry_messages")
    .insert({ enquiry_id: enquiryId, sender, body })
    .select("id, sender, body, created_at")
    .single();
  return data
    ? {
        id: (data as { id: string }).id,
        sender,
        body,
        createdAt: (data as { created_at: string }).created_at,
      }
    : null;
}

/** The signed-in couple's own enquiries (with the vendor's name/slug). */
export async function getMyEnquiriesAsCouple(): Promise<CoupleEnquiry[]> {
  const supabase = await createClient();
  const wedding = await getOrCreateWedding();
  if (!wedding) return [];

  const { data } = await supabase
    .from("vendor_enquiries")
    .select(
      "id, status, city, functions, budget, message, date, vendors ( name, slug )",
    )
    .eq("from_wedding_id", wedding.id)
    .order("created_at", { ascending: false });

  return (data ?? []).map(
    (r: {
      id: string;
      status: string;
      city: string;
      functions: string;
      budget: string;
      message: string;
      date: string;
      vendors: { name: string; slug: string } | { name: string; slug: string }[] | null;
    }) => {
      const v = Array.isArray(r.vendors) ? r.vendors[0] : r.vendors;
      return {
        id: r.id,
        vendorName: v?.name ?? "Vendor",
        vendorSlug: v?.slug ?? "",
        status: r.status,
        city: r.city,
        functions: r.functions,
        budget: r.budget,
        message: r.message,
        date: r.date,
      };
    },
  );
}
