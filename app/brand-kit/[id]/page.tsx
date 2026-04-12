'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { BrandKitData } from '@/app/api/generate/route'
import type { LogoSvgConcept } from '@/lib/logo-concepts-openai'
import {
  getContrastRatio,
  getReadableTextColor,
  isLightColor,
} from '@/lib/colorUtils'

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
    ['bold', ['bold','powerful','energetic','dynamic','intense','fierce','strong','athletic','sport','fitness','performance','driven','aggressive','edgy','high-impact','relentless','competitive','raw','hustle']],
    ['editorial', ['elegant','luxury','premium','sophisticated','refined','artisan','curated','exclusive','heritage','timeless','haute','bespoke','editorial','artisanal','culinary','gourmet','fine dining','restaurant','wine','boutique','craft','couture','minimalist']],
    ['friendly', ['friendly','warm','approachable','playful','fun','cheerful','community','casual','inclusive','welcoming','wholesome','handmade','local','family','kids','pet','natural','organic','cozy']],
    ['minimal', ['modern','tech','innovative','efficient','clean','professional','startup','digital','platform','software','precise','analytical','data','saas','minimal','streamlined','scalable']],
  ]
  map.forEach(([v, words]) => { words.forEach(w => { if (signals.includes(w)) scores[v]++ }) })

  const pairing = kit?.typography?.font_pairing_id ?? ''
  if (/editorial|serif|elegant|luxury|classic/.test(pairing)) scores.editorial += 3
  if (/bold|display|sport|impact|heavy/.test(pairing)) scores.bold += 3
  if (/friendly|round|warm|fun|playful/.test(pairing)) scores.friendly += 3
  if (/modern|tech|minimal|clean|mono/.test(pairing)) scores.minimal += 3

  const [best] = Object.entries(scores).sort((a, b) => b[1] - a[1])
  return best[1] > 0 ? (best[0] as Variant) : 'minimal'
}

function sRadius(shape: string, size: number): string {
  if (shape === 'circle') return '50%'
  if (shape === 'hexagon') return '0'
  return `${Math.round(size * 0.2)}px`
}

