'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { BrandKitData } from '@/app/api/generate/route'
import type { LogoSvgConcept } from '@/lib/logo-concepts-openai'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Asset {
  id: string
  brandName: string
  assetType: string
  logoSvg: string | null
  wordmarkSvg: string | null
  createdAt: string
  brandKitData: (BrandKitData & { logo_svg_concepts?: LogoSvgConcept[] }) | null
}

type Variant = 'bold' | 'minimal' | 'editorial' | 'friendly'

// ─── Helpers ───────────────────────────────────────────────────────────────────

function isLight(hex: string): boolean {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}

/**
 * Scores brand signals against 4 visual style systems.
 * Returns the winning variant. Falls back to 'minimal'.
 */
function detectVariant(kit: BrandKitData | null): Variant {
  const signals = [
    ...(kit?.brand_strategy?.brand_personality ?? []),
    kit?.brand_strategy?.tone_of_voice ?? '',
    kit?.brand_voice?.tone ?? '',
    kit?.typography?.font_pairing_id ?? '',
    kit?.brand_strategy?.positioning ?? '',
  ].join(' ').toLowerCase()

  const scores: Record<Variant, number> = { bold: 0, minimal: 0, editorial: 0, friendly: 0 }

  const map: [Variant, string[]][] = [
    ['bold', [
      'bold', 'powerful', 'energetic', 'dynamic', 'intense', 'fierce', 'strong',
      'athletic', 'sport', 'fitness', 'performance', 'driven', 'aggressive', 'edgy',
      'high-impact', 'relentless', 'competitive', 'raw', 'hustle',
    ]],
    ['editorial', [
      'elegant', 'luxury', 'premium', 'sophisticated', 'refined', 'artisan',
      'curated', 'exclusive', 'heritage', 'timeless', 'haute', 'bespoke',
      'editorial', 'artisanal', 'culinary', 'gourmet', 'fine dining', 'restaurant',
      'wine', 'boutique', 'craft', 'couture', 'minimalist',
    ]],
    ['friendly', [
      'friendly', 'warm', 'approachable', 'playful', 'fun', 'cheerful',
      'community', 'casual', 'inclusive', 'welcoming', 'wholesome', 'handmade',
      'local', 'family', 'kids', 'pet', 'natural', 'organic', 'cozy',
    ]],
    ['minimal', [
      'modern', 'tech', 'innovative', 'efficient', 'clean', 'professional',
      'startup', 'digital', 'platform', 'software', 'precise', 'analytical',
      'data', 'saas', 'minimal', 'streamlined', 'scalable',
    ]],
  ]

  map.forEach(([v, words]) => {
    words.forEach(w => { if (signals.includes(w)) scores[v]++ })
  })

  // Font pairing id is a strong signal
  const pairing = kit?.typography?.font_pairing_id ?? ''
  if (/editorial|serif|elegant|luxury|classic/.test(pairing)) scores.editorial += 3
  if (/bold|display|sport|impact|heavy/.test(pairing)) scores.bold += 3
  if (/friendly|round|warm|fun|playful/.test(pairing)) scores.friendly += 3
  if (/modern|tech|minimal|clean|mono/.test(pairing)) scores.minimal += 3

  const [best] = Object.entries(scores).sort((a, b) => b[1] - a[1])
  return best[1] > 0 ? (best[0] as Variant) : 'minimal'
}

function shapeRadius(shape: string, size: number): string {
  if (shape === 'circle') return '50%'
  if (shape === 'hexagon') return '0'
  return `${Math.round(size * 0.2)}px`
}

