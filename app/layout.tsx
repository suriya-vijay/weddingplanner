import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kalyanam & Co. — Where Forever Takes Shape",
  description:
    "The luxury operating system for Indian weddings. Inspiration, trusted vendors, planning tools, AI assistance, and your own wedding planner — gathered into one elegant platform.",
  keywords: [
    "Indian wedding planning",
    "luxury wedding platform",
    "wedding vendors",
    "wedding inspiration",
    "wedding planner",
  ],
  openGraph: {
    title: "Kalyanam & Co. — Where Forever Takes Shape",
    description: "The luxury operating system for Indian weddings.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
