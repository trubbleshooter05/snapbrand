import type { Metadata } from 'next'
import { GuideJsonLd } from '@/components/GuideJsonLd'
import SeoTemplatePage from '@/components/SeoTemplatePage'
import { SITE_CONTENT_REVIEWED_ISO, SITE_URL, getDefaultArticleByline } from '@/lib/site'

const siteUrl = SITE_URL
const META_DESC =
  'Free brand style guide template to document colors, fonts, icons, and UI patterns. Create design system standards.'

export const metadata: Metadata = {
  title: 'Brand Style Guide Template | Design System Documentation',
  description: META_DESC,
  openGraph: {
    title: 'Brand Style Guide Template | Design System Documentation',
    description: META_DESC,
    url: `${siteUrl}/brand-style-guide-template`,
    siteName: 'SnapBrand',
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/brand-style-guide-template`,
  },
  other: {
    'article:modified_time': SITE_CONTENT_REVIEWED_ISO,
  },
}

export default function BrandStyleGuideTemplatePage() {
  const sections = [
    {
      title: 'What Is a Brand Style Guide?',
      content:
        'A brand style guide (also called a design system or visual standards guide) documents how to use your brand elements consistently. It covers colors, typography, icons, spacing, and any repeating design components.',
    },
    {
      title: 'Brand Style Guide vs. Brand Guidelines',
      content:
        `A style guide focuses on design mechanics and technical specifications. Brand guidelines include broader elements like brand voice and values. Many companies use both together: guidelines for strategy, style guides for execution.`,
    },
    {
      title: 'Essential Sections of a Brand Style Guide',
      content: [
        'Color System: Hex codes, RGB, usage rules, and contrast specs',
        'Typography: Font families, sizes, weights, and line heights',
        'Button Styles: States (hover, active, disabled) and sizes',
        'Icons: Icon library, sizing, and usage guidelines',
        'Spacing: Padding, margins, and grid system',
        'Components: Cards, forms, navigation, modals',
        'Patterns: How components combine to form layouts',
      ],
    },
    {
      title: 'Who Uses Brand Style Guides?',
      content:
        `Product designers, web developers, content creators, and marketing teams all reference style guides. They ensure consistency across your website, apps, and marketing materials.`,
    },
    {
      title: 'Digital vs. Print Style Guides',
      content:
        `Digital style guides cover web and app design: colors for light and dark modes, responsive typography, and interactive states. Print guides cover offset colors (CMYK), paper stocks, and print specifications.`,
    },
    {
      title: 'Start With SnapBrand',
      content:
        `Your style guide needs a strong foundation. SnapBrand generates color systems and typography that work together across your entire product.`,
    },
  ]

  const relatedPages = [
    { href: '/brand-guidelines-template', label: 'Brand Guidelines Template' },
    { href: '/brand-identity-template', label: 'Brand Identity Template' },
    { href: '/brand-guide-template', label: 'Brand Guide Template' },
  ]

  return (
    <>
      <GuideJsonLd
        path="/brand-style-guide-template"
        headline="Brand Style Guide Template"
        description={META_DESC}
      />
      <SeoTemplatePage
        articleMeta={getDefaultArticleByline()}
        h1="Brand Style Guide Template"
        intro="Create comprehensive design system documentation with this brand style guide template. Define colors, typography, components, and patterns."
        sections={sections}
        relatedPages={relatedPages}
      />
    </>
  )
}
