'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { motion, AnimatePresence, type Variants, type BezierDefinition } from 'framer-motion'
import { PRICING_FAQ } from '@/lib/pricing-faq'
import { getDefaultArticleByline } from '@/lib/site'

export const dynamic = 'force-dynamic'

const PRICING_BYLINE = getDefaultArticleByline()

// ─── Conic spinning border ───────────────────────────────────────────────────
// 3px padding gives enough border area to see the gradient at all radii.
// Inner wrapper uses rounded-[13px] (= 16px - 3px) so corners align exactly.
// animation is applied via inline style so it directly references the
// @keyframes spin-slow in globals.css — no Tailwind JIT scanning required.
function ConicBorder({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ padding: '3px' }}>
      {/* Spinning gradient layer — fills the 3px border ring */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, #4F46E5, #7C3AED, #06B6D4, #4F46E5)',
            animation: 'spin-slow 6s linear infinite',
            willChange: 'transform',
          }}
        />
      </div>
      {/* Content sits above the gradient; rounded-[13px] matches 16px outer - 3px */}
      <div className="relative rounded-[13px] overflow-hidden h-full">{children}</div>
    </div>
  )
}

// ─── Animation config ────────────────────────────────────────────────────────
const EASE: BezierDefinition = [0.22, 1, 0.36, 1]

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: EASE },
  }),
}

// ─── Feature lists ───────────────────────────────────────────────────────────
const FREE_FEATURES = [
  { label: '3 free generations', included: true },
  { label: 'Basic brand assets', included: true },
  { label: 'PNG format export', included: true },
  { label: 'SVG format', included: false },
  { label: 'Commercial license', included: false },
]

const PRO_FEATURES = [
  { label: 'Unlimited generations', included: true },
  { label: 'Advanced brand assets', included: true },
  { label: 'PNG & SVG export', included: true },
  { label: 'Commercial license', included: true },
  { label: 'Priority support', included: true },
]

// ─── Page ────────────────────────────────────────────────────────────────────
export default function PricingPageClient() {
  const { data: session } = useSession()
  const isProMember =
    ((session?.user as unknown) as { isProMember?: boolean })?.isProMember ?? false
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (!session) {
      window.location.href = '/auth/signup'
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          email: session.user.email,
        }),
      })

      const { url } = await response.json()
      if (url) window.location.href = url
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-950 text-white">
      {/* BackgroundMesh is rendered globally via layout.tsx */}

      <div className="max-w-7xl mx-auto px-4 py-24">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className="text-sm font-semibold tracking-widest text-indigo-400 uppercase mb-4">
            Pricing
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-5">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400 max-w-xl mx-auto">
            Choose the plan that&apos;s right for you
          </p>
          <p className="text-sm text-gray-500 mt-6 max-w-xl mx-auto">
            <span className="text-gray-400">{PRICING_BYLINE.author}</span>
            <span className="mx-2 text-gray-600" aria-hidden>
              ·
            </span>
            <time dateTime={PRICING_BYLINE.dateModified}>
              Updated {PRICING_BYLINE.dateModifiedLabel}
            </time>
          </p>
        </motion.div>

        {/* ── Bento grid ──────────────────────────────────────────────────── */}
        {/*  Pro column is 1.2fr wide; the card itself is scaled 1.05x         */}
        <AnimatePresence>
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 max-w-4xl mx-auto items-stretch py-8">

            {/* Free card */}
            <motion.div
              custom={0}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className={[
                'group h-full rounded-2xl p-8 flex flex-col',
                'bg-slate-900/80 backdrop-blur-2xl border border-white/10',
                'transition-all duration-500 hover:border-indigo-500/50',
              ].join(' ')}
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-1">
                  Free
                </h3>
                <p className="text-gray-400 text-sm">Perfect for trying SnapBrand</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold text-white">$0</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>

              <ul className="space-y-3 mb-10 flex-1">
                {FREE_FEATURES.map(({ label, included }) => (
                  <li key={label} className="flex items-center gap-3 text-sm">
                    <span className={included ? 'text-emerald-400' : 'text-gray-600'}>
                      {included ? '✓' : '✗'}
                    </span>
                    <span className={included ? 'text-gray-300' : 'text-gray-600 line-through'}>
                      {label}
                    </span>
                  </li>
                ))}
              </ul>

              {!session ? (
                <Link
                  href="/auth/signup"
                  className="block text-center py-3 px-6 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold transition-all duration-300"
                >
                  Get Started
                </Link>
              ) : isProMember ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl bg-white/5 text-gray-500 font-semibold cursor-not-allowed"
                >
                  Downgrade
                </button>
              ) : (
                <div className="text-center py-3 px-6 rounded-xl bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                  Current Plan
                </div>
              )}
            </motion.div>

            {/* Pro card — conic spinning border + 1.05× scale */}
            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="scale-[1.05] origin-center flex flex-col"
            >
              <ConicBorder>
                <div
                  className={[
                    'group rounded-2xl p-10 flex flex-col',
                    'bg-slate-900/80 backdrop-blur-2xl border border-white/10',
                    'transition-all duration-500 hover:border-indigo-500/50',
                  ].join(' ')}
                >
                  {/* Badge row */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-violet-400 mb-1">
                        Pro
                      </h3>
                      <p className="text-gray-400 text-sm">For professional creators</p>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                      Most Popular
                    </span>
                  </div>

                  <div className="mb-8">
                    <span className="text-5xl font-bold text-white">$9.99</span>
                    <span className="text-gray-500 ml-1">/month</span>
                    <p className="text-sm text-gray-500 mt-1">Billed monthly</p>
                  </div>

                  <ul className="space-y-3 mb-10 flex-1">
                    {PRO_FEATURES.map(({ label }) => (
                      <li key={label} className="flex items-center gap-3 text-sm">
                        <span className="text-emerald-400">✓</span>
                        <span className="text-gray-300">{label}</span>
                      </li>
                    ))}
                  </ul>

                  {!session ? (
                    <motion.button
                      onClick={handleCheckout}
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white transition-all duration-300 disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="animate-pulse">Securing Session...</span>
                      ) : (
                        'Start Free Trial'
                      )}
                    </motion.button>
                  ) : isProMember ? (
                    <button
                      disabled
                      className="w-full py-3 rounded-xl font-semibold bg-indigo-600/50 text-white/50 cursor-not-allowed"
                    >
                      Current Plan
                    </button>
                  ) : (
                    <motion.button
                      onClick={handleCheckout}
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white transition-all duration-300 disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="animate-pulse">Securing Session...</span>
                      ) : (
                        'Upgrade to Pro'
                      )}
                    </motion.button>
                  )}
                </div>
              </ConicBorder>
            </motion.div>
          </div>
        </AnimatePresence>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <motion.div
          className="mt-28 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
        >
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {PRICING_FAQ.map(({ q, a }, i) => (
              <motion.div
                key={q}
                custom={i + 2}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className={[
                  'rounded-2xl p-6',
                  'bg-slate-900/80 backdrop-blur-2xl border border-white/10',
                  'transition-all duration-500 hover:border-indigo-500/50',
                ].join(' ')}
              >
                <h3 className="font-semibold text-white mb-2">{q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
