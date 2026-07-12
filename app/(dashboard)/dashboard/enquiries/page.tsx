import type { Metadata } from "next";
import { CoupleEnquiries } from "@/components/dashboard/couple-enquiries";
import {
  getMyEnquiriesAsCouple,
  getEnquiryMessages,
  type EnquiryMessage,
} from "@/lib/db/enquiry-chat";

export const metadata: Metadata = {
  title: "Messages · Kalyanam & Co.",
};

export default async function CoupleEnquiriesPage() {
  const enquiries = await getMyEnquiriesAsCouple();

  // Load each thread (couples rarely have many enquiries).
  const threads: Record<string, EnquiryMessage[]> = {};
  await Promise.all(
    enquiries.map(async (e) => {
      threads[e.id] = await getEnquiryMessages(e.id);
    }),
  );

  return <CoupleEnquiries enquiries={enquiries} threads={threads} />;
}
