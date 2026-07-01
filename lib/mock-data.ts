import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  Store,
  LayoutDashboard,
  ListChecks,
  Compass,
  Bot,
  Wallet,
  CalendarClock,
  Users,
  UserCheck,
} from "lucide-react";

/**
 * Mock content for the landing page (Phase 1 — no backend).
 * Imagery is represented as on-brand gradient "plates" (CSS) so the layout
 * reads luxurious without committing external/copyrighted assets.
 */

export type Plate = string; // a CSS background value

const plates: Record<string, Plate> = {
  forest:
    "linear-gradient(135deg, #1b4332 0%, #2d6a4f 55%, #40916c 100%)",
  gold: "linear-gradient(135deg, #8a6d1f 0%, #c9a227 60%, #ecdcae 100%)",
  blush: "linear-gradient(135deg, #d99aa0 0%, #e8b4b8 55%, #f9e9e6 100%)",
  dusk: "linear-gradient(140deg, #0f2c1f 0%, #2d6a4f 60%, #c9a227 130%)",
  rose: "linear-gradient(140deg, #1b4332 0%, #d99aa0 130%)",
  champagne:
    "linear-gradient(135deg, #2d6a4f 0%, #d8b961 70%, #f6eed4 100%)",
};

// ── Featured Weddings ───────────────────────────────────────────
export type FeaturedWedding = {
  couple: string;
  location: string;
  tradition: string;
  plate: Plate;
  vendors: string[];
  large?: boolean;
};

export const featuredWeddings: FeaturedWedding[] = [
  {
    couple: "Aanya & Vikram",
    location: "Udaipur, Rajasthan",
    tradition: "North Indian · Hindu",
    plate: plates.dusk,
    vendors: ["The Lighthouse Films", "Mandap Studio", "Saffron Catering"],
    large: true,
  },
  {
    couple: "Priya & Arjun",
    location: "Lake Como, Italy",
    tradition: "Tamil · Destination",
    plate: plates.champagne,
    vendors: ["Bloom & Co.", "House of Mehendi"],
  },
  {
    couple: "Neha & Rohan",
    location: "Jaipur, Rajasthan",
    tradition: "Marwari · Hindu",
    plate: plates.rose,
    vendors: ["Gulaal Decor", "Anita Makeovers"],
  },
  {
    couple: "Simran & Karan",
    location: "Goa, India",
    tradition: "Punjabi · Sikh",
    plate: plates.gold,
    vendors: ["Seaside Frames", "DJ Aurelius", "Petal & Pearl"],
  },
];

// ── Popular Vendors ─────────────────────────────────────────────
export type Vendor = {
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  startingAt: string;
  plate: Plate;
};

export const popularVendors: Vendor[] = [
  {
    name: "The Lighthouse Films",
    category: "Photography & Film",
    location: "Mumbai",
    rating: 4.9,
    reviews: 218,
    startingAt: "₹3,50,000",
    plate: plates.forest,
  },
  {
    name: "Mandap Studio",
    category: "Decor & Mandap",
    location: "Delhi NCR",
    rating: 4.8,
    reviews: 164,
    startingAt: "₹6,00,000",
    plate: plates.gold,
  },
  {
    name: "House of Mehendi",
    category: "Mehendi Artistry",
    location: "Jaipur",
    rating: 5.0,
    reviews: 97,
    startingAt: "₹45,000",
    plate: plates.blush,
  },
  {
    name: "Saffron Catering",
    category: "Catering",
    location: "Hyderabad",
    rating: 4.7,
    reviews: 301,
    startingAt: "₹1,800 / plate",
    plate: plates.champagne,
  },
];

export const vendorCategories: string[] = [
  "Photography",
  "Videography",
  "Decor",
  "Catering",
  "Makeup",
  "Mehendi",
  "DJs",
  "Florists",
  "Venues",
  "Invitations",
  "Bridal Fashion",
  "Jewelry",
  "Priests",
  "Choreographers",
];

// ── Platform Features (the 10 core features) ────────────────────
export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const features: Feature[] = [
  {
    icon: Sparkles,
    title: "Inspiration Gallery",
    description:
      "Save ideas, build mood boards, and explore real weddings — every vendor tagged, so you can hire the look you love.",
  },
  {
    icon: Store,
    title: "Vendor Marketplace",
    description:
      "Discover trusted photographers, decorators, caterers and more, with portfolios, pricing and availability in one place.",
  },
  {
    icon: LayoutDashboard,
    title: "Wedding Dashboard",
    description:
      "Your entire wedding — countdown, progress, budget, guests and planner — gathered into one calm workspace.",
  },
  {
    icon: ListChecks,
    title: "Smart Checklist",
    description:
      "A personalised checklist that adapts to your traditions, ceremonies and wedding size — guided, never overwhelming.",
  },
  {
    icon: Compass,
    title: "Step-by-Step Assistant",
    description:
      "Guided planning that walks you from engagement to the final farewell, one elegant step at a time.",
  },
  {
    icon: Bot,
    title: "AI Wedding Advisor",
    description:
      "A luxury planning advisor that understands Indian traditions — palettes, vendors, timelines and ideas, on demand.",
  },
  {
    icon: Wallet,
    title: "Budget Tracker",
    description:
      "Set a budget and watch it stay effortless — every booking updates your spend, by category, automatically.",
  },
  {
    icon: CalendarClock,
    title: "Wedding Timeline",
    description:
      "A personalised timeline of bookings, deadlines and ceremonies that updates itself as your plans evolve.",
  },
  {
    icon: Users,
    title: "Guest List & RSVPs",
    description:
      "Manage guests, families, meal preferences and RSVPs with grace — attendance tracked at a glance.",
  },
  {
    icon: UserCheck,
    title: "Your Wedding Planner",
    description:
      "A dedicated human planner assigned to your wedding — and on the day itself, the one orchestrating every moment.",
  },
];

