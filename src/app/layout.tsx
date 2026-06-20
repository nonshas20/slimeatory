import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Slimeatory — Slime worth obsessing over.",
  description:
    "Slimeatory blends artisan craft, viral content, and obsessive quality into every handcrafted jar we ship. Small batch. Big obsession.",
  keywords: ["Slimeatory", "handcrafted slime", "slime shop", "artisan slime", "small batch slime"],
  authors: [{ name: "Slimeatory" }],
  openGraph: {
    title: "Slimeatory — Slime worth obsessing over.",
    description: "Handcrafted slime, viral content, obsessive quality.",
    siteName: "Slimeatory",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${bricolage.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