function shapeClipPath(shape: string): string | undefined {
  return shape === 'hexagon'
    ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
    : undefined
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="text-[10px] text-gray-600 hover:text-white transition-colors font-mono tabular-nums shrink-0"
    >
      {copied ? '✓' : (label ?? 'copy')}
    </button>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function BrandKitPage() {
  const { id } = useParams<{ id: string }>()
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/brand-kit/${id}`)
      .then(r => { if (!r.ok) throw new Error('Brand kit not found'); return r.json() })
      .then((d: Asset) => setAsset(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
        <p className="text-gray-600 animate-pulse text-[10px] tracking-[0.3em] uppercase">
          Building your brand…
        </p>
      </div>
    )
  }
  if (error || !asset) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0A0A0F]">
        <p className="text-red-400 text-sm">{error ?? 'Not found.'}</p>
        <Link href="/" className="text-gray-500 hover:text-white text-sm transition-colors">← Back</Link>
      </div>
    )
  }

  // ── Brand data ────────────────────────────────────────────────────────────
  const kit      = asset.brandKitData
  const variant  = detectVariant(kit)
  const heading  = kit?.typography?.heading_font
  const body     = kit?.typography?.body_font
  const primary  = kit?.color_palette?.primary?.hex    ?? '#4F46E5'
  const accent   = kit?.color_palette?.accent?.hex     ?? '#6366F1'
  const bgColor  = kit?.color_palette?.background?.hex ?? '#F8FAFC'
  const textColor = kit?.color_palette?.text?.hex      ?? '#0F172A'
  const colors   = kit?.color_palette ? Object.entries(kit.color_palette) : []

  const personality = (kit?.brand_strategy?.brand_personality ?? []).join(' ').toLowerCase()
  const isFriendly  = personality.includes('friendly') || personality.includes('warm')
  const isTech      = personality.includes('modern')   || personality.includes('tech')

  const monoData   = kit?.logo_monogram
  const monoLetter = monoData?.letter ?? asset.brandName.charAt(0).toUpperCase()
  const monoShape  = (() => {
    // Editorial and friendly always use circle; bold prefers square
    if (variant === 'editorial' || variant === 'friendly') return 'circle'
    if (variant === 'bold') return (monoData?.shape === 'circle' ? 'rounded-square' : (monoData?.shape ?? 'rounded-square'))
    return monoData?.shape ?? (isFriendly ? 'circle' : isTech ? 'hexagon' : 'rounded-square')
  })()

  // Font helpers
  const HS = heading ? { fontFamily: `'${heading}', serif` } : {}
  const BS = body    ? { fontFamily: `'${body}', sans-serif` } : {}

  // Color derivations
  const onPrimary = isLight(primary) ? textColor : '#FFFFFF'
  const onAccent  = isLight(accent)  ? textColor : '#FFFFFF'
  const bgLight   = isLight(bgColor)

  // ── Variant design tokens ─────────────────────────────────────────────────
  // Each variant gets its own coherent set of design decisions.
  // These cascade through ALL sections for visual consistency.
  const V = (() => {
    switch (variant) {
      case 'bold': return {
        nameWeight:    900,
        nameTracking:  '-0.02em',
        nameLineHeight:'0.85',
        nameTransform: 'uppercase' as const,
        cardRadius:    '10px',
        cardBorder:    'rgba(255,255,255,0.11)',
        cardBg:        '#111118',
        ctaRadius:     '3px',
        taglineTransform: 'uppercase' as const,
        taglineTracking:  '0.2em',
        personalityRadius: '4px',
      }
      case 'editorial': return {
        nameWeight:    300,
        nameTracking:  '0.015em',
        nameLineHeight:'1',
        nameTransform: 'none' as const,
        cardRadius:    '16px',
        cardBorder:    'rgba(255,255,255,0.06)',
        cardBg:        '#0F0F14',
        ctaRadius:     '0px',
        taglineTransform: 'uppercase' as const,
        taglineTracking:  '0.35em',
        personalityRadius: '2px',
      }
      case 'friendly': return {
        nameWeight:    800,
        nameTracking:  '-0.01em',
        nameLineHeight:'1',
        nameTransform: 'none' as const,
        cardRadius:    '28px',
        cardBorder:    'rgba(255,255,255,0.08)',
        cardBg:        'rgba(15,23,42,0.45)',
        ctaRadius:     '14px',
        taglineTransform: 'none' as const,
        taglineTracking:  'normal',
        personalityRadius: '999px',
      }
      default: return { // minimal
        nameWeight:    700,
        nameTracking:  '-0.025em',
        nameLineHeight:'1',
        nameTransform: 'none' as const,
        cardRadius:    '24px',
        cardBorder:    'rgba(255,255,255,0.07)',
        cardBg:        'rgba(15,23,42,0.5)',
        ctaRadius:     '999px',
        taglineTransform: 'none' as const,
        taglineTracking:  'normal',
        personalityRadius: '6px',
      }
    }
  })()

  // Google Fonts — load 300 weight for editorial
  const googleFontsUrl = [heading, body].filter(Boolean).length
    ? `https://fonts.googleapis.com/css2?${[
        heading && `family=${encodeURIComponent(heading)}:wght@300;400;600;700;900`,
        body    && `family=${encodeURIComponent(body)}:wght@400;500;600`,
      ].filter(Boolean).join('&')}&display=swap`
    : null

  // ── Inner components (closures over brand data) ───────────────────────────

  function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 mb-8">
        {children}
      </p>
    )
  }

  interface MonoMarkProps {
    size: number
    bg: string
    fg: string
    outline?: boolean
    label: string
    shape?: string
    shadow?: string
  }
  function MonoMark({ size, bg, fg, outline = false, label, shape, shadow }: MonoMarkProps) {
    const s = shape ?? monoShape
    return (
      <div className="flex flex-col items-center gap-3">
        <div
          className="flex items-center justify-center select-none font-bold"
          style={{
            width: size,
            height: size,
            backgroundColor: outline ? 'transparent' : bg,
            border: outline ? `2px solid ${bg}` : undefined,
            color: outline ? bg : fg,
            fontSize: Math.round(size * 0.46),
            borderRadius: shapeRadius(s, size),
            clipPath: shapeClipPath(s),
            letterSpacing: '-0.02em',
            fontWeight: variant === 'bold' ? 900 : 700,
            boxShadow: shadow,
            ...HS,
          }}
        >
          {monoLetter}
        </div>
        <p className="text-xs text-zinc-500">{label}</p>
      </div>
    )
  }

  // ── Page ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {googleFontsUrl && <link href={googleFontsUrl} rel="stylesheet" />}

      {/* Nav */}
      <nav className="px-6 py-5 flex items-center justify-between border-b border-white/[0.04]">
        <Link href="/" className="text-[11px] text-gray-600 hover:text-white transition-colors tracking-wide">
          ← SnapBrand
        </Link>
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="text-[10px] text-gray-600 hover:text-white transition-colors border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-lg"
        >
          Share
        </button>
      </nav>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 1 · HERO
          4 genuinely different layouts — not just styled the same thing
      ════════════════════════════════════════════════════════════════════ */}

      {/* ── BOLD hero ─────────────────────────────────────────────────────
          Left-aligned. Massive uppercase name. Kinetic energy.
          Accent bar on left edge. Sharp. No centered softness.
      ─────────────────────────────────────────────────────────────────── */}
      {variant === 'bold' && (
        <section className="relative overflow-hidden" style={{ backgroundColor: primary }}>
          {/* Noise texture */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }} />
          {/* Left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-[5px]" style={{ backgroundColor: accent }} />

          <div className="pl-12 pr-8 md:pl-16 md:pr-12 py-24 md:py-32">
            <p className="text-[10px] font-black uppercase tracking-[0.45em] mb-10"
              style={{ color: onPrimary, opacity: 0.35 }}>
              Performance Identity
            </p>
            <h1
              className="font-black break-words"
              style={{
                ...HS,
                fontSize: 'clamp(4rem, 16vw, 12rem)',
                color: onPrimary,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                lineHeight: '0.84',
              }}
            >
              {asset.brandName}
            </h1>
            {/* Rule */}
            <div className="my-8 w-20 h-0.5" style={{ backgroundColor: onPrimary, opacity: 0.2 }} />
            {kit?.tagline_options?.[0] && (
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-10 max-w-lg"
                style={{ ...BS, color: onPrimary, opacity: 0.55 }}>
                {kit.tagline_options[0]}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className="px-8 py-3 text-[11px] font-black uppercase tracking-widest"
                style={{ backgroundColor: accent, color: onAccent, borderRadius: '3px' }}>
                Get Started
              </button>
              <button type="button"
                className="px-8 py-3 text-[11px] font-bold uppercase tracking-widest border-2"
                style={{ borderColor: onPrimary, color: onPrimary, backgroundColor: 'transparent', opacity: 0.55, borderRadius: '3px' }}>
                Learn More
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── EDITORIAL hero ────────────────────────────────────────────────
          Split panel: left = primary color slab with faded monogram.
          Right = dark, large light-weight name, text CTA.
          Feels like a luxury brand identity reveal. Nothing centered.
      ─────────────────────────────────────────────────────────────────── */}
      {variant === 'editorial' && (
        <section className="relative flex" style={{ minHeight: 580 }}>
          {/* Left slab — hidden on mobile */}
          <div
            className="hidden md:flex w-[32%] shrink-0 relative overflow-hidden items-center justify-center"
            style={{ backgroundColor: primary }}
          >
            {/* Faded monogram watermark — decorative */}
            <div
              className="absolute pointer-events-none select-none font-bold"
              style={{
                fontSize: '18rem',
                color: isLight(primary) ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                lineHeight: 1,
                ...HS,
              }}
            >
              {monoLetter}
            </div>
            <div className="absolute bottom-10 left-10">
              <p className="text-[9px] uppercase tracking-[0.45em]"
                style={{ color: isLight(primary) ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.28)' }}>
                Identity System
              </p>
            </div>
          </div>

          {/* Thin vertical divider */}
          <div className="hidden md:block absolute left-[32%] top-0 bottom-0 w-px"
            style={{ backgroundColor: `${primary}38` }} />

          {/* Right panel — dark, large type */}
          <div className="flex-1 flex flex-col justify-between px-10 md:px-16 py-16 md:py-20 bg-[#0A0A0F]">
            <div className="flex items-center gap-3">
              <div className="w-5 h-px shrink-0" style={{ backgroundColor: primary }} />
              <p className="text-[9px] uppercase tracking-[0.4em] text-gray-600">Brand Identity</p>
            </div>

            <div className="py-12">
              <h1
                className="break-words leading-none"
                style={{
                  ...HS,
                  fontSize: 'clamp(3rem, 9vw, 7.5rem)',
                  color: '#FFFFFF',
                  fontWeight: 300,
                  letterSpacing: '0.015em',
                }}
              >
                {asset.brandName}
              </h1>
              {kit?.tagline_options?.[0] && (
                <p className="mt-7 text-[10px] uppercase tracking-[0.42em]"
                  style={{ color: primary, ...BS }}>
                  {kit.tagline_options[0]}
                </p>
              )}
            </div>

            <div className="flex items-center gap-8">
              <button type="button"
                className="text-sm font-medium flex items-center gap-2 hover:opacity-60 transition-opacity"
                style={{ color: '#FFFFFF', ...BS }}>
                Get Started <span style={{ color: primary }}>→</span>
              </button>
              <button type="button"
                className="text-sm text-gray-600 hover:text-white transition-colors" style={BS}>
                Our Story
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── MINIMAL hero ──────────────────────────────────────────────────
          Dark background with radial glow from primary. Centered.
          Clean, precise. Pill CTAs. No noise, no decoration.
      ─────────────────────────────────────────────────────────────────── */}
      {variant === 'minimal' && (
        <section className="relative overflow-hidden bg-[#0A0A0F]">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 70% 55% at 50% 100%, ${primary}16 0%, transparent 70%)` }} />
          <div className="relative max-w-4xl mx-auto px-8 py-36 md:py-48 text-center">
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primary }} />
              <p className="text-[10px] uppercase tracking-[0.35em] text-gray-600">Brand Identity System</p>
            </div>
            <h1
              className="font-bold break-words leading-none mb-6"
              style={{
                ...HS,
                fontSize: 'clamp(3rem, 12vw, 8.5rem)',
                color: '#FFFFFF',
                letterSpacing: '-0.025em',
              }}
            >
              {asset.brandName}
            </h1>
            {kit?.tagline_options?.[0] && (
              <p className="text-xl mb-12 max-w-md mx-auto text-gray-400" style={BS}>
                {kit.tagline_options[0]}
              </p>
            )}
            <div className="flex items-center justify-center flex-wrap gap-3">
              <button type="button" className="px-8 py-3 text-sm font-semibold"
                style={{ backgroundColor: primary, color: onPrimary, borderRadius: '999px' }}>
                Get Started
              </button>
              <button type="button"
                className="px-8 py-3 text-sm font-medium text-gray-400 border hover:text-white transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.14)', borderRadius: '999px', backgroundColor: 'transparent' }}>
                Learn More
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── FRIENDLY hero ─────────────────────────────────────────────────
          Diagonal gradient primary → accent. Warm, centered, approachable.
          Decorative soft circles. White CTA button for contrast.
      ─────────────────────────────────────────────────────────────────── */}
      {variant === 'friendly' && (
        <section className="relative overflow-hidden" style={{ minHeight: 520 }}>
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(145deg, ${primary} 0%, ${accent} 100%)` }} />
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full pointer-events-none"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
          <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full pointer-events-none"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
          <div className="absolute top-[40%] right-[15%] w-28 h-28 rounded-full pointer-events-none"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />

          <div className="relative max-w-4xl mx-auto px-8 py-28 md:py-36 text-center">
            <h1
              className="font-extrabold break-words leading-none mb-5"
              style={{
                ...HS,
                fontSize: 'clamp(3rem, 11vw, 7.5rem)',
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
              }}
            >
              {asset.brandName}
            </h1>
            {kit?.tagline_options?.[0] && (
              <p className="text-xl md:text-2xl mb-10 max-w-lg mx-auto"
                style={{ ...BS, color: 'rgba(255,255,255,0.82)' }}>
                {kit.tagline_options[0]}
              </p>
            )}
            <div className="flex items-center justify-center flex-wrap gap-3">
              <button type="button" className="px-8 py-3.5 text-sm font-bold shadow-lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: textColor, borderRadius: '14px' }}>
                Get Started
              </button>
              <button type="button"
                className="px-8 py-3.5 text-sm font-semibold border-2"
                style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#FFFFFF', backgroundColor: 'transparent', borderRadius: '14px' }}>
                Learn More
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 2 · WORDMARK
          Composition and alignment varies per variant.
      ════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 pt-16 md:pt-20 pb-16 md:pb-20">
        <SectionLabel>Wordmark</SectionLabel>

        {/* BOLD — full-width stacked, uppercase, heavy */}
        {variant === 'bold' && (
          <div className="space-y-3">
            {[
              { bg: bgColor, nameColor: textColor, label: 'Light background' },
              { bg: '#0F0F0F', nameColor: '#FFFFFF', label: 'Dark background' },
            ].map(({ bg, nameColor, label }) => (
              <div key={label} className="relative overflow-hidden"
                style={{ backgroundColor: bg, borderRadius: '10px', padding: '52px 44px 44px' }}>
                {/* Faint monogram in corner */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none font-black opacity-[0.045]"
                  style={{ fontSize: '7rem', color: nameColor, textTransform: 'uppercase', lineHeight: 1, ...HS }}>
                  {monoLetter}
                </div>
                <h2 className="relative break-words"
                  style={{
                    ...HS,
                    fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                    color: nameColor,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    lineHeight: '0.88',
                    fontWeight: 900,
                  }}>
                  {asset.brandName}
                </h2>
                {kit?.tagline_options?.[0] && (
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.22em] opacity-35"
                    style={{ color: nameColor, ...BS }}>
                    {kit.tagline_options[0]}
                  </p>
                )}
                <p className="mt-8 text-[9px] uppercase tracking-widest opacity-20" style={{ color: nameColor }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* EDITORIAL — stacked, light weight, with rule lines */}
        {variant === 'editorial' && (
          <div className="space-y-4">
            {[
              { bg: bgColor, nameColor: textColor, label: 'Light background' },
              { bg: '#0C0C10', nameColor: '#F5F5F0', label: 'Dark background' },
            ].map(({ bg, nameColor, label }) => (
              <div key={label}
                style={{ backgroundColor: bg, borderRadius: '16px', padding: '60px 52px 52px' }}>
                {/* Small primary rule — editorial accent */}
                <div className="mb-10 w-10 h-px" style={{ backgroundColor: primary }} />
                <h2 className="break-words"
                  style={{
                    ...HS,
                    fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
                    color: nameColor,
                    fontWeight: 300,
                    letterSpacing: '0.015em',
                    lineHeight: '1',
                  }}>
                  {asset.brandName}
                </h2>
                {/* Full-width rule below name */}
                <div className="mt-8 h-px w-full opacity-12" style={{ backgroundColor: nameColor }} />
                {kit?.tagline_options?.[0] && (
                  <p className="mt-4 text-[10px] uppercase tracking-[0.38em]"
                    style={{ color: nameColor, opacity: 0.38, ...BS }}>
                    {kit.tagline_options[0]}
                  </p>
                )}
                <p className="mt-6 text-[9px] uppercase tracking-widest opacity-18" style={{ color: nameColor }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* MINIMAL + FRIENDLY — side-by-side panels */}
        {(variant === 'minimal' || variant === 'friendly') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { bg: bgColor, nameColor: textColor, label: 'Light background' },
              { bg: '#0F0F14', nameColor: '#F0F0F0', label: 'Dark background' },
            ].map(({ bg, nameColor, label }) => (
              <div key={label}
                className="flex flex-col justify-between"
                style={{
                  backgroundColor: bg,
                  borderRadius: V.cardRadius,
                  padding: variant === 'friendly' ? '48px 44px' : '56px 52px',
                  minHeight: '280px',
                }}
              >
                <h2 className="break-words"
                  style={{
                    ...HS,
                    fontSize: 'clamp(2rem, 5.5vw, 3.8rem)',
                    color: nameColor,
                    fontWeight: V.nameWeight,
                    letterSpacing: V.nameTracking,
                    lineHeight: '1.05',
                  }}>
                  {asset.brandName}
                </h2>
                {kit?.tagline_options?.[0] && (
                  <p className="mt-3 text-sm break-words"
                    style={{ color: nameColor, opacity: 0.45, ...BS }}>
                    {kit.tagline_options[0]}
                  </p>
                )}
                <p className="mt-8 text-[9px] uppercase tracking-widest opacity-22" style={{ color: nameColor }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 3 · MONOGRAM MARK
          Variant-specific treatment: bold=sharp+heavy, editorial=outline,
          minimal=clean+geometric, friendly=circle+warm shadow
      ════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20 border-t border-white/[0.05]">
        <SectionLabel>Monogram mark</SectionLabel>

        <div className="flex flex-wrap items-end gap-10 md:gap-14">
          {variant === 'bold' && <>
            <MonoMark size={180} bg={primary} fg={onPrimary} label="Primary mark"
              shadow="0 12px 40px rgba(0,0,0,0.5)" />
            <MonoMark size={96} bg={accent} fg={onAccent} label="Accent color"
              shadow="0 8px 24px rgba(0,0,0,0.4)" />
            <MonoMark size={96} bg="#FFFFFF" fg={primary} label="On white" />
          </>}

          {variant === 'editorial' && <>
            <MonoMark size={160} bg={primary} fg={onPrimary} label="Primary mark" shape="circle" />
            <MonoMark size={96} bg={primary} fg={onPrimary} outline label="Outline mark" shape="circle" />
            <MonoMark size={96} bg={textColor} fg={bgColor} label="Dark variant" shape="circle" />
          </>}

          {variant === 'minimal' && <>
            <MonoMark size={160} bg={primary} fg={onPrimary} label="Primary mark"
              shadow="0 8px 32px rgba(0,0,0,0.35)" />
            <MonoMark size={96} bg={primary} fg={onPrimary} label="App icon" />
            <MonoMark size={96} bg={textColor} fg={bgColor} label="Dark variant" />
          </>}

          {variant === 'friendly' && <>
            <MonoMark size={160} bg={primary} fg={onPrimary} label="Primary mark" shape="circle"
              shadow={`0 16px 48px ${primary}55`} />
            <MonoMark size={96} bg={accent} fg={onAccent} label="Accent" shape="circle"
              shadow={`0 8px 24px ${accent}44`} />
            <MonoMark size={96} bg="#FFFFFF" fg={primary} label="On white" shape="circle" />
          </>}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 4 · REAL-WORLD MOCKUPS
          3 large cards. Each mockup adapts to the active variant.
      ════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 border-t border-white/[0.05]">
        <SectionLabel>Application preview</SectionLabel>

        <div className="flex flex-col gap-10 md:gap-12">

          {/* ── Website hero mockup (full width, largest) ── */}
          <div style={{ borderRadius: V.cardRadius, border: `1px solid ${V.cardBorder}`, backgroundColor: V.cardBg, overflow: 'hidden' }}>
            <div style={{ backgroundColor: bgColor, minHeight: 340, overflow: 'hidden' }}>
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-2.5"
                style={{ borderBottom: `1px solid ${bgLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.07)'}` }}>
                <div className="w-2 h-2 rounded-full bg-red-400/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
                <div className="w-2 h-2 rounded-full bg-green-400/60" />
                <div className="flex-1 mx-2 h-3.5 rounded px-2 flex items-center"
                  style={{ backgroundColor: bgLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)' }}>
                  <span className="text-[8px] opacity-35" style={{ color: textColor }}>
                    {asset.brandName.toLowerCase().replace(/\s+/g, '')}.com
                  </span>
                </div>
              </div>

              {/* Navbar — variant-styled */}
              <div className="flex items-center justify-between px-4 py-2.5"
                style={{ borderBottom: `1px solid ${textColor}10` }}>
                <span className="font-bold text-xs truncate max-w-[200px]"
                  style={{
                    ...HS, color: textColor,
                    textTransform: variant === 'bold' ? 'uppercase' : 'none',
                    letterSpacing: variant === 'bold' ? '0.06em' : 'normal',
                    fontWeight: variant === 'bold' ? 900 : 600,
                  }}>
                  {asset.brandName}
                </span>
                <div className="flex gap-3">
                  {(variant === 'editorial' ? ['Work', 'About', 'Reserve'] : ['Product', 'Pricing', 'About'])
                    .map(l => (
                      <span key={l} className="text-[10px] opacity-35" style={{ color: textColor }}>{l}</span>
                    ))}
                </div>
              </div>

              {/* Hero body — different per variant */}
              {variant === 'bold' && (
                <div className="flex" style={{ minHeight: 168 }}>
                  <div className="w-2 shrink-0" style={{ backgroundColor: accent }} />
                  <div className="flex-1 px-5 py-6 flex flex-col justify-between">
                    <p className="font-black leading-tight break-words uppercase"
                      style={{ ...HS, fontSize: 17, color: textColor, letterSpacing: '-0.01em' }}>
                      {kit?.tagline_options?.[0] ?? asset.brandName}
                    </p>
                    <div className="mt-4">
                      <span className="inline-block px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white"
                        style={{ backgroundColor: primary, borderRadius: '3px' }}>
                        Get Started
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {variant === 'editorial' && (
                <div className="px-5 py-6">
                  <div className="h-px w-6 mb-4" style={{ backgroundColor: primary }} />
                  <p className="leading-snug mb-2 break-words"
                    style={{ ...HS, fontSize: 14, fontWeight: 300, color: textColor, letterSpacing: '0.01em' }}>
                    {kit?.tagline_options?.[0] ?? asset.brandName}
                  </p>
                  <p className="text-[8px] mb-4 opacity-38 leading-relaxed" style={{ ...BS, color: textColor }}>
                    Crafted with intention. Built to endure.
                  </p>
                  <span className="text-[9px] font-medium" style={{ color: primary, ...BS }}>
                    Explore →
                  </span>
                </div>
              )}

              {variant === 'minimal' && (
                <div className="px-5 py-6 text-center">
                  <p className="font-bold leading-tight mb-2 break-words"
                    style={{ ...HS, fontSize: 14, color: textColor, letterSpacing: '-0.02em' }}>
                    {kit?.tagline_options?.[0] ?? asset.brandName}
                  </p>
                  <p className="text-[8px] mb-4 opacity-38 leading-relaxed" style={{ ...BS, color: textColor }}>
                    Built for teams moving fast.
                  </p>
                  <span className="inline-block px-4 py-1.5 text-[9px] font-semibold text-white"
                    style={{ backgroundColor: primary, borderRadius: '999px' }}>
                    Get Started
                  </span>
                </div>
              )}

              {variant === 'friendly' && (
                <div className="px-5 py-6">
                  <p className="font-bold leading-tight mb-2 break-words"
                    style={{ ...HS, fontSize: 14, color: textColor, letterSpacing: '-0.01em', fontWeight: 800 }}>
                    {kit?.tagline_options?.[0] ?? asset.brandName}
                  </p>
                  <p className="text-[8px] mb-4 opacity-38 leading-relaxed" style={{ ...BS, color: textColor }}>
                    Something warm and genuinely helpful.
                  </p>
                  <span className="inline-block px-4 py-1.5 text-[9px] font-bold text-white"
                    style={{ backgroundColor: primary, borderRadius: '12px' }}>
                    Get Started
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-zinc-500 px-5 py-3 border-t border-white/[0.06]">Website hero</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* ── Social profile mockup ── */}
          <div style={{ borderRadius: V.cardRadius, border: `1px solid ${V.cardBorder}`, backgroundColor: V.cardBg, overflow: 'hidden' }}>
            <div className="flex flex-col items-center p-8" style={{ minHeight: 300, backgroundColor: V.cardBg }}>
              {/* Avatar */}
              <div className="flex items-center justify-center font-bold text-white mb-4 select-none"
                style={{
                  width: 96, height: 96,
                  backgroundColor: primary,
                  fontSize: 42,
                  fontWeight: variant === 'bold' ? 900 : 700,
                  borderRadius: shapeRadius(monoShape, 96),
                  clipPath: shapeClipPath(monoShape),
                  boxShadow: variant === 'friendly' ? `0 8px 28px ${primary}44` : undefined,
                  ...HS,
                }}>
                {monoLetter}
              </div>
              <p className="font-bold text-base text-white mb-1 text-center truncate max-w-[220px]"
                style={{ ...HS, textTransform: variant === 'bold' ? 'uppercase' : 'none', letterSpacing: variant === 'bold' ? '0.05em' : 'normal' }}>
                {asset.brandName}
              </p>
              {kit?.tagline_options?.[0] && (
                <p className="text-xs text-zinc-500 text-center mb-5 line-clamp-2 max-w-[220px]" style={BS}>
                  {kit.tagline_options[0]}
                </p>
              )}
              <button type="button" className="px-6 py-2 text-xs font-bold text-white"
                style={{ backgroundColor: primary, borderRadius: V.ctaRadius }}>
                Follow
              </button>
              <div className="flex gap-8 mt-6 pt-5 w-full justify-center"
                style={{ borderTop: `1px solid ${V.cardBorder}` }}>
                {[['2.4k', 'Posts'], ['18k', 'Followers'], ['340', 'Following']].map(([n, l]) => (
                  <div key={l} className="text-center">
                    <p className="text-sm font-bold text-white">{n}</p>
                    <p className="text-[10px] text-zinc-600">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-zinc-500 px-5 py-3 border-t border-white/[0.06]">Social profile</p>
          </div>

          {/* ── Business card mockup ── */}
          <div style={{ borderRadius: V.cardRadius, border: `1px solid ${V.cardBorder}`, backgroundColor: V.cardBg, overflow: 'hidden' }}>
            <div className="flex items-center justify-center p-8" style={{ minHeight: 300 }}>
              <div className="w-full shadow-2xl overflow-hidden"
                style={{
                  backgroundColor: bgColor,
                  borderRadius: variant === 'bold' ? '6px' : variant === 'editorial' ? '6px' : '14px',
                  aspectRatio: '1.75/1',
                  maxWidth: 340,
                }}>
                <div className="h-full flex flex-col justify-between p-5">
                  {/* Card header */}
                  <div className="flex items-center gap-2">
                    {variant === 'editorial' && (
                      <div className="w-1 self-stretch" style={{ backgroundColor: primary }} />
                    )}
                    <div className="flex-shrink-0 flex items-center justify-center font-bold text-white select-none"
                      style={{
                        width: 32, height: 32,
                        backgroundColor: primary,
                        fontSize: 13,
                        fontWeight: 700,
                        borderRadius: shapeRadius(monoShape, 32),
                        clipPath: shapeClipPath(monoShape),
                        ...HS,
                      }}>
                      {monoLetter}
                    </div>
                    <span className="font-bold text-xs truncate max-w-[160px]"
                      style={{
                        ...HS, color: textColor,
                        textTransform: variant === 'bold' ? 'uppercase' : 'none',
                        letterSpacing: variant === 'bold' ? '0.06em' : 'normal',
                        fontWeight: variant === 'bold' ? 900 : 600,
                      }}>
                      {asset.brandName}
                    </span>
                  </div>
                  {/* Contact info */}
                  <div>
                    <p className="font-semibold text-[11px] mb-0.5" style={{ ...HS, color: textColor }}>
                      Alex Johnson
                    </p>
                    <p className="text-[9px] mb-2 opacity-42" style={{ ...BS, color: textColor }}>
                      {variant === 'editorial' ? 'Creative Director' : variant === 'bold' ? 'Head Coach' : 'Founder & CEO'}
                    </p>
                    <p className="text-[8px] opacity-32" style={{ ...BS, color: textColor }}>
                      hello@{asset.brandName.toLowerCase().replace(/\s+/g, '')}.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-zinc-500 px-5 py-3 border-t border-white/[0.06]">Business card</p>
          </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 5 · BRAND ESSENTIALS
          Colors · Typography · Taglines — compact 3-col grid
      ════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20 border-t border-white/[0.05]">
        <SectionLabel>Brand essentials</SectionLabel>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Colors */}
          {colors.length > 0 && (
            <div style={{ borderRadius: V.cardRadius, border: `1px solid ${V.cardBorder}`, backgroundColor: V.cardBg, padding: '24px' }}>
              <p className="text-xs font-medium text-zinc-500 mb-5">Colors</p>
              <div className="space-y-3">
                {colors.map(([role, color]) => (
                  <div key={role} className="flex items-center gap-3">
                    <div className="shrink-0 border border-white/10"
                      style={{
                        width: 38, height: 38,
                        backgroundColor: color.hex,
                        borderRadius: variant === 'bold' ? '5px' : variant === 'friendly' ? '12px' : '8px',
                      }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white capitalize truncate">{role}</p>
                      <p className="text-[10px] text-gray-600 truncate">{color.name}</p>
                    </div>
                    <CopyButton text={color.hex} label={color.hex} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Typography */}
          {kit?.typography && (
            <div style={{ borderRadius: V.cardRadius, border: `1px solid ${V.cardBorder}`, backgroundColor: V.cardBg, padding: '24px' }}>
              <p className="text-xs font-medium text-zinc-500 mb-5">Typography</p>
              <div className="space-y-5">
                <div>
                  <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-2">Heading</p>
                  <p className="text-5xl leading-none text-white" style={{ ...HS, fontWeight: V.nameWeight }}>Aa</p>
                  <p className="text-xs text-gray-400 mt-2 break-words" style={HS}>{heading ?? 'System UI'}</p>
                  <p className="text-[10px] text-gray-700 mt-1" style={HS}>ABCDEFG abcdefg 01234</p>
                </div>
                <div style={{ borderTop: `1px solid ${V.cardBorder}`, paddingTop: '20px' }}>
                  <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-2">Body</p>
                  <p className="text-4xl leading-none text-white" style={BS}>Aa</p>
                  <p className="text-xs text-gray-400 mt-2 break-words" style={BS}>{body ?? 'System UI'}</p>
                  <p className="text-[10px] text-gray-700 mt-1 leading-relaxed" style={BS}>The quick brown fox</p>
                </div>
              </div>
            </div>
          )}

          {/* Taglines */}
          {(kit?.tagline_options?.length ?? 0) > 0 && (
            <div style={{ borderRadius: V.cardRadius, border: `1px solid ${V.cardBorder}`, backgroundColor: V.cardBg, padding: '24px' }}>
              <p className="text-xs font-medium text-zinc-500 mb-5">Taglines</p>
              <div className="space-y-3">
                {kit!.tagline_options.slice(0, 3).map((t, i) => (
                  <button key={i}
                    onClick={() => navigator.clipboard.writeText(t)}
                    className="w-full text-left group"
                    style={{
                      padding: '12px',
                      borderRadius: variant === 'bold' ? '5px' : variant === 'friendly' ? '14px' : '10px',
                      border: `1px solid ${V.cardBorder}`,
                      backgroundColor: 'transparent',
                      transition: 'border-color 0.15s',
                    }}>
                    <p className="text-sm text-white leading-snug" style={HS}>{t}</p>
                    <p className="text-[9px] text-gray-700 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to copy
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 6 · BRAND STRATEGY & VOICE — collapsed, below fold
      ════════════════════════════════════════════════════════════════════ */}
      {(kit?.brand_strategy || kit?.brand_voice) && (
        <section className="max-w-5xl mx-auto px-6 py-10"
          style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none select-none py-3 rounded-lg hover:bg-white/[0.03] px-1 -mx-1 transition-colors">
              <p className="text-sm font-medium text-zinc-400">
                Strategy, voice &amp; directions
              </p>
              <span className="text-zinc-500 text-sm transition-transform group-open:rotate-180">↓</span>
            </summary>

            <div className="mt-8 space-y-10">

              {kit?.brand_strategy && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-700 mb-5">Strategy</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Positioning',     val: kit.brand_strategy.positioning },
                      { label: 'Target Audience',  val: kit.brand_strategy.target_audience },
                      { label: 'Unique Value',     val: kit.brand_strategy.unique_value_prop },
                      { label: 'Tone of Voice',    val: kit.brand_strategy.tone_of_voice },
                    ].filter(x => x.val).map(({ label, val }) => (
                      <div key={label} style={{ backgroundColor: V.cardBg, border: `1px solid ${V.cardBorder}`, borderRadius: V.cardRadius, padding: '20px' }}>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mb-2">{label}</p>
                        <p className="text-gray-400 text-sm leading-relaxed">{val}</p>
                      </div>
                    ))}
                    {(kit.brand_strategy.brand_personality?.length ?? 0) > 0 && (
                      <div className="sm:col-span-2"
                        style={{ backgroundColor: V.cardBg, border: `1px solid ${V.cardBorder}`, borderRadius: V.cardRadius, padding: '20px' }}>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mb-3">Personality</p>
                        <div className="flex flex-wrap gap-2">
                          {kit.brand_strategy.brand_personality.map(t => (
                            <span key={t} className="px-3 py-1 text-xs font-medium"
                              style={{
                                backgroundColor: `${primary}14`,
                                color: primary,
                                border: `1px solid ${primary}32`,
                                borderRadius: V.personalityRadius,
                              }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {kit?.brand_voice && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-700 mb-5">Voice</p>
                  <div style={{ backgroundColor: V.cardBg, border: `1px solid ${V.cardBorder}`, borderRadius: V.cardRadius, padding: '24px' }}
                    className="space-y-5">
                    {kit.brand_voice.tone && (
                      <div>
                        <p className="text-[10px] text-gray-600 font-bold uppercase mb-1">Tone</p>
                        <p className="text-white font-medium text-sm">{kit.brand_voice.tone}</p>
                      </div>
                    )}
                    {kit.brand_voice.personality && (
                      <div>
                        <p className="text-[10px] text-gray-600 font-bold uppercase mb-1">Personality</p>
                        <p className="text-gray-400 text-sm leading-relaxed" style={BS}>{kit.brand_voice.personality}</p>
                      </div>
                    )}
                    {kit.brand_voice.tone_examples && (
                      <div>
                        <p className="text-[10px] text-gray-600 font-bold uppercase mb-3">Voice in practice</p>
                        <div className="grid gap-3 md:grid-cols-3">
                          {[
                            { label: 'Social',    val: kit.brand_voice.tone_examples.social_post },
                            { label: 'Email',     val: kit.brand_voice.tone_examples.email_subject },
                            { label: 'Headline',  val: kit.brand_voice.tone_examples.tagline_or_headline },
                          ].filter(x => x.val).map(({ label, val }) => (
                            <div key={label} style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.025)', border: `1px solid ${V.cardBorder}`, borderRadius: '10px' }}>
                              <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-2">{label}</p>
                              <p className="text-sm text-gray-300 leading-relaxed" style={BS}>{val}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {!kit.brand_voice.tone_examples && kit.brand_voice.sample_copy && (
                      <div>
                        <p className="text-[10px] text-gray-600 font-bold uppercase mb-2">Example copy</p>
                        <div style={{ padding: '20px', borderLeft: `4px solid ${primary}`, backgroundColor: 'rgba(255,255,255,0.025)', borderRadius: '0 8px 8px 0' }}>
                          <p className="text-base italic text-gray-300" style={BS}>&ldquo;{kit.brand_voice.sample_copy}&rdquo;</p>
                        </div>
                      </div>
                    )}
                    {(kit.brand_voice.brand_donts?.length ?? 0) > 0 && (
                      <div>
                        <p className="text-[10px] text-gray-600 font-bold uppercase mb-2">Brand don&rsquo;ts</p>
                        <ul className="space-y-1 text-sm text-gray-500 list-disc list-inside">
                          {kit.brand_voice.brand_donts?.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!kit?.logo_svg_concepts?.length && (kit?.logo_concepts?.length ?? 0) > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-700 mb-5">Logo Concept Directions</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {kit!.logo_concepts.map((concept, i) => (
                      <div key={i} style={{ backgroundColor: V.cardBg, border: `1px solid ${V.cardBorder}`, borderRadius: V.cardRadius, padding: '20px' }}>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold mb-3"
                          style={{ backgroundColor: primary }}>{i + 1}</div>
                        <p className="text-sm text-gray-400 leading-relaxed">{concept}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </details>
        </section>
      )}

      {/* CTA footer */}
      <section className="max-w-5xl mx-auto px-6 py-16"
        style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/"
            className="px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: primary, borderRadius: V.ctaRadius }}>
            Generate Another Brand Kit
          </Link>
          <p className="text-[11px] text-gray-700">
            Generated {new Date(asset.createdAt).toLocaleDateString()} · {asset.id}
          </p>
        </div>
      </section>

    </div>
  )
}
