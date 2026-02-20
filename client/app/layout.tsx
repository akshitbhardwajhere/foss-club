import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProvidersAndLayout from "./ProvidersAndLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FOSS Club | NIT Srinagar",
  description: "The premier Free and Open Source Software (FOSS) community at National Institute of Technology Srinagar. Join us in building the open-source future.",
  keywords: ["FOSS", "NIT Srinagar", "Open Source", "Programming", "Coding", "Hackathons", "Tech Community", "Software Engineering"],
  openGraph: {
    title: "FOSS Club | NIT Srinagar",
    description: "The premier Free and Open Source Software (FOSS) community at National Institute of Technology Srinagar.",
    siteName: "FOSS NIT Srinagar",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FOSS Club | NIT Srinagar",
    description: "The premier Free and Open Source Software (FOSS) community at National Institute of Technology Srinagar.",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050B08] text-white overflow-x-hidden`}
      >
        <ProvidersAndLayout>
          {children}
        </ProvidersAndLayout>
      </body>
    </html>
  );
}
