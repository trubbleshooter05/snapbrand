import type { Metadata } from 'next'
import SeoTemplatePage from '@/components/SeoTemplatePage'

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://snapbrand-snowy.vercel.app'
).replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Brand Guidelines Examples | Real-World Templates',
  description:
    'See real brand guidelines examples from top companies. Learn what makes great brand standards and how to create your own.',
  openGraph: {
    title: 'Brand Guidelines Examples | Real-World Templates',
    description:
      'See real brand guidelines examples from top companies. Learn what makes great brand standards and how to create your own.',
    url: `${siteUrl}/brand-guidelines-examples`,
    siteName: 'SnapBrand',
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/brand-guidelines-examples`,
  },
}

export default function BrandGuidelinesExamplesPage() {
  const sections = [
    {
      title: 'Why Study Brand Guidelines Examples?',
      content:
        'Looking at real brand guidelines from successful companies helps you understand what makes effective brand standards. You\'ll see patterns in how professional brands handle logos, colors, typography, and messaging.',
    },
    {
      title: 'What Great Brand Guidelines Include',
      content: [
        'Clear Logo Rules: Exact spacing, sizing, and usage restrictions',
        'Complete Color Specifications: Hex, RGB, Pantone, and CMYK values',
        'Typography Hierarchy: Primary, secondary, and accent fonts with sizes',
        'Real-World Applications: How guidelines apply to websites, print, packaging',
        `Do's and Don'ts: Visual examples of correct and incorrect usage`,
        'Brand Voice Guidelines: Tone, messaging style, and key phrases',
        'Visual Assets: Icons, patterns, and supporting design elements',
      ],
    },
    {
      title: 'Learning From Tech Company Guidelines',
      content:
        `Tech companies like Apple, Google, and Microsoft publish their design systems online. Study how they handle color usage across light and dark modes, responsive typography, and consistency across products. These examples show how to maintain brand cohesion at scale.`,
    },
    {
      title: 'Small Business Brand Guidelines Examples',
      content:
        `Small businesses and startups benefit from studying mid-size company guidelines. These examples show professional standards without enterprise complexity. Look at how newer brands handle logo variations, color palettes, and messaging.`,
    },
    {
      title: 'Common Mistakes in Brand Guidelines',
      content: [
        'Too vague: "Use our brand colors" without specifying exact values',
        'Too rigid: No room for flexibility or creative interpretation',
        'Out of date: Guidelines that don\'t reflect current brand usage',
        'Too long: Over-complicated documents that nobody reads',
        'No examples: Guidance without visual examples of correct usage',
      ],
    },
    {
      title: 'Create Professional Guidelines With SnapBrand',
      content:
        'Instead of reverse-engineering guidelines from examples, start with a professionally generated brand system. SnapBrand creates color palettes, typography systems, and brand voice in one generation — giving you a solid foundation for building comprehensive guidelines.',
    },
  ]

  const relatedPages = [
    { href: '/brand-guidelines-template', label: 'Brand Guidelines Template' },
    { href: '/brand-guide-examples', label: 'Brand Guide Examples' },
    { href: '/brand-book-template', label: 'Brand Book Template' },
  ]

  return (
    <SeoTemplatePage
      keyword="brand guidelines examples"
      title="Brand Guidelines Examples | Real-World Templates"
      metaDescription="See real brand guidelines examples from top companies. Learn what makes great brand standards and how to create your own."
      h1="Brand Guidelines Examples"
      intro="Study real examples of professional brand guidelines from successful companies. Learn best practices and what makes effective brand standards."
      sections={sections}
      relatedPages={relatedPages}
    />
  )
}
