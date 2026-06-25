// Import standard metadata types from Next.js
import type { Metadata } from "next";
// Load custom Google fonts Geist Sans and Geist Mono
import { Geist, Geist_Mono } from "next/font/google";
// Import global styling
import "./globals.css";
// Import client-side layout providers wrapper
import ProvidersAndLayout from "./ProvidersAndLayout";
// Import custom UI notification drawer (Sonner toast notifications)
import { Toaster } from "@/components/ui/sonner";

// Configure Geist Sans font and store the CSS variable identifier
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configure Geist Mono font and store the CSS variable identifier
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define core SEO and OpenGraph metadata configurations for the public website
export const metadata: Metadata = {
  title: "FOSS Club | NIT Srinagar",
  description:
    "The premier Free and Open Source Software (FOSS) community at National Institute of Technology Srinagar. Join us in building the open-source future.",
  keywords: [
    "FOSS",
    "NIT Srinagar",
    "Open Source",
    "Programming",
    "Coding",
    "Hackathons",
    "Tech Community",
    "Software Engineering",
  ],
  openGraph: {
    title: "FOSS Club | NIT Srinagar",
    description:
      "The premier Free and Open Source Software (FOSS) community at National Institute of Technology Srinagar.",
    siteName: "FOSS NIT Srinagar",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FOSS Club | NIT Srinagar",
    description:
      "The premier Free and Open Source Software (FOSS) community at National Institute of Technology Srinagar.",
  },
};

/**
 * RootLayout (Server Component)
 *
 * The absolute root of the Next.js application bridging the `<html>` and `<body>` tags.
 * Sets up global metadata (SEO/OpenGraph), integrates global CSS, loads local Geist fonts,
 * and initializes the dark mode theme. Wraps everything in the client-side `ProvidersAndLayout`.
 *
 * @param {Object} props - React children node.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Set default lang and class 'dark' to initialize dark mode styling
    <html lang="en" className="dark">
      <body
        // Apply custom fonts as CSS variables and enforce base theme background
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050B08] text-white overflow-x-hidden`}
      >
        {/* Wrap pages in the client-side Store Providers & Page transitions layout */}
        <ProvidersAndLayout>{children}</ProvidersAndLayout>
        {/* Render the global alerts toast element */}
        <Toaster />
      </body>
    </html>
  );
}
