import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VendorProfileView } from "@/components/vendor/profile-view";
import { getMyVendor } from "@/lib/db/vendor-portal";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Profile · Vendor Portal",
};

export default async function VendorProfilePage() {
  const vendor = await getMyVendor();
  if (!vendor) notFound();

  // The vendor's user id = the RLS-significant folder for vendor-media uploads.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <VendorProfileView vendor={vendor} userId={user?.id ?? ""} />;
}
