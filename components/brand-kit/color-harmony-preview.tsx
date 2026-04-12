'use client'

import { getBrandColorOnPanel, getReadableTextColor } from '@/lib/colorUtils'

export type ColorHarmonyPreviewProps = {
  brandName: string
  /** Main UI canvas */
  background: string
  /** Body / heading text on canvas */
  text: string
  primary: string
  secondary: string
  accent: string
  /** Optional font style for headline (e.g. body font from kit) */
  bodyStyle?: React.CSSProperties
}

/**
 * Mini composed UI: toolbar + content strip showing how palette roles work together.
 */
export function ColorHarmonyPreview({
  brandName,
  background,
  text,
  primary,
  secondary,
  accent,
  bodyStyle,
}: ColorHarmonyPreviewProps) {
  const onBg = getReadableTextColor(background)
  const onPrimary = getReadableTextColor(primary)
  const secondaryFg = getBrandColorOnPanel(secondary, background)
  const accentFg = getBrandColorOnPanel(accent, background)

  return (
    <div className="mt-8 rounded-xl border border-white/10 overflow-hidden">
      <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500 px-4 pt-4 pb-1">
        Color harmony
      </p>
      <p className="text-[11px] tracking-[0.05em] text-white/60 px-4 pb-3 leading-relaxed">
        How primary, secondary, and accent read on your background and body text.
      </p>

      {/* Toolbar — background + primary CTA */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-black/[0.08]"
        style={{ backgroundColor: background, color: onBg }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-8 h-8 rounded-xl shrink-0 shadow-sm"
            style={{ backgroundColor: primary }}
            aria-hidden
          />
          <span className="text-xs font-semibold tracking-tight truncate" style={{ ...bodyStyle, color: onBg }}>
            {brandName}
          </span>
        </div>
        <nav className="hidden sm:flex items-center gap-5 text-[10px] font-medium opacity-65" style={{ color: onBg }}>
          <span>Product</span>
          <span>Pricing</span>
        </nav>
        <button
          type="button"
          className="text-[10px] font-semibold px-3.5 py-2 rounded-lg shrink-0 transition hover:brightness-[0.93]"
          style={{ backgroundColor: primary, color: onPrimary }}
        >
          Get started
        </button>
      </div>

      {/* Content — text role + accents */}
      <div className="px-4 py-5" style={{ backgroundColor: background }}>
        <p
          className="text-[10px] uppercase mb-2 font-medium"
          style={{ color: text, letterSpacing: '0.05em', opacity: 0.6 }}
        >
          Featured
        </p>
        <h3
          className="text-lg font-semibold leading-snug mb-3 tracking-tight"
          style={{ color: text, ...bodyStyle }}
        >
          One system. Every touchpoint.
        </h3>
        <div className="h-0.5 w-14 mb-4 rounded-full" style={{ backgroundColor: accent }} />
        <div className="flex flex-wrap gap-2">
          <span
            className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg border"
            style={{
              borderColor: `${secondary}55`,
              color: secondaryFg,
              backgroundColor: `${secondary}14`,
            }}
          >
            Secondary — structure
          </span>
          <span
            className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg"
            style={{
              backgroundColor: `${accent}18`,
              color: accentFg,
            }}
          >
            Accent — emphasis
          </span>
        </div>
      </div>
      <div className="px-4 py-2.5 border-t border-white/10 bg-black/25">
        <p className="text-[9px] font-mono tabular-nums text-zinc-500">
          Canvas <span className="text-zinc-400">{background}</span>
          {' · '}
          Body <span className="text-zinc-400">{text}</span>
        </p>
      </div>
    </div>
  )
}
