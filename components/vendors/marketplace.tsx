"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Star, MapPin, Search, BadgeCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { isImageUrl } from "@/components/ui/plate";
import {
  marketplaceCategories,
  type VendorProfile,
} from "@/lib/mock-data";

/**
 * Vendor Marketplace — browse/filter vendor profiles. Category + location
 * filters + text search, all client-side. Vendor data is fetched from the DB by
 * the server page and passed in as a prop. Cards link to /vendors/[slug].
 */
export function Marketplace({ vendors }: { vendors: VendorProfile[] }) {
  const [category, setCategory] = useState<string>("All");
  const [location, setLocation] = useState<string>("All");

  // Derive the filter options from the vendors actually listed. The old
  // hardcoded list was Indian cities (Mumbai/Jaipur/Goa…) while vendors pick
  // from US_CITIES, so no option could ever match — the filter was dead.
  const locationOptions = useMemo(
    () =>
      [...new Set(vendors.map((v) => v.location).filter(Boolean))].sort(),
    [vendors],
  );
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vendors.filter((v) => {
      if (category !== "All" && v.category !== category) return false;
      if (location !== "All" && !v.serviceAreas.includes(location) && v.location !== location)
        return false;
      if (
        q &&
        !`${v.name} ${v.category} ${v.tagline} ${v.styles.join(" ")}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [vendors, category, location, query]);

  const filtersActive = category !== "All" || location !== "All" || query.trim();

  return (
    <div>
      {/* Search + location */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vendors, styles, services…"
            className="h-12 w-full rounded-full border border-border-strong bg-ivory pl-12 pr-4 text-[0.95rem] text-ink placeholder:text-ink-faint focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500"
          />
        </div>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          aria-label="Filter by location"
          className="h-12 rounded-full border border-border-strong bg-ivory px-5 text-[0.95rem] text-ink focus:border-gold-400 focus:outline-2 focus:outline-offset-2 focus:outline-gold-500 sm:w-52"
        >
          <option value="All">All locations</option>
          {locationOptions.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {/* Category chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        {marketplaceCategories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors duration-[var(--dur-fast)] cursor-pointer",
              category === c
                ? "border-forest-700 bg-forest-700 text-cream"
                : "border-border-strong bg-ivory text-ink-soft hover:border-gold-400 hover:text-forest-700",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Results bar */}
      <div className="mt-8 flex items-center justify-between border-y border-border py-4">
        <p className="text-sm text-ink-soft">
          <span className="font-serif text-lg text-forest-700">
            {results.length}
          </span>{" "}
          {results.length === 1 ? "vendor" : "vendors"}
        </p>
        {filtersActive && (
          <button
            type="button"
            onClick={() => {
              setCategory("All");
              setLocation("All");
              setQuery("");
            }}
            className="inline-flex items-center gap-1 text-sm text-gold-600 hover:underline"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Grid */}
      {results.length > 0 ? (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((v) => (
              <VendorCard key={v.slug} vendor={v} />
            ))}
          </div>
          {/* A young marketplace looks broken with a couple of cards and a sea
              of whitespace. Frame it as growing, and recruit. */}
          {results.length < 6 && (
            <div className="mt-10 rounded-3xl border border-dashed border-border-strong bg-ivory/60 px-8 py-10 text-center">
              <p className="font-serif text-xl text-ink">
                We&rsquo;re growing — carefully
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
                Every vendor is reviewed before they appear here, so this list
                grows slowly and deliberately. Know someone exceptional?
              </p>
              <Link
                href="/signup"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-forest-700 px-5 py-2.5 text-sm font-medium text-cream transition-colors duration-[var(--dur-fast)] hover:bg-forest-600"
              >
                Become a vendor
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="mt-16 text-center">
          <p className="font-serif text-2xl text-ink">No vendors match</p>
          <p className="mt-2 text-ink-soft">Try clearing a filter or searching differently.</p>
        </div>
      )}
    </div>
  );
}

function VendorCard({ vendor }: { vendor: VendorProfile }) {
  return (
    <Link
      href={`/vendors/${vendor.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-ivory shadow-[var(--shadow-sm)] transition-all duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-2 hover:border-gold-200 hover:shadow-[var(--shadow-lg)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {isImageUrl(vendor.cover) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vendor.cover}
            alt=""
            loading="lazy"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.05]"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.05]"
            style={{ background: vendor.cover }}
          />
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-forest-700 shadow-[var(--shadow-xs)]">
          <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
          {vendor.rating.toFixed(1)}
        </span>
        {vendor.verified && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-forest-700/90 px-2.5 py-1 text-xs font-medium text-cream">
            <BadgeCheck className="h-3.5 w-3.5" /> Verified
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-gold-600">
          {vendor.category}
        </p>
        <h3 className="mt-1.5 font-serif text-lg text-ink transition-colors group-hover:text-forest-700">
          {vendor.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-ink-soft">{vendor.tagline}</p>
        <p className="mt-2 flex items-center gap-1 text-sm text-ink-faint">
          <MapPin className="h-3.5 w-3.5" /> {vendor.location} · {vendor.reviews} reviews
        </p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span>
            <span className="text-xs text-ink-soft">From </span>
            <span className="font-serif text-base text-forest-700">
              {vendor.startingAt}
            </span>
          </span>
          <span className="text-sm text-gold-600">{vendor.priceTier}</span>
        </div>
      </div>
    </Link>
  );
}
