'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion, type BezierDefinition } from 'framer-motion'
import { getConfig } from './config'

const EASE: BezierDefinition = [0.22, 1, 0.36, 1]

export default function ClientPage({ businessType }: { businessType: string }) {
  const router = useRouter()
  const config = getConfig(businessType)

  const [brandName, setBrandName] = useState('')
  const [description, setDescription] = useState('')
  const [generating, setGenerating] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!brandName.trim() || !description.trim()) {
      setFormError('Please enter a name and description.')
      return
    }
    setGenerating(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: brandName.trim(),
          brandDescription: `${config.label}: ${description.trim()}`,
          assetType: 'Logo',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (res.status === 403) {
          setFormError('Free limit reached. Sign up to continue!')
        } else {
          setFormError(data.error ?? 'Something went wrong.')
        }
        return
      }
      router.push(`/brand-kit/${data.asset.id}`)
    } catch {
      setFormError('Network error. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Hero + CTA Form ───────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="text-sm font-semibold tracking-widest text-indigo-400 uppercase mb-5">
            {config.label} Branding
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Create a Professional<br />
            <span className="text-indigo-400">{config.label} Logo</span><br />
            in Seconds
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            {config.description}
          </p>
        </motion.div>

        {/* ── Logo Generation Form ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
          className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 text-left"
        >
          <form onSubmit={handleGenerate} className="space-y-4">
            {formError && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-sm">
                {formError}
                {formError.toLowerCase().includes('sign up') && (
                  <Link href="/auth/signup" className="ml-2 underline text-indigo-400 hover:text-indigo-300">
                    Sign up free →
                  </Link>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your {config.label} Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder={`e.g. ${config.label === 'Real Estate' ? 'Luxury Homes Realty' : 'Your Business Name'}`}
                required
                disabled={generating}
                className="w-full px-4 py-3 border border-white/15 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Describe Your Brand
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`Describe your business, target market, and style. E.g., ${config.label === 'Real Estate' ? '"High-end residential properties, modern aesthetic, trusted and professional"' : '"Your niche, audience, and preferences"'}`}
                rows={3}
                required
                disabled={generating}
                className="w-full px-4 py-3 border border-white/15 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {generating ? (
                <span className="animate-pulse">✨ Creating Your Logo…</span>
              ) : (
                '✨ Generate My Logo — Free'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            No signup required · 3 free generations · Takes ~15 seconds
          </p>
        </motion.div>
      </section>

      {/* ── Benefits ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2
          className="text-3xl font-bold text-white text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: EASE }}
        >
          Why Your {config.label} Business Needs a Strong Logo
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-6">
          {config.benefits.map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.55, ease: EASE }}
              className="rounded-2xl p-6 bg-slate-900/80 backdrop-blur-2xl border border-white/10 transition-all duration-500 hover:border-indigo-500/50"
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <motion.h2
          className="text-3xl font-bold text-white text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
        >
          How It Works
        </motion.h2>
        <div className="space-y-8">
          {[
            {
              num: '1',
              title: 'Tell Us About Your Brand',
              desc: 'Enter your business name and describe your brand identity, values, and target market.',
            },
            {
              num: '2',
              title: 'AI Generates Your Logo',
              desc: 'Our AI analyzes your input and creates multiple professional logo options instantly.',
            },
            {
              num: '3',
              title: 'Get Your Complete Brand Kit',
              desc: 'Receive your logo plus complementary color palettes, fonts, and brand guidelines.',
            },
            {
              num: '4',
              title: 'Download & Use',
              desc: 'Export in your preferred format and use across all your marketing materials.',
            },
          ].map(({ num, title, desc }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.55, ease: EASE }}
              className="flex gap-6 items-start"
            >
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-600 text-white font-bold text-lg">
                  {num}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-400">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Why SNAPBRAND ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6, ease: EASE }}
        >
          <div className="rounded-2xl p-8 bg-slate-900/80 backdrop-blur-2xl border border-white/10">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">Instant Results</h3>
            <p className="text-gray-400 text-sm">Get professional logos in seconds, not weeks.</p>
          </div>
          <div className="rounded-2xl p-8 bg-slate-900/80 backdrop-blur-2xl border border-white/10">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">Tailored to Your Niche</h3>
            <p className="text-gray-400 text-sm">Logos optimized for {config.label.toLowerCase()} industry standards.</p>
          </div>
          <div className="rounded-2xl p-8 bg-slate-900/80 backdrop-blur-2xl border border-white/10">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-white mb-2">Affordable</h3>
            <p className="text-gray-400 text-sm">3 free generations, or upgrade for unlimited.</p>
          </div>
        </motion.div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <motion.h2
          className="text-3xl font-bold text-white text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="space-y-4">
          {config.faqItems.map(({ q, a }, i) => (
            <motion.div
              key={q}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.05, duration: 0.55, ease: EASE }}
              className="rounded-2xl p-6 bg-slate-900/80 backdrop-blur-2xl border border-white/10 transition-all duration-500 hover:border-indigo-500/50"
            >
              <h3 className="font-semibold text-white mb-2">{q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Related Business Types ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2
          className="text-3xl font-bold text-white text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6, ease: EASE }}
        >
          Logo Generators for Other Industries
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-4">
          {config.relatedTypes.map(({ slug, label }) => (
            <motion.div
              key={slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.55, ease: EASE }}
            >
              <Link
                href={`/logo-generator/${slug}`}
                className="block p-6 rounded-2xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 hover:border-indigo-500/50 transition-all duration-500 text-center"
              >
                <p className="text-white font-semibold">{label} Logos</p>
                <p className="text-gray-400 text-sm mt-1">Create now →</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pb-28 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6, ease: EASE }}
          className="rounded-3xl p-16 text-center bg-slate-900/80 backdrop-blur-2xl border border-white/10"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Build Your {config.label} Brand?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Get a professional logo and complete brand kit in seconds. 3 free generations, no credit card required.
          </p>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-block px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold transition-all duration-300"
          >
            Generate My Logo Now
          </Link>
        </motion.div>
      </section>

      {/* ── Internal Links Footer ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-white/10">
        <div className="grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <h4 className="font-semibold text-white mb-4">Logo Generators</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/logo-generator/real-estate" className="hover:text-indigo-400">Real Estate</Link></li>
              <li><Link href="/logo-generator/restaurant" className="hover:text-indigo-400">Restaurant</Link></li>
              <li><Link href="/logo-generator/ecommerce" className="hover:text-indigo-400">E-commerce</Link></li>
              <li><Link href="/logo-generator/fitness-coach" className="hover:text-indigo-400">Fitness Coach</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Brand Kits</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/brand-kit/real-estate" className="hover:text-indigo-400">Real Estate Brand Kit</Link></li>
              <li><Link href="/brand-kit/restaurant" className="hover:text-indigo-400">Restaurant Brand Kit</Link></li>
              <li><Link href="/" className="hover:text-indigo-400">All Generators</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/pricing" className="hover:text-indigo-400">Pricing</Link></li>
              <li><Link href="/" className="hover:text-indigo-400">Home</Link></li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  )
}
