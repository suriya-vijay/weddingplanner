import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventsView } from "@/components/dashboard/events-view";
import { getOrCreateWedding } from "@/lib/db/weddings";
import { getGuests } from "@/lib/db/guests";
import { getEvents, getEventGuestMap } from "@/lib/db/events";

export const metadata: Metadata = {
  title: "Events · Kalyanam & Co.",
};

export default async function EventsPage() {
  const wedding = await getOrCreateWedding();
  if (!wedding) notFound();
  const [guests, events] = await Promise.all([
    getGuests(wedding.id),
    getEvents(wedding.id),
  ]);
  const assignments = await getEventGuestMap(events.map((e) => e.id));
  return (
    <EventsView
      initialGuests={guests}
      initialEvents={events}
      initialAssignments={assignments}
    />
  );
}
