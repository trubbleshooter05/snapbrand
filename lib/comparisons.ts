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
}

export const comparisons: Comparison[] = [
  {
    slug: "snapbrand-vs-looka",
    competitor: "Looka",
    metaTitle: "SnapBrand vs Looka — AI Brand Kit Comparison (2026)",
    metaDescription: "Compare SnapBrand and Looka. See features, pricing, and which AI brand tool is better for your business.",
    h1: "SnapBrand vs Looka: Which Is Better for Your Brand?",
    competitorDescription: "Looka is an AI logo maker that generates logos based on style preferences and provides a Brand Kit as an add-on product.",
    advantages: [
      "Complete brand system in one generation, not just a logo",
      "Industry-specific brand kits tailored to your vertical",
      "Brand voice and copywriting guidelines included",
      "3 free generations with no credit card",
      "Complete kit in 60 seconds vs multi-step process"
    ],
    competitorAdvantages: [
      "More established brand with wider recognition",
      "More logo customization in their editor",
      "Business card and stationery mockups",
      "Larger print template library"
    ],
    competitorPricing: "Free to design, $20-65 for logo, $96 for Brand Kit (one-time)",
    verdict: "Looka is better for logo-focused needs with extensive editing. SnapBrand is better if you need a complete brand identity system — colors, fonts, voice, strategy — quickly and affordably."
  },
  {
    slug: "snapbrand-vs-canva",
    competitor: "Canva",
    metaTitle: "SnapBrand vs Canva Brand Kit — Key Difference Explained (2026)",
    metaDescription: "SnapBrand generates your brand with AI. Canva stores a brand you already have. See the key difference.",
    h1: "SnapBrand vs Canva: Generator vs Storage",
    competitorDescription: "Canva's Brand Kit stores your existing brand assets and helps apply them across designs. It does NOT generate a brand identity for you.",
    advantages: [
      "Generates your brand from scratch — no existing assets needed",
      "AI-powered: describe your business, get a complete brand",
      "Includes brand voice, taglines, and strategy",
      "Perfect for businesses that don't have a brand yet",
      "3 free generations let you explore options"
    ],
    competitorAdvantages: [
      "Millions of design templates",
      "Full design editor for any marketing material",
      "Team collaboration features",
      "Better for applying an existing brand"
    ],
    competitorPricing: "Free basic, $13/mo Pro, $10/person/mo Teams",
    verdict: "Different tools for different jobs. SnapBrand CREATES your brand. Canva APPLIES it. Start with SnapBrand, then use Canva to create designs with your new brand assets. They're complementary."
  },
  {
    slug: "snapbrand-vs-fiverr",
    competitor: "Fiverr",
    metaTitle: "SnapBrand vs Fiverr Logo Design — AI vs Freelancer (2026)",
    metaDescription: "AI brand kit or Fiverr designer? Compare speed, cost, quality, and what you actually get.",
    h1: "SnapBrand vs Fiverr: AI Brand Kit vs Freelancer",
    competitorDescription: "Fiverr connects you with freelance designers for logos and brand identities. Prices range from $5 to $500+.",
    advantages: [
      "60 seconds vs 3-7 days on Fiverr",
      "Unlimited iterations on Pro plan",
      "Complete brand system, not just a logo",
      "No designer lottery — consistent quality",
      "Try before you buy with free generations"
    ],
    competitorAdvantages: [
      "Human creative input and original vision",
      "Complex custom illustration work",
      "Vector source files (AI, EPS) included",
      "Better for unusual or highly specific needs"
    ],
    competitorPricing: "$5-50 basic logo, $100-300 brand package, $500+ premium",
    verdict: "Use SnapBrand to explore directions and get a working brand today. If you later want custom illustration, hire a Fiverr designer and hand them your SnapBrand kit as a brief — they'll charge less when you already know what you want."
  }
];

export function getComparisonBySlug(slug: string): Comparison | undefined {
  return comparisons.find(c => c.slug === slug);
}

export function getAllComparisonSlugs(): string[] {
  return comparisons.map(c => c.slug);
}