// ── Testimonials ────────────────────────────────────────────────
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Kalyanam turned three cities and four ceremonies into something we could actually enjoy. It felt like having a luxury planner in our pocket — and a real one on the day.",
    name: "Aanya Mehra",
    role: "Bride · Udaipur",
    initials: "AM",
  },
  {
    quote:
      "Every vendor we booked came from a wedding we'd admired in the gallery. No cold calls, no guesswork — just taste, beautifully organised.",
    name: "Vikram Shah",
    role: "Groom · Mumbai",
    initials: "VS",
  },
  {
    quote:
      "As the mother of the bride, I finally felt in control of the budget. The timeline kept the whole family moving together, gently.",
    name: "Sunita Rao",
    role: "Mother of the Bride · Bengaluru",
    initials: "SR",
  },
];

// ── FAQ ─────────────────────────────────────────────────────────
export const faqs = [
  {
    question: "Which Indian wedding traditions does Kalyanam support?",
    answer:
      "All of them. The platform adapts to North and South Indian, Hindu, Sikh, Muslim, Christian, Jain and interfaith celebrations — and lets every wedding feel completely personalised to your family's customs.",
  },
  {
    question: "Do I really get a human wedding planner?",
    answer:
      "Yes. Every couple is assigned a dedicated planner who guides you through the journey. On the wedding day itself, your planner is responsible for coordinating the execution so you can simply be present.",
  },
  {
    question: "How does the AI Wedding Advisor work alongside my planner?",
    answer:
      "The AI advisor helps with ideas, palettes, vendor suggestions and timelines whenever inspiration strikes. It complements — never replaces — your human planner, who owns the real-world coordination.",
  },
  {
    question: "Can my family help with the planning?",
    answer:
      "Absolutely. The primary account holder is the administrator and can invite parents, siblings and family members as collaborators, each with their own permissions to help.",
  },
  {
    question: "Is Kalyanam only for weddings in India?",
    answer:
      "No — Kalyanam is built for luxury Indian weddings anywhere in the world, from Udaipur to Lake Como, with vendors and planning tools that travel with you.",
  },
];

// ── Inspiration Gallery ─────────────────────────────────────────
// Pinterest/Instagram-style items. Imagery = on-brand gradient plates with a
// per-item aspect ratio so a masonry layout reads naturally. Each item tags the
// vendors involved (PRD requirement). Mock data — no backend yet.

export const ceremonies = [
  "Mandap",
  "Sangeet",
  "Mehendi",
  "Haldi",
  "Reception",
  "Pheras",
  "Baraat",
] as const;

export const traditions = [
  "North Indian",
  "South Indian",
  "Punjabi · Sikh",
  "Marwari",
  "Bengali",
  "Tamil",
  "Gujarati",
] as const;

export const colorThemes = [
  "Forest & Gold",
  "Blush & Ivory",
  "Marigold",
  "Royal Maroon",
  "Peacock",
  "Champagne",
] as const;

export const budgetTiers = ["₹", "₹₹", "₹₹₹", "₹₹₹₹"] as const;

export const locations = [
  "Udaipur",
  "Jaipur",
  "Goa",
  "Mumbai",
  "Lake Como",
  "Kerala",
] as const;

export type InspirationItem = {
  id: string;
  title: string;
  ceremony: (typeof ceremonies)[number];
  tradition: (typeof traditions)[number];
  color: (typeof colorThemes)[number];
  budget: (typeof budgetTiers)[number];
  location: (typeof locations)[number];
  vendors: string[];
  plate: Plate;
  /** aspect ratio (w/h) — drives natural masonry height variation */
  aspect: number;
};

const galleryPlates: Record<string, Plate> = {
  ...plates,
  marigold: "linear-gradient(145deg, #c9621f 0%, #e89b1f 55%, #f6d77a 100%)",
  maroon: "linear-gradient(150deg, #4a1418 0%, #7b2d26 60%, #b5564a 120%)",
  peacock: "linear-gradient(150deg, #0a3b40 0%, #0e5c63 55%, #2d9aa3 120%)",
  ivory: "linear-gradient(150deg, #d8c9a8 0%, #f3ead4 60%, #fbf8f3 100%)",
  emerald: "linear-gradient(150deg, #0f2c1f 0%, #2d6a4f 50%, #95d5b2 130%)",
};

