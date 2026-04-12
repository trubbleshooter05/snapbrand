/** Single source of truth for public site identity (audit / SEO / schema). */

export const SITE_NAME = "SnapBrand";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://snapbrand-snowy.vercel.app"
).replace(/\/$/, "");

export const EDITORIAL_ATTRIBUTION = "SnapBrand Editorial Team";

/** ISO date for last editorial review (update when content is substantively revised). */
export const SITE_CONTENT_REVIEWED_ISO = "2026-04-11";

export function formatReviewDate(iso: string): string {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@snapbrand.app";

export function getDefaultArticleByline() {
  return {
    author: EDITORIAL_ATTRIBUTION,
    dateModified: SITE_CONTENT_REVIEWED_ISO,
    dateModifiedLabel: formatReviewDate(SITE_CONTENT_REVIEWED_ISO),
  };
}
