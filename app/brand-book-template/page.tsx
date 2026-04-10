import type { Metadata } from 'next'
import SeoTemplatePage from '@/components/SeoTemplatePage'

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://snapbrand-snowy.vercel.app'
).replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Brand Book Template | Professional Brand Standards',
  description:
    'Free brand book template to document your complete brand identity. Create professional brand standards in minutes.',
  openGraph: {
    title: 'Brand Book Template | Professional Brand Standards',
    description:
      'Free brand book template to document your complete brand identity. Create professional brand standards in minutes.',
    url: `${siteUrl}/brand-book-template`,
    siteName: 'SnapBrand',
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/brand-book-template`,
  },
}

export default function BrandBookTemplatePage() {
  const sections = [
    {
      title: 'What Is a Brand Book?',
      content:
        'A brand book (also called a brand manual) is a comprehensive document that tells your brand story and establishes design standards. It goes beyond guidelines to explain the "why" behind your brand decisions.',
    },
    {
      title: `Brand Book vs. Brand Guidelines: What's the Difference?`,
      content:
        `While "brand book," "brand guide," and "brand guidelines" are often used interchangeably, a brand book typically includes more narrative content — your brand story, values, and mission. Guidelines focus on the mechanics (colors, fonts, sizes). A brand book combines both.`,
    },
    {
      title: 'What to Include in Your Brand Book',
      content: [
        'Brand Story: Your mission, vision, and brand values',
        'Brand Personality: How your brand thinks, feels, and communicates',
        'Logo Usage: Specs, spacing, and do\'s and don\'ts',
        'Color Palette: Complete specifications with meaning',
        'Typography System: Font families and usage hierarchy',
        'Imagery Style: Photography and illustration approach',
        'Voice & Tone: Communication guidelines',
        'Real-World Applications: Website, print, packaging examples',
      ],
    },
    {
      title: 'Who Needs a Brand Book?',
      content:
        'Growing companies, agencies, and any organization with multiple people creating brand content benefit from a brand book. It ensures that your internal team, contractors, and partners all represent your brand consistently.',
    },
    {
      title: 'How to Create a Brand Book',
      content:
        `Start with your brand identity — visuals, voice, and values. Then organize them into a logical narrative that tells your brand story. Include real examples of your brand in use. Make it accessible and shareable.`,
    },
    {
      title: 'Get Started With SnapBrand',
      content:
        `Your brand book foundation should start with a cohesive visual identity. SnapBrand generates logos, color systems, and typography in seconds — everything you need to begin building your brand book.`,
    },
  ]

  const relatedPages = [
    { href: '/brand-guidelines-template', label: 'Brand Guidelines Template' },
    { href: '/brand-identity-template', label: 'Brand Identity Template' },
    { href: '/brand-guide-template', label: 'Brand Guide Template' },
  ]

  return (
    <SeoTemplatePage
      keyword="brand book template"
      title="Brand Book Template | Professional Brand Standards"
      metaDescription="Free brand book template to document your complete brand identity. Create professional brand standards in minutes."
      h1="Brand Book Template"
      intro="Create a professional brand book that tells your brand story and establishes design standards. This template includes everything from your mission to logo usage rules."
      sections={sections}
      relatedPages={relatedPages}
    />
  )
}
