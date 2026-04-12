/**
 * Manual SEO content factory — generates review-only JSON matching
 * app/logo-generator/[business-type]/config.ts (plus `slug`).
 * Does not modify config.ts.
 *
 * Run (do not paste shell comments into npm): `npm run seo:factory`
 * Extra slugs: `npm run seo:factory -- coffee-shop podcast`
 */
import * as fs from "node:fs";
import * as path from "node:path";
import type { BusinessTypeConfig } from "../app/logo-generator/[business-type]/config";

export type GeneratedBusinessTypeEntry = BusinessTypeConfig & { slug: string };

/** Default batch — edit or pass slugs via CLI: npm run seo:factory -- foo bar */
const DEFAULT_INPUT: string[] = [
  "saas",
  "consulting",
  "startup",
  "photography",
  "beauty-salon",
];

/** Known slugs → short labels for relatedTypes and fallbacks */
const SLUG_LABELS: Record<string, string> = {
  "real-estate": "Real Estate",
  restaurant: "Restaurant",
  "fitness-coach": "Fitness Coach",
  ecommerce: "E-commerce",
  saas: "SaaS",
  "digital-agency": "Digital Agency",
  consulting: "Consulting",
  startup: "Startup",
  "online-course": "Online Course",
  "life-coach": "Life Coach",
  photography: "Photography",
  "beauty-salon": "Beauty Salon",
};

const RELATED_POOL = Object.keys(SLUG_LABELS);

