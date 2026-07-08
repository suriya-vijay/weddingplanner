import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

/**
 * Dashboard layout — the couple's private planning workspace. Sidebar +
 * content, no public header/footer. Real per-couple workspace (Supabase auth):
 * your wedding, guests, budget, checklist and timeline all save live.
 */
export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col bg-cream lg:flex-row">
      <DashboardSidebar />
      <main className="flex-1 overflow-x-hidden px-5 py-7 sm:px-8 lg:px-12">
        {children}
      </main>
    </div>
  );
}
