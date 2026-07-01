import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VendorProfileView } from "@/components/vendor/profile-view";
import { getVendorBySlug, myVendorSlug } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "My Profile · Vendor Portal",
};

export default function VendorProfilePage() {
  const vendor = getVendorBySlug(myVendorSlug);
  if (!vendor) notFound();
  return <VendorProfileView vendor={vendor} />;
}
