import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema, webPageSchema } from "@/lib/schema/jsonld-builders";
import { SITE_URL } from "@/lib/site";

const title = "Terms of Service | SnapBrand";
const description =
  "Terms governing use of the SnapBrand website and AI brand kit services.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/terms`,
    siteName: "SnapBrand",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  const url = `${SITE_URL}/terms`;
  return (
    <>
      <JsonLd data={webPageSchema({ name: title, description, url })} />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Terms", path: "/terms" },
        ])}
      />
      <div className="min-h-screen bg-gray-950 text-white">
        <article className="max-w-3xl mx-auto px-4 pt-24 pb-20">
          <p className="text-sm font-semibold tracking-widest text-indigo-400 uppercase mb-4">
            Legal
          </p>
          <h1 className="text-4xl font-bold text-white mb-6">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-10">
            Last updated: April 11, 2026 · Applies to {SITE_URL}
          </p>

          <div className="prose prose-invert prose-sm max-w-none space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mt-0">Agreement</h2>
              <p>
                By accessing or using SnapBrand, you agree to these Terms and our{" "}
                <Link className="text-indigo-400" href="/privacy">
                  Privacy Policy
                </Link>
                . If you do not agree, do not use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">The service</h2>
              <p>
                SnapBrand provides AI-assisted tools to generate branding-related outputs
                (such as logo directions, color palettes, typography suggestions, and
                short-form copy) based on information you provide. Outputs are
                machine-generated drafts and may require human review before commercial use.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Accounts</h2>
              <p>
                You are responsible for safeguarding your account credentials and for activity
                under your account. You must provide accurate information when registering.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Acceptable use</h2>
              <p>You agree not to misuse the service, including by:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Violating applicable laws or third-party rights;</li>
                <li>Attempting to probe, scan, or test the vulnerability of our systems;</li>
                <li>Reverse engineering or attempting to extract models except where permitted by law;</li>
                <li>Uploading malware or harassing content;</li>
                <li>Using automated means to abuse rate limits or fair-use policies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Intellectual property</h2>
              <p>
                The SnapBrand name, site design, and software are protected by intellectual
                property laws. License terms for assets you generate depend on your plan and
                are described on the{" "}
                <Link className="text-indigo-400" href="/pricing">
                  pricing
                </Link>{" "}
                page and in-product messaging. You are responsible for ensuring your use of
                outputs does not infringe others’ rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Disclaimers</h2>
              <p>
                The service is provided “as is” and “as available.” We disclaim warranties to
                the fullest extent permitted by law. AI outputs may be inaccurate or
                unsuitable for your use case; you evaluate and use them at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Limitation of liability</h2>
              <p>
                To the maximum extent permitted by law, SnapBrand and its suppliers will not
                be liable for indirect, incidental, special, consequential, or punitive
                damages, or for loss of profits, data, or goodwill, arising from your use of
                the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Termination</h2>
              <p>
                We may suspend or terminate access for violations of these Terms or for
                operational reasons. You may stop using the service at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Changes</h2>
              <p>
                We may modify these Terms; the “Last updated” date will change when we do.
                Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Contact</h2>
              <p>
                <Link className="text-indigo-400" href="/contact">
                  Contact SnapBrand
                </Link>
              </p>
            </section>
          </div>
        </article>
      </div>
    </>
  );
}
