import type { Metadata } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://snapbrand-snowy.vercel.app"
).replace(/\/$/, "");

export type SeoMarketingSection = {
  title: string;
  content: string | string[];
};

export type SeoMarketingPageDef = {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: SeoMarketingSection[];
  relatedPages: { href: string; label: string }[];
};

export function metadataForSeoMarketingPage(def: SeoMarketingPageDef): Metadata {
  const url = `${siteUrl}${def.path}`;
  return {
    title: def.title,
    description: def.description,
    openGraph: {
      title: def.title,
      description: def.description,
      url,
      siteName: "SnapBrand",
      type: "website",
    },
    alternates: {
      canonical: url,
    },
  };
}

/** Slug → full page definition for marketing SEO landings */
export const SEO_MARKETING_PAGES: Record<string, SeoMarketingPageDef> = {
  "free-brand-kit-generator": {
    path: "/free-brand-kit-generator",
    eyebrow: "Brand kit generator",
    title:
      "Free Brand Kit Generator — Logo, Colors & Voice in One Flow | SnapBrand",
    description:
      "Use a free brand kit generator to get logo directions, a cohesive palette, typography, and messaging. No signup required for your first generations—try SnapBrand.",
    h1: "Free Brand Kit Generator",
    intro:
      "A free brand kit generator helps you move from a vague business idea to a usable identity you can ship: logo concepts, color harmony, font pairing, tagline options, and tone of voice. Instead of piecing assets together from unrelated tools, you describe what you sell and who you serve, then review a complete kit you can iterate on. That matters when you are validating a product, launching a side project, or refreshing a small business brand without a full agency budget. SnapBrand is built for speed: you get structured output in about a minute so you can test landing pages, pitch decks, and social profiles with consistent visuals and copy. You can start without a credit card and explore multiple directions before you commit.",
    sections: [
      {
        title: "What you should expect from a brand kit",
        content:
          "A practical brand kit is more than a single logo file. It should clarify primary and secondary colors, which fonts to use for headlines versus body text, how your brand sounds in one or two sentences, and how to describe your offer consistently. When those pieces align, every touchpoint—from your site hero to your email signature—feels intentional. A generator is not a replacement for deep strategy at enterprise scale, but for most founders and small teams it removes the blank-page problem and gives you a professional baseline you can refine with customers and stakeholders.",
      },
      {
        title: "How to get the best results from SnapBrand",
        content: [
          "Name your business clearly and avoid generic placeholders so the model can anchor visuals and copy.",
          "Describe your audience and differentiator: who buys from you and why you win versus alternatives.",
          "Mention constraints such as premium vs playful, local vs global, or technical vs lifestyle—those cues steer palette and typography.",
          "Generate more than one kit when you are unsure; comparing two directions often clarifies what feels on-brand.",
        ],
      },
      {
        title: "Why founders choose SnapBrand for a free first pass",
        content:
          "SnapBrand focuses on end-to-end brand system output—not only a mark—so you spend less time reconciling hex codes with voice guidelines. The workflow is designed for people who need something credible today and a path to polish tomorrow. When you are ready, you can upgrade for more generations and exports while keeping the same brief discipline that made your first kits useful.",
      },
    ],
    relatedPages: [
      { href: "/logo-and-brand-kit-generator", label: "Logo and brand kit generator" },
      { href: "/brand-kit-for-small-business", label: "Brand kit for small business" },
      { href: "/snapbrand-vs-looka", label: "SnapBrand vs Looka" },
    ],
  },

  "logo-and-brand-kit-generator": {
    path: "/logo-and-brand-kit-generator",
    eyebrow: "Logo + brand system",
    title:
      "Logo and Brand Kit Generator — Full Identity in One Session | SnapBrand",
    description:
      "Generate a logo direction plus a complete brand kit: colors, fonts, taglines, and voice. SnapBrand turns your brief into cohesive assets in about a minute.",
    h1: "Logo and Brand Kit Generator",
    intro:
      "Searching for a logo and brand kit generator usually means you want both a distinctive mark and the system around it—colors that match the story, type that fits the product, and messaging that sounds like one company, not three vendors. Traditional workflows split logo tools, palette pickers, and copy generators, which slows you down and risks visual drift. SnapBrand combines those steps: you enter your brand name and a short description, and you receive a unified kit you can apply to your site, packaging, and campaigns. Whether you are naming a new SaaS product or rebranding a local service, starting with a single coherent pass saves hours and reduces expensive rework later.",
    sections: [
      {
        title: "Logo plus kit vs logo-only tools",
        content:
          "Logo-only generators optimize for mark exploration but often leave you guessing at supporting colors and fonts. A combined approach encodes the same creative brief across every element, so your headline font does not fight your icon style and your palette supports readability on real backgrounds. That integration is what makes a kit ready for production rather than inspiration-only.",
      },
      {
        title: "Where teams use the output first",
        content:
          "Most teams apply the first kit to a landing page, a pitch deck, and a profile banner so they can test messaging with real prospects. Others use the kit as a creative brief for an agency or freelancer, which typically lowers revision counts because the direction is already aligned. If you operate across channels, having voice and visual rules in one place keeps Instagram, email, and paid ads consistent without constant design firefighting.",
      },
      {
        title: "Try SnapBrand on your actual brief",
        content:
          "The fastest way to judge fit is to run your real business description—not a toy example—through SnapBrand and compare two outputs. Adjust tone in your brief between runs to see how the system responds. When something clicks, move forward with confidence and iterate from a solid foundation.",
      },
    ],
    relatedPages: [
      { href: "/free-brand-kit-generator", label: "Free brand kit generator" },
      { href: "/brand-kit-for-startups", label: "Brand kit for startups" },
      { href: "/snapbrand-vs-canva-brand-kit", label: "SnapBrand vs Canva Brand Kit" },
    ],
  },

  "brand-kit-for-real-estate-agents": {
    path: "/brand-kit-for-real-estate-agents",
    eyebrow: "Industry brand kits",
    title:
      "Brand Kit for Real Estate Agents — Trust, Polish & Local Presence",
    description:
      "Build a real estate agent brand kit with professional colors, typography, and messaging suited to listings, signs, and digital lead gen. Generate yours with SnapBrand.",
    h1: "Brand Kit for Real Estate Agents",
    intro:
      "Real estate is a trust-first category: buyers and sellers gravitate toward agents who look established, approachable, and hyper-relevant to their market. A brand kit for real estate agents should telegraph credibility without feeling corporate or cold, and it should flex across yard signs, listing flyers, Instagram stories, and email campaigns. Many agents rely on brokerage templates alone, which helps with compliance but can blur personal differentiation. With SnapBrand, you can generate a tailored kit that reflects your farm area, price segment, and personality—whether that is luxury understatement, family-friendly warmth, or investor-focused clarity. The goal is repeatable visuals and phrasing so every touchpoint reinforces why someone should call you instead of the next search result.",
    sections: [
      {
        title: "What matters in agent branding",
        content:
          "Prospects scan photos, headlines, and color before they read details. Consistent primary colors and a readable type hierarchy make listing materials easier to skim under time pressure. Voice matters too: confident and specific beats vague superlatives. Your kit should include short positioning lines you can reuse on business cards, open-house slides, and profile bios without rewriting from scratch each time.",
      },
      {
        title: "Translating your kit into everyday marketing",
        content:
          "Start with your web hero and profile photo frame: apply the palette and fonts from your kit so those high-impression surfaces match your print collateral. Use the tone guidelines to standardize how you describe transactions, neighborhoods, and client outcomes. When you sponsor a community event or run a digital ad, you will not be guessing which blue or serif fits—you will already have the answer.",
      },
      {
        title: "Generate an agent-ready kit with SnapBrand",
        content:
          "Describe your market focus, typical price band, and the vibe you want buyers to feel—modern loft specialist, suburban family expert, or waterfront advisor. SnapBrand returns a cohesive system you can stress-test against your current materials. Iterate until the story feels like you, then roll it out consistently across channels for stronger recognition and referrals.",
      },
    ],
    relatedPages: [
      { href: "/brand-kit/for/real-estate-agent", label: "Real estate agent generator page" },
      { href: "/brand-kit-for-small-business", label: "Brand kit for small business" },
      { href: "/logo-and-brand-kit-generator", label: "Logo and brand kit generator" },
    ],
  },

  "brand-kit-for-small-business": {
    path: "/brand-kit-for-small-business",
    eyebrow: "Small business",
    title:
      "Brand Kit for Small Business — Affordable Identity You Can Actually Use",
    description:
      "Create a small business brand kit with coordinated logo directions, colors, fonts, and messaging. SnapBrand helps you look professional while you stay focused on customers.",
    h1: "Brand Kit for Small Business",
    intro:
      "Small businesses win on reliability, personality, and clarity—but those qualities disappear when your website, invoices, and storefront signs all look like they came from different decades. A brand kit for small business owners should be easy to maintain with limited time and no dedicated designer on staff. It needs clear color codes, simple font rules, and a voice that your team can repeat in customer conversations. SnapBrand gives you that package quickly from a short brief about what you sell and what makes you different. You can deploy the kit across Google Business Profile, packaging, uniforms, and email newsletters without paying for a lengthy agency engagement before you have traction.",
    sections: [
      {
        title: "Practical priorities when you are stretched thin",
        content:
          "Favor guidelines you will actually follow: two primary colors, one accent, two fonts, and a handful of approved phrases beat a fifty-page manual nobody opens. Your kit should make it obvious how to format a headline, how much whitespace to leave, and how to describe your guarantee or delivery promise consistently. That reduces mistakes and speeds up any contractor you hire later.",
      },
      {
        title: "Growing from scrappy to scalable",
        content:
          "Early on, your brand can evolve weekly; a structured kit does not trap you—it gives you a checkpoint so changes are intentional. When you add a second location or an online store, you will already know how to extend visuals and tone instead of rebranding by accident. Investors and partners also read polish as operational maturity, even for a lean team.",
      },
      {
        title: "Start with SnapBrand today",
        content:
          "Share your business name, what you deliver, and the audience you serve. SnapBrand produces a cohesive identity system you can compare across a few generations until it feels right. From there, apply it consistently and revisit when your offer or market shifts—your future self will thank you for the head start.",
      },
    ],
    relatedPages: [
      { href: "/free-brand-kit-generator", label: "Free brand kit generator" },
      { href: "/brand-kit-for-ecommerce", label: "Brand kit for ecommerce" },
      { href: "/brand-kit-for-instagram", label: "Brand kit for Instagram" },
    ],
  },

  "brand-kit-for-startups": {
    path: "/brand-kit-for-startups",
    eyebrow: "Startups",
    title:
      "Brand Kit for Startups — Move Fast Without Looking Amateur | SnapBrand",
    description:
      "Ship a startup brand kit fast: positioning cues, logo directions, palette, type, and voice aligned for pitch decks, product UI, and hiring. Try SnapBrand free to iterate.",
    h1: "Brand Kit for Startups",
    intro:
      "Startups need momentum: you are racing to prove traction, recruit talent, and stand out in crowded categories. A brand kit for startups should be decisive enough to unify your pitch deck, product marketing site, and early ads, yet flexible enough to evolve when your positioning sharpens. Investors notice when typography, color, and narrative feel like one vision instead of a collage of freelance experiments. SnapBrand helps founders compress weeks of alignment into minutes by generating a coherent system from your problem statement, target user, and differentiation. You still own strategy—SnapBrand gives you professional scaffolding so design and copy debates start from shared assets rather than blank slides.",
    sections: [
      {
        title: "What to lock early versus what to flex",
        content:
          "Lock a credible color system, typographic hierarchy, and baseline voice before you scale spend on paid acquisition or conference booths. Stay flexible on illustrative details until product-market fit clarifies. A kit makes those early locks cheaper to test because you can A/B messaging while keeping visuals stable, which isolates what actually moves conversion.",
      },
      {
        title: "Cross-functional alignment",
        content:
          "Engineering, marketing, and sales should reference the same short descriptor of what you do. When your kit includes phrasing and tone, you reduce drift in onboarding screens, help docs, and outbound sequences. That consistency compounds as headcount grows and you cannot rely on hallway conversations alone.",
      },
      {
        title: "Generate your startup kit with SnapBrand",
        content:
          "Bring your real pitch: category, ICP, wedge, and competitors. Generate multiple kits to explore divergent aesthetics—enterprise sober versus product-led playful—then pick a lane and execute. SnapBrand is built for rapid iteration so you can revisit branding when you pivot without starting from zero.",
      },
    ],
    relatedPages: [
      { href: "/brand-kit-for-small-business", label: "Brand kit for small business" },
      { href: "/logo-and-brand-kit-generator", label: "Logo and brand kit generator" },
      { href: "/snapbrand-vs-looka", label: "SnapBrand vs Looka" },
    ],
  },

  "brand-kit-for-instagram": {
    path: "/brand-kit-for-instagram",
    eyebrow: "Social & creators",
    title:
      "Brand Kit for Instagram — Cohesive Posts, Stories & Profile | SnapBrand",
    description:
      "Create an Instagram-friendly brand kit: colors, fonts, and voice that stay consistent in posts, Reels, and bio links. Generate yours with SnapBrand in minutes.",
    h1: "Brand Kit for Instagram",
    intro:
      "Instagram rewards recognizable rhythm: when followers see your colors, type treatment, and caption tone before they read your handle, you earn saves and shares. A brand kit for Instagram should translate to square posts, vertical Stories, and tiny profile avatars without losing legibility. Creators and small brands often stall because they improvise palettes per post; the feed looks scattered even when individual pieces are pretty. SnapBrand helps you define the system first—accent colors that pop on mobile, headline styles that survive compression, and voice guidelines that keep CTAs and hashtags on-brand. You can then batch content faster because you are not deciding basics anew every day.",
    sections: [
      {
        title: "Designing for mobile contrast and motion",
        content:
          "Test readability on dimmed screens and bright outdoor light. High-contrast pairs from your kit reduce eye strain and improve swipe-through on Reels covers. Keep one or two signature elements—color block, frame shape, or typographic hook—so viewers recognize your work in under a second as they scroll.",
      },
      {
        title: "Caption voice that scales",
        content:
          "Decide if you lead with education, humor, or aspiration, then document phrases and emoji usage in your kit so collaborators or assistants can post without breaking tone. Consistency builds parasocial trust, which drives DMs, clicks, and sales from link-in-bio flows.",
      },
      {
        title: "Build your Instagram-ready kit",
        content:
          "Tell SnapBrand about your niche, content pillars, and monetization path—courses, services, or products. Use the generated palette and voice across templates in your editor of choice. Iterate kits until your grid mockups feel unmistakably you, then roll out a content calendar with less creative friction.",
      },
    ],
    relatedPages: [
      { href: "/brand-kit-for-ecommerce", label: "Brand kit for ecommerce" },
      { href: "/free-brand-kit-generator", label: "Free brand kit generator" },
      { href: "/brand-kit-for-small-business", label: "Brand kit for small business" },
    ],
  },

  "brand-kit-for-ecommerce": {
    path: "/brand-kit-for-ecommerce",
    eyebrow: "Ecommerce",
    title:
      "Brand Kit for Ecommerce — Product Pages, Ads & Packaging That Convert",
    description:
      "Generate an ecommerce brand kit with cohesive visuals and messaging for your storefront, ads, and unboxing. SnapBrand aligns logo, colors, fonts, and voice for selling online.",
    h1: "Brand Kit for Ecommerce",
    intro:
      "Ecommerce brands live in thumbnails, carousel ads, and unboxing moments. A brand kit for ecommerce must stay legible at small sizes, work on white and photo backgrounds, and support trust signals like guarantees and shipping clarity. Disjointed colors between your Shopify theme, TikTok ads, and email flows quietly hurt conversion because shoppers sense inconsistency as risk. SnapBrand generates a unified system from your product category, customer objections, and brand personality—whether you sell sustainable apparel, specialty food, or electronics accessories. You can hand the same brief to designers and agencies later, but first you need a credible baseline you can ship this quarter.",
    sections: [
      {
        title: "Merchandising and performance creative",
        content:
          "Your kit should include accent colors that pop in sale badges and CTA buttons without clashing with product photography. Typography rules help long titles in PDPs remain scannable. Voice guidelines keep promo copy aligned with your premium-or-accessible positioning so discounts do not accidentally sound desperate.",
      },
      {
        title: "Retention and packaging",
        content:
          "Repeat purchases rise when post-purchase emails and inserts feel like the same brand as the ad that acquired the customer. A documented kit makes it easier to brief printers and fulfillment partners so inserts, tape, and thank-you cards reinforce recognition unboxing after unboxing.",
      },
      {
        title: "Generate your store’s kit with SnapBrand",
        content:
          "Describe your catalog, average order value, and brand promise—fast shipping, craftsmanship, or curated selection. SnapBrand outputs coordinated assets you can apply to your theme, ad accounts, and social storefronts. Test multiple directions for seasonal launches while keeping parent brand equity intact.",
      },
    ],
    relatedPages: [
      { href: "/brand-kit/for/ecommerce", label: "Ecommerce vertical generator" },
      { href: "/brand-kit-for-instagram", label: "Brand kit for Instagram" },
      { href: "/snapbrand-vs-canva-brand-kit", label: "SnapBrand vs Canva Brand Kit" },
    ],
  },

  "snapbrand-vs-looka": {
    path: "/snapbrand-vs-looka",
    eyebrow: "Compare",
    title: "SnapBrand vs Looka — AI Brand Kit vs Logo-First Workflow (2026)",
    description:
      "Compare SnapBrand and Looka for AI branding: speed, what you get in the kit, pricing philosophy, and which tool fits logo exploration vs full brand systems.",
    h1: "SnapBrand vs Looka",
    intro:
      "Choosing between SnapBrand vs Looka comes down to what you need first: a deeply editable logo build-out or a complete brand system you can apply across copy and channels. Looka popularized AI-assisted logo design with a guided quiz and optional brand kit purchases; many teams love it for iterating on mark shapes and business-card mocks. SnapBrand emphasizes end-to-end identity in a single generation—logo directions alongside palette, typography pairing, taglines, and brand voice so your story does not lag your visuals. If you already know you need stationery templates and fine-grained logo tweaking, test Looka’s editor. If you need a coherent brief you can ship to a website and campaigns today, run SnapBrand with your real positioning statement and compare outputs side by side.",
    sections: [
      {
        title: "Where SnapBrand leads",
        content:
          "SnapBrand is strongest when you want a unified narrative: colors, fonts, and messaging generated from the same inputs so nothing feels bolted on. That helps founders who lack a copywriter and designers who need a creative direction before high-fidelity work. Multiple free generations let you explore divergent aesthetics before spending.",
      },
      {
        title: "Where Looka shines",
        content:
          "Looka remains a solid choice when the logo itself is the open question and you want granular control over symbols and layouts. Its ecosystem of mockups helps visualize cards and swag. Pricing often reflects logo-first purchasing, so evaluate total cost if you also need messaging and voice guidelines elsewhere.",
      },
      {
        title: "How to decide quickly",
        content:
          "Write a two-sentence brief covering audience, offer, and tone. Generate once in SnapBrand and once in Looka, then score clarity, cohesion, and time-to-export for your next milestone—landing page, pitch, or store. Pick the pipeline that gets credible creative in front of customers fastest; you can always refine later.",
      },
    ],
    relatedPages: [
      { href: "/compare/snapbrand-vs-looka", label: "SnapBrand vs Looka (full comparison)" },
      { href: "/snapbrand-vs-canva-brand-kit", label: "SnapBrand vs Canva Brand Kit" },
      { href: "/logo-and-brand-kit-generator", label: "Logo and brand kit generator" },
    ],
  },

  "snapbrand-vs-canva-brand-kit": {
    path: "/snapbrand-vs-canva-brand-kit",
    eyebrow: "Compare",
    title:
      "SnapBrand vs Canva Brand Kit — Generate Identity vs Apply Existing Assets",
    description:
      "Understand SnapBrand vs Canva Brand Kit: SnapBrand creates a new brand from your brief; Canva stores logos and colors for designs. See when to use each together.",
    h1: "SnapBrand vs Canva Brand Kit",
    intro:
      "The SnapBrand vs Canva Brand Kit comparison is really generator versus repository. Canva’s Brand Kit is excellent once you already have a logo, hex codes, and fonts—it keeps teams on-template across decks, social posts, and print. It does not invent positioning, voice, or a coordinated system from a business description; you bring assets, Canva helps apply them. SnapBrand starts earlier in the journey: you describe your business and receive a generated identity direction you can iterate on, including messaging hooks. Many teams use both in sequence—SnapBrand to originate the system, Canva to scale creative production—so the question is less about rivalry and more about which job you are solving this week.",
    sections: [
      {
        title: "When SnapBrand is the right first step",
        content:
          "Choose SnapBrand when you have a name and story but no finalized visuals, or when your current look is inconsistent and you want a fresh pass grounded in strategy-like prompts. It is built for speed and exploration without requiring design files upfront. You can generate multiple kits cheaply while you validate positioning.",
      },
      {
        title: "When Canva Brand Kit earns its keep",
        content:
          "Choose Canva after you have locked core assets and need collaboration, template libraries, and role-based access across marketing. Its strength is throughput and reuse, not net-new brand strategy. Teams with mature guidelines still benefit from centralized colors and type in Canva to reduce off-brand exports.",
      },
      {
        title: "Using both without duplication",
        content:
          "Export your SnapBrand palette and font picks into Canva once you are happy, then govern templates there. That pairing keeps creation fast and compliance high. If you only use Canva, budget extra time to produce the underlying strategy elsewhere; if you only use SnapBrand, plan how assets flow into your daily design tool of choice.",
      },
    ],
    relatedPages: [
      { href: "/compare/snapbrand-vs-canva", label: "SnapBrand vs Canva (full page)" },
      { href: "/snapbrand-vs-looka", label: "SnapBrand vs Looka" },
      { href: "/free-brand-kit-generator", label: "Free brand kit generator" },
    ],
  },

  "snapbrand-vs-hatchful": {
    path: "/snapbrand-vs-hatchful",
    eyebrow: "Compare",
    title:
      "SnapBrand vs Hatchful — Beyond Logos to Full Brand Kits | SnapBrand",
    description:
      "Compare SnapBrand and Shopify Hatchful: quick logo packs vs AI brand kits with colors, type, taglines, and voice. See which fits your store or launch timeline.",
    h1: "SnapBrand vs Hatchful",
    intro:
      "SnapBrand vs Hatchful reflects two eras of DIY branding. Hatchful by Shopify gives beginners fast logo templates tuned to industries, which pairs naturally with merchants who want an icon and wordmark before they publish a store. It is approachable and lightweight for getting something acceptable live. SnapBrand targets teams that want more than a mark: a structured kit spanning palette rationale, typography hierarchy, tagline directions, and brand voice so marketing copy and visuals stay aligned as you scale beyond a single storefront banner. If you only need a simple logo to start selling, Hatchful can suffice. If you are competing on story, community, or premium positioning, a fuller kit reduces the patchwork of fonts and colors that creep in after launch.",
    sections: [
      {
        title: "Output depth and iteration",
        content:
          "Hatchful optimizes for quick selection among template families; iteration is largely within those bounds. SnapBrand lets you re-prompt with richer business context to explore divergent creative territories—still fast, but oriented toward system output rather than a single emblem. Consider how often you will refresh campaigns; systems age better than one-off logos without guidelines.",
      },
      {
        title: "Commerce workflows",
        content:
          "Hatchful’s Shopify pedigree helps merchants who live in that ecosystem feel at home. SnapBrand remains store-agnostic: use outputs on Shopify, WooCommerce, or marketplaces equally. If you sell across channels, cross-platform messaging consistency often matters more than a single-platform wizard.",
      },
      {
        title: "Try SnapBrand on your shop brief",
        content:
          "Describe your catalog, hero products, and customer promise, then compare a Hatchful export with a SnapBrand kit applied to your homepage mock. Pick the path that makes your brand feel intentional at first click—then keep iterating with data.",
      },
    ],
    relatedPages: [
      { href: "/brand-kit-for-ecommerce", label: "Brand kit for ecommerce" },
      { href: "/snapbrand-vs-looka", label: "SnapBrand vs Looka" },
      { href: "/logo-and-brand-kit-generator", label: "Logo and brand kit generator" },
    ],
  },
};

export function getSeoMarketingSlugs(): string[] {
  return Object.keys(SEO_MARKETING_PAGES);
}
