import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnquiriesView } from "@/components/vendor/enquiries-view";
import { getMyVendor, getMyEnquiries } from "@/lib/db/vendor-portal";
import {
  getEnquiryMessages,
  type EnquiryMessage,
} from "@/lib/db/enquiry-chat";

export const metadata: Metadata = {
  title: "Enquiries · Vendor Portal",
};

export default async function VendorEnquiriesPage() {
  const vendor = await getMyVendor();
  if (!vendor) notFound();
  const enquiries = await getMyEnquiries(vendor.id);

  const threads: Record<string, EnquiryMessage[]> = {};
  await Promise.all(
    enquiries.map(async (e) => {
      threads[e.id] = await getEnquiryMessages(e.id);
    }),
  );

  return <EnquiriesView initialEnquiries={enquiries} threads={threads} />;
}