export const inspirationItems: InspirationItem[] = [
  {
    id: "insp-1",
    title: "Golden Mandap at Dawn",
    ceremony: "Mandap",
    tradition: "North Indian",
    color: "Forest & Gold",
    budget: "₹₹₹₹",
    location: "Udaipur",
    vendors: ["Mandap Studio", "The Lighthouse Films"],
    plate: galleryPlates.dusk,
    aspect: 0.78,
  },
  {
    id: "insp-2",
    title: "Marigold Mehendi Courtyard",
    ceremony: "Mehendi",
    tradition: "Marwari",
    color: "Marigold",
    budget: "₹₹",
    location: "Jaipur",
    vendors: ["House of Mehendi", "Gulaal Decor"],
    plate: galleryPlates.marigold,
    aspect: 1.0,
  },
  {
    id: "insp-3",
    title: "Blush Beachside Reception",
    ceremony: "Reception",
    tradition: "Punjabi · Sikh",
    color: "Blush & Ivory",
    budget: "₹₹₹",
    location: "Goa",
    vendors: ["Seaside Frames", "Petal & Pearl", "DJ Aurelius"],
    plate: galleryPlates.blush,
    aspect: 1.3,
  },
  {
    id: "insp-4",
    title: "Royal Maroon Pheras",
    ceremony: "Pheras",
    tradition: "North Indian",
    color: "Royal Maroon",
    budget: "₹₹₹₹",
    location: "Udaipur",
    vendors: ["Saffron Catering", "Mandap Studio"],
    plate: galleryPlates.maroon,
    aspect: 0.85,
  },
  {
    id: "insp-5",
    title: "Peacock Sangeet Stage",
    ceremony: "Sangeet",
    tradition: "Gujarati",
    color: "Peacock",
    budget: "₹₹₹",
    location: "Mumbai",
    vendors: ["DJ Aurelius", "Bloom & Co."],
    plate: galleryPlates.peacock,
    aspect: 1.15,
  },
  {
    id: "insp-6",
    title: "Sunlit Haldi in Kerala",
    ceremony: "Haldi",
    tradition: "South Indian",
    color: "Marigold",
    budget: "₹",
    location: "Kerala",
    vendors: ["House of Mehendi"],
    plate: galleryPlates.gold,
    aspect: 0.92,
  },
  {
    id: "insp-7",
    title: "Lakeside Champagne Vows",
    ceremony: "Reception",
    tradition: "Tamil",
    color: "Champagne",
    budget: "₹₹₹₹",
    location: "Lake Como",
    vendors: ["Bloom & Co.", "The Lighthouse Films"],
    plate: galleryPlates.champagne,
    aspect: 1.4,
  },
  {
    id: "insp-8",
    title: "Emerald Baraat Procession",
    ceremony: "Baraat",
    tradition: "Punjabi · Sikh",
    color: "Forest & Gold",
    budget: "₹₹₹",
    location: "Jaipur",
    vendors: ["Gulaal Decor", "DJ Aurelius"],
    plate: galleryPlates.emerald,
    aspect: 0.8,
  },
  {
    id: "insp-9",
    title: "Ivory Bengali Morning",
    ceremony: "Pheras",
    tradition: "Bengali",
    color: "Blush & Ivory",
    budget: "₹₹",
    location: "Mumbai",
    vendors: ["Anita Makeovers", "Seaside Frames"],
    plate: galleryPlates.ivory,
    aspect: 1.05,
  },
  {
    id: "insp-10",
    title: "Forest & Gold Mandap",
    ceremony: "Mandap",
    tradition: "South Indian",
    color: "Forest & Gold",
    budget: "₹₹₹₹",
    location: "Kerala",
    vendors: ["Mandap Studio", "Saffron Catering"],
    plate: galleryPlates.forest,
    aspect: 0.88,
  },
  {
    id: "insp-11",
    title: "Rose Twilight Sangeet",
    ceremony: "Sangeet",
    tradition: "Marwari",
    color: "Royal Maroon",
    budget: "₹₹₹",
    location: "Udaipur",
    vendors: ["DJ Aurelius", "Gulaal Decor"],
    plate: galleryPlates.rose,
    aspect: 1.2,
  },
  {
    id: "insp-12",
    title: "Champagne Reception Tablescape",
    ceremony: "Reception",
    tradition: "Gujarati",
    color: "Champagne",
    budget: "₹₹₹",
    location: "Goa",
    vendors: ["Petal & Pearl", "Saffron Catering"],
    plate: galleryPlates.champagne,
    aspect: 0.95,
  },
];

// ── Vendor Marketplace (rich profiles) ──────────────────────────
// Full vendor profiles for the marketplace + profile pages. Mock data.

export type VendorPackage = {
  name: string;
  price: string;
  features: string[];
};

export type VendorReview = {
  author: string;
  rating: number;
  text: string;
  wedding: string;
};

export type VendorProfile = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  location: string;
  serviceAreas: string[];
  rating: number;
  reviews: number;
  startingAt: string;
  priceTier: "₹" | "₹₹" | "₹₹₹" | "₹₹₹₹";
  verified: boolean;
  styles: string[];
  about: string;
  packages: VendorPackage[];
  gallery: Plate[];
  cover: Plate;
  logoPlate: Plate;
  instagram: string;
  website: string;
  availability: string;
  reviewList: VendorReview[];
};

/** Marketplace vendor categories (with counts derived below). */
export const marketplaceCategories = [
  "All",
  "Photography",
  "Decor",
  "Catering",
  "Mehendi",
  "Makeup",
  "Entertainment",
  "Florists",
  "Venues",
] as const;

export const vendorLocations = [
  "Mumbai",
  "Delhi NCR",
  "Jaipur",
  "Udaipur",
  "Goa",
  "Hyderabad",
] as const;

