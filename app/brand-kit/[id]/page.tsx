'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { BrandKitData } from '@/app/api/generate/route'

interface Asset {
  id: string
  brandName: string
  assetType: string
  logoSvg: string | null
  wordmarkSvg: string | null
  createdAt: string
  brandKitData: BrandKitData | null
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className="text-xs text-gray-400 hover:text-indigo-400 transition-colors"
    >
      {copied ? '✓ copied' : (label ?? 'copy')}
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-5">
      {children}
    </h2>
  )
}

export default function BrandKitPage() {
  const { id } = useParams<{ id: string }>()
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/brand-kit/${id}`)
      .then((r) => { if (!r.ok) throw new Error('Brand kit not found'); return r.json() })
      .then((d: Asset) => setAsset(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-400 animate-pulse">Building your brand kit…</p>
      </div>
    )
  }
  if (error || !asset) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-950">
        <p className="text-red-400">{error ?? 'Not found.'}</p>
        <Link href="/" className="text-indigo-400 hover:text-indigo-300">← Back</Link>
      </div>
    )
  }

  const kit = asset.brandKitData
  const heading = kit?.typography?.heading_font
  const body    = kit?.typography?.body_font
  const primary = kit?.color_palette?.primary?.hex ?? '#4F46E5'
  const colors  = kit?.color_palette ? Object.entries(kit.color_palette) : []

  const googleFontsUrl = [heading, body].filter(Boolean).length
    ? `https://fonts.googleapis.com/css2?${[
        heading && `family=${encodeURIComponent(heading)}:wght@400;700`,
        body    && `family=${encodeURIComponent(body)}:wght@400;700`,
      ].filter(Boolean).join('&')}&display=swap`
    : null

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {googleFontsUrl && <link href={googleFontsUrl} rel="stylesheet" />}

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">

        {/* ── Back ──────────────────────────────────────────────────────────── */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
          ← Generate another
        </Link>

        {/* ── Hero header ───────────────────────────────────────────────────── */}
        <div className="text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Brand Identity System</p>
          <h1
            className="text-5xl font-black text-white"
            style={{ fontFamily: heading ? `'${heading}', sans-serif` : undefined }}
          >
            {asset.brandName}
          </h1>
          {kit?.tagline_options?.[0] && (
            <p
              className="text-xl text-gray-400"
              style={{ fontFamily: body ? `'${body}', sans-serif` : undefined }}
            >
              {kit.tagline_options[0]}
            </p>
          )}
        </div>

        {/* ── Logo mark ─────────────────────────────────────────────────────── */}
        {(asset.logoSvg || asset.wordmarkSvg) && (
          <section>
            <SectionLabel>Logo Mark</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Light background */}
              <div className="bg-white rounded-2xl p-12 flex items-center justify-center">
                {asset.logoSvg && (
                  <div
                    className="w-40 h-40"
                    dangerouslySetInnerHTML={{ __html: asset.logoSvg }}
                  />
                )}
              </div>
              {/* Dark background */}
              <div className="bg-gray-900 border border-white/10 rounded-2xl p-12 flex items-center justify-center">
                {asset.logoSvg && (
                  <div
                    className="w-40 h-40"
                    dangerouslySetInnerHTML={{ __html: asset.logoSvg }}
                  />
                )}
              </div>
            </div>
            {/* Wordmark */}
            {asset.wordmarkSvg && (
              <div className="bg-white rounded-2xl p-8 flex items-center justify-center overflow-x-auto">
                <div dangerouslySetInnerHTML={{ __html: asset.wordmarkSvg }} />
              </div>
            )}
          </section>
        )}

        {/* ── Color palette ─────────────────────────────────────────────────── */}
        {colors.length > 0 && (
          <section>
            <SectionLabel>Color Palette</SectionLabel>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {colors.map(([role, color]) => (
                <div key={role} className="group text-center">
                  <div
                    className="aspect-square rounded-2xl border border-white/10 group-hover:scale-105 transition-transform shadow-lg cursor-pointer mb-3"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => navigator.clipboard.writeText(color.hex)}
                    title="Click to copy hex"
                  />
                  <p className="text-sm font-bold text-white capitalize">{role}</p>
                  <p className="text-xs text-gray-400">{color.name}</p>
                  <CopyButton text={color.hex} label={color.hex} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Typography ────────────────────────────────────────────────────── */}
        {kit?.typography && (
          <section>
            <SectionLabel>Typography</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-8">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">Heading — {heading}</p>
                <p className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: heading ? `'${heading}', sans-serif` : undefined }}>
                  {heading}
                </p>
                <p className="text-2xl text-gray-700" style={{ fontFamily: heading ? `'${heading}', sans-serif` : undefined }}>
                  Aa Bb Cc Dd Ee Ff Gg
                </p>
                <p className="text-base text-gray-500 mt-2" style={{ fontFamily: heading ? `'${heading}', sans-serif` : undefined }}>
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">Body — {body}</p>
                <p className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: body ? `'${body}', sans-serif` : undefined }}>
                  {body}
                </p>
                <p className="text-2xl text-gray-700" style={{ fontFamily: body ? `'${body}', sans-serif` : undefined }}>
                  Aa Bb Cc Dd Ee Ff Gg
                </p>
                <p className="text-base text-gray-500 mt-2" style={{ fontFamily: body ? `'${body}', sans-serif` : undefined }}>
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── Taglines ──────────────────────────────────────────────────────── */}
        {kit?.tagline_options && kit.tagline_options.length > 0 && (
          <section>
            <SectionLabel>Tagline Options</SectionLabel>
            <div className="space-y-3">
              {kit.tagline_options.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-slate-900/80 border border-white/10 rounded-xl p-5 hover:border-white/30 transition-colors cursor-pointer group"
                  onClick={() => navigator.clipboard.writeText(t)}
                >
                  <p
                    className="text-lg font-medium text-white"
                    style={{ fontFamily: heading ? `'${heading}', sans-serif` : undefined }}
                  >
                    &ldquo;{t}&rdquo;
                  </p>
                  <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity ml-4 shrink-0">
                    click to copy
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Brand voice ───────────────────────────────────────────────────── */}
        {kit?.brand_voice && (
          <section>
            <SectionLabel>Brand Voice</SectionLabel>
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-8 space-y-6">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Tone</p>
                <p className="text-lg font-medium text-white">{kit.brand_voice.tone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Personality</p>
                <p className="text-gray-300" style={{ fontFamily: body ? `'${body}', sans-serif` : undefined }}>
                  {kit.brand_voice.personality}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Example Copy</p>
                <div
                  className="rounded-xl p-6 border-l-4 bg-white/5"
                  style={{ borderColor: primary }}
                >
                  <p
                    className="text-lg italic text-gray-200"
                    style={{ fontFamily: body ? `'${body}', sans-serif` : undefined }}
                  >
                    &ldquo;{kit.brand_voice.sample_copy}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Brand strategy ────────────────────────────────────────────────── */}
        {kit?.brand_strategy && (
          <section>
            <SectionLabel>Brand Strategy</SectionLabel>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Positioning',      val: kit.brand_strategy.positioning },
                { label: 'Target Audience',  val: kit.brand_strategy.target_audience },
                { label: 'Unique Value',     val: kit.brand_strategy.unique_value_prop },
                { label: 'Tone of Voice',    val: kit.brand_strategy.tone_of_voice },
              ].map(({ label, val }) => (
                <div key={label} className="bg-slate-900/80 border border-white/10 rounded-xl p-5">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-2">{label}</p>
                  <p className="text-gray-200 text-sm leading-relaxed">{val}</p>
                </div>
              ))}
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-5 sm:col-span-2">
                <p className="text-xs text-gray-500 font-bold uppercase mb-3">Personality</p>
                <div className="flex flex-wrap gap-2">
                  {kit.brand_strategy.brand_personality.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full text-sm font-medium border"
                      style={{ backgroundColor: `${primary}20`, color: primary, borderColor: `${primary}50` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Logo concepts ─────────────────────────────────────────────────── */}
        {kit?.logo_concepts && kit.logo_concepts.length > 0 && (
          <section>
            <SectionLabel>Logo Concept Directions</SectionLabel>
            <p className="text-sm text-gray-500 mb-4">Hand these to a designer for custom execution:</p>
            <div className="grid md:grid-cols-3 gap-4">
              {kit.logo_concepts.map((concept, i) => (
                <div key={i} className="bg-slate-900/80 border border-white/10 rounded-xl p-6">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3"
                    style={{ backgroundColor: primary }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{concept}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="border-t border-white/10 pt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="px-8 py-3 rounded-xl font-bold text-white transition-colors"
            style={{ backgroundColor: primary }}
          >
            Generate Another Brand Kit
          </Link>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="text-sm text-gray-400 hover:text-white underline transition-colors"
          >
            Copy shareable link
          </button>
        </section>

        <p className="text-xs text-gray-700 pb-8">
          Generated {new Date(asset.createdAt).toLocaleDateString()} · Kit ID: {asset.id}
        </p>

      </div>
    </div>
  )
}
