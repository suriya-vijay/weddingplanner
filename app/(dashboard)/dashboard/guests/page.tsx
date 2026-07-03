import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuestsView } from "@/components/dashboard/guests-view";
import { getOrCreateWedding } from "@/lib/db/weddings";
import { getGuests } from "@/lib/db/guests";

export const metadata: Metadata = {
  title: "Guests · Kalyanam & Co.",
};

export default async function GuestsPage() {
  const wedding = await getOrCreateWedding();
  if (!wedding) notFound();
  const guests = await getGuests(wedding.id);
  return <GuestsView initialGuests={guests} />;
}