const gp = {
  forest: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 55%, #40916c 100%)",
  gold: "linear-gradient(135deg, #8a6d1f 0%, #c9a227 60%, #ecdcae 100%)",
  blush: "linear-gradient(135deg, #d99aa0 0%, #e8b4b8 55%, #f9e9e6 100%)",
  dusk: "linear-gradient(140deg, #0f2c1f 0%, #2d6a4f 60%, #c9a227 130%)",
  rose: "linear-gradient(140deg, #1b4332 0%, #d99aa0 130%)",
  champagne: "linear-gradient(135deg, #2d6a4f 0%, #d8b961 70%, #f6eed4 100%)",
  peacock: "linear-gradient(150deg, #0a3b40 0%, #0e5c63 55%, #2d9aa3 120%)",
  maroon: "linear-gradient(150deg, #4a1418 0%, #7b2d26 60%, #b5564a 120%)",
};

function reviews(n: number): VendorReview[] {
  const base: VendorReview[] = [
    {
      author: "Aanya M.",
      rating: 5,
      text: "Absolutely exceptional — they understood our vision instantly and elevated every detail.",
      wedding: "Udaipur, 2025",
    },
    {
      author: "Rohan & Neha",
      rating: 5,
      text: "Professional, warm, and worth every rupee. Our families are still talking about it.",
      wedding: "Jaipur, 2025",
    },
    {
      author: "Simran K.",
      rating: 4,
      text: "Beautiful work and great communication throughout the planning process.",
      wedding: "Goa, 2024",
    },
  ];
  return base.slice(0, n);
}

