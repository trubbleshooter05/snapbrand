import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getAllVerticalSlugs,
  getVerticalBySlug,
  verticals,
} from '@/lib/verticals'
import { VerticalGenerateForm } from './vertical-generate-form'

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://snapbrand-snowy.vercel.app'
).replace(/\/$/, '')

interface Props {
  params: Promise<{ vertical: string }>
}

export function generateStaticParams() {
  return getAllVerticalSlugs().map((vertical) => ({ vertical }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vertical: slug } = await params
  const v = getVerticalBySlug(slug)
  if (!v) {
    return { title: 'Not Found' }
  }
  return {
    title: v.metaTitle,
    description: v.metaDescription,
    openGraph: {
      title: v.metaTitle,
      description: v.metaDescription,
      url: `${BASE_URL}/brand-kit/for/${v.slug}`,
      siteName: 'SnapBrand',
      type: 'website',
    },
  }
}

export default async function VerticalBrandKitPage({ params }: Props) {
  const { vertical: slug } = await params
  const v = getVerticalBySlug(slug)
  if (!v) notFound()

  const otherVerticals = verticals.filter((x) => x.slug !== v.slug)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 pt-10 md:pt-14 pb-12 border-b border-white/[0.06]">
        <p className="text-xs font-semibold tracking-[0.2em] text-indigo-400 uppercase mb-3">
          {v.title}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
          {v.h1}
        </h1>
        <p className="text-base md:text-[17px] text-zinc-400 leading-relaxed mb-6 max-w-2xl">
          {v.description}
        </p>

        <VerticalGenerateForm businessType={v.businessType} examplePrompt={v.examplePrompt} />
      </div>

      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Common challenges</h2>
        <ul className="grid sm:grid-cols-2 gap-4">
          {v.painPoints.map((point) => (
            <li
              key={point}
              className="rounded-xl p-5 bg-slate-900/80 border border-white/10 text-gray-300 text-sm leading-relaxed"
            >
              {point}
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-white mb-4">Suggested styles</h2>
        <p className="text-gray-400 text-sm mb-6">
          These directions work well for this vertical — mention one in your description or let AI decide.
        </p>
        <div className="flex flex-wrap gap-3">
          {v.suggestedStyles.map((style) => (
            <span
              key={style}
              className="px-4 py-2 rounded-full text-sm font-medium bg-indigo-500/15 text-indigo-200 border border-indigo-500/30"
            >
              {style}
            </span>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-white mb-8">Frequently asked questions</h2>
        <dl className="space-y-8">
          {v.faq.map(({ q, a }) => (
            <div key={q}>
              <dt className="text-lg font-semibold text-white mb-2">{q}</dt>
              <dd className="text-gray-400 leading-relaxed">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-24 border-t border-white/10 pt-16">
        <h2 className="text-2xl font-bold text-white mb-6">More industry brand kits</h2>
        <ul className="grid sm:grid-cols-2 gap-3">
          {otherVerticals.map((x) => (
            <li key={x.slug}>
              <Link
                href={`/brand-kit/for/${x.slug}`}
                className="block rounded-xl px-4 py-3 bg-slate-900/60 border border-white/10 text-indigo-300 hover:border-indigo-500/40 hover:text-indigo-200 transition-colors"
              >
                {x.title} →
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
