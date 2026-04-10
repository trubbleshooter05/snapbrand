import type { Metadata } from 'next'
import SeoTemplatePage from '@/components/SeoTemplatePage'

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://snapbrand-snowy.vercel.app'
).replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Brand Guide Examples | Inspire Your Brand Standards',
  description:
    'Browse brand guide examples to inspire your own. See how successful brands define their visual identity and messaging.',
  openGraph: {
    title: 'Brand Guide Examples | Inspire Your Brand Standards',
    description:
      'Browse brand guide examples to inspire your own. See how successful brands define their visual identity and messaging.',
    url: `${siteUrl}/brand-guide-examples`,
    siteName: 'SnapBrand',
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/brand-guide-examples`,
  },
}

export default function BrandGuideExamplesPage() {
  const sections = [
    {
      title: 'What Can You Learn From Brand Guide Examples?',
      content:
        `Brand guide examples show you how real companies structure their standards. By studying them, you'll learn what information matters most, how much detail to include, and what format works best for your team.`,
    },
    {
      title: 'Elements Found in Most Brand Guides',
      content: [
        'Logo Anatomy: Explanation of logo design, components, and meaning',
        'Logo Clearance & Sizing: Minimum sizes and spacing requirements',
        'Color Philosophy: Why specific colors were chosen for the brand',
        'Palette Specifications: All colors with technical specifications',
        'Font Selection: Primary and secondary fonts with usage rules',
        'Photography Style: Mood, tone, and visual approach',
        'Voice & Tone: How the brand communicates with customers',
      ],
    },
    {
      title: 'How Startups Structure Brand Guides',
      content:
        `Early-stage companies keep brand guides focused and concise. They include essentials (logo, colors, fonts, tone) without over-complicating. This approach works better for small teams and makes it easier to update as the brand evolves.`,
    },
    {
      title: 'Enterprise-Level Brand Guide Structure',
      content:
        'Larger companies create detailed brand guidelines covering every scenario. They include extensive do\'s and don\'ts, sub-brand variations, global language considerations, and accessibility requirements. This level of detail prevents brand dilution across thousands of employees.',
    },
    {
      title: 'Modern vs. Traditional Brand Guides',
      content: [
        'Modern guides are interactive, digital-first, and live documents updated regularly',
        'Traditional guides are static PDFs created once and rarely updated',
        'Progressive companies use both: a digital guide for daily use + a PDF for distribution',
        `Mobile-optimized guides help team members reference standards from anywhere`,
      ],
    },
    {
      title: 'Get Started With SnapBrand',
      content:
        `The best brand guide starts with a professional brand system. SnapBrand generates cohesive colors, typography, and brand voice instantly. Use this as the foundation for your brand guide — it's already designed to work together.`,
    },
  ]

  const relatedPages = [
    { href: '/brand-guide-template', label: 'Brand Guide Template' },
    { href: '/brand-guidelines-examples', label: 'Brand Guidelines Examples' },
    { href: '/brand-style-guide-template', label: 'Brand Style Guide Template' },
  ]

  return (
    <SeoTemplatePage
      h1="Brand Guide Examples"
      intro="Explore how successful brands structure their brand guides. Get inspiration and learn best practices for creating your own comprehensive brand standards."
      sections={sections}
      relatedPages={relatedPages}
    />
  )
}
