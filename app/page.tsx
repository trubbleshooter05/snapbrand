'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { motion, type BezierDefinition } from 'framer-motion'

export const dynamic = 'force-dynamic'

const EASE: BezierDefinition = [0.22, 1, 0.36, 1]

const FEATURES = [
  {
    icon: '🎨',
    title: 'Logo Generation',
    desc: 'Create unique, professional logos tailored to your brand identity.',
  },
  {
    icon: '🎯',
    title: 'Color Palettes',
    desc: 'Generate beautiful color schemes that work perfectly for your brand.',
  },
  {
    icon: '✨',
    title: 'Brand Assets',
    desc: 'Get complete brand packages with all the assets you need.',
  },
]

const FREE_FEATURES = ['3 free generations', 'Basic brand assets', 'PNG format export']
const PRO_FEATURES = [
  'Unlimited generations',
  'Advanced brand assets',
  'PNG & SVG export',
  'Priority support',
  'Commercial license',
]

export default function Home() {
  const { data: session } = useSession()
  const generationsUsed =
    ((session?.user as unknown) as { generationsUsed?: number })?.generationsUsed ?? 0
  const isProMember =
    ((session?.user as unknown) as { isProMember?: boolean })?.isProMember ?? false
  const generationsRemaining = Math.max(0, 3 - generationsUsed)

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 pt-28 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="text-sm font-semibold tracking-widest text-indigo-400 uppercase mb-5">
            AI Brand Generation
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Build your brand<br />
            <span className="text-indigo-400">in seconds</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Create stunning brand assets with AI. Logos, color palettes, and complete brand
            packages — instantly.
          </p>

          {session ? (
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/dashboard"
                className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold transition-all duration-300"
              >
                Go to Dashboard
              </Link>
              {!isProMember && (
                <Link
                  href="/pricing"
                  className="px-8 py-3.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Upgrade to Pro →
                </Link>
              )}
            </div>
          ) : (
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/auth/signup"
                className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold transition-all duration-300"
              >
                Get Started Free
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl font-semibold transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          )}
        </motion.div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-16 scroll-mt-24">
        <motion.h2
          className="text-3xl font-bold text-white text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
        >
          Features
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.1, duration: 0.55, ease: EASE }}
              className={[
                'rounded-2xl p-6',
                'bg-slate-900/80 backdrop-blur-2xl border border-white/10',
                'transition-all duration-500 hover:border-indigo-500/50',
              ].join(' ')}
            >
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pricing teaser ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
        >
          <p className="text-sm font-semibold tracking-widest text-indigo-400 uppercase mb-3">
            Pricing
          </p>
          <h2 className="text-3xl font-bold text-white mb-2">Simple, Transparent Pricing</h2>
          <p className="text-gray-400">Start free. Upgrade when you need more.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55, ease: EASE }}
            className={[
              'rounded-2xl p-8 flex flex-col',
              'bg-slate-900/80 backdrop-blur-2xl border border-white/10',
              'transition-all duration-500 hover:border-indigo-500/50',
            ].join(' ')}
          >
            <h3 className="text-xl font-bold text-white mb-1">Free</h3>
            <p className="text-gray-400 text-sm mb-6">Perfect for trying out SNAPBRAND</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-gray-500 ml-1">/month</span>
            </div>
            <ul className="space-y-2 mb-8 text-sm flex-1">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-gray-300">
                  <span className="text-emerald-400">✓</span> {f}
                </li>
              ))}
            </ul>
            {!session ? (
              <Link
                href="/auth/signup"
                className="block text-center py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold transition-all"
              >
                Get Started
              </Link>
            ) : isProMember ? (
              <button
                disabled
                className="w-full py-2.5 rounded-xl bg-white/5 text-gray-500 font-semibold cursor-not-allowed"
              >
                Downgrade
              </button>
            ) : (
              <div className="text-center py-2.5 rounded-xl bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20 text-sm">
                {generationsRemaining} generations remaining
              </div>
            )}
          </motion.div>

          {/* Pro card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.55, ease: EASE }}
            className={[
              'rounded-2xl p-8 flex flex-col relative overflow-hidden',
              'bg-slate-900/80 backdrop-blur-2xl border border-indigo-500/40',
              'transition-all duration-500 hover:border-indigo-500/80',
            ].join(' ')}
          >
            {/* Top gradient accent line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />

            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl font-bold text-white">Pro</h3>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                Most Popular
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-6">For professional creators</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$9.99</span>
              <span className="text-gray-500 ml-1">/month</span>
            </div>
            <ul className="space-y-2 mb-8 text-sm flex-1">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-gray-300">
                  <span className="text-emerald-400">✓</span> {f}
                </li>
              ))}
            </ul>
            {!session ? (
              <Link
                href="/auth/signup"
                className="block text-center py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold transition-all"
              >
                Start Free Trial
              </Link>
            ) : isProMember ? (
              <button
                disabled
                className="w-full py-2.5 rounded-xl bg-indigo-600/50 text-white/50 font-semibold cursor-not-allowed"
              >
                Current Plan
              </button>
            ) : (
              <Link
                href="/pricing"
                className="block text-center py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold transition-all"
              >
                Upgrade Now →
              </Link>
            )}
          </motion.div>
        </div>

        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <Link
            href="/pricing"
            className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
          >
            View full pricing details →
          </Link>
        </motion.div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pb-28 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
          className={[
            'rounded-3xl p-16 text-center',
            'bg-slate-900/80 backdrop-blur-2xl border border-white/10',
          ].join(' ')}
        >
          <h2 className="text-4xl font-bold text-white mb-4">Ready to create your brand?</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Start with 3 free generations today. No credit card required.
          </p>
          {!session && (
            <Link
              href="/auth/signup"
              className="inline-block px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold transition-all duration-300"
            >
              Get Started Free
            </Link>
          )}
        </motion.div>
      </section>

    </div>
  )
}
