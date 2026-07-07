import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PackagesView } from "@/components/vendor/packages-view";
import { getMyVendor, getMyPackages } from "@/lib/db/vendor-portal";

export const metadata: Metadata = {
  title: "Packages · Vendor Portal",
};

export default async function VendorPackagesPage() {
  const vendor = await getMyVendor();
  if (!vendor) notFound();

  const seed = await getMyPackages(vendor.id);
  return <PackagesView seed={seed} />;
}
