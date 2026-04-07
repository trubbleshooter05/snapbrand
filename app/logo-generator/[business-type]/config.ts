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
}

// Default config if business type not found
export const getConfig = (businessType: string): BusinessTypeConfig => {
  return BUSINESS_TYPE_CONFIG[businessType] || BUSINESS_TYPE_CONFIG['real-estate']
}
