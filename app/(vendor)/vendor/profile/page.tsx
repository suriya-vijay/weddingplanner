import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VendorProfileView } from "@/components/vendor/profile-view";
import { getMyVendor } from "@/lib/db/vendor-portal";

export const metadata: Metadata = {
  title: "My Profile · Vendor Portal",
};

export default async function VendorProfilePage() {
  const vendor = await getMyVendor();
  if (!vendor) notFound();
  return <VendorProfileView vendor={vendor} />;
}
