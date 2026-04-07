import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundMesh from "@/components/BackgroundMesh";

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

export const metadata: Metadata = {
  title: "SNAPBRAND - AI-Powered Brand Generation",
  description: "Generate beautiful brand assets with AI. Create logos, colors, and more.",
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
