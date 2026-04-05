'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { BrandKitData } from '@/app/api/generate/route'

interface Asset {
  id: string
  brandName: string
  assetType: string
  imageUrl: string
  createdAt: string
  brandKitData: BrandKitData | null
}

const EASE = [0.22, 1, 0.36, 1] as const

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="rounded-2xl p-6 bg-slate-900/80 backdrop-blur-2xl border border-white/10"
    >
      <h3 className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-4">
        {title}
      </h3>
      {children}
    </motion.div>
  )
}

function CopyHex({ hex }: { hex: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      onClick={copy}
      title="Click to copy"
      className="text-xs text-gray-500 hover:text-indigo-400 transition-colors font-mono"
    >
      {copied ? '✓ copied' : hex}
    </button>
  )
}

export default function BrandKitPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/brand-kit/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Could not load brand kit')
        return r.json()
      })
      .then((data: Asset) => setAsset(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-400 animate-pulse">Loading brand kit…</p>
      </div>
    )
  }

  if (error || !asset) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-950">
        <p className="text-red-400">{error ?? 'Brand kit not found.'}</p>
        <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300">
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  const kit = asset.brandKitData

  // Load Google Fonts if typography data exists
  const headingFont = kit?.typography?.heading_font
  const bodyFont    = kit?.typography?.body_font
  const googleFontsUrl =
    headingFont || bodyFont
      ? `https://fonts.googleapis.com/css2?${[
          headingFont && `family=${encodeURIComponent(headingFont)}:wght@400;700`,
          bodyFont    && `family=${encodeURIComponent(bodyFont)}:wght@400;700`,
        ]
          .filter(Boolean)
          .join('&')}&display=swap`
      : null

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {googleFontsUrl && (
        // eslint-disable-next-line @next/next/no-page-custom-font
        <link href={googleFontsUrl} rel="stylesheet" />
      )}

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-8">

        {/* ── Back link ──────────────────────────────────────────────────── */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          ← Dashboard
        </Link>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className="text-sm font-semibold tracking-widest text-indigo-400 uppercase mb-2">
            Brand Kit
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: headingFont ?? undefined }}
          >
            {asset.brandName}
          </h1>
          {kit?.brand_voice?.sample_copy && (
            <p
              className="text-gray-400 mt-2 text-lg max-w-2xl"
              style={{ fontFamily: bodyFont ?? undefined }}
            >
              {kit.brand_voice.sample_copy}
            </p>
          )}
        </motion.div>

        {/* ── Logo icon + taglines grid ───────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Logo image */}
          <Section title="Logo Icon">
            <div className="rounded-xl overflow-hidden bg-white aspect-square flex items-center justify-center">
              <img
                src={asset.imageUrl}
                alt={`${asset.brandName} logo icon`}
                className="w-full h-full object-contain p-4"
                loading="lazy"
              />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Icon only — no text in the image. Brand name rendered as HTML below.
            </p>
            <h2
              className="text-2xl font-bold text-white mt-3"
              style={{ fontFamily: headingFont ?? undefined }}
            >
              {asset.brandName}
            </h2>
            {kit?.tagline_options?.[0] && (
              <p
                className="text-gray-400 text-sm"
                style={{ fontFamily: bodyFont ?? undefined }}
              >
                {kit.tagline_options[0]}
              </p>
            )}
          </Section>

          {/* Taglines */}
          {kit?.tagline_options && (
            <Section title="Tagline Options">
              <div className="space-y-3">
                {kit.tagline_options.map((t, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/40 transition-colors cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(t)}
                    title="Click to copy"
                  >
                    <p
                      className="text-white font-medium"
                      style={{ fontFamily: bodyFont ?? undefined }}
                    >
                      &ldquo;{t}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-3">Click any tagline to copy</p>
            </Section>
          )}
        </div>

        {/* ── Color palette ───────────────────────────────────────────────── */}
        {kit?.color_palette && (
          <Section title="Color Palette">
            <div className="flex flex-wrap gap-4">
              {Object.entries(kit.color_palette).map(([role, color]) => (
                <div key={role} className="text-center">
                  <div
                    className="w-20 h-20 rounded-xl border border-white/10 cursor-pointer hover:scale-105 transition-transform shadow-lg"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => navigator.clipboard.writeText(color.hex)}
                    title={`Click to copy ${color.hex}`}
                  />
                  <p className="text-sm font-semibold text-white mt-2">{color.name}</p>
                  <CopyHex hex={color.hex} />
                  <p className="text-xs text-gray-500 capitalize">{role}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Typography ──────────────────────────────────────────────────── */}
        {kit?.typography && (
          <Section title="Typography">
            <div className="space-y-6">
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest">Heading — {headingFont}</p>
                <p
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: headingFont ?? undefined }}
                >
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest">Body — {bodyFont}</p>
                <p
                  className="text-base text-gray-300 leading-relaxed"
                  style={{ fontFamily: bodyFont ?? undefined }}
                >
                  The quick brown fox jumps over the lazy dog.<br />
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
                </p>
              </div>
            </div>
          </Section>
        )}

        {/* ── Brand strategy + voice ──────────────────────────────────────── */}
        {kit?.brand_strategy && (
          <Section title="Brand Strategy">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Positioning</p>
                <p className="text-gray-200">{kit.brand_strategy.positioning}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Target Audience</p>
                <p className="text-gray-200">{kit.brand_strategy.target_audience}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Unique Value</p>
                <p className="text-gray-200">{kit.brand_strategy.unique_value_prop}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Personality</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {kit.brand_strategy.brand_personality.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        )}

        {kit?.brand_voice && (
          <Section title="Brand Voice">
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Tone</p>
                <p className="text-gray-200">{kit.brand_voice.tone}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Personality</p>
                <p className="text-gray-200">{kit.brand_voice.personality}</p>
              </div>
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">Sample Copy</p>
                <p
                  className="text-gray-200 italic"
                  style={{ fontFamily: bodyFont ?? undefined }}
                >
                  &ldquo;{kit.brand_voice.sample_copy}&rdquo;
                </p>
              </div>
            </div>
          </Section>
        )}

        {/* ── Logo concepts (text, for a designer) ───────────────────────── */}
        {kit?.logo_concepts && kit.logo_concepts.length > 0 && (
          <Section title="Logo Concepts (for a designer)">
            <div className="space-y-3">
              {kit.logo_concepts.map((concept, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-indigo-500 font-bold text-sm mt-0.5">{i + 1}.</span>
                  <p className="text-gray-300 text-sm leading-relaxed">{concept}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Actions ─────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-4 pt-4">
          <a
            href={asset.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold transition-all"
          >
            Download Logo Icon
          </a>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold transition-all"
          >
            Generate Another
          </Link>
        </div>

        <p className="text-xs text-gray-600 pb-8">
          Generated {new Date(asset.createdAt).toLocaleDateString()} · Asset ID: {asset.id}
        </p>
      </div>
    </div>
  )
}
