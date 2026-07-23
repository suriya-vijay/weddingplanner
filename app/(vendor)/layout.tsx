import { VendorSidebar } from "@/components/vendor/vendor-sidebar";
import { getMyVendor, getVendorUnreadCount } from "@/lib/db/vendor-portal";

/**
 * Vendor layout — the vendor's private business workspace. Sidebar + content,
 * no public header/footer. Real vendor account (Supabase auth); profile edits,
 * image uploads, packages, and enquiries all persist live. Computes the unread
 * enquiry count for the sidebar notification badge.
 */
export default async function VendorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const vendor = await getMyVendor();
  const unread = vendor ? await getVendorUnreadCount(vendor.id) : 0;
  return (
    <div className="flex min-h-dvh flex-col bg-cream lg:flex-row">
      <VendorSidebar unreadEnquiries={unread} />
      <main className="texture-paisley on-light flex-1 overflow-x-hidden px-5 py-7 sm:px-8 lg:px-12">
        {children}
      </main>
    </div>
  );
}
