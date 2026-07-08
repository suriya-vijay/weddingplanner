import { AdminSidebar } from "@/components/admin/admin-sidebar";

/**
 * Admin layout — sidebar + content. No public header/footer. Real role-gated
 * admin (Supabase auth); inspiration edits + image uploads persist live.
 */
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col bg-cream lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden px-5 py-7 sm:px-8 lg:px-12">
        {children}
      </main>
    </div>
  );
}
