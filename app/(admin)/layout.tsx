import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getSessionUser } from "@/lib/auth/get-session";

/**
 * Admin layout — sidebar + content, no public header/footer.
 *
 * Role-gated HERE as well as in the proxy. Defense in depth: the admin screens
 * read cross-tenant data with the service-role client (see lib/db/admin-stats),
 * which bypasses RLS, so this must not rely on the middleware alone.
 * `getSessionUser()` defaults an unknown role to "couple", so a user with no
 * role metadata is denied rather than let through.
 */
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/");

  return (
    <div className="flex min-h-dvh flex-col bg-cream lg:flex-row">
      <AdminSidebar />
      <main className="texture-paisley on-light flex-1 overflow-x-hidden px-5 py-7 sm:px-8 lg:px-12">
        {children}
      </main>
    </div>
  );
}
