/**
 * JsonLd — injects JSON-LD structured data into the page <head>.
 * Usage: <JsonLd data={schemaObject} />
 *
 * This is a Server Component (no 'use client') so it renders into <head>
 * via Next.js layout or page-level metadata.
 */

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

// ─── Pre-built schema factories ───────────────────────────────────────────────

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://snapbrand.io"
).replace(/\/$/, "");

export function logoGeneratorSchema(slug: string, seoTitle: string, seoDescription: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": `SNAPBRAND — ${seoTitle}`,
        "applicationCategory": "DesignApplication",
        "description": seoDescription,
        "url": `${BASE_URL}/logo-generator/${slug}`,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "description": "Free to start. Pro plans available."
        },
        "operatingSystem": "Web",
        "browserRequirements": "Requires JavaScript",
        "publisher": {
          "@type": "Organization",
          "name": "SNAPBRAND",
          "url": BASE_URL
        }
      },
      {
        "@type": "WebPage",
        "name": seoTitle,
        "description": seoDescription,
        "url": `${BASE_URL}/logo-generator/${slug}`,
        "isPartOf": { "@type": "WebSite", "name": "SNAPBRAND", "url": BASE_URL },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
            { "@type": "ListItem", "position": 2, "name": "Logo Generator", "item": `${BASE_URL}/logo-generator` },
            { "@type": "ListItem", "position": 3, "name": seoTitle }
          ]
        }
      }
    ]
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

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SNAPBRAND",
    "url": BASE_URL,
    "description": "AI-powered logo and brand kit generator for small businesses and startups.",
    "sameAs": []
  };
}
