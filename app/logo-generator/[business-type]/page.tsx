import type { Metadata } from 'next'
import ClientPage from './client-page'
import { getConfig } from './config'

interface Props {
  params: Promise<{ 'business-type': string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const businessType = (await params)['business-type']
  const config = getConfig(businessType)

  return {
    title: config.seoTitle,
    description: config.seoDescription,
    keywords: [config.keyword, 'logo maker', 'AI logo generator', 'brand generator'],
    openGraph: {
      title: config.seoTitle,
      description: config.seoDescription,
      type: 'website',
    },
  }
}

export default async function LogoGeneratorPage({ params }: Props) {
  const businessType = (await params)['business-type']
  return <ClientPage businessType={businessType} />
}
