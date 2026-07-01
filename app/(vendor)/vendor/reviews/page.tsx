import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { Panel, StatTile, ProgressBar } from "@/components/dashboard/ui";
import { getVendorBySlug, myVendorSlug } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Reviews · Vendor Portal",
};

export default function VendorReviewsPage() {
  const vendor = getVendorBySlug(myVendorSlug);
  if (!vendor) notFound();

  // Rating breakdown from the (mock) review list, padded to feel real.
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: vendor.reviewList.filter((r) => r.rating === star).length,
  }));
  const totalListed = vendor.reviewList.length || 1;

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-gold-600">Vendor portal</p>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Reviews</h1>
        <p className="mt-1 text-ink-soft">
          What couples say about {vendor.name}.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatTile
          label="Average rating"
          value={vendor.rating.toFixed(1)}
          sub="across all reviews"
          icon={<Star className="h-[1.1rem] w-[1.1rem]" />}
        />
        <StatTile label="Total reviews" value={vendor.reviews} sub="lifetime" />
        <StatTile
          label="Verified"
          value={vendor.verified ? "Yes" : "No"}
          sub="business status"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        {/* Distribution */}
        <Panel>
          <h2 className="font-serif text-lg text-ink">Rating breakdown</h2>
          <div className="mt-4 space-y-3">
            {dist.map((d) => (
              <div key={d.star} className="flex items-center gap-3">
                <span className="flex w-10 shrink-0 items-center gap-1 text-sm text-ink-soft">
                  {d.star} <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
                </span>
                <ProgressBar value={(d.count / totalListed) * 100} />
                <span className="w-6 shrink-0 text-right text-sm text-ink-faint">
                  {d.count}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Review list */}
        <div className="space-y-4">
          {vendor.reviewList.map((r, i) => (
            <Panel key={i}>
              <div className="flex items-center gap-1 text-gold-500">
                {Array.from({ length: r.rating }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-gold-500" />
                ))}
              </div>
              <blockquote className="mt-3 text-ink-soft">“{r.text}”</blockquote>
              <figcaption className="mt-3 text-sm">
                <span className="font-medium text-ink">{r.author}</span>
                <span className="text-ink-faint"> · {r.wedding}</span>
              </figcaption>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}
