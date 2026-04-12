import { SITE_CONTENT_REVIEWED_ISO } from "@/lib/site";

export interface Comparison {
  slug: string;
  competitor: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  competitorDescription: string;
  advantages: string[];
  competitorAdvantages: string[];
  competitorPricing: string;
  verdict: string;
  /** ISO date for Article schema and bylines (editorial review). */
  dateModified: string;
}

export const comparisons: Comparison[] = [
  {
    slug: "snapbrand-vs-looka",
    competitor: "Looka",
    metaTitle: "SnapBrand vs Looka — AI Brand Kit Comparison (2026)",
    metaDescription:
      "Side-by-side overview: how SnapBrand and Looka differ on workflow, outputs, and pricing models for AI-assisted branding.",
    h1: "SnapBrand vs Looka: Which Fits Your Workflow?",
    competitorDescription:
      "Looka is an AI-assisted logo tool: you pick styles and refine a mark, and you can add a Brand Kit as a paid add-on for related assets.",
    advantages: [
      "Outputs a structured kit in one pass (logo direction, palette, type, and messaging cues) from a short brief",
      "Industry-oriented prompts when you start from vertical landing pages",
      "Includes voice and tagline-style copy suggestions alongside visuals",
      "Free tier includes several generations without a card on file (limits apply)",
      "Typical flow completes in roughly a minute for a first draft",
    ],
    competitorAdvantages: [
      "Widely known product with a long track record in DIY logo design",
      "Deeper in-editor logo adjustments than a single-pass generator",
      "Mockups for business cards and some print-oriented layouts",
      "Large library of template-driven applications",
    ],
    competitorPricing:
      "Historically: free to explore; paid logo and Brand Kit options are sold separately (check Looka for current numbers).",
    verdict:
      "If your bottleneck is iterating on a single mark with heavy manual tweaks, Looka’s editor-centric flow can make sense. If you want a fast, unified first draft of logo + palette + type + messaging to react to, SnapBrand is built around that single-pass kit model. Confirm current pricing and export terms on each vendor’s site before you buy.",
    dateModified: SITE_CONTENT_REVIEWED_ISO,
  },
  {
    slug: "snapbrand-vs-canva",
    competitor: "Canva",
    metaTitle: "SnapBrand vs Canva Brand Kit — Key Difference Explained (2026)",
    metaDescription:
      "Clarifies the difference between generating a new brand with AI and storing an existing brand in Canva’s Brand Kit.",
    h1: "SnapBrand vs Canva: Generation vs Brand Kit Storage",
    competitorDescription:
      "Canva’s Brand Kit (on paid plans) stores logos, colors, and fonts so they can be applied across designs. It assumes you already have those assets.",
    advantages: [
      "Produces an initial brand direction from text when you do not yet have finalized assets",
      "AI-generated palette and type pairing in the same step as logo directions",
      "Copy and tone suggestions aimed at early positioning drafts",
      "Useful when you are starting from only a name and a short description",
      "Free tier lets you try multiple directions before paying",
    ],
    competitorAdvantages: [
      "Very large template library for social, print, and presentations",
      "Full canvas editor for day-to-day design work",
      "Collaboration and brand control features for teams (plan-dependent)",
      "Strong fit once your hex codes and logos are locked",
    ],
    competitorPricing:
      "Varies by region and plan; see Canva’s pricing page for Pro and Teams.",
    verdict:
      "These tools solve different problems: SnapBrand is aimed at producing an initial brand system from a brief; Canva is aimed at applying an existing brand across creative work. Teams often draft or refresh direction in a generator, then move approved assets into Canva (or any design tool) for production. Verify feature availability on your Canva plan.",
    dateModified: SITE_CONTENT_REVIEWED_ISO,
  },
  {
    slug: "snapbrand-vs-fiverr",
    competitor: "Fiverr",
    metaTitle: "SnapBrand vs Fiverr Logo Design — AI vs Freelancer (2026)",
    metaDescription:
      "Compare turnaround, cost structure, and what you typically receive from AI brand kits versus hiring a freelancer on Fiverr.",
    h1: "SnapBrand vs Fiverr: AI Brand Kit vs Freelance Designer",
    competitorDescription:
      "Fiverr is a marketplace: you hire individual designers with their own styles, timelines, and deliverable packages. Pricing spans a wide range.",
    advantages: [
      "Near-instant first drafts instead of multi-day scheduling cycles",
      "Predictable tool behavior for iteration on a subscription or free tier",
      "Structured kit output (colors, fonts, messaging) in one session",
      "Useful for exploring directions before briefing a human designer",
      "Lower friction when you need something credible today and may refine later",
    ],
    competitorAdvantages: [
      "Original art direction from a person who can interpret nuance",
      "Suitable for bespoke illustration or unusual brand requirements",
      "Some gigs include editable vector source files by agreement",
      "You can select specialists by portfolio fit",
    ],
    competitorPricing:
      "Highly variable by seller and scope; always read the gig description for file types and revisions.",
    verdict:
      "Many teams use AI kits to narrow direction quickly, then commission a designer for polish, illustration, or production-ready vector work. If you need hand-drawn craft or complex brand systems, a vetted freelancer may still be the right investment. Review deliverables and revision counts before ordering.",
    dateModified: SITE_CONTENT_REVIEWED_ISO,
  },
];

export function getComparisonBySlug(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}

export function getAllComparisonSlugs(): string[] {
  return comparisons.map((c) => c.slug);
}
