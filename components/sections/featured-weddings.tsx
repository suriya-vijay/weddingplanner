import { MapPin, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { featuredWeddings, type FeaturedWedding } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/**
 * Featured Weddings — editorial, asymmetric. One large lead card spans two rows,
 * the rest stack beside it. Every wedding tags its vendors (PRD requirement).
 */
export function FeaturedWeddings() {
  return (
    <section id="inspiration" className="section bg-cream">
      <div className="container-luxe">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Real weddings</p>
            <h2 className="mt-4 font-serif text-h2 text-ink">
              Weddings worth
              <span className="italic text-forest-700"> falling for</span>
            </h2>
            <p className="lede mt-4">
              Browse celebrations by ceremony, tradition, colour and place — then
              hire the very vendors who made them.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <a
              href="#"
              className="group inline-flex items-center gap-2 font-medium text-forest-700 transition-colors hover:text-gold-600"
            >
              View the gallery
              <ArrowUpRight className="h-4 w-4 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid auto-rows-[minmax(0,1fr)] gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          {featuredWeddings.map((w, i) => (
            <Reveal
              key={w.couple}
              delay={i * 60}
              className={cn(
                w.large && "md:col-span-2 md:row-span-2 lg:col-span-2",
              )}
            >
              <WeddingCard wedding={w} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WeddingCard({ wedding }: { wedding: FeaturedWedding }) {
  return (
    <a
      href="#"
      className={cn(
        "group relative block h-full min-h-[16rem] overflow-hidden rounded-3xl shadow-[var(--shadow-sm)] transition-all duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-lg)]",
        wedding.large && "min-h-[22rem]",
      )}
    >
      {/* Gradient plate (stand-in for photography) */}
      <div
        aria-hidden
        className="absolute inset-0 transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.04]"
        style={{ background: wedding.plate }}
      />
      {/* Legibility scrim */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/20 to-transparent"
      />

      <div className="relative flex h-full flex-col justify-end p-6 sm:p-7">
        <Badge tone="gold" className="mb-3 w-fit bg-forest-900/35 text-cream">
          {wedding.tradition}
        </Badge>
        <h3
          className={cn(
            "font-serif text-cream",
            wedding.large ? "text-3xl sm:text-4xl" : "text-2xl",
          )}
        >
          {wedding.couple}
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-cream/75">
          <MapPin className="h-4 w-4" aria-hidden />
          {wedding.location}
        </p>

        {/* Vendor tags reveal on hover (UX Bible §2) */}
        <div className="mt-4 flex flex-wrap gap-2 opacity-0 transition-opacity duration-[var(--dur-base)] group-hover:opacity-100">
          {wedding.vendors.map((v) => (
            <span
              key={v}
              className="rounded-full bg-forest-900/35 px-3 py-1 text-xs text-cream"
            >
              {v}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
