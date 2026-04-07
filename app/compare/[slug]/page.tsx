import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  comparisons,
  getAllComparisonSlugs,
  getComparisonBySlug,
} from '@/lib/comparisons'

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://snapbrand-snowy.vercel.app'
).replace(/\/$/, '')

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllComparisonSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = getComparisonBySlug(slug)
  if (!c) {
    return { title: 'Not Found' }
  }
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url: `${BASE_URL}/compare/${c.slug}`,
      siteName: 'SnapBrand',
      type: 'website',
    },
  }
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params
  const c = getComparisonBySlug(slug)
  if (!c) notFound()

  const other = comparisons.filter((x) => x.slug !== c.slug)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <article className="max-w-3xl mx-auto px-4 pt-20 pb-16">
        <p className="text-sm font-semibold tracking-widest text-indigo-400 uppercase mb-4">
          Comparison
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
          {c.h1}
        </h1>

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-3">About {c.competitor}</h2>
          <p className="text-gray-400 leading-relaxed">{c.competitorDescription}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">SnapBrand</h2>
          <ul className="space-y-3">
            {c.advantages.map((item) => (
              <li key={item} className="flex gap-3 text-gray-300 text-sm leading-relaxed">
                <span className="text-emerald-400 shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">{c.competitor}</h2>
          <ul className="space-y-3">
            {c.competitorAdvantages.map((item) => (
              <li key={item} className="flex gap-3 text-gray-300 text-sm leading-relaxed">
                <span className="text-amber-400/90 shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12 rounded-2xl p-6 bg-slate-900/80 border border-white/10">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
            {c.competitor} pricing (indicative)
          </h2>
          <p className="text-white">{c.competitorPricing}</p>
        </section>

        <section
          className="rounded-2xl p-8 mb-16 bg-gradient-to-br from-indigo-950/80 to-violet-950/50 border border-indigo-500/30"
          aria-label="Verdict"
        >
          <h2 className="text-lg font-bold text-white mb-4">Verdict</h2>
          <p className="text-gray-200 leading-relaxed">{c.verdict}</p>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="inline-flex justify-center items-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold transition-all"
          >
            Try SnapBrand free
          </Link>
          <Link
            href="/#features"
            className="inline-flex justify-center items-center px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold transition-all"
          >
            See how it works
          </Link>
        </div>
      </article>

      <section className="max-w-3xl mx-auto px-4 pb-24 border-t border-white/10 pt-12">
        <h2 className="text-lg font-semibold text-white mb-4">More comparisons</h2>
        <ul className="space-y-2">
          {other.map((x) => (
            <li key={x.slug}>
              <Link
                href={`/compare/${x.slug}`}
                className="text-indigo-400 hover:text-indigo-300 text-sm"
              >
                SnapBrand vs {x.competitor} →
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
