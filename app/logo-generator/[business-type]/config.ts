import { GENERATED_BUSINESS_TYPES } from "./generated-types";
/**
 * Logo Generator Page Configuration
 *
 * Add new business types here. Each type automatically gets:
 * - Dynamic URL: /logo-generator/[business-type]
 * - SEO metadata (title, description)
 * - Branded content (benefits, FAQs)
 * - Internal links
 *
 * To add a new type:
 * 1. Copy a complete entry below
 * 2. Update slug, label, keywords, benefits, faqItems
 * 3. Save — page automatically works at new URL
 */

export interface BusinessTypeConfig {
  label: string
  keyword: string
  seoTitle: string
  seoDescription: string
  description: string
  benefits: { icon: string; title: string; desc: string }[]
  faqItems: { q: string; a: string }[]
  relatedTypes: { slug: string; label: string }[]
  /** Primary form submit; audience-specific when set */
  ctaFormSubmit?: string
  /** Bottom section CTA link text */
  ctaBottom?: string
  /** Bottom section supporting copy under the headline */
  ctaSectionBlurb?: string
}

export const BUSINESS_TYPE_CONFIG: Record<string, BusinessTypeConfig> = {
  'real-estate': {
    label: 'Real Estate',
    keyword: 'real estate logo generator',
    seoTitle: 'Real Estate Logo Generator - Professional Property Logos | SNAPBRAND',
    seoDescription: 'Design professional real estate logos in seconds. Build trust with buyers and sellers. Customize instantly. No design skills required. Free trial.',
    description: 'Stand out in real estate with a professional logo that builds trust and differentiates your brand in a competitive market.',
    benefits: [
      {
        icon: '🏠',
        title: 'Earn Trust Instantly',
        desc: 'A professional logo positions you as a credible expert. Buyers and sellers choose brokers who look established.',
      },
      {
        icon: '⚡',
        title: 'Consistent Branding',
        desc: 'Use the same visual identity across listings, websites, business cards, and social media for maximum impact.',
      },
      {
        icon: '🎨',
        title: 'Niche-Specific Design',
        desc: 'Get logos tailored to residential, luxury, commercial, or investment properties—not generic stock designs.',
      },
      {
        icon: '💼',
        title: 'Done in Seconds',
        desc: 'No designers, no waiting weeks. Get polished logos ready to use immediately.',
      },
    ],
    faqItems: [
      {
        q: 'How fast do I get a logo?',
        a: 'Seconds. Our AI designs logos instantly. Download and use right away.',
      },
      {
        q: 'Can I use it commercially?',
        a: 'Free plans allow personal use. Pro members get a full commercial license for all business uses.',
      },
      {
        q: 'What formats are included?',
        a: 'Free: PNG. Pro: PNG, SVG, and additional formats for websites, print, and social media.',
      },
      {
        q: 'Can I change colors and fonts?',
        a: 'Completely. Your brand kit includes editable design files and brand guidelines.',
      },
      {
        q: 'What if I don\'t like the first design?',
        a: 'Generate as many variations as you need. Pro members get unlimited attempts.',
      },
    ],
    relatedTypes: [
      { slug: 'restaurant', label: 'Restaurant Logos' },
      { slug: 'ecommerce', label: 'E-commerce Logos' },
      { slug: 'fitness-coach', label: 'Fitness Coach Logos' },
    ],
  },

  'restaurant': {
    label: 'Restaurant',
    keyword: 'restaurant logo generator',
    seoTitle: 'Design Professional Restaurant Logos | SNAPBRAND',
    seoDescription: 'Create stunning restaurant logos for cafes, fine dining, or fast casual. Brand your food business instantly. AI-powered designs tailored to your cuisine. Try free.',
    description: 'Design logos that make customers hungry and set your restaurant apart from the competition with visual branding.',
    benefits: [
      {
        icon: '🍽️',
        title: 'Appetizing Visuals',
        desc: 'Your logo should make people want to eat there. Our AI creates designs that communicate your cuisine and appeal to diners.',
      },
      {
        icon: '🎯',
        title: 'Own Your Brand',
        desc: 'Stop blending in with competitors. A unique logo gives customers a reason to remember your restaurant.',
      },
      {
        icon: '📲',
        title: 'Works Everywhere',
        desc: 'Menus, delivery apps (DoorDash, Uber Eats), websites, signage, uniforms—same professional look across all touchpoints.',
      },
      {
        icon: '⭐',
        title: 'Built-In Brand Loyalty',
        desc: 'Recognizable logos encourage repeat visits. Customers remember you and recommend you to friends.',
      },
    ],
    faqItems: [
      {
        q: 'Can I use the logo on menus and delivery apps?',
        a: 'Free plans for personal use only. Pro members get commercial rights for menus, apps, social media, and print.',
      },
      {
        q: 'Can you create logos for my cuisine type?',
        a: 'Absolutely. Tell us your cuisine (Italian, Thai, vegan, fusion, etc.) and we\'ll generate designs that match it.',
      },
      {
        q: 'What if I want different design styles?',
        a: 'Our AI generates multiple options. Pick the style that fits your restaurant\'s personality best.',
      },
      {
        q: 'How much customization can I do?',
        a: 'Complete control. Change colors, fonts, layouts. Your brand kit includes everything you need to adjust.',
      },
      {
        q: 'How quickly can I launch it?',
        a: 'Today. Generate → download → use. Usually takes 15 seconds total.',
      },
    ],
    relatedTypes: [
      { slug: 'real-estate', label: 'Real Estate Logos' },
      { slug: 'ecommerce', label: 'E-commerce Logos' },
      { slug: 'fitness-coach', label: 'Fitness Coach Logos' },
    ],
  },

  'fitness-coach': {
    label: 'Fitness Coach',
    keyword: 'fitness coach logo generator',
    seoTitle: 'Professional Fitness Coach Logo Generator | SNAPBRAND',
    seoDescription: 'Create powerful fitness logos for personal trainers and coaches. Build your brand on social media. Motivating designs for apps and merchandise. Start free.',
    description: 'Build credibility with a professional fitness logo that shows clients you\'re serious about delivering results.',
    benefits: [
      {
        icon: '💪',
        title: 'Communicate Results',
        desc: 'Your logo should convey strength, expertise, and transformation. Clients want to see you\'ve got what it takes.',
      },
      {
        icon: '📱',
        title: 'Own Social Media',
        desc: 'Professional logos stand out on Instagram, TikTok, and YouTube. Build a recognizable personal brand.',
      },
      {
        icon: '🏆',
        title: 'Instant Credibility',
        desc: 'Prospects judge coaches in seconds. A professional logo says "I\'m established and successful."',
      },
      {
        icon: '💼',
        title: 'Expand Your Business',
        desc: 'Use logos across coaching programs, fitness apps, online courses, merchandise, and partnerships.',
      },
    ],
    faqItems: [
      {
        q: 'Can I use the logo for my coaching app?',
        a: 'Free plans for personal use. Pro members get commercial rights for apps, courses, programs, and merchandise.',
      },
      {
        q: 'Do you support my specific niche?',
        a: 'Yes. Strength training, yoga, HIIT, CrossFit, nutrition coaching, transformation—we design for your specialty.',
      },
      {
        q: 'Can I get different visual styles?',
        a: 'Yes. Describe your vibe (hardcore, wellness, minimalist, energetic) and choose from multiple AI-generated options.',
      },
      {
        q: 'Can I match my brand colors?',
        a: 'Totally. Full editing access. Customize colors, fonts, and every design element to match your personal brand.',
      },
      {
        q: 'Will it look good on phone screens?',
        a: 'Optimized for all sizes. Looks professional on social profiles, app icons, headers, and printed materials.',
      },
    ],
    relatedTypes: [
      { slug: 'real-estate', label: 'Real Estate Logos' },
      { slug: 'restaurant', label: 'Restaurant Logos' },
      { slug: 'ecommerce', label: 'E-commerce Logos' },
    ],
  },

  'ecommerce': {
    label: 'E-commerce Store',
    keyword: 'ecommerce logo generator',
    seoTitle: 'Professional E-commerce Logo Generator | SNAPBRAND',
    seoDescription: 'Design professional e-commerce logos that increase trust and sales. Perfect for Shopify, Amazon, and WooCommerce stores. Tested for conversions. Start free.',
    description: 'Stand out on marketplaces and boost sales with a professional logo that builds customer trust.',
    benefits: [
      {
        icon: '🛍️',
        title: 'Build Customer Trust',
        desc: 'Established-looking stores convert better. A professional logo is your first chance to prove you\'re legitimate.',
      },
      {
        icon: '📦',
        title: 'Win on Marketplaces',
        desc: 'Amazon, eBay, Etsy, Shopify—customers scroll past bland logos. Yours needs to pop.',
      },
      {
        icon: '🎯',
        title: 'Increase Sale Prices',
        desc: 'Professional branding raises perceived value. Customers feel confident paying more for products from quality brands.',
      },
      {
        icon: '🔄',
        title: 'Consistent Everywhere',
        desc: 'Website, app, emails, packaging, social media—same professional brand image everywhere customers see you.',
      },
    ],
    faqItems: [
      {
        q: 'Can I use it on Shopify, Amazon, and WooCommerce?',
        a: 'Free plans for personal use. Pro members get commercial rights across all platforms.',
      },
      {
        q: 'Does it work for both products and services?',
        a: 'Yes. Physical products, digital downloads, services, subscriptions—we design for your specific store type.',
      },
      {
        q: 'Can the logo match my products?',
        a: 'Definitely. Share your niche (fashion, beauty, tech, wellness, etc.) and we\'ll create designs that appeal to your customers.',
      },
      {
        q: 'What file formats do I get?',
        a: 'Free: PNG. Pro: PNG, SVG, plus formats optimized for web, email, packaging, business cards, and print.',
      },
      {
        q: 'What if my product line changes?',
        a: 'Generate new logos anytime. Pro plan is unlimited. Your brand kit scales as your store grows.',
      },
    ],
    relatedTypes: [
      { slug: 'real-estate', label: 'Real Estate Logos' },
      { slug: 'restaurant', label: 'Restaurant Logos' },
      { slug: 'fitness-coach', label: 'Fitness Coach Logos' },
    ],
  },

  saas: {
    label: 'SaaS',
    keyword: 'saas logo generator',
    seoTitle: 'SaaS Logo Generator — B2B Software Logos That Convert | SNAPBRAND',
    seoDescription:
      'Ship a credible B2B brand fast: AI SaaS logos for signup pages, product UI, and investor decks. Look established before your next launch—start free, no designer required.',
    description:
      'Win trust on your marketing site and inside your product with a polished SaaS logo built for demos, pricing pages, and app chrome.',
    ctaFormSubmit: '✨ Generate My SaaS Logo — Free',
    ctaBottom: 'Ship my SaaS brand kit',
    ctaSectionBlurb:
      'Your logo belongs on the homepage hero, changelog, and App Store—get a crisp mark and full brand kit in seconds. 3 free generations; upgrade when you scale.',
    benefits: [
      {
        icon: '🚀',
        title: 'Credibility on the Funnel',
        desc: 'Visitors decide in seconds. A sharp logo signals a serious product—not a weekend project—so trials and demos convert better.',
      },
      {
        icon: '🧩',
        title: 'Built for Product-Led Growth',
        desc: 'Works across landing pages, onboarding, docs, and in-app settings so your brand feels cohesive from click to retention.',
      },
      {
        icon: '📈',
        title: 'Investor-Ready Polish',
        desc: 'Pitch decks and update emails look intentional. Present a unified visual story as you raise, hire, and ship features.',
      },
      {
        icon: '⚡',
        title: 'Iterate in Minutes',
        desc: 'Rename, reposition, or split a product line? Generate new directions without waiting on agency timelines.',
      },
    ],
    faqItems: [
      {
        q: 'Will it fit a B2B / enterprise positioning?',
        a: 'Yes. Describe your ICP, category, and tone—we generate marks that read trustworthy and modern, not playful by default.',
      },
      {
        q: 'Can I use the logo in my product and marketing?',
        a: 'Free tier is for personal try-outs. Pro includes commercial use for websites, ads, decks, and product surfaces.',
      },
      {
        q: 'Do you support dark mode and app icons?',
        a: 'Your brand kit includes assets you can adapt. Tell us your UI background (light/dark) in the brief for better contrast.',
      },
      {
        q: 'What if we pivot messaging?',
        a: 'Regenerate anytime. Pro members can explore unlimited variations as your positioning evolves.',
      },
      {
        q: 'How fast is delivery?',
        a: 'Typically under a minute from submit to preview. Download and share immediately.',
      },
    ],
    relatedTypes: [
      { slug: 'digital-agency', label: 'Digital Agency' },
      { slug: 'consulting', label: 'Consulting' },
      { slug: 'ecommerce', label: 'E-commerce' },
    ],
  },

  'digital-agency': {
    label: 'Digital Agency',
    keyword: 'digital agency logo generator',
    seoTitle: 'Digital Agency Logo Generator — Creative Studio & Client-Ready Marks | SNAPBRAND',
    seoDescription:
      'Win pitches with a studio-grade logo: bold, memorable, and portfolio-ready. Perfect for rebrands, retainers, and new agency offers—try free, then scale with Pro.',
    description:
      'Stand out to clients and talent with an agency mark that reads creative, strategic, and premium—whether you are boutique or full-service.',
    ctaFormSubmit: '✨ Generate My Agency Logo — Free',
    ctaBottom: 'Showcase my studio brand',
    ctaSectionBlurb:
      'Put a confident logo on proposals, case studies, and your site before the next RFP. Three free generations; no credit card to start.',
    benefits: [
      {
        icon: '🎯',
        title: 'Pitch-Deck Presence',
        desc: 'Your mark is the first slide clients notice. Look like the partner they want on retainer—not another generic freelancer page.',
      },
      {
        icon: '🖌️',
        title: 'Creative Without Chaos',
        desc: 'Directional, distinctive shapes and type that feel designed—not templated—so your brand matches the quality of your work.',
      },
      {
        icon: '🤝',
        title: 'Recruit & Partner Better',
        desc: 'Talent and vendors Google you first. A cohesive logo signals stability for collaborations and subcontracting.',
      },
      {
        icon: '📣',
        title: 'Consistent Across Touchpoints',
        desc: 'Behance, LinkedIn, email footers, podcast art—one system that scales as you add services or niches.',
      },
    ],
    faqItems: [
      {
        q: 'Can the style feel premium / boutique?',
        a: 'Absolutely. Share your positioning (e.g., branding-only, performance, Webflow, enterprise) and aesthetic keywords for tailored results.',
      },
      {
        q: 'Do I get files for white-label decks?',
        a: 'Free includes PNG for quick use. Pro adds vector and formats suitable for print, decks, and social templates.',
      },
      {
        q: 'What about sub-brands or practice areas?',
        a: 'Generate parent marks and variations. Describe each offer line—we will steer the palette and symbol set.',
      },
      {
        q: 'Is commercial use included?',
        a: 'Pro unlocks commercial licensing for client-facing and promotional use. Check plans for full terms.',
      },
      {
        q: 'How many concepts can I explore?',
        a: 'Free trials include multiple generations; Pro is unlimited for iterating before you commit.',
      },
    ],
    relatedTypes: [
      { slug: 'saas', label: 'SaaS' },
      { slug: 'consulting', label: 'Consulting' },
      { slug: 'restaurant', label: 'Restaurant' },
    ],
  },

  consulting: {
    label: 'Consulting',
    keyword: 'consulting logo generator',
    seoTitle: 'Consulting Logo Generator — Trusted Advisor & Firm Branding | SNAPBRAND',
    seoDescription:
      'Look credible before the first call: executive-ready consulting logos for solo advisors and firms. Win higher retainers with a mark that signals expertise—start free.',
    description:
      'Differentiate your practice with a refined logo that reads authoritative and approachable—ideal for proposals, LinkedIn, and keynote slides.',
    ctaFormSubmit: '✨ Generate My Consulting Logo — Free',
    ctaBottom: 'Elevate my firm’s first impression',
    ctaSectionBlurb:
      'From solo experts to boutique firms—get a polished logo and brand kit you can drop into proposals and one-pagers today. 3 free generations.',
    benefits: [
      {
        icon: '🏛️',
        title: 'Trust at First Glance',
        desc: 'Buyers hire consultants who feel established. A deliberate mark reduces perceived risk on big engagements.',
      },
      {
        icon: '📄',
        title: 'Proposal-Ready',
        desc: 'Looks sharp on PDFs, SOWs, and capability decks—aligned with how enterprise clients evaluate vendors.',
      },
      {
        icon: '🎤',
        title: 'Speaker & Thought Leadership',
        desc: 'Consistent visuals on podcasts, conferences, and articles reinforce your positioning as the go-to expert.',
      },
      {
        icon: '🧭',
        title: 'Practice-Area Fit',
        desc: 'Strategy, ops, HR, IT, finance—describe your niche and audience; we steer clear of gimmicky tropes.',
      },
    ],
    faqItems: [
      {
        q: 'Does it work for solo consultants vs. firms?',
        a: 'Yes. Say whether you are independent or a named partnership—we tune formality and scale accordingly.',
      },
      {
        q: 'Can I look executive without looking stuffy?',
        a: 'Describe the tone you want (modern, warm, precise). We balance authority with approachability.',
      },
      {
        q: 'What formats do I receive?',
        a: 'Free: PNG for immediate use. Pro: vectors and exports for print, slide masters, and email signatures.',
      },
      {
        q: 'Can I align with an existing website?',
        a: 'Share colors, typography hints, and competitors to avoid—we will keep the mark coherent with your stack.',
      },
      {
        q: 'Is there a commercial license?',
        a: 'Pro includes commercial use for client work and firm marketing. Review the plan details for scope.',
      },
    ],
    relatedTypes: [
      { slug: 'saas', label: 'SaaS' },
      { slug: 'digital-agency', label: 'Digital Agency' },
      { slug: 'real-estate', label: 'Real Estate' },
    ],
  },

  startup: {
    label: 'Startup',
    keyword: 'startup logo generator',
    seoTitle: 'Startup Logo Generator — Early-Stage Branding That Investors Notice | SNAPBRAND',
    seoDescription:
      'Launch with a credible mark: AI startup logos for pitch decks, landing pages, and hiring. Look bigger than your runway—3 free generations, no designer waitlist.',
    description:
      'Move fast without looking amateur: a sharp logo for your MVP site, deck, and LinkedIn so customers and investors take you seriously from day one.',
    ctaFormSubmit: '✨ Generate My Startup Logo — Free',
    ctaBottom: 'Ship my launch-ready brand',
    ctaSectionBlurb:
      'From pre-seed to Series A—your logo should work on the pitch deck, careers page, and product. Start with three free generations; upgrade when you scale.',
    benefits: [
      {
        icon: '🚀',
        title: 'Deck & Demo Ready',
        desc: 'First impressions matter in fundraising. A polished mark signals execution—not just an idea—when investors skim your materials.',
      },
      {
        icon: '🧱',
        title: 'Scales With the Team',
        desc: 'Same identity across recruiting posts, swag, and email—so early hires feel like they joined a real company.',
      },
      {
        icon: '🎯',
        title: 'Positioning-Aligned',
        desc: 'Describe your category and ICP—we steer clear of cliché rocket icons unless that is actually your vibe.',
      },
      {
        icon: '⚡',
        title: 'Ship This Week',
        desc: 'No agency calendar. Iterate positioning? Regenerate directions in minutes instead of waiting on revisions.',
      },
    ],
    faqItems: [
      {
        q: 'Will it work for B2B and consumer startups?',
        a: 'Yes. Tell us your buyer, category, and tone—we tune for credible B2B or energetic DTC as needed.',
      },
      {
        q: 'Can I use it in my pitch deck and data room?',
        a: 'Free tier is great for experiments. Pro unlocks commercial use for decks, sites, and hiring collateral—check the plan.',
      },
      {
        q: 'What if we rebrand after a pivot?',
        a: 'Generate new concepts anytime. Pro members get unlimited exploration as your product narrative evolves.',
      },
      {
        q: 'Do you support wordmarks vs. symbols?',
        a: 'Describe the style you want—logotype-heavy, icon-forward, or both. We will produce options that fit your name length.',
      },
      {
        q: 'How fast is delivery?',
        a: 'Usually under a minute. Download and drop into your site or deck immediately.',
      },
    ],
    relatedTypes: [
      { slug: 'saas', label: 'SaaS' },
      { slug: 'online-course', label: 'Online Course' },
      { slug: 'digital-agency', label: 'Digital Agency' },
    ],
  },

  'online-course': {
    label: 'Online Course',
    keyword: 'online course logo generator',
    seoTitle: 'Online Course Logo Generator — Creator & LMS Branding That Sells | SNAPBRAND',
    seoDescription:
      'Sell more enrollments with a pro course brand: logos for cohorts, webinars, and lesson thumbnails. Build trust before the sales page scroll—try free today.',
    description:
      'Stand out in crowded creator markets with a logo that reads premium on Teachable, Kajabi, YouTube, and your community—so students know you are the real deal.',
    ctaFormSubmit: '✨ Generate My Course Logo — Free',
    ctaBottom: 'Boost my enrollment page',
    ctaSectionBlurb:
      'Your logo belongs on the checkout page, certificate, and community banner. Three free generations—no credit card—to test before your next launch.',
    benefits: [
      {
        icon: '🎓',
        title: 'Trust Before the Buy Button',
        desc: 'Courses are high-intent purchases. A polished mark reduces refund anxiety and increases completion confidence.',
      },
      {
        icon: '📺',
        title: 'Thumbnail & Video Friendly',
        desc: 'Readable at small sizes for YouTube, Reels, and lesson intros—so your brand stays recognizable across formats.',
      },
      {
        icon: '🧑‍🤝‍🧑',
        title: 'Community & Cohort Ready',
        desc: 'Discord, Circle, Skool—same mark everywhere so members feel part of one school, not scattered assets.',
      },
      {
        icon: '💳',
        title: 'Upsell-Aligned',
        desc: 'Looks as strong on a $997 flagship as a lead magnet—consistent branding supports higher price points.',
      },
    ],
    faqItems: [
      {
        q: 'Does it work for coaching programs and memberships?',
        a: 'Yes. Describe your niche (career, fitness, language, finance) and we tailor tone and visual style.',
      },
      {
        q: 'Can I match my existing brand colors?',
        a: 'Share your palette and fonts to avoid—we will keep the mark coherent with your current materials.',
      },
      {
        q: 'What file formats do I get?',
        a: 'Free: PNG for quick use. Pro: SVG and exports for video overlays, slides, and print certificates.',
      },
      {
        q: 'Is commercial use included?',
        a: 'Pro includes commercial licensing for paid courses and marketing. Review the plan for full scope.',
      },
      {
        q: 'How many variations can I try?',
        a: 'Multiple generations on free trials; Pro is unlimited while you nail your launch creative.',
      },
    ],
    relatedTypes: [
      { slug: 'life-coach', label: 'Life Coach' },
      { slug: 'startup', label: 'Startup' },
      { slug: 'consulting', label: 'Consulting' },
    ],
  },

  'life-coach': {
    label: 'Life Coach',
    keyword: 'life coach logo generator',
    seoTitle: 'Life Coach Logo Generator — Personal Branding Clients Connect With | SNAPBRAND',
    seoDescription:
      'Attract aligned clients: warm, credible life-coach logos for websites, Instagram, and booking pages. Book more discovery calls—start free, no design skills needed.',
    description:
      'Show empathy and expertise at a glance—your logo should feel human on bios, podcasts, and worksheets, not corporate-cold or generic stock.',
    ctaFormSubmit: '✨ Generate My Life Coach Logo — Free',
    ctaBottom: 'Fill my calendar with ideal clients',
    ctaSectionBlurb:
      'From Instagram to intake forms—get a mark that matches your methodology and values. Three free generations to find the direction that feels like you.',
    benefits: [
      {
        icon: '💬',
        title: 'Approachable Authority',
        desc: 'Clients want safety and expertise. We balance softness with confidence so you do not look like a corporate consultant by accident.',
      },
      {
        icon: '🌱',
        title: 'Niche-Specific',
        desc: 'Relationship, career, wellness, executive—describe who you help and the transformation you sell.',
      },
      {
        icon: '📱',
        title: 'Social-First Legibility',
        desc: 'Profile photos, story highlights, and link-in-bio pages—optimized for mobile where most coaching is discovered.',
      },
      {
        icon: '📓',
        title: 'Worksheets & Retreats',
        desc: 'PDFs, slide decks, and event banners—one visual system for 1:1 and group offers.',
      },
    ],
    faqItems: [
      {
        q: 'Can the style feel spiritual vs. executive?',
        a: 'Absolutely. Tell us the energy you coach from (grounded, bold, minimalist, nurturing) and we steer accordingly.',
      },
      {
        q: 'Do you avoid overused coaching clichés?',
        a: 'We use your brief—if you do not want lotus leaves or generic silhouettes, say so and we will explore fresher directions.',
      },
      {
        q: 'Can I use it commercially?',
        a: 'Pro unlocks commercial use for client-facing materials and marketing. Free is for personal experimentation.',
      },
      {
        q: 'What formats are included?',
        a: 'Free: PNG. Pro: vectors for print, merch, and large banners.',
      },
      {
        q: 'How fast can I launch?',
        a: 'Minutes from submit to download. Update your site and booking link the same day.',
      },
    ],
    relatedTypes: [
      { slug: 'online-course', label: 'Online Course' },
      { slug: 'fitness-coach', label: 'Fitness Coach' },
      { slug: 'consulting', label: 'Consulting' },
    ],
  },

  photography: {
    label: 'Photography',
    keyword: 'photography logo generator',
    seoTitle: 'Photography Logo Generator — Studio & Freelance Branding That Gets Booked | SNAPBRAND',
    seoDescription:
      'Win more shoots: elegant photography logos for weddings, portraits, and brands. Look premium on invoices, watermarks, and your site—start free, upgrade for full rights.',
    description:
      'Your eye is the product—lead with a mark that feels editorial, romantic, or bold so clients remember you when they are ready to book.',
    ctaFormSubmit: '✨ Generate My Photography Logo — Free',
    ctaBottom: 'Book more shoots with a pro mark',
    ctaSectionBlurb:
      'Watermark previews, email signatures, and Instagram—one cohesive identity. Three free generations; Pro for vectors and commercial use.',
    benefits: [
      {
        icon: '📷',
        title: 'Watermark-Ready',
        desc: 'Clean at low opacity and small sizes so your galleries stay branded without stealing attention from the image.',
      },
      {
        icon: '💍',
        title: 'Wedding & Portrait Fit',
        desc: 'Romantic script, modern editorial, or adventurous—describe your niche and ideal client profile.',
      },
      {
        icon: '🖼️',
        title: 'Print & Albums',
        desc: 'Looks sharp on thank-you cards, packaging stickers, and studio signage when you go Pro for vector files.',
      },
      {
        icon: '🌐',
        title: 'Site & Directory Trust',
        desc: 'The same logo on Google Business, Yelp, and your portfolio builds recognition across discovery channels.',
      },
    ],
    faqItems: [
      {
        q: 'Can I get black, white, and color versions?',
        a: 'Describe your usage (dark galleries, light invoices). We generate options you can adapt; Pro adds vector masters.',
      },
      {
        q: 'Does it work for brand and product photographers?',
        a: 'Yes—share studio vs. on-location, B2B vs. couples, and we tune the vibe.',
      },
      {
        q: 'Commercial licensing?',
        a: 'Pro includes commercial use for client deliverables and marketing. Confirm scope in plan details.',
      },
      {
        q: 'What if my business name is long?',
        a: 'We can emphasize a monogram or wordmark—tell us your preferred hierarchy.',
      },
      {
        q: 'How fast is turnaround?',
        a: 'Typically under a minute. Swap assets into your site and email the same day.',
      },
    ],
    relatedTypes: [
      { slug: 'beauty-salon', label: 'Beauty Salon' },
      { slug: 'digital-agency', label: 'Digital Agency' },
      { slug: 'ecommerce', label: 'E-commerce' },
    ],
  },

  'beauty-salon': {
    label: 'Beauty Salon',
    keyword: 'beauty salon logo generator',
    seoTitle: 'Beauty Salon Logo Generator — Spa & Salon Branding Clients Love | SNAPBRAND',
    seoDescription:
      'Fill your chairs: chic salon and spa logos for signage, Instagram, and booking apps. Look premium before the first visit—try free, then go Pro for print-ready files.',
    description:
      'Differentiate in a crowded market with a mark that feels fresh, luxurious, or neighborhood-trusted—matching your services and price point.',
    ctaFormSubmit: '✨ Generate My Salon Logo — Free',
    ctaBottom: 'Grow bookings with a standout brand',
    ctaSectionBlurb:
      'From storefront vinyl to Stories and Fresha—your logo should travel. Three free generations; upgrade for vectors and full commercial use.',
    benefits: [
      {
        icon: '✨',
        title: 'Premium Perception',
        desc: 'Clients associate polish with hygiene and skill. A refined logo supports higher service prices and retail add-ons.',
      },
      {
        icon: '💇',
        title: 'Service-Line Fit',
        desc: 'Hair, nails, skin, med-spa—describe your menu and aesthetic so the mark matches your interior.',
      },
      {
        icon: '📍',
        title: 'Local Discovery',
        desc: 'Consistent branding on maps, reviews, and storefront helps repeat visits and referrals.',
      },
      {
        icon: '📸',
        title: 'Social & Promo Ready',
        desc: 'Readable in Reels covers, gift cards, and seasonal campaigns without redesigning every month.',
      },
    ],
    faqItems: [
      {
        q: 'Can it feel luxe without looking generic “salon script”?',
        a: 'Tell us what to avoid and your reference brands—we explore distinctive directions beyond cookie-cutter curls.',
      },
      {
        q: 'Do you support franchise or multi-location?',
        a: 'Describe your structure—parent mark plus sub-brand tags are possible with clear naming in your brief.',
      },
      {
        q: 'Print and signage files?',
        a: 'Free: PNG for digital. Pro: SVG/PDF-friendly exports for vinyl, menus, and merchandise.',
      },
      {
        q: 'Commercial use?',
        a: 'Pro includes commercial licensing for in-salon and promotional use. Check the plan for details.',
      },
      {
        q: 'How fast can I update my storefront?',
        a: 'Download in minutes. Coordinate with your printer using Pro vector assets.',
      },
    ],
    relatedTypes: [
      { slug: 'photography', label: 'Photography' },
      { slug: 'restaurant', label: 'Restaurant' },
      { slug: 'ecommerce', label: 'E-commerce' },
    ],
  },
}

// Default config if business type not found

const ALL_CONFIG: Record<string, BusinessTypeConfig> = {
  ...BUSINESS_TYPE_CONFIG,
  ...GENERATED_BUSINESS_TYPES
};

export const getConfig = (businessType: string): BusinessTypeConfig => {
  return ALL_CONFIG[businessType.trim().toLowerCase()] ?? ALL_CONFIG["real-estate"]
}
