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
            We read every message. For fastest help, include your account email (if
            applicable) and a short description of the issue.
          </p>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Email
              </h2>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-lg text-indigo-400 hover:text-indigo-300 break-all"
              >
                {CONTACT_EMAIL}
              </a>
              <p className="text-sm text-gray-500 mt-2">
                Set <code className="text-gray-400">NEXT_PUBLIC_CONTACT_EMAIL</code> in
                your deployment to override this address.
              </p>
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
