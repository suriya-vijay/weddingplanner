import type { Metadata } from "next";
import { GuestsView } from "@/components/dashboard/guests-view";

export const metadata: Metadata = {
  title: "Guests · Kalyanam & Co.",
};

export default function GuestsPage() {
  return <GuestsView />;
}
