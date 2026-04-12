import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema, webPageSchema } from "@/lib/schema/jsonld-builders";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

const title = "Contact | SnapBrand";
const description =
  "Reach the SnapBrand team for product questions, billing help, and privacy inquiries.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/contact`,
    siteName: "SnapBrand",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  const url = `${SITE_URL}/contact`;
  return (
    <>
      <JsonLd data={webPageSchema({ name: title, description, url })} />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <div className="min-h-screen bg-gray-950 text-white">
        <article className="max-w-3xl mx-auto px-4 pt-24 pb-20">
          <p className="text-sm font-semibold tracking-widest text-indigo-400 uppercase mb-4">
            SnapBrand
          </p>
          <h1 className="text-4xl font-bold text-white mb-6">Contact</h1>
          <p className="text-gray-400 mb-10 leading-relaxed">
            Get help with the product, your account, or formal privacy requests. We don’t list
            an email address on this page to reduce spam; use the options below.
          </p>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 space-y-6">
            {CONTACT_EMAIL ? (
              <div>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Email
                </h2>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=SnapBrand%20inquiry`}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-6 py-3 text-white font-semibold transition-all"
                >
                  Email SnapBrand
                </a>
                <p className="text-xs text-gray-500 mt-3 max-w-md">
                  The inbox isn’t shown as text on this site. Your mail app opens with a new
                  message; some browsers still expose the destination in the link or status bar.
                </p>
              </div>
            ) : null}

            <div>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                {CONTACT_EMAIL ? "Other ways to get help" : "How to reach us"}
              </h2>
              <ul className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <li>
                  <strong className="text-white">Product &amp; generation:</strong> use the{" "}
                  <Link className="text-indigo-400 hover:text-indigo-300" href="/#generate">
                    brand kit generator
                  </Link>{" "}
                  on the home page (no signup required for your first tries).
                </li>
                <li>
                  <strong className="text-white">Account &amp; billing:</strong> sign in and use
                  your dashboard and{" "}
                  <Link className="text-indigo-400 hover:text-indigo-300" href="/pricing">
                    pricing
                  </Link>{" "}
                  for plan details. Checkout is handled by our payment provider.
                </li>
                <li>
                  <strong className="text-white">Privacy &amp; data rights:</strong> see our{" "}
                  <Link className="text-indigo-400 hover:text-indigo-300" href="/privacy">
                    Privacy Policy
                  </Link>{" "}
                  for what we collect and how to request access, correction, or deletion where
                  applicable.
                </li>
              </ul>
              {!CONTACT_EMAIL ? (
                <p className="text-xs text-gray-500 mt-4">
                  To add a private mailto button here, set{" "}
                  <code className="text-gray-400">NEXT_PUBLIC_CONTACT_EMAIL</code> in your
                  hosting environment (the address is not shown as text).
                </p>
              ) : null}
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Policies
              </h2>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link className="text-indigo-400 hover:text-indigo-300" href="/privacy">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link className="text-indigo-400 hover:text-indigo-300" href="/terms">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
