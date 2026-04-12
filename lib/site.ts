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

/**
 * Optional public support inbox. Set `NEXT_PUBLIC_CONTACT_EMAIL` in your environment
 * when you have an address you want listed; otherwise the site uses non-email contact paths.
 */
export const CONTACT_EMAIL: string | undefined = (() => {
  const raw = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  return raw && raw.length > 0 ? raw : undefined;
})();

export function getDefaultArticleByline() {
  return {
    author: EDITORIAL_ATTRIBUTION,
    dateModified: SITE_CONTENT_REVIEWED_ISO,
    dateModifiedLabel: formatReviewDate(SITE_CONTENT_REVIEWED_ISO),
  };
}
