import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundMesh from "@/components/BackgroundMesh";
import { JsonLd, organizationSchemaGraph } from "@/components/JsonLd";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://snapbrand-snowy.vercel.app"
).replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: `${siteUrl}/`,
  },
  title:
    "SnapBrand — AI Brand Kit Generator | Create Your Brand in 60 Seconds",
  description:
    "Generate a complete brand identity with AI. Logo, color palette, typography, taglines, and brand voice — in 60 seconds. Free to try, no signup required.",
  keywords: [
    "AI brand kit",
    "brand generator",
    "logo generator",
    "brand identity",
    "AI logo",
    "color palette",
    "typography",
    "SnapBrand",
  ],
  openGraph: {
    title:
      "SnapBrand — AI Brand Kit Generator | Create Your Brand in 60 Seconds",
    description:
      "Generate a complete brand identity with AI. Logo, color palette, typography, taglines, and brand voice — in 60 seconds. Free to try, no signup required.",
    url: `${siteUrl}/`,
    siteName: "SnapBrand",
    type: "website",
  },
  verification: {
    google: "EdP7De48YXoMCUbFmJu9PoxdBlBof-HSUxlZTYVnjiQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd data={organizationSchemaGraph()} />
        <BackgroundMesh />
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
