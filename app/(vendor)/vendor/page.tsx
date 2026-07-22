import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Eye,
  Inbox,
  Star,
  CalendarCheck,
  ArrowUpRight,
  BadgeCheck,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Panel, StatTile, ProgressRing } from "@/components/dashboard/ui";
import { Stagger } from "@/components/ui/stagger";
import { getMyVendor, getMyEnquiries } from "@/lib/db/vendor-portal";

export const metadata: Metadata = {
  title: "Vendor Portal · Kalyanam & Co.",
};

const STATUS_TONE: Record<string, string> = {
  New: "bg-gold-100 text-gold-700",
  Replied: "bg-forest-100 text-forest-700",
  Booked: "bg-forest-100 text-forest-700",
  Closed: "bg-cream-deep text-ink-soft",
};

export default async function VendorOverview() {
  const vendor = await getMyVendor();
  if (!vendor) notFound();
  const vendorEnquiries = await getMyEnquiries(vendor.id);

  const openEnquiries = vendorEnquiries.filter(
    (e) => e.status === "New" || e.status === "Replied",
  ).length;
  const booked = vendorEnquiries.filter((e) => e.status === "Booked").length;

  // Profile completeness — only fields the VENDOR can actually fill in.
  // `verified` was deliberately removed: it's an admin-controlled flag, so
  // including it capped a fully-completed profile at 83% with no way to reach
  // 100% — a progress bar you can't finish is worse than none.
  const checks = [
    !!vendor.about,
    vendor.gallery.length >= 6,
    vendor.packages.length >= 2,
    vendor.styles.length >= 2,
    !!vendor.instagram,
    !!vendor.location,
  ];
  const completeness = Math.round(
    (checks.filter(Boolean).length / checks.length) * 100,
  );

  const recent = vendorEnquiries.slice(0, 3);

  return (
    <div className="space-y-8">
      {vendor.status === "pending" && (
        <div className="rounded-2xl border border-gold-300 bg-gold-100 px-5 py-4 text-gold-700">
          <p className="font-medium">Your profile is under review</p>
          <p className="mt-0.5 text-sm">
            It&rsquo;ll go live on the marketplace once an admin approves it.
          </p>
        </div>
      )}
      {vendor.status === "rejected" && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-5 py-4 text-destructive">
          <p className="font-medium">Your profile wasn&rsquo;t approved</p>
          <p className="mt-0.5 text-sm">
            {vendor.rejectionReason
              ? `Reason: ${vendor.rejectionReason}`
              : "No reason was provided."}{" "}
            <Link href="/vendor/profile" className="font-medium underline">
              Update your profile
            </Link>{" "}
            and it&rsquo;ll be re-reviewed.
          </p>
        </div>
      )}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-gold-600">Vendor portal</p>
          <h1 className="mt-2 flex flex-wrap items-center gap-2 font-serif text-3xl text-ink sm:text-4xl">
            {vendor.name}
            {vendor.verified && (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-forest-700">
                <BadgeCheck className="h-5 w-5" /> Verified
              </span>
            )}
          </h1>
          <p className="mt-1 flex items-center gap-2 text-ink-soft">
            <span>{vendor.category}</span>
            <span className="text-ink-faint">·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gold-600" /> {vendor.location}
            </span>
          </p>
        </div>
        <Button href={`/vendors/${vendor.slug}`} variant="outline" size="md">
          <Eye className="h-4 w-4" /> View public profile
        </Button>
      </header>

      {/* Stat tiles — one-shot staggered entrance (see components/ui/stagger) */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stagger>
          <StatTile
            label="Profile views"
            value={vendor.profileViews.toLocaleString("en-US")}
            sub="all time"
            icon={<Eye className="h-[1.1rem] w-[1.1rem]" />}
          />
          <StatTile
            label="Open enquiries"
            value={openEnquiries}
            sub={`${vendorEnquiries.length} total leads`}
            icon={<Inbox className="h-[1.1rem] w-[1.1rem]" />}
          />
          <StatTile
            label="Average rating"
            value={vendor.rating.toFixed(1)}
            sub={`${vendor.reviews} reviews`}
            icon={<Star className="h-[1.1rem] w-[1.1rem]" />}
          />
          <StatTile
            label="Bookings"
            value={booked}
            sub="all time"
            icon={<CalendarCheck className="h-[1.1rem] w-[1.1rem]" />}
          />
        </Stagger>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Recent enquiries */}
        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-ink">Recent enquiries</h2>
            <Link
              href="/vendor/enquiries"
              className="inline-flex items-center gap-1 text-sm font-medium text-forest-700 hover:text-gold-600"
            >
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="mt-5 space-y-3">
            {recent.map((e) => (
              <li
                key={e.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-border/70 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{e.couple}</p>
                  <p className="truncate text-xs text-ink-faint">
                    {e.functions} · {e.city} · {e.budget}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_TONE[e.status]}`}
                >
                  {e.status}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Profile completeness */}
        <Panel className="flex flex-col items-center text-center">
          <h2 className="font-serif text-xl text-ink">Profile strength</h2>
          <div className="my-5">
            <ProgressRing value={completeness}>
              <div>
                <p className="font-serif text-3xl text-ink">{completeness}%</p>
                <p className="text-xs text-ink-faint">complete</p>
              </div>
            </ProgressRing>
          </div>
          <p className="text-sm text-ink-soft">
            A complete profile ranks higher and earns more enquiries.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {vendor.styles.map((s) => (
              <Badge key={s} tone="forest">
                {s}
              </Badge>
            ))}
          </div>
          <Button href="/vendor/profile" variant="primary" size="md" className="mt-5 w-full">
            Edit my profile
          </Button>
        </Panel>
      </div>
    </div>
  );
}