export const vendors: VendorProfile[] = [
  {
    slug: "the-lighthouse-films",
    name: "The Lighthouse Films",
    category: "Photography",
    tagline: "Cinematic wedding films & timeless portraits",
    location: "Mumbai",
    serviceAreas: ["Mumbai", "Goa", "Udaipur", "Destination"],
    rating: 4.9,
    reviews: 218,
    startingAt: "₹3,50,000",
    priceTier: "₹₹₹₹",
    verified: true,
    styles: ["Cinematic", "Editorial", "Candid"],
    about:
      "An award-winning studio crafting cinematic wedding films and editorial portraiture for luxury Indian celebrations across the globe. We tell your story with restraint, warmth and an eye for light.",
    packages: [
      { name: "Essential", price: "₹3,50,000", features: ["1-day coverage", "2 photographers", "Online gallery"] },
      { name: "Signature", price: "₹6,50,000", features: ["2-day coverage", "Film + photo", "Highlight reel", "Album"] },
      { name: "Luxe", price: "₹12,00,000", features: ["Full multi-day", "Cinematic film", "Drone", "Fine-art album"] },
    ],
    cover: gp.dusk,
    logoPlate: gp.forest,
    gallery: [gp.forest, gp.dusk, gp.champagne, gp.gold, gp.rose, gp.blush],
    instagram: "@lighthousefilms",
    website: "lighthousefilms.in",
    availability: "Booking 2025–2026",
    reviewList: reviews(3),
  },
  {
    slug: "mandap-studio",
    name: "Mandap Studio",
    category: "Decor",
    tagline: "Bespoke mandaps & floral architecture",
    location: "Delhi NCR",
    serviceAreas: ["Delhi NCR", "Jaipur", "Udaipur"],
    rating: 4.8,
    reviews: 164,
    startingAt: "₹6,00,000",
    priceTier: "₹₹₹₹",
    verified: true,
    styles: ["Regal", "Floral", "Contemporary"],
    about:
      "We design and build bespoke mandaps and immersive floral sets that turn venues into worlds. From heritage palaces to modern ballrooms, every structure is custom to your story.",
    packages: [
      { name: "Ceremony", price: "₹6,00,000", features: ["Custom mandap", "Stage & aisle", "Floral install"] },
      { name: "Full Event", price: "₹14,00,000", features: ["All functions", "Lighting design", "Seating & lounge"] },
    ],
    cover: gp.gold,
    logoPlate: gp.maroon,
    gallery: [gp.gold, gp.maroon, gp.champagne, gp.rose, gp.forest, gp.blush],
    instagram: "@mandapstudio",
    website: "mandapstudio.in",
    availability: "Limited 2025 dates",
    reviewList: reviews(3),
  },
  {
    slug: "house-of-mehendi",
    name: "House of Mehendi",
    category: "Mehendi",
    tagline: "Intricate bridal mehendi artistry",
    location: "Jaipur",
    serviceAreas: ["Jaipur", "Udaipur", "Delhi NCR"],
    rating: 5.0,
    reviews: 97,
    startingAt: "₹45,000",
    priceTier: "₹₹",
    verified: true,
    styles: ["Rajasthani", "Arabic", "Minimal"],
    about:
      "Heritage bridal mehendi with a modern sensibility — intricate, personal and photographed beautifully. Our artists travel with your celebration.",
    packages: [
      { name: "Bridal", price: "₹45,000", features: ["Full bridal mehendi", "Trial session"] },
      { name: "Bridal + Family", price: "₹90,000", features: ["Bridal", "Up to 10 guests", "On-site team"] },
    ],
    cover: gp.blush,
    logoPlate: gp.rose,
    gallery: [gp.blush, gp.rose, gp.gold, gp.champagne, gp.maroon, gp.forest],
    instagram: "@houseofmehendi",
    website: "houseofmehendi.in",
    availability: "Open 2025–2026",
    reviewList: reviews(2),
  },
  {
    slug: "saffron-catering",
    name: "Saffron Catering",
    category: "Catering",
    tagline: "Regional Indian fine-dining, at scale",
    location: "Hyderabad",
    serviceAreas: ["Hyderabad", "Mumbai", "Goa"],
    rating: 4.7,
    reviews: 301,
    startingAt: "₹1,800 / plate",
    priceTier: "₹₹₹",
    verified: true,
    styles: ["Multi-cuisine", "Live counters", "Regional"],
    about:
      "From Awadhi to Chettinad, we bring regional Indian fine-dining to weddings of every scale, with live counters, plated services and impeccable hospitality.",
    packages: [
      { name: "Classic", price: "₹1,800 / plate", features: ["3 cuisines", "Live counters", "Dessert bar"] },
      { name: "Grand", price: "₹3,200 / plate", features: ["6 cuisines", "Plated + buffet", "Mixology"] },
    ],
    cover: gp.champagne,
    logoPlate: gp.gold,
    gallery: [gp.champagne, gp.gold, gp.forest, gp.rose, gp.blush, gp.dusk],
    instagram: "@saffroncatering",
    website: "saffroncatering.in",
    availability: "Booking year-round",
    reviewList: reviews(3),
  },
  {
    slug: "gulaal-decor",
    name: "Gulaal Decor",
    category: "Decor",
    tagline: "Colour-drenched, joyful set design",
    location: "Jaipur",
    serviceAreas: ["Jaipur", "Udaipur"],
    rating: 4.8,
    reviews: 142,
    startingAt: "₹4,50,000",
    priceTier: "₹₹₹",
    verified: false,
    styles: ["Vibrant", "Traditional", "Boho"],
    about:
      "We love colour. Gulaal creates joyful, richly textured sets that celebrate Indian tradition with a fresh, editorial eye.",
    packages: [
      { name: "Function", price: "₹4,50,000", features: ["Single function decor", "Florals", "Lighting"] },
    ],
    cover: gp.rose,
    logoPlate: gp.maroon,
    gallery: [gp.rose, gp.maroon, gp.gold, gp.blush, gp.champagne, gp.forest],
    instagram: "@gulaaldecor",
    website: "gulaaldecor.in",
    availability: "Open 2025",
    reviewList: reviews(2),
  },
  {
    slug: "dj-aurelius",
    name: "DJ Aurelius",
    category: "Entertainment",
    tagline: "Sangeet sets & luxe reception sound",
    location: "Mumbai",
    serviceAreas: ["Mumbai", "Goa", "Destination"],
    rating: 4.9,
    reviews: 188,
    startingAt: "₹1,20,000",
    priceTier: "₹₹",
    verified: true,
    styles: ["Bollywood", "House", "Fusion"],
    about:
      "High-energy sangeets and refined reception sound. Aurelius reads the room and keeps the dancefloor full from first beat to last.",
    packages: [
      { name: "Sangeet", price: "₹1,20,000", features: ["4-hour set", "Sound + lighting"] },
      { name: "Full Weekend", price: "₹3,50,000", features: ["All functions", "MC", "Premium rig"] },
    ],
    cover: gp.peacock,
    logoPlate: gp.forest,
    gallery: [gp.peacock, gp.dusk, gp.forest, gp.gold, gp.maroon, gp.rose],
    instagram: "@djaurelius",
    website: "djaurelius.com",
    availability: "Few 2025 weekends left",
    reviewList: reviews(3),
  },
  {
    slug: "anita-makeovers",
    name: "Anita Makeovers",
    category: "Makeup",
    tagline: "Luminous bridal makeup & hair",
    location: "Delhi NCR",
    serviceAreas: ["Delhi NCR", "Jaipur", "Udaipur"],
    rating: 4.9,
    reviews: 210,
    startingAt: "₹65,000",
    priceTier: "₹₹₹",
    verified: true,
    styles: ["Luminous", "Classic", "HD"],
    about:
      "Skin-first bridal makeup that photographs beautifully and lasts through every function. Trials, on-site team and family looks included.",
    packages: [
      { name: "Bridal", price: "₹65,000", features: ["Bridal makeup + hair", "Trial"] },
      { name: "Bridal + Party", price: "₹1,40,000", features: ["Bridal", "Up to 6 family", "On-site"] },
    ],
    cover: gp.blush,
    logoPlate: gp.rose,
    gallery: [gp.blush, gp.champagne, gp.rose, gp.gold, gp.forest, gp.maroon],
    instagram: "@anitamakeovers",
    website: "anitamakeovers.in",
    availability: "Open 2025–2026",
    reviewList: reviews(3),
  },
  {
    slug: "seaside-frames",
    name: "Seaside Frames",
    category: "Photography",
    tagline: "Sun-soaked destination photography",
    location: "Goa",
    serviceAreas: ["Goa", "Kerala", "Destination"],
    rating: 4.8,
    reviews: 121,
    startingAt: "₹2,80,000",
    priceTier: "₹₹₹",
    verified: false,
    styles: ["Candid", "Travel", "Documentary"],
    about:
      "Golden-hour specialists for beach and destination weddings. Relaxed, documentary coverage that feels like your celebration.",
    packages: [
      { name: "Destination", price: "₹2,80,000", features: ["2-day coverage", "Travel included", "Gallery"] },
    ],
    cover: gp.champagne,
    logoPlate: gp.peacock,
    gallery: [gp.champagne, gp.peacock, gp.gold, gp.blush, gp.forest, gp.dusk],
    instagram: "@seasideframes",
    website: "seasideframes.in",
    availability: "Open 2025",
    reviewList: reviews(2),
  },
  {
    slug: "petal-and-pearl",
    name: "Petal & Pearl",
    category: "Florists",
    tagline: "Fine-art florals & tablescapes",
    location: "Goa",
    serviceAreas: ["Goa", "Mumbai"],
    rating: 4.9,
    reviews: 88,
    startingAt: "₹2,00,000",
    priceTier: "₹₹₹",
    verified: true,
    styles: ["Fine-art", "Garden", "Modern"],
    about:
      "Seasonal, fine-art florals and tablescapes designed to feel effortless and abundant. We source the freshest blooms for every celebration.",
    packages: [
      { name: "Ceremony Florals", price: "₹2,00,000", features: ["Aisle + mandap florals", "Bouquets"] },
      { name: "Full Floral", price: "₹5,50,000", features: ["All functions", "Tablescapes", "Installations"] },
    ],
    cover: gp.blush,
    logoPlate: gp.forest,
    gallery: [gp.blush, gp.rose, gp.champagne, gp.gold, gp.forest, gp.peacock],
    instagram: "@petalandpearl",
    website: "petalandpearl.in",
    availability: "Open 2025–2026",
    reviewList: reviews(2),
  },
  {
    slug: "bloom-and-co",
    name: "Bloom & Co.",
    category: "Florists",
    tagline: "Destination floral design",
    location: "Mumbai",
    serviceAreas: ["Mumbai", "Lake Como", "Destination"],
    rating: 4.7,
    reviews: 76,
    startingAt: "₹2,40,000",
    priceTier: "₹₹₹",
    verified: false,
    styles: ["Lush", "European", "Romantic"],
    about:
      "Romantic, European-inflected floral design for destination weddings — from Mumbai ballrooms to lakeside Italian villas.",
    packages: [
      { name: "Destination Florals", price: "₹2,40,000", features: ["Travel floral team", "Ceremony + reception"] },
    ],
    cover: gp.rose,
    logoPlate: gp.blush,
    gallery: [gp.rose, gp.champagne, gp.blush, gp.gold, gp.forest, gp.dusk],
    instagram: "@bloomandco",
    website: "bloomandco.in",
    availability: "Booking 2026",
    reviewList: reviews(2),
  },
  {
    slug: "the-grand-udaipur",
    name: "The Grand Udaipur",
    category: "Venues",
    tagline: "Lakeside palace weddings",
    location: "Udaipur",
    serviceAreas: ["Udaipur"],
    rating: 4.9,
    reviews: 64,
    startingAt: "₹18,00,000",
    priceTier: "₹₹₹₹",
    verified: true,
    styles: ["Palace", "Lakeside", "Heritage"],
    about:
      "A heritage lakeside palace offering breathtaking backdrops, world-class hospitality and full-service celebration planning for up to 800 guests.",
    packages: [
      { name: "Weekend Takeover", price: "₹18,00,000", features: ["Full venue", "120 rooms", "In-house catering"] },
    ],
    cover: gp.dusk,
    logoPlate: gp.gold,
    gallery: [gp.dusk, gp.gold, gp.champagne, gp.forest, gp.maroon, gp.rose],
    instagram: "@thegrandudaipur",
    website: "thegrandudaipur.com",
    availability: "Select 2026 dates",
    reviewList: reviews(3),
  },
  {
    slug: "raga-live",
    name: "Raga Live",
    category: "Entertainment",
    tagline: "Live classical & fusion ensembles",
    location: "Hyderabad",
    serviceAreas: ["Hyderabad", "Mumbai", "Delhi NCR"],
    rating: 4.8,
    reviews: 54,
    startingAt: "₹90,000",
    priceTier: "₹₹",
    verified: false,
    styles: ["Classical", "Fusion", "Sufi"],
    about:
      "Live classical, Sufi and fusion ensembles that bring soul to your ceremonies — from serene pheras to joyful baraats.",
    packages: [
      { name: "Ceremony", price: "₹90,000", features: ["3-piece ensemble", "2-hour set"] },
      { name: "Full Day", price: "₹2,20,000", features: ["Ensemble + vocals", "All functions"] },
    ],
    cover: gp.peacock,
    logoPlate: gp.maroon,
    gallery: [gp.peacock, gp.maroon, gp.gold, gp.forest, gp.champagne, gp.dusk],
    instagram: "@ragalive",
    website: "ragalive.in",
    availability: "Open 2025",
    reviewList: reviews(2),
  },
];