function labelForSlug(slug: string): string {
  return (
    SLUG_LABELS[slug] ??
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

function relatedTypesFor(slug: string): { slug: string; label: string }[] {
  const others = RELATED_POOL.filter((s) => s !== slug);
  let start = 0;
  for (let i = 0; i < slug.length; i++) {
    start = (start + slug.charCodeAt(i)) % Math.max(others.length, 1);
  }
  const rotated = [...others.slice(start), ...others.slice(0, start)];
  return rotated.slice(0, 3).map((s) => ({ slug: s, label: labelForSlug(s) }));
}

/** Hand-tuned drafts per slug — swap/extend this object to grow the factory */
const TEMPLATES: Partial<Record<string, Omit<GeneratedBusinessTypeEntry, "slug">>> = {
  saas: {
    label: "SaaS",
    keyword: "saas logo generator",
    seoTitle: "SaaS Logo Generator — B2B Software Marks That Convert | SNAPBRAND",
    seoDescription:
      "Launch a credible B2B brand: AI SaaS logos for signup flows, pricing pages, and product UI. Win trials and demos—start free, upgrade for vectors and commercial use.",
    description:
      "Position your product as enterprise-ready before the first sales call—your logo belongs on the homepage, changelog, and investor deck.",
    benefits: [
      {
        icon: "🚀",
        title: "Funnel Credibility",
        desc: "Visitors judge trust in seconds. A sharp mark signals a serious product—not a side project.",
      },
      {
        icon: "🧩",
        title: "PLG-Ready",
        desc: "Cohesive visuals across marketing site, app shell, and docs so the brand feels intentional end to end.",
      },
      {
        icon: "📈",
        title: "Deck & Board-Ready",
        desc: "Present a unified story for fundraising and hiring; iterate fast when positioning shifts.",
      },
      {
        icon: "⚡",
        title: "Ship This Sprint",
        desc: "No agency queue—generate directions in minutes and pick what fits your category.",
      },
    ],
    faqItems: [
      {
        q: "Will it read enterprise vs. playful?",
        a: "Describe your ICP and tone. We bias toward trustworthy, modern B2B unless you ask for bold consumer energy.",
      },
      {
        q: "Can I use it in-product and in ads?",
        a: "Free is for trying personally. Pro unlocks commercial use across site, ads, and product surfaces—see plan terms.",
      },
      {
        q: "Dark mode / app icon friendly?",
        a: "Mention light vs. dark UI in your brief for better contrast. Pro adds formats suited to icons and favicons.",
      },
      {
        q: "What if we rebrand after a pivot?",
        a: "Regenerate anytime; Pro supports unlimited exploration as messaging evolves.",
      },
      {
        q: "How fast?",
        a: "Typically under a minute from submit to downloadable assets.",
      },
    ],
    relatedTypes: relatedTypesFor("saas"),
    ctaFormSubmit: "✨ Generate My SaaS Logo — Free",
    ctaBottom: "Ship my B2B brand kit",
    ctaSectionBlurb:
      "Put a confident mark on your site, deck, and product chrome—three free generations, then scale with Pro.",
  },

  consulting: {
    label: "Consulting",
    keyword: "consulting logo generator",
    seoTitle:
      "Consulting Logo Generator — Trusted Advisor Branding for Firms & Solos | SNAPBRAND",
    seoDescription:
      "Win higher retainers: executive consulting logos for proposals, LinkedIn, and keynotes. Look established before the discovery call—start free.",
    description:
      "Signal expertise and stability—your logo should feel at home on SOWs, capability decks, and conference slides.",
    benefits: [
      {
        icon: "🏛️",
        title: "Trust at First Glance",
        desc: "Buyers hire consultants who look credible. Reduce perceived risk on large engagements.",
      },
      {
        icon: "📄",
        title: "Proposal-Grade",
        desc: "Sharp on PDFs and one-pagers—the format clients actually forward internally.",
      },
      {
        icon: "🎤",
        title: "Thought Leadership",
        desc: "Consistent visuals across podcasts, articles, and stages reinforce your niche authority.",
      },
      {
        icon: "🧭",
        title: "Practice-Area Fit",
        desc: "Strategy, ops, HR, IT—describe your niche; we avoid gimmicky stock tropes.",
      },
    ],
    faqItems: [
      {
        q: "Solo vs. partnership branding?",
        a: "Say which you are—we tune scale and formality (named partners vs. personal brand).",
      },
      {
        q: "Executive without feeling stiff?",
        a: "Set the tone: modern, warm, precise—we balance authority and approachability.",
      },
      {
        q: "File formats?",
        a: "Free: PNG for quick use. Pro: vectors for print, slide masters, signatures.",
      },
      {
        q: "Align with an existing site?",
        a: "Share palette and type hints plus brands to avoid—we keep the mark coherent.",
      },
      {
        q: "Commercial license?",
        a: "Pro includes commercial use for client-facing work—verify scope in your plan.",
      },
    ],
    relatedTypes: relatedTypesFor("consulting"),
    ctaFormSubmit: "✨ Generate My Consulting Logo — Free",
    ctaBottom: "Elevate my firm’s first impression",
    ctaSectionBlurb:
      "Drop a polished mark into proposals and profiles today—three free tries before you upgrade.",
  },

  startup: {
    label: "Startup",
    keyword: "startup logo generator",
    seoTitle: "Startup Logo Generator — Launch Branding Investors & Users Respect | SNAPBRAND",
    seoDescription:
      "Move fast without looking amateur: AI startup logos for pitch decks, landing pages, and hiring. Look bigger than your runway—try free.",
    description:
      "From MVP to Series A—one identity that works on the deck, careers page, and product teaser.",
    benefits: [
      {
        icon: "🚀",
        title: "Deck & Demo Ready",
        desc: "Investors skim fast—a deliberate mark signals execution, not just an idea.",
      },
      {
        icon: "🧱",
        title: "Hiring & Culture",
        desc: "Same badge on recruiting posts and swag so early team members feel they joined a real company.",
      },
      {
        icon: "🎯",
        title: "Category-Aligned",
        desc: "Describe your space—we steer clear of lazy rocket clichés unless that is honestly your vibe.",
      },
      {
        icon: "⚡",
        title: "Iterate Weekly",
        desc: "Pivot messaging? Regenerate in minutes instead of waiting on agency cycles.",
      },
    ],
    faqItems: [
      {
        q: "B2B vs. DTC startups?",
        a: "Both—tell us buyer, category, and tone so visuals match your GTM motion.",
      },
      {
        q: "Pitch deck and data room use?",
        a: "Free for experiments; Pro unlocks commercial use for decks, sites, and recruiting—check the plan.",
      },
      {
        q: "Wordmark vs. symbol?",
        a: "Specify preference—we can lean typographic, icon-forward, or balanced lockups.",
      },
      {
        q: "After a pivot?",
        a: "Generate fresh directions anytime; Pro is unlimited for exploration.",
      },
      {
        q: "Turnaround time?",
        a: "Usually under a minute to first downloadable previews.",
      },
    ],
    relatedTypes: relatedTypesFor("startup"),
    ctaFormSubmit: "✨ Generate My Startup Logo — Free",
    ctaBottom: "Launch my investor-ready brand",
    ctaSectionBlurb:
      "Ship a mark you are proud to put on the deck and homepage—three free generations to find direction.",
  },

  photography: {
    label: "Photography",
    keyword: "photography logo generator",
    seoTitle:
      "Photography Logo Generator — Studio & Freelance Brands That Get Booked | SNAPBRAND",
    seoDescription:
      "Book more clients: photography logos for weddings, portraits, and commercial work. Watermark-ready, site-ready—start free, Pro for vectors.",
    description:
      "Lead with a mark that matches your niche—editorial, romantic, or bold—so referrals remember you.",
    benefits: [
      {
        icon: "📷",
        title: "Watermark-Friendly",
        desc: "Reads cleanly at low opacity so your images stay the hero.",
      },
      {
        icon: "💍",
        title: "Niche Fit",
        desc: "Wedding, family, brand, product—describe your ideal client and style.",
      },
      {
        icon: "🖼️",
        title: "Print & Packaging",
        desc: "Thank-you cards, stickers, studio signage—Pro vectors scale without blur.",
      },
      {
        icon: "🌐",
        title: "Discovery Consistency",
        desc: "Same logo on Google Business, portfolio, and directories builds recognition.",
      },
    ],
    faqItems: [
      {
        q: "Black, white, and full-color?",
        a: "Note primary backgrounds (gallery dark vs. invoice light). Pro helps with master variants.",
      },
      {
        q: "Brand or product photography?",
        a: "Yes—studio vs. location and B2B vs. couples changes the vibe; say so in the brief.",
      },
      {
        q: "Commercial licensing?",
        a: "Pro covers client deliverables and marketing—confirm details in your plan.",
      },
      {
        q: "Long business names?",
        a: "We can emphasize monogram or wordmark—tell us your hierarchy preference.",
      },
      {
        q: "How fast?",
        a: "Minutes from submit to download for digital use.",
      },
    ],
    relatedTypes: relatedTypesFor("photography"),
    ctaFormSubmit: "✨ Generate My Photography Logo — Free",
    ctaBottom: "Book more shoots with a pro mark",
    ctaSectionBlurb:
      "Watermark, email, Instagram—one cohesive identity. Three free generations; Pro for print-ready files.",
  },

  "beauty-salon": {
    label: "Beauty Salon",
    keyword: "beauty salon logo generator",
    seoTitle:
      "Beauty Salon Logo Generator — Spa & Salon Branding Clients Trust | SNAPBRAND",
    seoDescription:
      "Fill your calendar: salon and spa logos for signage, booking apps, and Instagram. Look premium before the first visit—try free.",
    description:
      "Stand out on the block and in the feed—your mark should match your services and price point.",
    benefits: [
      {
        icon: "✨",
        title: "Premium Perception",
        desc: "Polish supports retail upsells and higher service tiers.",
      },
      {
        icon: "💇",
        title: "Service Menu Fit",
        desc: "Hair, nails, skin, med-spa—describe your aesthetic and clientele.",
      },
      {
        icon: "📍",
        title: "Local & Loyalty",
        desc: "Consistent branding on maps, reviews, and storefront drives repeats.",
      },
      {
        icon: "📸",
        title: "Promo-Ready",
        desc: "Readable in Stories, gift cards, and seasonal campaigns.",
      },
    ],
    faqItems: [
      {
        q: "Luxury without generic script?",
        a: "Tell us references and what to avoid—we explore distinctive directions.",
      },
      {
        q: "Multi-location or franchise?",
        a: "Describe structure—we can suggest parent mark plus sub-brand usage in your notes.",
      },
      {
        q: "Print and vinyl?",
        a: "Free: digital PNG. Pro: vectors for menus, signage, and merch.",
      },
      {
        q: "Commercial use?",
        a: "Pro includes in-salon and promotional use—see plan for scope.",
      },
      {
        q: "How fast can we update signage?",
        a: "Download in minutes; coordinate print with Pro vector exports.",
      },
    ],
    relatedTypes: relatedTypesFor("beauty-salon"),
    ctaFormSubmit: "✨ Generate My Salon Logo — Free",
    ctaBottom: "Grow bookings with a standout brand",
    ctaSectionBlurb:
      "From storefront to Stories—three free generations; upgrade for vectors and commercial rights.",
  },
};

function ensureLogoGeneratorInTitle(seoTitle: string): string {
  if (/logo generator/i.test(seoTitle)) return seoTitle;
  const pipe = seoTitle.lastIndexOf("|");
  if (pipe === -1) return `${seoTitle.trim()} Logo Generator | SNAPBRAND`;
  return `${seoTitle.slice(0, pipe).trim()} Logo Generator ${seoTitle.slice(pipe).trim()}`;
}

function buildEntry(slug: string): GeneratedBusinessTypeEntry {
  const trimmed = slug.trim().toLowerCase();
  const template = TEMPLATES[trimmed];
  if (!template) {
    const label = labelForSlug(trimmed);
    const base: GeneratedBusinessTypeEntry = {
      slug: trimmed,
      label,
      keyword: `${trimmed.replace(/-/g, " ")} logo generator`,
      seoTitle: ensureLogoGeneratorInTitle(
        `${label} Logo Generator — Professional Branding | SNAPBRAND`,
      ),
      seoDescription: `Create a professional ${label.toLowerCase()} logo in minutes. AI-powered, conversion-focused branding—start free, upgrade when you need more.`,
      description: `Stand out with a ${label.toLowerCase()} logo tailored to your audience—built for your site, social, and marketing.`,
      benefits: [
        {
          icon: "✨",
          title: "On-Brand Fast",
          desc: "Generate directions that match your niche without starting from a blank canvas.",
        },
        {
          icon: "🎯",
          title: "Conversion-Aware",
          desc: "Clear, memorable marks that support trust on landing pages and profiles.",
        },
        {
          icon: "⚡",
          title: "Iterate Quickly",
          desc: "Try multiple concepts in one session before you commit.",
        },
        {
          icon: "💼",
          title: "Commercial Options",
          desc: "Upgrade for vectors and licensing when you are ready to ship everywhere.",
        },
      ],
      faqItems: [
        {
          q: "How fast is delivery?",
          a: "Usually under a minute from submit to preview.",
        },
        {
          q: "Can I use it commercially?",
          a: "Free is for personal trials; Pro unlocks commercial use—check your plan.",
        },
        {
          q: "What formats?",
          a: "Free includes PNG; Pro adds vectors and more export options.",
        },
        {
          q: "Can I match my colors?",
          a: "Yes—describe palette and competitors to avoid in your brief.",
        },
        {
          q: "What if I want variations?",
          a: "Generate multiple options; Pro supports unlimited exploration.",
        },
      ],
      relatedTypes: relatedTypesFor(trimmed),
      ctaFormSubmit: `✨ Generate My ${label} Logo — Free`,
      ctaBottom: `Level up my ${label.toLowerCase()} brand`,
      ctaSectionBlurb: `Get a polished ${label.toLowerCase()} mark and brand kit—three free generations to start.`,
    };
    return base;
  }

  const seoTitle = ensureLogoGeneratorInTitle(template.seoTitle);

  return {
    slug: trimmed,
    ...template,
    seoTitle,
    relatedTypes: template.relatedTypes ?? relatedTypesFor(trimmed),
  };
}

function parseArgs(): string[] {
  const args = process.argv.slice(2).filter((a) => a.length > 0);
  if (args.length > 0) return args.map((s) => s.trim().toLowerCase());
  return DEFAULT_INPUT;
}

function main(): void {
  const input = parseArgs();
  const entries: Record<string, GeneratedBusinessTypeEntry> = {};

  for (const slug of input) {
    entries[slug] = buildEntry(slug);
  }

  const outDir = path.join(process.cwd(), "scripts", "output");
  fs.mkdirSync(outDir, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `seo-review-${stamp}.json`;
  const outPath = path.join(outDir, fileName);

  const payload = {
    generatedAt: new Date().toISOString(),
    input,
    note:
      "Review-only output. Merge into app/logo-generator/[business-type]/config.ts manually after editing.",
    entries,
  };

  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(`Wrote ${outPath}`);
  console.log(`Slugs: ${input.join(", ")}`);
}

main();
