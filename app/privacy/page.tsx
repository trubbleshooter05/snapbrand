import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema, webPageSchema } from "@/lib/schema/jsonld-builders";
import { SITE_URL } from "@/lib/site";

const title = "Privacy Policy | SnapBrand";
const description =
  "How SnapBrand collects, uses, and protects information when you use our website and services.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/privacy`,
    siteName: "SnapBrand",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  const url = `${SITE_URL}/privacy`;
  return (
    <>
      <JsonLd
        data={webPageSchema({ name: title, description, url })}
      />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ])}
      />
      <div className="min-h-screen bg-gray-950 text-white">
        <article className="max-w-3xl mx-auto px-4 pt-24 pb-20">
          <p className="text-sm font-semibold tracking-widest text-indigo-400 uppercase mb-4">
            Legal
          </p>
          <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-10">
            Last updated: April 11, 2026 · Applies to {SITE_URL}
          </p>

          <div className="prose prose-invert prose-sm max-w-none space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mt-0">Overview</h2>
              <p>
                SnapBrand (“we”, “us”) operates the website at{" "}
                <Link className="text-indigo-400 hover:text-indigo-300" href="/">
                  {SITE_URL}
                </Link>
                . This policy describes how we handle information in connection with
                the site and related services. If you use SnapBrand, you agree to this
                policy and our{" "}
                <Link className="text-indigo-400" href="/terms">
                  Terms of Service
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Information we may collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-gray-200">Account data</strong> — if you create an
                  account: email address and profile details you provide.
                </li>
                <li>
                  <strong className="text-gray-200">Content you submit</strong> — text you
                  enter to generate brand kits (for example brand name and description).
                </li>
                <li>
                  <strong className="text-gray-200">Technical data</strong> — standard server
                  and analytics data such as IP address, browser type, device type, and
                  pages visited, used to operate and secure the service.
                </li>
                <li>
                  <strong className="text-gray-200">Payment data</strong> — if you purchase a
                  paid plan, payment processing is handled by our payment provider; we do not
                  store full card numbers on our servers.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">How we use information</h2>
              <p>We use the information above to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide, maintain, and improve SnapBrand features;</li>
                <li>Authenticate users and prevent abuse;</li>
                <li>Process transactions and send service-related messages;</li>
                <li>Comply with law and enforce our terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Cookies</h2>
              <p>
                We may use cookies and similar technologies for session management,
                preferences, analytics, and security. You can control cookies through your
                browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Third parties</h2>
              <p>
                We rely on infrastructure and service providers (for example hosting,
                analytics, authentication, and payments). Those providers process data
                under their own terms and only as needed to deliver the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Retention</h2>
              <p>
                We retain information for as long as needed to provide the service, meet
                legal obligations, and resolve disputes. Retention periods may vary by data
                type.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Your choices</h2>
              <p>
                Depending on your region, you may have rights to access, correct, delete, or
                export personal data, or to object to certain processing. Contact us to
                exercise those rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Children</h2>
              <p>
                SnapBrand is not directed at children under 13, and we do not knowingly
                collect their personal information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Changes</h2>
              <p>
                We may update this policy from time to time. The “Last updated” date at the
                top will change when we do; continued use after changes means you accept
                the revised policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Contact</h2>
              <p>
                Questions about privacy: see our{" "}
                <Link className="text-indigo-400" href="/contact">
                  contact page
                </Link>
                .
              </p>
            </section>
          </div>
        </article>
      </div>
    </>
  );
}
