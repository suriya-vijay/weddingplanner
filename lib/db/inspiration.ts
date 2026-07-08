import { createClient } from "@/lib/supabase/server";
import type { InspirationItem } from "@/lib/mock-data";

/** Inspiration gallery reads (public) + admin writes. */

type InspRow = {
  id: string;
  title: string;
  ceremony: string;
  tradition: string;
  color: string;
  budget: string;
  location: string;
  aspect: number;
  plate: string;
  image_url: string | null;
  vendors: string[];
};

/** DB row → the app-facing InspirationItem shape (adds a real DB id). */
export type GalleryItem = InspirationItem & { imageUrl: string | null };

function toItem(r: InspRow): GalleryItem {
  return {
    id: r.id,
    title: r.title,
    ceremony: r.ceremony as InspirationItem["ceremony"],
    tradition: r.tradition as InspirationItem["tradition"],
    color: r.color as InspirationItem["color"],
    budget: r.budget as InspirationItem["budget"],
    location: r.location as InspirationItem["location"],
    aspect: Number(r.aspect),
    plate: r.plate,
    vendors: r.vendors ?? [],
    imageUrl: r.image_url,
  };
}

export async function getInspiration(): Promise<GalleryItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("inspiration_items")
    .select("*")
    .order("sort");
  return ((data ?? []) as InspRow[]).map(toItem);
}

export async function getInspirationByIds(
  ids: string[],
): Promise<GalleryItem[]> {
  if (!ids.length) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("inspiration_items")
    .select("*")
    .in("id", ids);
  return ((data ?? []) as InspRow[]).map(toItem);
}

/** One inspiration item by id (for the slide-deck detail page). */
export async function getInspirationById(
  id: string,
): Promise<GalleryItem | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("inspiration_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ? toItem(data as InspRow) : null;
}
