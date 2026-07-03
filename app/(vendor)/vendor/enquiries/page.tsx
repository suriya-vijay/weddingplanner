import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnquiriesView } from "@/components/vendor/enquiries-view";
import { getMyVendor, getMyEnquiries } from "@/lib/db/vendor-portal";

export const metadata: Metadata = {
  title: "Enquiries · Vendor Portal",
};

export default async function VendorEnquiriesPage() {
  const vendor = await getMyVendor();
  if (!vendor) notFound();
  const enquiries = await getMyEnquiries(vendor.id);
  return <EnquiriesView initialEnquiries={enquiries} />;
}
