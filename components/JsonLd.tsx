/**
 * JsonLd — injects JSON-LD structured data (valid in document body).
 * Server-only; use from Server Components or layouts.
 */

import { SITE_NAME, SITE_URL } from "@/lib/site";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Re-export schema builders for convenience (single import path).
export {
  articleSchema,
  breadcrumbListSchema,
  comparisonArticleSchema,
  organizationSchemaGraph,
  softwareApplicationHomepageSchema,
  webPageSchema,
} from "@/lib/schema/jsonld-builders";

// ─── Pre-built schema factories ───────────────────────────────────────────────

const BASE_URL = SITE_URL;

export function logoGeneratorSchema(slug: string, seoTitle: string, seoDescription: string) {
  const pageUrl = `${BASE_URL}/logo-generator/${slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: `${SITE_NAME} — ${seoTitle}`,
        applicationCategory: "DesignApplication",
        description: seoDescription,
        url: pageUrl,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          description: "Free to start. Pro plans available.",
        },
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript",
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: BASE_URL,
        },
      },
      {
        "@type": "WebPage",
        name: seoTitle,
        description: seoDescription,
        url: pageUrl,
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            {
              "@type": "ListItem",
              position: 2,
              name: seoTitle,
              item: pageUrl,
            },
          ],
        },
      },
    ],
  };
}

export function faqSchema(faqItems: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };
}

/** @deprecated Prefer organizationSchemaGraph from jsonld-builders via layout. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
    description:
      "AI-powered brand kit generator for small businesses and startups.",
    sameAs: [] as string[],
  };
}
