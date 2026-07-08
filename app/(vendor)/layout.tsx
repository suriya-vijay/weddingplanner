import { VendorSidebar } from "@/components/vendor/vendor-sidebar";

/**
 * Vendor layout — the vendor's private business workspace. Sidebar + content,
 * no public header/footer. Real vendor account (Supabase auth); profile edits,
 * image uploads, packages, and enquiries all persist live. A few Overview
 * headline metrics (e.g. profile views) are still sample numbers.
 */
export default function VendorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col bg-cream lg:flex-row">
      <VendorSidebar />
      <main className="flex-1 overflow-x-hidden px-5 py-7 sm:px-8 lg:px-12">
        {children}
      </main>
    </div>
  );
}