export function getVendorBySlug(slug: string): VendorProfile | undefined {
  return vendors.find((v) => v.slug === slug);
}

// ── Customer Dashboard (the couple's private workspace) ─────────
// Mock/seed data for the planning workspace. Local state only — nothing here
// persists yet (that arrives with the backend). Dates are ISO strings so the
// countdown/timeline compute the same on server and client.

export type WeddingProfile = {
  coupleNames: string;
  partnerA: string;
  partnerB: string;
  /** ISO date (YYYY-MM-DD) of the main ceremony */
  date: string;
  city: string;
  venue: string;
  tradition: string;
  guestEstimate: number;
  totalBudget: number;
  currency: "₹";
};

export const weddingProfile: WeddingProfile = {
  coupleNames: "Aanya & Vikram",
  partnerA: "Aanya",
  partnerB: "Vikram",
  date: "2026-12-05",
  city: "Udaipur, Rajasthan",
  venue: "The Grand Udaipur",
  tradition: "North Indian · Hindu",
  guestEstimate: 420,
  totalBudget: 8000000,
  currency: "₹",
};

/** Assigned human planner (a core PRD promise). */
export const assignedPlanner = {
  name: "Meera Kapoor",
  title: "Lead Wedding Planner",
  initials: "MK",
  since: "Jan 2026",
  phone: "+91 98••• •••42",
  email: "meera@kalyanam.co",
  plate: plates.forest,
};

