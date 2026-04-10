import type { Metadata } from 'next'
import SeoTemplatePage from '@/components/SeoTemplatePage'

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://snapbrand-snowy.vercel.app'
).replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Brand Guidelines Template | Free Download',
  description:
    'Free brand guidelines template to document your logo, colors, fonts, and messaging. Download now.',
  openGraph: {
    title: 'Brand Guidelines Template | Free Download',
    description:
      'Free brand guidelines template to document your logo, colors, fonts, and messaging. Download now.',
    url: `${siteUrl}/brand-guidelines-template`,
    siteName: 'SnapBrand',
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/brand-guidelines-template`,
  },
}

export default function BrandGuidelinesTemplatePage() {
  const sections = [
    {
      title: 'What Are Brand Guidelines?',
      content: `Brand guidelines are a comprehensive document that outlines how your brand should look, sound, and feel across all marketing materials and touchpoints. They serve as a rulebook for anyone creating content for your business — whether it's your team, freelancers, or agencies. A strong brand guidelines template ensures consistency and professionalism across your entire organization.`,
    },
    {
      title: 'Why Your Business Needs Brand Guidelines',
      content: [
        'Consistency: Every piece of content maintains your visual identity, building recognition and trust with customers',
        'Professionalism: Clear guidelines signal that your brand is established and credible',
        'Efficiency: New team members onboard faster when brand standards are documented',
        'Brand Protection: Guidelines prevent misuse of your logo, colors, and messaging',
        'Scalability: As your business grows, guidelines ensure your brand grows with it',
      ],
    },
    {
      title: 'What Should Be Included in Your Brand Guidelines?',
      content: [
        'Logo Usage: Primary and secondary logo variations, minimum sizes, clear space, and incorrect usage examples',
        'Color Palette: Primary, secondary, and accent colors with hex codes, RGB values, and Pantone numbers',
        'Typography: Font families, sizes, weights, and usage hierarchy for web and print',
        'Brand Voice: Tone of voice guidelines, messaging pillars, and key brand values',
        'Imagery Style: Photography style, illustration approach, and visual tone',
        'Design Elements: Patterns, icons, graphics, and other visual components',
      ],
    },
    {
      title: 'How to Create Brand Guidelines (Step-by-Step)',
      content: [
        'Define Your Brand Identity: Start with your brand story, values, and unique positioning',
        `Document Visual Elements: Gather all logos, colors, and fonts you'll use`,
        'Write Style Guide: Define tone, voice, and messaging approach',
        'Create Visual Examples: Show how guidelines apply to real-world materials',
        'Get Feedback: Review with team members and key stakeholders',
        'Publish & Share: Make guidelines accessible to everyone who creates content for your brand',
      ],
    },
    {
      title: `Free Brand Guidelines Template: What You'll Get`,
      content:
        `A professional, ready-to-use brand guidelines template that includes sections for logo usage, color specifications, typography rules, brand voice, and real-world application examples. Simply fill in your brand information and share with your team.`,
    },
    {
      title: 'How SnapBrand Simplifies This Process',
      content:
        `Instead of starting from a blank template, SnapBrand generates your entire brand system in 60 seconds. Describe your business, and our AI creates a logo, color palette, typography system, and brand voice — all ready to be documented in your guidelines. This gives you a complete, cohesive starting point that you can immediately turn into professional brand guidelines.`,
    },
  ]

  const relatedPages = [
    { href: '/brand-guide-template', label: 'Brand Guide Template' },
    { href: '/brand-guidelines-examples', label: 'Brand Guidelines Examples' },
    { href: '/brand-book-template', label: 'Brand Book Template' },
  ]

  return (
    <SeoTemplatePage
      keyword="brand guidelines template"
      title="Brand Guidelines Template | Free Download"
      metaDescription="Free brand guidelines template to document your logo, colors, fonts, and messaging. Download now."
      h1="Brand Guidelines Template"
      intro="A complete template to document your brand's visual identity, voice, and messaging. Use this guide to ensure consistency across all your marketing materials."
      sections={sections}
      relatedPages={relatedPages}
    />
  )
}
