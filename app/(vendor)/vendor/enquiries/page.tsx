import type { Metadata } from "next";
import { EnquiriesView } from "@/components/vendor/enquiries-view";

export const metadata: Metadata = {
  title: "Enquiries · Vendor Portal",
};

export default function VendorEnquiriesPage() {
  return <EnquiriesView />;
}
