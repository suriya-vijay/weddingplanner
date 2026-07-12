import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VenueCanvas } from "@/components/dashboard/venue-canvas";
import { getOrCreateWedding } from "@/lib/db/weddings";
import { getGuests } from "@/lib/db/guests";
import { getVenueLayout, EMPTY_VENUE, type VenueData } from "@/lib/db/venue";

export const metadata: Metadata = {
  title: "Venue & Seating · Kalyanam & Co.",
};

export default async function SeatingPage() {
  const wedding = await getOrCreateWedding();
  if (!wedding) notFound();

  const guests = await getGuests(wedding.id);

  // Resilient to the migration not being applied yet: fall back to an empty
  // layout + a "run 0007" notice instead of crashing the page.
  let initialData: VenueData = EMPTY_VENUE;
  let migrationReady = true;
  try {
    initialData = await getVenueLayout(wedding.id);
  } catch {
    migrationReady = false;
  }

  return (
    <VenueCanvas
      guests={guests}
      initialData={initialData}
      migrationReady={migrationReady}
    />
  );
}
