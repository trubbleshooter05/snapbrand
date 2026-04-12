import {
  CONTACT_EMAIL,
  EDITORIAL_ATTRIBUTION,
  SITE_CONTENT_REVIEWED_ISO,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

const ORG_ID = `${SITE_URL}/#organization`;

export function organizationSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "AI-powered brand kit generator: logo directions, color palettes, typography, and brand voice for startups and small businesses.",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          url: `${SITE_URL}/contact`,
          ...(CONTACT_EMAIL ? { email: CONTACT_EMAIL } : {}),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { "@id": ORG_ID },
        inLanguage: "en-US",
      },
    ],
  };
}

export function softwareApplicationHomepageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${SITE_NAME} — Brand Kit Generator`,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier with paid Pro subscription available.",
    },
    description:
      "Generate a complete brand kit with AI: logo directions, colors, typography, taglines, and brand voice. Free to try; signup optional for first generations.",
    url: SITE_URL,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: input.url,
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
    datePublished: input.datePublished ?? input.dateModified,
    dateModified: input.dateModified,
    author: {
      "@type": "Organization",
      name: EDITORIAL_ATTRIBUTION,
    },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}

export function breadcrumbListSchema(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

export function comparisonArticleSchema(input: {
  headline: string;
  description: string;
  url: string;
  dateModified: string;
}) {
  return articleSchema({
    headline: input.headline,
    description: input.description,
    url: input.url,
    dateModified: input.dateModified,
  });
}

/** Legal / utility static pages — WebPage + breadcrumb optional */
export function webPageSchema(input: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: input.url,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": ORG_ID },
    dateModified: SITE_CONTENT_REVIEWED_ISO,
  };
}
