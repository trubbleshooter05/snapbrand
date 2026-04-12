'use client'

import Link from 'next/link'

interface Section {
  title: string
  content: string | string[]
}

interface SeoTemplatePageProps {
  eyebrow?: string
  h1: string
  intro: string
  sections: Section[]
  relatedPages: { href: string; label: string }[]
}

export default function SeoTemplatePage({
  eyebrow = 'SEO Template Guide',
  h1,
  intro,
  sections,
  relatedPages,
}: SeoTemplatePageProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto px-4 pt-20 pb-12">
        <p className="text-sm font-semibold tracking-widest text-indigo-400 uppercase mb-4">
          {eyebrow}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {h1}
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed mb-8">{intro}</p>

        {/* Primary CTA - Above fold */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link
            href="/#generate"
            className="inline-flex justify-center items-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold transition-all"
          >
            Create Your Brand Kit in Seconds
          </Link>
          <Link
            href="/"
            className="inline-flex justify-center items-center px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold transition-all"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        {sections.map((section, idx) => (
          <section key={idx} className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
            {Array.isArray(section.content) ? (
              <ul className="space-y-3">
                {section.content.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="text-gray-400 leading-relaxed flex gap-3"
                  >
                    <span className="text-indigo-400 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 leading-relaxed">{section.content}</p>
            )}

            {/* Secondary CTA after each section */}
            {idx === Math.floor(sections.length / 2) && (
              <div className="mt-8 rounded-xl p-6 bg-indigo-950/50 border border-indigo-500/30">
                <p className="text-indigo-100 mb-4">
                  Ready to generate your brand identity?
                </p>
                <Link
                  href="/#generate"
                  className="inline-flex items-center px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
                >
                  Start Creating Your Brand Kit →
                </Link>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Related Pages Section */}
      {relatedPages.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 pb-24 border-t border-white/10 pt-16">
          <h2 className="text-2xl font-bold text-white mb-6">Related Guides</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {relatedPages.map((page, idx) => (
              <li key={idx}>
                <Link
                  href={page.href}
                  className="block rounded-xl px-4 py-3 bg-slate-900/60 border border-white/10 text-indigo-300 hover:border-indigo-500/40 hover:text-indigo-200 transition-colors"
                >
                  {page.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Final CTA */}
      <div className="max-w-3xl mx-auto px-4 pb-24">
        <div className="rounded-xl p-8 bg-gradient-to-br from-indigo-950/80 to-violet-950/50 border border-indigo-500/30">
          <h3 className="text-2xl font-bold text-white mb-4">
            Generate Your Brand Kit Now
          </h3>
          <p className="text-gray-200 mb-6 leading-relaxed">
            Turn this template into your complete brand identity. Get colors, typography,
            brand voice, and more — all in 60 seconds.
          </p>
          <Link
            href="/#generate"
            className="inline-flex justify-center items-center px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold transition-all text-lg"
          >
            Create Your Brand Kit Free →
          </Link>
        </div>
      </div>
    </div>
  )
}