function sClip(shape: string): string | undefined {
  return shape === 'hexagon' ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' : undefined
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className="text-[10px] text-zinc-600 hover:text-white transition-colors font-mono tabular-nums shrink-0"
    >{copied ? '✓' : (label ?? 'copy')}</button>
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────────

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090E]">
      <p className="text-zinc-700 animate-pulse text-[10px] tracking-[0.3em] uppercase">Building your brand…</p>
    </div>
  )
  if (error || !asset) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#09090E]">
      <p className="text-red-400 text-sm">{error ?? 'Not found.'}</p>
      <Link href="/" className="text-zinc-500 hover:text-white text-sm">← Back</Link>
    </div>
  )

  // ── Data ──────────────────────────────────────────────────────────────────
  const kit       = asset.brandKitData
  const variant   = detectVariant(kit)
  const heading   = kit?.typography?.heading_font
  const body      = kit?.typography?.body_font
  const primary   = kit?.color_palette?.primary?.hex    ?? '#4F46E5'
  const accent    = kit?.color_palette?.accent?.hex     ?? '#6366F1'
  const bgColor   = kit?.color_palette?.background?.hex ?? '#F8FAFC'
  const textColor = kit?.color_palette?.text?.hex       ?? '#0A0A0F'
  const colors    = kit?.color_palette ? Object.entries(kit.color_palette) : []

  const personality = (kit?.brand_strategy?.brand_personality ?? []).join(' ').toLowerCase()
  const isFriendly = personality.includes('friendly') || personality.includes('warm')
  const isTech     = personality.includes('modern')   || personality.includes('tech')

  const monoLetter = kit?.logo_monogram?.letter ?? asset.brandName.charAt(0).toUpperCase()
  const monoShape  = (() => {
    if (variant === 'editorial' || variant === 'friendly') return 'circle'
    if (variant === 'bold') return (kit?.logo_monogram?.shape === 'circle' ? 'rounded-square' : (kit?.logo_monogram?.shape ?? 'rounded-square'))
    return kit?.logo_monogram?.shape ?? (isFriendly ? 'circle' : isTech ? 'hexagon' : 'rounded-square')
  })()

  const HS = heading ? { fontFamily: `'${heading}', serif` } : {}
  const BS = body    ? { fontFamily: `'${body}', sans-serif` } : {}

  const onPrimary = getReadableTextColor(primary)
  const onAccent  = getReadableTextColor(accent)
  const onBg      = getReadableTextColor(bgColor)
  const bgLight   = isLightColor(bgColor)

  // ── Variant tokens ────────────────────────────────────────────────────────
  const V = (() => {
    switch (variant) {
      case 'bold': return {
        nameWeight: 900, nameTracking: '-0.02em',
        cardRadius: '10px', cardBorder: 'rgba(255,255,255,0.10)',
        ctaRadius: '3px', tagRadius: '4px',
      }
      case 'editorial': return {
        nameWeight: 300, nameTracking: '0.015em',
        cardRadius: '14px', cardBorder: 'rgba(255,255,255,0.06)',
        ctaRadius: '0px', tagRadius: '2px',
      }
      case 'friendly': return {
        nameWeight: 800, nameTracking: '-0.01em',
        cardRadius: '24px', cardBorder: 'rgba(255,255,255,0.08)',
        ctaRadius: '14px', tagRadius: '999px',
      }
      default: return {
        nameWeight: 700, nameTracking: '-0.025em',
        cardRadius: '20px', cardBorder: 'rgba(255,255,255,0.07)',
        ctaRadius: '999px', tagRadius: '6px',
      }
    }
  })()

  const googleFontsUrl = [heading, body].filter(Boolean).length
    ? `https://fonts.googleapis.com/css2?${[
        heading && `family=${encodeURIComponent(heading)}:wght@300;400;600;700;900`,
        body    && `family=${encodeURIComponent(body)}:wght@400;500;600`,
      ].filter(Boolean).join('&')}&display=swap`
    : null

  // ── Inner components ──────────────────────────────────────────────────────

  function Label({ children }: { children: React.ReactNode }) {
    if (variant === 'editorial') return (
      <div className="flex items-center gap-3 mb-8">
        <div className="w-5 h-px shrink-0" style={{ backgroundColor: primary }} />
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500">{children}</p>
      </div>
    )
    if (variant === 'bold') return <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500 mb-8">{children}</p>
    return <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500 mb-8">{children}</p>
  }

  function Mono({ size, bg, fg, outline, label, shadow }: {
    size: number; bg: string; fg: string; outline?: boolean; label: string; shadow?: string
  }) {
    return (
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex items-center justify-center select-none"
          style={{
            width: size, height: size,
            backgroundColor: outline ? 'transparent' : bg,
            border: outline ? `2px solid ${bg}` : undefined,
            color: outline ? bg : fg,
            fontSize: Math.round(size * 0.44),
            fontWeight: variant === 'bold' ? 900 : 700,
            borderRadius: sRadius(monoShape, size),
            clipPath: sClip(monoShape),
            boxShadow: shadow, letterSpacing: '-0.02em', ...HS,
          }}>
          {monoLetter}
        </div>
        <p className="text-[10px] text-zinc-600">{label}</p>
      </div>
    )
  }

  // Truncate helper for mockups
  const tn = (s: string, n: number) => s.length > n ? s.slice(0, n - 1) + '…' : s

  // ── Page ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#09090E] text-white">
      {googleFontsUrl && <link href={googleFontsUrl} rel="stylesheet" />}

      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-[11px] text-zinc-600 hover:text-white transition-colors">← SnapBrand</Link>
        <button type="button" onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="text-[10px] text-zinc-600 hover:text-white transition-colors border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg">
          Share
        </button>
      </nav>

      {/* ═══════ 1 · HERO ═══════════════════════════════════════════════════ */}

      {variant === 'bold' && (
        <section className="relative overflow-hidden" style={{ backgroundColor: primary }}>
          <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '200px' }} />
          <div className="absolute left-0 top-0 bottom-0 w-[5px]" style={{ backgroundColor: accent }} />
          <div className="pl-12 pr-8 md:pl-16 md:pr-12 py-20 md:py-28">
            <h1 className="font-black break-words" style={{ ...HS, fontSize: 'clamp(3.5rem, 15vw, 11rem)', color: onPrimary, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: '0.84' }}>
              {asset.brandName}
            </h1>
            <div className="my-6 w-16 h-0.5" style={{ backgroundColor: onPrimary, opacity: 0.2 }} />
            {kit?.tagline_options?.[0] && (
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-8 max-w-lg" style={{ ...BS, color: onPrimary, opacity: 0.5 }}>{kit.tagline_options[0]}</p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className="px-7 py-2.5 text-[11px] font-black uppercase tracking-widest" style={{ backgroundColor: accent, color: onAccent, borderRadius: '3px' }}>Get Started</button>
              <button type="button" className="px-7 py-2.5 text-[11px] font-bold uppercase tracking-widest border-2" style={{ borderColor: onPrimary, color: onPrimary, backgroundColor: 'transparent', opacity: 0.5, borderRadius: '3px' }}>Learn More</button>
            </div>
          </div>
        </section>
      )}

      {variant === 'editorial' && (
        <section className="relative flex" style={{ minHeight: 520 }}>
          <div className="hidden md:flex w-[32%] shrink-0 relative overflow-hidden items-center justify-center" style={{ backgroundColor: primary }}>
            <div className="absolute pointer-events-none select-none font-bold" style={{ fontSize: '16rem', color: isLightColor(primary) ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', lineHeight: 1, ...HS }}>{monoLetter}</div>
          </div>
          <div className="hidden md:block absolute left-[32%] top-0 bottom-0 w-px" style={{ backgroundColor: `${primary}30` }} />
          <div className="flex-1 flex flex-col justify-between px-10 md:px-16 py-14 md:py-18 bg-[#09090E]">
            <div className="flex items-center gap-3">
              <div className="w-5 h-px shrink-0" style={{ backgroundColor: primary }} />
              <p className="text-[9px] uppercase tracking-[0.4em] text-zinc-600">Brand Identity</p>
            </div>
            <div className="py-8">
              <h1 className="break-words leading-none" style={{ ...HS, fontSize: 'clamp(2.5rem, 8vw, 7rem)', color: '#FFFFFF', fontWeight: 300, letterSpacing: '0.015em' }}>{asset.brandName}</h1>
              {kit?.tagline_options?.[0] && (
                <p className="mt-6 text-[10px] uppercase tracking-[0.4em]" style={{ color: getContrastRatio('#09090E', primary) >= 4.5 ? primary : '#FFFFFF', ...BS }}>{kit.tagline_options[0]}</p>
              )}
            </div>
            <div className="flex items-center gap-8">
              <button type="button" className="text-sm font-medium flex items-center gap-2 hover:opacity-60 transition-opacity" style={{ color: '#FFFFFF', ...BS }}>Get Started <span style={{ color: primary }}>→</span></button>
              <button type="button" className="text-sm text-zinc-600 hover:text-white transition-colors" style={BS}>Our Story</button>
            </div>
          </div>
        </section>
      )}

      {variant === 'minimal' && (
        <section className="relative overflow-hidden bg-[#09090E]">
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 100%, ${primary}14 0%, transparent 70%)` }} />
          <div className="relative max-w-4xl mx-auto px-8 py-32 md:py-40 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primary }} />
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">Brand Identity</p>
            </div>
            <h1 className="font-bold break-words leading-none mb-5" style={{ ...HS, fontSize: 'clamp(3rem, 11vw, 8rem)', color: '#FFFFFF', letterSpacing: '-0.025em' }}>{asset.brandName}</h1>
            {kit?.tagline_options?.[0] && (
              <p className="text-lg mb-10 max-w-md mx-auto text-zinc-400" style={BS}>{kit.tagline_options[0]}</p>
            )}
            <div className="flex items-center justify-center flex-wrap gap-3">
              <button type="button" className="px-7 py-2.5 text-sm font-semibold" style={{ backgroundColor: primary, color: onPrimary, borderRadius: '999px' }}>Get Started</button>
              <button type="button" className="px-7 py-2.5 text-sm font-medium text-zinc-400 border hover:text-white transition-colors" style={{ borderColor: 'rgba(255,255,255,0.12)', borderRadius: '999px', backgroundColor: 'transparent' }}>Learn More</button>
            </div>
          </div>
        </section>
      )}

      {variant === 'friendly' && (
        <section className="relative overflow-hidden" style={{ minHeight: 480 }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(145deg, ${primary} 0%, ${accent} 100%)` }} />
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full pointer-events-none" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full pointer-events-none" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
          <div className="relative max-w-4xl mx-auto px-8 py-24 md:py-32 text-center">
            <h1 className="font-extrabold break-words leading-none mb-5" style={{ ...HS, fontSize: 'clamp(3rem, 10vw, 7rem)', color: '#FFFFFF', letterSpacing: '-0.01em' }}>{asset.brandName}</h1>
            {kit?.tagline_options?.[0] && (
              <p className="text-xl mb-10 max-w-lg mx-auto" style={{ ...BS, color: 'rgba(255,255,255,0.8)' }}>{kit.tagline_options[0]}</p>
            )}
            <div className="flex items-center justify-center flex-wrap gap-3">
              <button type="button" className="px-8 py-3 text-sm font-bold shadow-lg" style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: textColor, borderRadius: '14px' }}>Get Started</button>
              <button type="button" className="px-8 py-3 text-sm font-semibold border-2" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#FFFFFF', backgroundColor: 'transparent', borderRadius: '14px' }}>Learn More</button>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ 2 · WORDMARK ════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10">
        <Label>Wordmark</Label>

        {variant === 'bold' && (
          <div className="space-y-3">
            {[{ bg: bgColor, c: onBg, l: 'Light' }, { bg: '#0F0F0F', c: getReadableTextColor('#0F0F0F'), l: 'Dark' }].map(({ bg, c, l }) => (
              <div key={l} className="relative overflow-hidden" style={{ backgroundColor: bg, borderRadius: '10px', padding: '44px 40px 36px' }}>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none font-black opacity-[0.04]" style={{ fontSize: '6rem', color: c, textTransform: 'uppercase', lineHeight: 1, ...HS }}>{monoLetter}</div>
                <h2 className="relative break-words" style={{ ...HS, fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: c, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: '0.88', fontWeight: 900 }}>{asset.brandName}</h2>
                {kit?.tagline_options?.[0] && <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] opacity-30" style={{ color: c, ...BS }}>{kit.tagline_options[0]}</p>}
                <p className="mt-6 text-[9px] uppercase tracking-widest opacity-18" style={{ color: c }}>{l}</p>
              </div>
            ))}
          </div>
        )}

        {variant === 'editorial' && (
          <div className="space-y-3">
            {[{ bg: bgColor, c: onBg, l: 'Light' }, { bg: '#0C0C10', c: getReadableTextColor('#0C0C10'), l: 'Dark' }].map(({ bg, c, l }) => (
              <div key={l} style={{ backgroundColor: bg, borderRadius: '14px', padding: '52px 48px 44px' }}>
                <div className="mb-8 w-8 h-px" style={{ backgroundColor: primary }} />
                <h2 className="break-words" style={{ ...HS, fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: c, fontWeight: 300, letterSpacing: '0.015em', lineHeight: '1' }}>{asset.brandName}</h2>
                <div className="mt-6 h-px w-full opacity-10" style={{ backgroundColor: c }} />
                {kit?.tagline_options?.[0] && <p className="mt-3 text-[10px] uppercase tracking-[0.35em] opacity-35" style={{ color: c, ...BS }}>{kit.tagline_options[0]}</p>}
                <p className="mt-5 text-[9px] uppercase tracking-widest opacity-18" style={{ color: c }}>{l}</p>
              </div>
            ))}
          </div>
        )}

        {(variant === 'minimal' || variant === 'friendly') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[{ bg: bgColor, c: onBg, l: 'Light' }, { bg: '#0F0F14', c: getReadableTextColor('#0F0F14'), l: 'Dark' }].map(({ bg, c, l }) => (
              <div key={l} className="flex flex-col justify-between" style={{ backgroundColor: bg, borderRadius: V.cardRadius, padding: '48px 44px', minHeight: 260 }}>
                <h2 className="break-words" style={{ ...HS, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: c, fontWeight: V.nameWeight, letterSpacing: V.nameTracking, lineHeight: '1.05' }}>{asset.brandName}</h2>
                {kit?.tagline_options?.[0] && <p className="mt-2 text-sm break-words opacity-40" style={{ color: c, ...BS }}>{kit.tagline_options[0]}</p>}
                <p className="mt-6 text-[9px] uppercase tracking-widest opacity-18" style={{ color: c }}>{l}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═══════ 3 · MONOGRAM ════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <Label>Monogram</Label>
        <div className="flex flex-wrap items-end gap-10 md:gap-14">
          {variant === 'bold' && <>
            <Mono size={160} bg={primary} fg={onPrimary} label="Primary" shadow="0 10px 36px rgba(0,0,0,0.5)" />
            <Mono size={88} bg={accent} fg={onAccent} label="Accent" shadow="0 6px 20px rgba(0,0,0,0.4)" />
            <Mono size={88} bg="#FFFFFF" fg={primary} label="On white" />
          </>}
          {variant === 'editorial' && <>
            <Mono size={140} bg={primary} fg={onPrimary} label="Filled" />
            <Mono size={88} bg={primary} fg={onPrimary} outline label="Outline" />
            <Mono size={88} bg={textColor} fg={getReadableTextColor(textColor)} label="Dark" />
          </>}
          {variant === 'minimal' && <>
            <Mono size={140} bg={primary} fg={onPrimary} label="Primary" shadow="0 8px 28px rgba(0,0,0,0.35)" />
            <Mono size={88} bg={primary} fg={onPrimary} label="Icon" />
            <Mono size={88} bg={textColor} fg={getReadableTextColor(textColor)} label="Dark" />
          </>}
          {variant === 'friendly' && <>
            <Mono size={140} bg={primary} fg={onPrimary} label="Primary" shadow={`0 14px 40px ${primary}50`} />
            <Mono size={88} bg={accent} fg={onAccent} label="Accent" shadow={`0 8px 20px ${accent}40`} />
            <Mono size={88} bg="#FFFFFF" fg={primary} label="On white" />
          </>}
        </div>
      </section>

      {/* ═══════ 4 · MOCKUPS — 3 real-world applications side by side ════════ */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <Label>In context</Label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* ── Website hero ─────────────────────────────────────────────── */}
          <div className="overflow-hidden" style={{ borderRadius: V.cardRadius, border: `1px solid ${V.cardBorder}`, backgroundColor: '#111116' }}>
            <div style={{ backgroundColor: bgColor, overflow: 'hidden' }}>
              {/* Browser bar */}
              <div className="flex items-center gap-1.5 px-3.5 py-2" style={{ borderBottom: `1px solid ${bgLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'}` }}>
                <div className="w-[7px] h-[7px] rounded-full bg-red-400/50" />
                <div className="w-[7px] h-[7px] rounded-full bg-yellow-400/50" />
                <div className="w-[7px] h-[7px] rounded-full bg-green-400/50" />
                <div className="flex-1 mx-2 h-3 rounded px-1.5 flex items-center" style={{ backgroundColor: bgLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}>
                  <span className="text-[7px] opacity-30" style={{ color: onBg }}>{asset.brandName.toLowerCase().replace(/\s+/g, '')}.com</span>
                </div>
              </div>
              {/* Nav */}
              <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: `1px solid ${onBg}0A` }}>
                <span className="text-[10px] truncate max-w-[110px]" style={{ ...HS, color: onBg, fontWeight: variant === 'bold' ? 900 : 600, textTransform: variant === 'bold' ? 'uppercase' : 'none', letterSpacing: variant === 'bold' ? '0.05em' : '-0.01em' }}>{tn(asset.brandName, 16)}</span>
                <div className="flex gap-2">
                  {(variant === 'editorial' ? ['Work', 'About', 'Contact'] : ['Product', 'Pricing', 'About']).map(l => (
                    <span key={l} className="text-[7px] opacity-30" style={{ color: onBg }}>{l}</span>
                  ))}
                </div>
              </div>
              {/* Hero content — this is what makes it look real */}
              {variant === 'bold' ? (
                <div className="relative overflow-hidden" style={{ minHeight: 140 }}>
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: accent }} />
                  <div className="px-4 py-5">
                    <p className="font-black break-words uppercase leading-tight" style={{ ...HS, fontSize: 16, color: onBg, letterSpacing: '-0.01em' }}>{tn(kit?.tagline_options?.[0] ?? asset.brandName, 40)}</p>
                    <p className="text-[7px] mt-2 opacity-35 leading-relaxed max-w-[180px]" style={{ ...BS, color: onBg }}>Performance meets purpose. Built for those who refuse to settle.</p>
                    <div className="mt-3 inline-block px-3 py-1 text-[8px] font-black uppercase tracking-wider text-white" style={{ backgroundColor: primary, borderRadius: '2px' }}>Get Started</div>
                  </div>
                </div>
              ) : variant === 'editorial' ? (
                <div className="px-4 py-5" style={{ minHeight: 140 }}>
                  <div className="h-px w-5 mb-3" style={{ backgroundColor: primary }} />
                  <p className="break-words leading-snug" style={{ ...HS, fontSize: 15, fontWeight: 300, color: onBg, letterSpacing: '0.01em' }}>{tn(kit?.tagline_options?.[0] ?? asset.brandName, 40)}</p>
                  <p className="text-[7px] mt-2 opacity-35 leading-relaxed max-w-[180px]" style={{ ...BS, color: onBg }}>Crafted with intention. Designed to endure.</p>
                  <p className="mt-3 text-[8px] font-medium" style={{ color: primary, ...BS }}>Discover →</p>
                </div>
              ) : variant === 'friendly' ? (
                <div className="px-4 py-5" style={{ minHeight: 140 }}>
                  <p className="font-extrabold break-words leading-tight" style={{ ...HS, fontSize: 15, color: onBg, letterSpacing: '-0.01em' }}>{tn(kit?.tagline_options?.[0] ?? asset.brandName, 40)}</p>
                  <p className="text-[7px] mt-2 opacity-35 leading-relaxed max-w-[180px]" style={{ ...BS, color: onBg }}>Something great starts here. Join thousands who already love it.</p>
                  <div className="mt-3 inline-block px-3 py-1 text-[8px] font-bold text-white" style={{ backgroundColor: primary, borderRadius: '10px' }}>Get Started</div>
                </div>
              ) : (
                <div className="px-4 py-5 text-center" style={{ minHeight: 140 }}>
                  <p className="font-bold break-words leading-tight" style={{ ...HS, fontSize: 15, color: onBg, letterSpacing: '-0.02em' }}>{tn(kit?.tagline_options?.[0] ?? asset.brandName, 40)}</p>
                  <p className="text-[7px] mt-2 opacity-35 leading-relaxed mx-auto max-w-[180px]" style={{ ...BS, color: onBg }}>The modern platform for teams who build.</p>
                  <div className="mt-3 inline-block px-3 py-1 text-[8px] font-semibold text-white" style={{ backgroundColor: primary, borderRadius: '999px' }}>Get Started</div>
                </div>
              )}
            </div>
            <p className="text-[10px] text-zinc-600 px-4 py-2.5">Website</p>
          </div>

          {/* ── Social profile ───────────────────────────────────────────── */}
          <div className="overflow-hidden" style={{ borderRadius: V.cardRadius, border: `1px solid ${V.cardBorder}`, backgroundColor: '#111116' }}>
            <div className="flex flex-col items-center p-6 pt-8" style={{ minHeight: 280 }}>
              <div className="flex items-center justify-center font-bold select-none mb-3"
                style={{ width: 64, height: 64, backgroundColor: primary, color: onPrimary, fontSize: 28, fontWeight: variant === 'bold' ? 900 : 700, borderRadius: sRadius(monoShape, 64), clipPath: sClip(monoShape), boxShadow: '0 6px 20px rgba(0,0,0,0.4)', ...HS }}>
                {monoLetter}
              </div>
              <p className="font-bold text-[13px] text-white mb-0.5 text-center truncate max-w-[170px]" style={{ ...HS, textTransform: variant === 'bold' ? 'uppercase' : 'none', letterSpacing: variant === 'bold' ? '0.04em' : 'normal' }}>{asset.brandName}</p>
              <p className="text-[10px] text-zinc-500 mb-1" style={BS}>@{asset.brandName.toLowerCase().replace(/\s+/g, '')}</p>
              {kit?.tagline_options?.[0] && <p className="text-[10px] text-zinc-500 text-center mb-4 line-clamp-2 max-w-[160px]" style={BS}>{kit.tagline_options[0]}</p>}
              <button type="button" className="px-5 py-1.5 text-[10px] font-bold text-white mb-4" style={{ backgroundColor: primary, borderRadius: V.ctaRadius }}>Follow</button>
              <div className="flex gap-6 mt-auto pt-3 w-full justify-center" style={{ borderTop: `1px solid ${V.cardBorder}` }}>
                {[['2.4k', 'Posts'], ['18k', 'Followers'], ['340', 'Following']].map(([n, l]) => (
                  <div key={l} className="text-center">
                    <p className="text-[11px] font-bold text-white">{n}</p>
                    <p className="text-[9px] text-zinc-600">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-zinc-600 px-4 py-2.5">Social</p>
          </div>

          {/* ── Business card ────────────────────────────────────────────── */}
          <div className="overflow-hidden" style={{ borderRadius: V.cardRadius, border: `1px solid ${V.cardBorder}`, backgroundColor: '#111116' }}>
            <div className="flex items-center justify-center p-6" style={{ minHeight: 280 }}>
              <div className="w-full shadow-2xl overflow-hidden" style={{ backgroundColor: bgColor, borderRadius: variant === 'editorial' || variant === 'bold' ? '4px' : '12px', aspectRatio: '1.75/1', maxWidth: 280, boxShadow: '0 2px 6px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.15), 0 32px 64px rgba(0,0,0,0.12)' }}>
                <div className="h-full flex flex-col justify-between p-5">
                  <div className="flex items-center gap-2">
                    {variant === 'editorial' && <div className="w-px self-stretch min-h-[28px]" style={{ backgroundColor: primary }} />}
                    <div className="shrink-0 flex items-center justify-center font-bold select-none" style={{ width: 28, height: 28, backgroundColor: primary, color: onPrimary, fontSize: 11, fontWeight: 700, borderRadius: sRadius(monoShape, 28), clipPath: sClip(monoShape), ...HS }}>{monoLetter}</div>
                    <span className="font-bold text-[10px] truncate max-w-[120px]" style={{ ...HS, color: onBg, textTransform: variant === 'bold' ? 'uppercase' : 'none', letterSpacing: variant === 'bold' ? '0.05em' : '-0.01em', fontWeight: variant === 'bold' ? 900 : 600 }}>{tn(asset.brandName, 18)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[10px] mb-px" style={{ ...HS, color: onBg }}>Alex Johnson</p>
                    <p className="text-[8px] mb-1.5 opacity-45" style={{ ...BS, color: onBg }}>{variant === 'editorial' ? 'Creative Director' : variant === 'bold' ? 'Head Coach' : 'Founder & CEO'}</p>
                    <p className="text-[7px] opacity-30" style={{ ...BS, color: onBg }}>hello@{asset.brandName.toLowerCase().replace(/\s+/g, '')}.com</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-zinc-600 px-4 py-2.5">Business card</p>
          </div>

        </div>
      </section>

      {/* ═══════ 5 · BRAND ESSENTIALS — colors + type + taglines ═════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <Label>Brand essentials</Label>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {colors.length > 0 && (
            <div className="rounded-2xl border p-5" style={{ borderColor: V.cardBorder, backgroundColor: '#111116' }}>
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-4">Colors</p>
              <div className="space-y-2.5">
                {colors.map(([role, color]) => (
                  <div key={role} className="flex items-center gap-3">
                    <div className="shrink-0 border border-white/10" style={{ width: 34, height: 34, backgroundColor: color.hex, borderRadius: variant === 'bold' ? '4px' : variant === 'friendly' ? '10px' : '8px' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-white capitalize truncate">{role}</p>
                      <p className="text-[10px] text-zinc-600 truncate">{color.name}</p>
                    </div>
                    <CopyButton text={color.hex} label={color.hex} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {kit?.typography && (
            <div className="rounded-2xl border p-5" style={{ borderColor: V.cardBorder, backgroundColor: '#111116' }}>
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-4">Typography</p>
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1">Heading</p>
                  <p className="text-4xl leading-none text-white" style={{ ...HS, fontWeight: V.nameWeight }}>Aa</p>
                  <p className="text-[11px] text-zinc-400 mt-1.5 break-words" style={HS}>{heading ?? 'System UI'}</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5" style={HS}>ABCDEFG abcdefg 012</p>
                </div>
                <div style={{ borderTop: `1px solid ${V.cardBorder}`, paddingTop: 16 }}>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1">Body</p>
                  <p className="text-3xl leading-none text-white" style={BS}>Aa</p>
                  <p className="text-[11px] text-zinc-400 mt-1.5 break-words" style={BS}>{body ?? 'System UI'}</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5 leading-relaxed" style={BS}>The quick brown fox</p>
                </div>
              </div>
            </div>
          )}

          {(kit?.tagline_options?.length ?? 0) > 0 && (
            <div className="rounded-2xl border p-5" style={{ borderColor: V.cardBorder, backgroundColor: '#111116' }}>
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-4">Taglines</p>
              <div className="space-y-2.5">
                {kit!.tagline_options.slice(0, 3).map((t, i) => (
                  <button key={i} onClick={() => navigator.clipboard.writeText(t)}
                    className="w-full text-left group rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 transition hover:border-white/15">
                    <p className="text-[12px] text-white leading-snug" style={HS}>{t}</p>
                    <p className="text-[9px] text-zinc-700 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Copy</p>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ═══════ 6 · STRATEGY & VOICE — collapsed ═══════════════════════════ */}
      {(kit?.brand_strategy || kit?.brand_voice) && (
        <section className="max-w-5xl mx-auto px-6 py-10 border-t border-white/[0.04]">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none select-none py-2 px-1 -mx-1 rounded-lg hover:bg-white/[0.02] transition-colors">
              <p className="text-sm font-medium text-zinc-400">Strategy, voice & directions</p>
              <span className="text-zinc-600 text-sm transition-transform group-open:rotate-180">↓</span>
            </summary>
            <div className="mt-8 space-y-10">
              {kit?.brand_strategy && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-5">Strategy</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Positioning',    val: kit.brand_strategy.positioning },
                      { label: 'Target Audience', val: kit.brand_strategy.target_audience },
                      { label: 'Unique Value',   val: kit.brand_strategy.unique_value_prop },
                      { label: 'Tone of Voice',  val: kit.brand_strategy.tone_of_voice },
                    ].filter(x => x.val).map(({ label, val }) => (
                      <div key={label} className="rounded-xl border p-4" style={{ borderColor: V.cardBorder, backgroundColor: '#111116' }}>
                        <p className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider mb-1.5">{label}</p>
                        <p className="text-zinc-400 text-sm leading-relaxed">{val}</p>
                      </div>
                    ))}
                    {(kit.brand_strategy.brand_personality?.length ?? 0) > 0 && (
                      <div className="sm:col-span-2 rounded-xl border p-4" style={{ borderColor: V.cardBorder, backgroundColor: '#111116' }}>
                        <p className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider mb-2.5">Personality</p>
                        <div className="flex flex-wrap gap-2">
                          {kit.brand_strategy.brand_personality.map(t => (
                            <span key={t} className="px-2.5 py-0.5 text-[11px] font-medium" style={{ backgroundColor: `${primary}14`, color: getContrastRatio('#111116', primary) >= 3 ? primary : '#FFFFFF', border: `1px solid ${primary}28`, borderRadius: V.tagRadius }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {kit?.brand_voice && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-5">Voice</p>
                  <div className="rounded-xl border p-5 space-y-5" style={{ borderColor: V.cardBorder, backgroundColor: '#111116' }}>
                    {kit.brand_voice.tone && <div><p className="text-[10px] text-zinc-600 font-semibold uppercase mb-1">Tone</p><p className="text-white font-medium text-sm">{kit.brand_voice.tone}</p></div>}
                    {kit.brand_voice.personality && <div><p className="text-[10px] text-zinc-600 font-semibold uppercase mb-1">Personality</p><p className="text-zinc-400 text-sm leading-relaxed" style={BS}>{kit.brand_voice.personality}</p></div>}
                    {kit.brand_voice.tone_examples && (
                      <div>
                        <p className="text-[10px] text-zinc-600 font-semibold uppercase mb-3">Voice in practice</p>
                        <div className="grid gap-3 md:grid-cols-3">
                          {[{ label: 'Social', val: kit.brand_voice.tone_examples.social_post }, { label: 'Email', val: kit.brand_voice.tone_examples.email_subject }, { label: 'Headline', val: kit.brand_voice.tone_examples.tagline_or_headline }].filter(x => x.val).map(({ label, val }) => (
                            <div key={label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                              <p className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1.5">{label}</p>
                              <p className="text-[13px] text-zinc-300 leading-relaxed" style={BS}>{val}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {!kit.brand_voice.tone_examples && kit.brand_voice.sample_copy && (
                      <div><p className="text-[10px] text-zinc-600 font-semibold uppercase mb-2">Example</p><div className="p-4 rounded-lg bg-white/[0.02]" style={{ borderLeft: `3px solid ${primary}` }}><p className="text-base italic text-zinc-300" style={BS}>&ldquo;{kit.brand_voice.sample_copy}&rdquo;</p></div></div>
                    )}
                    {(kit.brand_voice.brand_donts?.length ?? 0) > 0 && (
                      <div><p className="text-[10px] text-zinc-600 font-semibold uppercase mb-2">Don&rsquo;ts</p><ul className="space-y-1 text-sm text-zinc-500 list-disc list-inside">{kit.brand_voice.brand_donts?.map((d, i) => <li key={i}>{d}</li>)}</ul></div>
                    )}
                  </div>
                </div>
              )}
              {!kit?.logo_svg_concepts?.length && (kit?.logo_concepts?.length ?? 0) > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-5">Logo directions</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    {kit!.logo_concepts.map((c, i) => (
                      <div key={i} className="rounded-xl border p-4" style={{ borderColor: V.cardBorder, backgroundColor: '#111116' }}>
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold mb-2" style={{ backgroundColor: primary, color: onPrimary }}>{i + 1}</div>
                        <p className="text-sm text-zinc-400 leading-relaxed">{c}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </details>
        </section>
      )}

      {/* Footer CTA */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-white/[0.04]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="px-7 py-2.5 text-sm font-bold transition hover:brightness-90" style={{ backgroundColor: primary, color: onPrimary, borderRadius: V.ctaRadius }}>Generate Another Brand Kit</Link>
          <p className="text-[11px] text-zinc-700">Generated {new Date(asset.createdAt).toLocaleDateString()} · {asset.id}</p>
        </div>
      </section>

    </div>
  )
}
