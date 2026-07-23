import type { Metadata } from "next";
import { Users } from "lucide-react";
import { Panel, StatTile } from "@/components/dashboard/ui";
import { EmptyState } from "@/components/ui/empty-state";
import { getPeople } from "@/lib/db/admin-people";

export const metadata: Metadata = { title: "People · Admin" };

const ROLE_TONE: Record<string, string> = {
  admin: "bg-gold-100 text-gold-700",
  vendor: "bg-peacock/15 text-peacock",
  couple: "bg-forest-100 text-forest-700",
};

/**
 * Who is signed up. The site owner previously had no way to see their own
 * users at all — no screen listed couples or vendors.
 */
export default async function AdminPeoplePage() {
  const people = await getPeople();
  const couples = people.filter((p) => p.role === "couple").length;
  const vendors = people.filter((p) => p.role === "vendor").length;

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-gold-600">Admin</p>
        <h1 className="mt-2 font-serif text-h1 text-ink">People</h1>
        <p className="mt-1 text-ink-soft">
          Everyone with an account on Kalyanam.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Total" value={people.length} sub="accounts" />
        <StatTile label="Couples" value={couples} sub="planning a wedding" />
        <StatTile label="Vendors" value={vendors} sub="listed or pending" />
      </div>

      {people.length === 0 ? (
        <EmptyState icon={<Users className="h-6 w-6" />} title="No accounts yet">
          Signups will appear here as couples and vendors join.
        </EmptyState>
      ) : (
        <Panel>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-ink-faint">
                  <th className="pb-3 pr-4 font-medium">Name</th>
                  <th className="pb-3 pr-4 font-medium">Email</th>
                  <th className="pb-3 pr-4 font-medium">Role</th>
                  <th className="pb-3 pr-4 font-medium">Wedding / business</th>
                  <th className="pb-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {people.map((p) => (
                  <tr key={p.id} className="text-ink transition-colors duration-[var(--dur-fast)] hover:bg-cream-deep/50">
                    <td className="py-3 pr-4 font-medium">{p.name}</td>
                    <td className="py-3 pr-4 text-ink-soft">{p.email}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          ROLE_TONE[p.role] ?? "bg-cream-deep text-ink-soft"
                        }`}
                      >
                        {p.role}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-ink-soft">
                      {p.context || "—"}
                    </td>
                    <td className="py-3 text-ink-faint">
                      {new Date(p.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}
