import type { Metadata } from 'next'
import SeoTemplatePage from '@/components/SeoTemplatePage'

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://snapbrand-snowy.vercel.app'
).replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Brand Identity Template | Design Your Complete Brand',
  description:
    'Free brand identity template to define your logo, colors, fonts, and brand personality. Create a cohesive visual identity.',
  openGraph: {
    title: 'Brand Identity Template | Design Your Complete Brand',
    description:
      'Free brand identity template to define your logo, colors, fonts, and brand personality. Create a cohesive visual identity.',
    url: `${siteUrl}/brand-identity-template`,
    siteName: 'SnapBrand',
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/brand-identity-template`,
  },
}

export default function BrandIdentityTemplatePage() {
  const sections = [
    {
      title: 'What Is Brand Identity?',
      content:
        'Brand identity is the visual and verbal expression of your brand. It\'s how your business looks, sounds, and feels. A strong brand identity makes you recognizable and memorable to customers.',
    },
    {
      title: 'Core Elements of Brand Identity',
      content: [
        'Logo: Your primary visual mark and symbol',
        'Color Palette: Primary, secondary, and accent colors',
        'Typography: Font selections for different uses',
        'Visual Style: Imagery, patterns, and graphics',
        'Brand Voice: How you communicate and write',
        'Brand Personality: Traits that describe your brand',
      ],
    },
    {
      title: 'Why Brand Identity Matters',
      content:
        'A cohesive brand identity builds trust, improves recall, and creates a professional impression. Customers choose brands they recognize and trust — strong identity does both.',
    },
    {
      title: 'Creating Your Brand Identity',
      content:
        'Start by defining your brand personality and values. Then translate those into visual elements: colors that evoke the right feeling, fonts that match your tone, and a logo that represents your essence.',
    },
    {
      title: 'Brand Identity Examples',
      content:
        'Look at brands you admire. Notice how Apple\'s minimalism reflects innovation, how Coca-Cola\'s red is instantly recognizable, or how Mailchimp\'s playful design matches their approachable voice. Each element works together.',
    },
    {
      title: 'Build Your Identity With SnapBrand',
      content:
        'SnapBrand generates a complete, cohesive brand identity in 60 seconds. Describe your business and get colors, typography, logo concepts, and brand voice that all work together.',
    },
  ]

  const relatedPages = [
    { href: '/brand-guidelines-template', label: 'Brand Guidelines Template' },
    { href: '/brand-style-guide-template', label: 'Brand Style Guide Template' },
    { href: '/brand-book-template', label: 'Brand Book Template' },
  ]

  return (
    <SeoTemplatePage
      keyword="brand identity template"
      title="Brand Identity Template | Design Your Complete Brand"
      metaDescription="Free brand identity template to define your logo, colors, fonts, and brand personality. Create a cohesive visual identity."
      h1="Brand Identity Template"
      intro="Build a strong, recognizable brand identity. This template helps you define your logo, colors, typography, and brand voice."
      sections={sections}
      relatedPages={relatedPages}
    />
  )
}
