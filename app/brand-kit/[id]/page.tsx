'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { BrandKitData } from '@/app/api/generate/route'
import type { LogoSvgConcept } from '@/lib/logo-concepts-openai'

interface Asset {
  id: string
  brandName: string
  assetType: string
  logoSvg: string | null
  wordmarkSvg: string | null
  createdAt: string
  brandKitData: (BrandKitData & { logo_svg_concepts?: LogoSvgConcept[] }) | null
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

        {/* ── Logo concepts (GPT SVG) or legacy monogram ───────────────────── */}
        {kit?.logo_svg_concepts && kit.logo_svg_concepts.length > 0 ? (
          <section>
            <SectionLabel>Logo Concepts</SectionLabel>
            <p className="text-sm text-gray-500 mb-6">
              Four distinct directions — real SVG you can refine or hand to a designer.
            </p>
            <div className="space-y-10">
              {kit.logo_svg_concepts.map((concept) => (
                <div
                  key={concept.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-lg font-semibold text-white">{concept.label}</p>
                    <span className="text-xs uppercase tracking-wider text-gray-500">
                      {concept.id.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Icon · 48×48</p>
                      <div className="flex gap-4 flex-wrap">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:object-contain">
                          <div dangerouslySetInnerHTML={{ __html: concept.svg }} />
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gray-900 border border-white/10 flex items-center justify-center overflow-hidden [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:object-contain">
                          <div dangerouslySetInnerHTML={{ __html: concept.svg }} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Lockup · 200px wide</p>
                      <div className="flex flex-col gap-3">
                        <div className="w-[200px] min-h-[60px] rounded-xl bg-white flex items-center justify-center px-2 py-2 overflow-hidden [&_svg]:w-full [&_svg]:h-auto [&_svg]:max-h-[60px]">
                          <div className="w-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: concept.svg }} />
                        </div>
                        <div className="w-[200px] min-h-[60px] rounded-xl bg-gray-900 border border-white/10 flex items-center justify-center px-2 py-2 overflow-hidden [&_svg]:w-full [&_svg]:h-auto [&_svg]:max-h-[60px]">
                          <div className="w-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: concept.svg }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (asset.logoSvg || asset.wordmarkSvg) ? (
          <section>
            <SectionLabel>Logo Mark</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-2xl p-12 flex items-center justify-center">
                {asset.logoSvg && (
                  <div
                    className="w-40 h-40"
                    dangerouslySetInnerHTML={{ __html: asset.logoSvg }}
                  />
                )}
              </div>
              <div className="bg-gray-900 border border-white/10 rounded-2xl p-12 flex items-center justify-center">
                {asset.logoSvg && (
                  <div
                    className="w-40 h-40"
                    dangerouslySetInnerHTML={{ __html: asset.logoSvg }}
                  />
                )}
              </div>
            </div>
            {asset.wordmarkSvg && (
              <div className="bg-white rounded-2xl p-8 flex items-center justify-center overflow-x-auto">
                <div dangerouslySetInnerHTML={{ __html: asset.wordmarkSvg }} />
              </div>
            )}
          </section>
        ) : null}

        {/* ── Color palette ─────────────────────────────────────────────────── */}
        {colors.length > 0 && (
          <section>
            <SectionLabel>Color Palette</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
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

            {kit?.color_contrast_summary && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Contrast (approximate WCAG)
                </p>
                <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-300">
                  {Object.entries(kit.color_contrast_summary).map(([k, v]) => (
                    <li key={k}>
                      <span className="text-gray-500 capitalize">
                        {k.replace(/_/g, ' ')}:{' '}
                      </span>
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Palette in context
              </p>
              <div
                className="rounded-2xl border border-white/10 overflow-hidden max-w-lg"
                style={{
                  backgroundColor: kit?.color_palette?.background?.hex ?? '#F8FAFC',
                  color: kit?.color_palette?.text?.hex ?? '#0F172A',
                }}
              >
                <div className="p-6">
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-1 opacity-70"
                    style={{ color: kit?.color_palette?.secondary?.hex }}
                  >
                    Preview
                  </p>
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ fontFamily: heading ? `'${heading}', sans-serif` : undefined }}
                  >
                    {asset.brandName}
                  </h3>
                  <p
                    className="text-sm mb-4 opacity-90"
                    style={{ fontFamily: body ? `'${body}', sans-serif` : undefined }}
                  >
                    This mini layout shows how primary, text, and accent work on your background.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md"
                      style={{ backgroundColor: kit?.color_palette?.primary?.hex ?? primary }}
                    >
                      Primary CTA
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg text-sm font-semibold border-2 bg-transparent"
                      style={{
                        borderColor: kit?.color_palette?.accent?.hex ?? '#6366F1',
                        color: kit?.color_palette?.accent?.hex ?? '#6366F1',
                      }}
                    >
                      Secondary
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Typography ────────────────────────────────────────────────────── */}
        {kit?.typography && (
          <section>
            <SectionLabel>Typography</SectionLabel>
            {kit.typography.font_pairing_id && (
              <p className="text-sm text-gray-500 mb-4 capitalize">
                Curated pairing: {kit.typography.font_pairing_id.replace(/-/g, ' ')}
              </p>
            )}
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

        {/* ── Typography Scale ──────────────────────────────────────────────── */}
        {kit?.typography_scale && (
          <section>
            <SectionLabel>Typography Scale</SectionLabel>
            <div className="space-y-4">
              {Object.entries(kit.typography_scale).map(([key, val]) => (
                <div key={key} className="bg-slate-900/80 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold uppercase tracking-wider text-gray-400">{key}</p>
                    <p className="text-xs text-gray-500">{val.size} • {val.weight} • {val.line_height}lh</p>
                  </div>
                  <p
                    className="text-xl mb-2"
                    style={{
                      fontSize: val.size,
                      fontWeight: val.weight,
                      lineHeight: val.line_height,
                      fontFamily: heading ? `'${heading}', sans-serif` : undefined,
                    }}
                  >
                    The quick brown fox
                  </p>
                  <p className="text-xs text-gray-500">{val.usage}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Spacing & Grid System ─────────────────────────────────────────── */}
        {kit?.spacing_system && (
          <section>
            <SectionLabel>Spacing & Grid System</SectionLabel>
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-6">
                <p className="text-xs text-gray-500 font-bold uppercase mb-3">Base Unit</p>
                <p className="text-lg text-white mb-4">{kit.spacing_system.base_unit}</p>
                <p className="text-xs text-gray-400 mb-4">{kit.spacing_system.margin_padding_standard}</p>
              </div>
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-6">
                <p className="text-xs text-gray-500 font-bold uppercase mb-3">Grid</p>
                <p className="text-lg text-white">{kit.spacing_system.grid_columns}-column grid</p>
              </div>
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-6">
                <p className="text-xs text-gray-500 font-bold uppercase mb-3">Spacing Scale</p>
                <div className="space-y-2">
                  {kit.spacing_system.spacing_scale.map((space, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        style={{
                          width: space,
                          height: '24px',
                          backgroundColor: primary,
                          borderRadius: '4px',
                        }}
                      />
                      <span className="text-sm text-gray-300">{space}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Component Specs ────────────────────────────────────────────────── */}
        {kit?.component_specs && (
          <section>
            <SectionLabel>Component Library</SectionLabel>
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-6">
                <p className="text-xs text-gray-500 font-bold uppercase mb-4">Buttons</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Primary</p>
                    <p className="text-sm text-gray-300">{kit.component_specs.button.primary}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Secondary</p>
                    <p className="text-sm text-gray-300">{kit.component_specs.button.secondary}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">States</p>
                    <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                      {kit.component_specs.button.states.map((state, i) => (
                        <li key={i}>{state}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-6">
                <p className="text-xs text-gray-500 font-bold uppercase mb-4">Input Fields</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Default</p>
                    <p className="text-sm text-gray-300">{kit.component_specs.input.default}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Focus</p>
                    <p className="text-sm text-gray-300">{kit.component_specs.input.focus}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Error</p>
                    <p className="text-sm text-gray-300">{kit.component_specs.input.error}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-6">
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Cards</p>
                <p className="text-sm text-gray-300">{kit.component_specs.card}</p>
              </div>
            </div>
          </section>
        )}

        {/* ── Imagery Guide ──────────────────────────────────────────────────── */}
        {kit?.imagery_guide && (
          <section>
            <SectionLabel>Imagery & Icon Style</SectionLabel>
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-6">
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Photography</p>
                <p className="text-sm text-gray-300">{kit.imagery_guide.photo_style}</p>
              </div>
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-6">
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Illustration</p>
                <p className="text-sm text-gray-300">{kit.imagery_guide.illustration_style}</p>
              </div>
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-6">
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Icons</p>
                <p className="text-sm text-gray-300">{kit.imagery_guide.icon_specs}</p>
              </div>
            </div>
          </section>
        )}

        {/* ── Accessibility ──────────────────────────────────────────────────── */}
        {kit?.accessibility && (
          <section>
            <SectionLabel>Accessibility Guidelines</SectionLabel>
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-6">
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">WCAG AA Contrast</p>
                <p className="text-sm text-gray-300">{kit.accessibility.contrast_aa}</p>
              </div>
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-6">
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">WCAG AAA Contrast</p>
                <p className="text-sm text-gray-300">{kit.accessibility.contrast_aaa}</p>
              </div>
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-6">
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Compliance Target</p>
                <p className="text-sm text-gray-300">{kit.accessibility.wcag_compliance}</p>
              </div>
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-6">
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Minimum Font Size</p>
                <p className="text-sm text-gray-300">{kit.accessibility.font_size_minimum}</p>
              </div>
            </div>
          </section>
        )}

        {/* ── Logo concept notes (text-only fallback when no SVG concepts) ─── */}
        {!kit?.logo_svg_concepts?.length && kit?.logo_concepts && kit.logo_concepts.length > 0 && (
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
