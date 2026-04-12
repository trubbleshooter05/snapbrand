import type { Metadata } from "next";
import { JsonLd, faqSchema } from "@/components/JsonLd";
import {
  breadcrumbListSchema,
  webPageSchema,
} from "@/lib/schema/jsonld-builders";
import { PRICING_FAQ } from "@/lib/pricing-faq";
import { SITE_URL } from "@/lib/site";
import PricingPageClient from "./pricing-client";

const title = "Pricing | SnapBrand — Free & Pro Plans";
const description =
  "SnapBrand pricing: start free with limited generations, or upgrade to Pro for unlimited brand kits, SVG export, and a commercial license.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/pricing`,
    siteName: "SnapBrand",
    type: "website",
  },
};

export default function PricingPage() {
  const pageUrl = `${SITE_URL}/pricing`;
  return (
    <>
      <JsonLd data={faqSchema(PRICING_FAQ)} />
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      <JsonLd
        data={webPageSchema({
          name: title,
          description,
          url: pageUrl,
        })}
      />
      <PricingPageClient />
    </>
  );
}
