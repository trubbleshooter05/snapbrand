import type { MetadataRoute } from "next";
import { BUSINESS_TYPE_CONFIG } from "./logo-generator/[business-type]/config";
import { getAllVerticalSlugs } from "@/lib/verticals";
import { getAllComparisonSlugs } from "@/lib/comparisons";
import { getSeoMarketingSlugs } from "@/lib/seo-marketing-pages";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://snapbrand-snowy.vercel.app"
).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const logoGeneratorEntries: MetadataRoute.Sitemap = Object.keys(
    BUSINESS_TYPE_CONFIG,
  ).map((slug) => ({
    url: `${BASE_URL}/logo-generator/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const verticalPages = getAllVerticalSlugs().map((slug) => ({
    url: `${BASE_URL}/brand-kit/for/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const comparisonPages = getAllComparisonSlugs().map((slug) => ({
    url: `${BASE_URL}/compare/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const seoMarketingPages = getSeoMarketingSlugs().map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const seoTemplatePages = [
    {
      url: `${BASE_URL}/brand-guidelines-template`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/brand-guide-template`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/brand-guidelines-examples`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/brand-guide-examples`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/brand-book-template`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/brand-identity-template`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/brand-style-guide-template`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    ...seoTemplatePages,
    ...seoMarketingPages,
    ...logoGeneratorEntries,
    ...verticalPages,
    ...comparisonPages,
  ];
}