// ── Checklist ───────────────────────────────────────────────────
export type ChecklistPhase =
  | "12+ months"
  | "9–12 months"
  | "6–9 months"
  | "3–6 months"
  | "1–3 months"
  | "Final month";

export type ChecklistItem = {
  id: string;
  task: string;
  phase: ChecklistPhase;
  category: string;
  done: boolean;
};

export const checklistPhases: ChecklistPhase[] = [
  "12+ months",
  "9–12 months",
  "6–9 months",
  "3–6 months",
  "1–3 months",
  "Final month",
];

export const checklistItems: ChecklistItem[] = [
  { id: "c1", task: "Set your wedding budget together", phase: "12+ months", category: "Planning", done: true },
  { id: "c2", task: "Finalise the guest count estimate", phase: "12+ months", category: "Guests", done: true },
  { id: "c3", task: "Shortlist and book the venue", phase: "12+ months", category: "Venue", done: true },
  { id: "c4", task: "Choose your wedding dates (muhurat)", phase: "12+ months", category: "Planning", done: true },
  { id: "c5", task: "Book photographer & videographer", phase: "9–12 months", category: "Vendors", done: true },
  { id: "c6", task: "Book decorator & mandap designer", phase: "9–12 months", category: "Vendors", done: true },
  { id: "c7", task: "Book caterer & finalise menu tasting", phase: "9–12 months", category: "Catering", done: false },
  { id: "c8", task: "Reserve blocks of guest hotel rooms", phase: "6–9 months", category: "Guests", done: false },
  { id: "c9", task: "Order bridal outfit & begin fittings", phase: "6–9 months", category: "Fashion", done: true },
  { id: "c10", task: "Book mehendi artist & makeup artist", phase: "6–9 months", category: "Beauty", done: false },
  { id: "c11", task: "Design & send save-the-dates", phase: "6–9 months", category: "Invitations", done: false },
  { id: "c12", task: "Book sangeet DJ & choreographer", phase: "3–6 months", category: "Entertainment", done: false },
  { id: "c13", task: "Finalise & print invitations", phase: "3–6 months", category: "Invitations", done: false },
  { id: "c14", task: "Plan haldi, mehendi & sangeet functions", phase: "3–6 months", category: "Ceremonies", done: false },
  { id: "c15", task: "Arrange guest transport & logistics", phase: "1–3 months", category: "Guests", done: false },
  { id: "c16", task: "Confirm final guest count with vendors", phase: "1–3 months", category: "Guests", done: false },
  { id: "c17", task: "Bridal & groom trials (hair, makeup)", phase: "1–3 months", category: "Beauty", done: false },
  { id: "c18", task: "Share the day-of timeline with the planner", phase: "Final month", category: "Planning", done: false },
  { id: "c19", task: "Confirm payments & final vendor briefs", phase: "Final month", category: "Vendors", done: false },
  { id: "c20", task: "Pack for the honeymoon", phase: "Final month", category: "Personal", done: false },
];

// ── Budget ──────────────────────────────────────────────────────
export type BudgetItem = {
  id: string;
  category: string;
  label: string;
  /** planned allocation, in ₹ */
  estimated: number;
  /** actually spent so far, in ₹ */
  spent: number;
  status: "Paid" | "Deposit paid" | "Not started";
};

export const budgetItems: BudgetItem[] = [
  { id: "b1", category: "Venue", label: "The Grand Udaipur — weekend takeover", estimated: 1800000, spent: 900000, status: "Deposit paid" },
  { id: "b2", category: "Catering", label: "Saffron Catering — 420 guests", estimated: 1400000, spent: 200000, status: "Deposit paid" },
  { id: "b3", category: "Decor", label: "Mandap Studio — all functions", estimated: 1400000, spent: 700000, status: "Deposit paid" },
  { id: "b4", category: "Photography", label: "The Lighthouse Films — Luxe", estimated: 1200000, spent: 1200000, status: "Paid" },
  { id: "b5", category: "Fashion", label: "Bridal & groom outfits", estimated: 900000, spent: 450000, status: "Deposit paid" },
  { id: "b6", category: "Entertainment", label: "DJ Aurelius + Raga Live", estimated: 500000, spent: 0, status: "Not started" },
  { id: "b7", category: "Beauty", label: "Anita Makeovers + House of Mehendi", estimated: 300000, spent: 65000, status: "Deposit paid" },
  { id: "b8", category: "Invitations", label: "Cards, save-the-dates & stationery", estimated: 250000, spent: 0, status: "Not started" },
  { id: "b9", category: "Florals", label: "Petal & Pearl — ceremony & tables", estimated: 250000, spent: 0, status: "Not started" },
];

// ── Timeline ────────────────────────────────────────────────────
export type TimelineMilestone = {
  id: string;
  title: string;
  detail: string;
  /** ISO date */
  date: string;
  status: "done" | "upcoming";
};

