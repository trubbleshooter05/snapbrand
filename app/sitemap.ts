import type { MetadataRoute } from "next";
import { BUSINESS_TYPE_CONFIG } from "./logo-generator/[business-type]/config";

/**
 * Logo generator URLs are built from `BUSINESS_TYPE_CONFIG` keys (e.g. `startup`,
 * `online-course`, `life-coach`, `photography`, `beauty-salon`, and all other slugs).
 */
/** Canonical site origin; override via NEXT_PUBLIC_SITE_URL when using a custom domain. */
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
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...logoGeneratorEntries,
  ];
}
