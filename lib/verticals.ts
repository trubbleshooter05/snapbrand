export interface Vertical {
  slug: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  businessType: string;
  description: string;
  painPoints: string[];
  suggestedStyles: string[];
  examplePrompt: string;
  faq: { q: string; a: string }[];
}

export const verticals: Vertical[] = [
  {
    slug: "restaurant",
    title: "AI Brand Kit for Restaurants",
    h1: "Create Your Restaurant Brand Identity in 60 Seconds",
    metaTitle: "AI Brand Kit for Restaurants — Logo, Colors, Menu Design | SnapBrand",
    metaDescription: "Generate a complete restaurant brand kit with AI. Get a logo, color palette, typography, menu templates, and social media designs in seconds. Free to try.",
    businessType: "Restaurant",
    description: "Whether you're opening a new restaurant or rebranding an existing one, your visual identity sets the tone before guests taste a single dish. A cohesive brand across your menu, signage, social media, and delivery apps builds recognition and trust. SnapBrand generates a complete restaurant brand system — colors that evoke the right appetite, typography that matches your cuisine's personality, and a visual identity that works from your storefront to your Instagram grid.",
    painPoints: [
      "Hiring a designer costs $2,000-5,000+ for a restaurant brand package",
      "Generic Canva templates make every restaurant look the same",
      "Need consistent branding across menus, signage, social media, and delivery apps",
      "Seasonal menu changes require constant design updates"
    ],
    suggestedStyles: ["Warm & Organic", "Modern & Clean", "Luxury & Elegant"],
    examplePrompt: "Farm-to-table Italian restaurant in Brooklyn with exposed brick and candlelit ambiance",
    faq: [
      { q: "What's included in a restaurant brand kit?", a: "A complete brand kit includes your logo concept, color palette with hex codes, recommended fonts for menus and signage, brand voice guidelines, tagline options, and social media template designs — everything you need for a cohesive restaurant identity." },
      { q: "Can I use this for my menu design?", a: "Yes. The typography and color palette are specifically chosen to work on menus, signage, and digital displays. Apply the fonts and colors directly in any design tool like Canva or Adobe Express." },
      { q: "How is this different from a generic logo maker?", a: "Generic logo makers give you an icon. SnapBrand gives you a complete brand system — colors, fonts, voice, taglines, and social templates that all work together to tell your restaurant's story." }
    ]
  },
  {
    slug: "real-estate-agent",
    title: "AI Brand Kit for Real Estate Agents",
    h1: "Build Your Real Estate Personal Brand in 60 Seconds",
    metaTitle: "AI Brand Kit for Real Estate Agents — Logo, Colors, Templates | SnapBrand",
    metaDescription: "Stand out in a crowded market. Generate a professional real estate brand kit with AI — logo, colors, fonts, social templates, and listing materials. Free to try.",
    businessType: "Real Estate Agent",
    description: "In real estate, your personal brand IS your business. Clients choose agents they trust, and trust starts with a professional, consistent visual identity across your yard signs, business cards, listing presentations, and social media. SnapBrand generates a brand system that positions you as the obvious choice in your market — not just another agent sharing your brokerage's generic template.",
    painPoints: [
      "Brokerage-provided branding is generic and shared with dozens of other agents",
      "Professional branding packages cost $1,500-3,000+",
      "Need consistent look across yard signs, business cards, social media, and listing presentations",
      "Rebranding when switching brokerages is expensive and time-consuming"
    ],
    suggestedStyles: ["Luxury & Elegant", "Modern & Clean", "Bold & Playful"],
    examplePrompt: "Luxury real estate agent specializing in waterfront properties on Long Island",
    faq: [
      { q: "Will this work alongside my brokerage branding?", a: "Yes. Your SnapBrand kit creates your personal brand identity that works alongside your brokerage branding, giving you a distinctive look while staying compliant with your brokerage guidelines." },
      { q: "Can I use this for my listing presentations?", a: "Absolutely. The color palette, fonts, and brand voice are designed to be applied across all your materials — from listing presentations to social media posts to yard signs." },
      { q: "Is this better than hiring a designer?", a: "For getting started quickly and affordably, yes. A designer costs $2,000+ and takes weeks. SnapBrand gives you a professional brand system in 60 seconds that you can refine over time." }
    ]
  },
  {
    slug: "saas",
    title: "AI Brand Kit for SaaS Companies",
    h1: "Create Your SaaS Brand in 60 Seconds",
    metaTitle: "AI Brand Kit for SaaS & Software Startups | SnapBrand",
    metaDescription: "Launch your SaaS with a professional brand. AI-generated logo, tech-forward colors, and design system. Free to try.",
    businessType: "SaaS",
    description: "Your SaaS brand needs to look like it belongs alongside the tools your users already pay for. First impressions from your landing page determine whether prospects trust your product. SnapBrand generates a brand system with the credibility and clarity that converts investors and customers.",
    painPoints: [
      "Landing page design sets first impressions for product quality",
      "Need brand system before building product UI",
      "Investor decks require polished branding",
      "Competing with established SaaS requires credibility"
    ],
    suggestedStyles: ["Tech & Minimal", "Modern & Clean", "Bold & Playful"],
    examplePrompt: "B2B SaaS platform for automating invoice reconciliation for accounting teams",
    faq: [
      { q: "Can I use this in my product UI?", a: "Yes — the color palette and typography are designed for product interfaces. Apply the primary/secondary/accent colors directly to your component library." },
      { q: "Do I need this before I launch?", a: "Recommended. A cohesive brand from day one builds trust on your landing page and in investor meetings. You can iterate on it as you grow." }
    ]
  },
  {
    slug: "ecommerce",
    title: "AI Brand Kit for E-commerce Stores",
    h1: "Create Your Online Store Brand in 60 Seconds",
    metaTitle: "AI Brand Kit for E-commerce & Shopify Stores | SnapBrand",
    metaDescription: "Build a Shopify-ready brand identity with AI. Logo, colors, packaging concepts, and social templates for e-commerce brands. Free to try.",
    businessType: "E-commerce Store",
    description: "In e-commerce, your brand IS the product experience. From your Shopify theme to your packaging to your Instagram ads — every touchpoint needs to feel cohesive to build the trust that converts browsers into buyers. A professional brand signals quality before the customer even opens your checkout.",
    painPoints: [
      "Shopify themes are templates — everyone looks the same",
      "Packaging design requires consistent colors and typography",
      "Running ads across Meta, Google, TikTok needs unified creative",
      "Competing with established D2C brands requires professional visual identity"
    ],
    suggestedStyles: ["Modern & Clean", "Bold & Playful", "Luxury & Elegant"],
    examplePrompt: "Sustainable activewear brand for women who hike, made from recycled ocean plastics",
    faq: [
      { q: "Will this work with Shopify?", a: "Yes — the hex codes and font recommendations can be directly applied to any Shopify theme. The color palette works on both light and dark backgrounds." },
      { q: "Can I use this for paid ads?", a: "Absolutely. The brand colors and logo are optimized for social ads, email headers, and product photography backgrounds." }
    ]
  },
  {
    slug: "personal-trainer",
    title: "AI Brand Kit for Personal Trainers",
    h1: "Create Your Fitness Brand Identity in 60 Seconds",
    metaTitle: "AI Brand Kit for Personal Trainers & Fitness Coaches | SnapBrand",
    metaDescription: "Build a fitness brand that attracts premium clients. Generate a personal trainer brand kit with AI — logo, colors, social templates. Free to try.",
    businessType: "Personal Trainer",
    description: "Your brand should reflect the transformation you deliver. Standing out from thousands of trainers on Instagram requires more than good content — it requires a cohesive, professional visual identity that signals you're worth premium rates. A branded presence builds trust with potential clients before they book a session.",
    painPoints: [
      "Most trainers use random colors and fonts across social media",
      "Professional branding feels out of reach on a trainer's budget",
      "Need to look professional to attract premium clients",
      "Competing with thousands of trainers on Instagram requires visual differentiation"
    ],
    suggestedStyles: ["Bold & Playful", "Modern & Clean", "Tech & Minimal"],
    examplePrompt: "High-intensity functional fitness coach for busy professionals who value efficiency",
    faq: [
      { q: "Will this help me get more clients on Instagram?", a: "A consistent brand identity makes your profile look professional and trustworthy. The color palette and font system help you maintain visual consistency across every post." },
      { q: "Can I use this for online coaching?", a: "Yes — the brand kit works for both in-person and online coaching. Apply the assets to your website, social media, client portals, and marketing materials." }
    ]
  }
];

export function getVerticalBySlug(slug: string): Vertical | undefined {
  return verticals.find(v => v.slug === slug);
}

export function getAllVerticalSlugs(): string[] {
  return verticals.map(v => v.slug);
}