export const timelineMilestones: TimelineMilestone[] = [
  { id: "t1", title: "Venue booked", detail: "The Grand Udaipur reserved for the wedding weekend.", date: "2026-01-18", status: "done" },
  { id: "t2", title: "Photographer confirmed", detail: "The Lighthouse Films — Luxe package paid in full.", date: "2026-02-10", status: "done" },
  { id: "t3", title: "Decor & mandap locked", detail: "Mandap Studio deposit paid; design approved.", date: "2026-03-02", status: "done" },
  { id: "t4", title: "Bridal outfit — first fitting", detail: "Lehenga fitting and jewellery selection.", date: "2026-05-15", status: "done" },
  { id: "t5", title: "Menu tasting", detail: "Final tasting with Saffron Catering.", date: "2026-08-20", status: "upcoming" },
  { id: "t6", title: "Invitations sent", detail: "Printed invitations dispatched to all guests.", date: "2026-09-15", status: "upcoming" },
  { id: "t7", title: "Sangeet rehearsal", detail: "Choreography rehearsal with the families.", date: "2026-11-20", status: "upcoming" },
  { id: "t8", title: "Wedding weekend", detail: "Haldi, Mehendi, Sangeet, Pheras & Reception.", date: "2026-12-05", status: "upcoming" },
];

// ── Guests ──────────────────────────────────────────────────────
export type RsvpStatus = "Confirmed" | "Pending" | "Declined";
export type GuestSide = "Bride" | "Groom" | "Both";
export type MealPref = "Veg" | "Non-veg" | "Jain" | "Vegan";

export type Guest = {
  id: string;
  name: string;
  side: GuestSide;
  group: string;
  count: number;
  rsvp: RsvpStatus;
  meal: MealPref;
};

export const guests: Guest[] = [
  { id: "g1", name: "Rao Family", side: "Bride", group: "Immediate family", count: 6, rsvp: "Confirmed", meal: "Veg" },
  { id: "g2", name: "Shah Family", side: "Groom", group: "Immediate family", count: 5, rsvp: "Confirmed", meal: "Non-veg" },
  { id: "g3", name: "Priya & Arjun", side: "Bride", group: "Close friends", count: 2, rsvp: "Confirmed", meal: "Veg" },
  { id: "g4", name: "Dr. Sunita Mehra", side: "Bride", group: "Relatives", count: 1, rsvp: "Pending", meal: "Jain" },
  { id: "g5", name: "The Kapoors", side: "Groom", group: "Relatives", count: 4, rsvp: "Confirmed", meal: "Veg" },
  { id: "g6", name: "Karan Singh", side: "Groom", group: "Close friends", count: 1, rsvp: "Pending", meal: "Non-veg" },
  { id: "g7", name: "Neha & Rohan", side: "Both", group: "College friends", count: 2, rsvp: "Confirmed", meal: "Vegan" },
  { id: "g8", name: "Iyer Family", side: "Bride", group: "Relatives", count: 5, rsvp: "Declined", meal: "Veg" },
  { id: "g9", name: "Malhotra Family", side: "Groom", group: "Family friends", count: 4, rsvp: "Pending", meal: "Non-veg" },
  { id: "g10", name: "Aunt Lakshmi", side: "Bride", group: "Relatives", count: 2, rsvp: "Confirmed", meal: "Jain" },
];

/** Saved inspiration for the overview strip — reuse the gallery items. */
export const savedInspirationIds = ["insp-1", "insp-4", "insp-7", "insp-10", "insp-11"];

// ── Vendor Portal (the vendor's own private workspace) ──────────
// The signed-in vendor "owns" one profile from the `vendors` array below. Mock
// enquiries (leads) drive the vendor dashboard. Local state only — persistence
// and real per-vendor accounts arrive with the backend.

/** Which vendor profile the demo vendor account manages. */
export const myVendorSlug = "the-lighthouse-films";

export type EnquiryStatus = "New" | "Replied" | "Booked" | "Closed";

export type VendorEnquiry = {
  id: string;
  couple: string;
  /** ISO date the enquiry came in */
  date: string;
  eventDate: string;
  city: string;
  functions: string;
  budget: string;
  status: EnquiryStatus;
  message: string;
};

export const vendorEnquiries: VendorEnquiry[] = [
  {
    id: "enq-1",
    couple: "Aanya & Vikram",
    date: "2026-06-20",
    eventDate: "2026-12-05",
    city: "Udaipur",
    functions: "Wedding + Reception",
    budget: "₹10–12L",
    status: "Booked",
    message: "Loved your Udaipur reel — we'd like the Luxe package for our palace wedding.",
  },
  {
    id: "enq-2",
    couple: "Priya & Arjun",
    date: "2026-06-24",
    eventDate: "2027-02-14",
    city: "Lake Como",
    functions: "Destination wedding",
    budget: "₹8–10L",
    status: "Replied",
    message: "Do you travel to Italy? Looking for cinematic film + photo for a 2-day event.",
  },
  {
    id: "enq-3",
    couple: "Neha & Rohan",
    date: "2026-06-27",
    eventDate: "2026-11-22",
    city: "Jaipur",
    functions: "Sangeet + Wedding",
    budget: "₹6–8L",
    status: "New",
    message: "Please share availability for late November and your Signature package details.",
  },
  {
    id: "enq-4",
    couple: "Simran & Karan",
    date: "2026-06-28",
    eventDate: "2027-01-10",
    city: "Goa",
    functions: "Beach wedding",
    budget: "₹5–6L",
    status: "New",
    message: "We're planning a sunset beach ceremony — would love a quote.",
  },
  {
    id: "enq-5",
    couple: "Isha & Dev",
    date: "2026-05-30",
    eventDate: "2026-10-18",
    city: "Mumbai",
    functions: "Reception only",
    budget: "₹3–4L",
    status: "Closed",
    message: "Went with another studio for our date — thank you!",
  },
];
