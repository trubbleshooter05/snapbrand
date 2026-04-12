import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { APIError, OpenAI } from 'openai'
import { buildContrastSummary, dedupePaletteColors, normalizeHex } from '@/lib/color-utils'
import { fontPairingsPromptBlock, resolveFontPairing } from '@/lib/font-pairings'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const FREE_LIMIT = 3
const GUEST_COOKIE = 'sb_guest_token'

// ─── Types ────────────────────────────────────────────────────────────────────
export interface BrandKitData {
  brand_strategy: {
    positioning:        string
    target_audience:    string
    brand_personality:  string[]
    tone_of_voice:      string
    unique_value_prop:  string
  }
  color_palette: {
    primary:    { hex: string; name: string; usage: string }
    secondary:  { hex: string; name: string; usage: string }
    accent:     { hex: string; name: string; usage: string }
    background: { hex: string; name: string; usage: string }
    text:       { hex: string; name: string; usage: string }
  }
  typography: {
    /** Must be one curated id; server resolves exact Google Font names. */
    font_pairing_id?: string
    heading_font:   string
    body_font:      string
    heading_weight: string
    body_weight:    string
  }
  /** @deprecated Legacy kits only — no longer generated. */
  typography_scale?: Record<string, { size: string; weight: string; line_height: string; usage: string }>
  spacing_system?: Record<string, unknown>
  component_specs?: Record<string, unknown>
  imagery_guide?: Record<string, unknown>
  accessibility?: Record<string, unknown>
  tagline_options: string[]
  brand_voice: {
    tone:        string
    personality: string
    /** @deprecated Prefer tone_examples */
    sample_copy?: string
    tone_examples?: {
      social_post: string
      email_subject: string
      tagline_or_headline: string
    }
    /** Exactly three guardrails in strong kits */
    brand_donts?: string[]
  }
  logo_concepts:      string[]
  logo_image_prompt:  string
  logo_monogram: {
    letter: string
    shape:  'circle' | 'rounded-square' | 'hexagon' | 'diamond'
    style:  string
  }
  /** @deprecated No longer generated; use HTML/CSS brand lockup. */
  logo_svg_concepts?: unknown[]
  /** Computed WCAG contrast labels (server-side). */
  color_contrast_summary?: {
    text_on_background: string
    primary_on_background: string
    accent_on_background: string
    text_on_primary: string
  }
}

const SYSTEM_PROMPT = `You are an expert brand strategist and creative director.
Generate a focused brand kit based on the business info provided.
Return ONLY valid JSON — no markdown, no explanation, no backticks.

Do NOT include generic design-system filler: omit spacing_system, component_specs, imagery_guide, accessibility, and typography_scale entirely (no keys). The product highlights strategy, voice, colors, typography pairing, taglines, and logo directions — not boilerplate grids or WCAG boilerplate.

COLOR PALETTE RULES (critical):
- Exactly 5 colors in color_palette: primary, secondary, accent, background, text.
- ALL 5 hex codes MUST be clearly distinct — no duplicates and no two colors that are nearly the same (vary hue and/or lightness so a human can tell them apart at a glance).
- Do NOT use pure #000000 or pure #FFFFFF. Use a rich near-black for text (e.g. #0F172A, #1E293B) and a soft off-white or tinted light for backgrounds (e.g. #F8FAFC, #FAFAF9).
- Structure: primary = main brand color; secondary = harmonious complement or analogous tone; accent = attention-grabbing CTA/highlight; background = main light UI surfaces; text = primary body/heading color on light backgrounds.
- Ensure implied contrast: text on background should meet WCAG AA for body copy (aim for strong contrast).

TYPOGRAPHY — pick exactly ONE font_pairing_id from this curated list based on brand personality and vertical (do not invent font names; the server locks heading/body to the pairing):
${fontPairingsPromptBlock()}

BRAND STRATEGY — be specific to THIS business and vertical (no generic filler):
- positioning: Reference real market context — name competitor types, substitutes, or well-known alternatives buyers might pick (e.g. DIY tools, freelancers, agencies, marketplaces) and state how this brand is different.
- target_audience: Include segment/demographics, 2–3 concrete pain points, and 2–3 specific online places they actually spend time (platforms, communities, search/social behaviors).
- brand_personality & tone_of_voice: Tie traits to the offer; do NOT default to vague phrases like “confident and approachable” unless you justify them with this brand’s proof points.

BRAND VOICE — concrete copy beats adjectives:
- tone_examples MUST contain three distinct finished strings: (1) social_post — one short post in voice, (2) email_subject — subject line only, (3) tagline_or_headline — hero line or tagline. These are real copy, not descriptions of copy.
- brand_donts: exactly 3 strings — specific things this brand must never say or do (voice/claims/tactics). This makes the guide actionable.

JSON shape:
{
  "brand_strategy": {
    "positioning": "differentiation vs named competitor categories or substitutes in this vertical",
    "target_audience": "segment, pains, and 2-3 online hangouts/channels",
    "brand_personality": ["trait1", "trait2", "trait3"],
    "tone_of_voice": "how this brand sounds in practice for this audience",
    "unique_value_prop": "concise UVP"
  },
  "color_palette": {
    "primary":    { "hex": "#XXXXXX", "name": "Color Name", "usage": "main brand color" },
    "secondary":  { "hex": "#XXXXXX", "name": "Color Name", "usage": "secondary actions" },
    "accent":     { "hex": "#XXXXXX", "name": "Color Name", "usage": "highlights/CTAs" },
    "background": { "hex": "#XXXXXX", "name": "Color Name", "usage": "backgrounds" },
    "text":       { "hex": "#XXXXXX", "name": "Color Name", "usage": "text content" }
  },
  "typography": {
    "font_pairing_id": "one id from the TYPOGRAPHY list above, e.g. modern-tech",
    "heading_font":   "(echo the heading font name from that pairing)",
    "body_font":      "(echo the body font name from that pairing)",
    "heading_weight": "(echo from pairing)",
    "body_weight":    "(echo from pairing)"
  },
  "tagline_options": ["Tagline 1", "Tagline 2", "Tagline 3"],
  "brand_voice": {
    "tone": "short label + rationale tied to this business",
    "personality": "2-4 sentences specific to this buyer and offer",
    "tone_examples": {
      "social_post": "one short social post in brand voice",
      "email_subject": "email subject line only",
      "tagline_or_headline": "hero headline or tagline line"
    },
    "brand_donts": [
      "First thing this brand must never say or do",
      "Second guardrail",
      "Third guardrail"
    ]
  },
  "logo_concepts": [
    "Concept 1: visual description for a designer",
    "Concept 2: visual description for a designer",
    "Concept 3: visual description for a designer"
  ],
  "logo_image_prompt": "Unused placeholder",
  "logo_monogram": {
    "letter": "First 1-2 letters of brand name, uppercase",
    "shape": "one of: circle, rounded-square, hexagon, diamond",
    "style": "modern"
  }
}`

function clientError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return clientError('OPENAI_API_KEY is not configured on the server.', 500)
    }

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return clientError('Invalid JSON body.', 400)
    }
    const { brandName, brandDescription, assetType } = body as Record<string, unknown>

    if (!brandName || !brandDescription || typeof brandName !== 'string' || typeof brandDescription !== 'string') {
      return clientError('brandName and brandDescription are required.', 400)
    }

    const session = await getServerSession(authOptions)
    let userId: string | null = null
    let guestToken: string | null = null
    let newGuestToken = false

    if (session?.user?.id) {
      userId = session.user.id
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) return clientError('User not found', 404)
      if (!user.isProMember && user.generationsUsed >= FREE_LIMIT) {
        return NextResponse.json(
          { error: 'Generation limit reached. Upgrade to Pro for unlimited generations.' },
          { status: 403 }
        )
      }
    } else {
      guestToken = request.cookies.get(GUEST_COOKIE)?.value ?? null
      if (!guestToken) {
        guestToken = randomUUID()
        newGuestToken = true
      }
      const anonCount = await prisma.generatedAsset.count({
        where: { guestToken, userId: null },
      })
      if (anonCount >= FREE_LIMIT) {
        return NextResponse.json(
          { error: 'You have used your 3 free generations. Sign up to keep going!' },
          { status: 403 }
        )
      }
    }

    const kitResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Business name: ${brandName}\nAsset type: ${assetType ?? 'Brand Kit'}\nDescription: ${brandDescription}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    })

    let kit: BrandKitData
    try {
      kit = JSON.parse(kitResponse.choices[0].message.content ?? '{}') as BrandKitData
    } catch {
      return clientError('GPT-4o returned invalid JSON. Please try again.', 500)
    }

    if (kit.typography) {
      const resolved = resolveFontPairing(kit.typography)
      kit.typography = { ...kit.typography, ...resolved }
    }

    if (kit.color_palette) {
      const cp = kit.color_palette
      const roles = ['primary', 'secondary', 'accent', 'background', 'text'] as const
      for (const r of roles) {
        const entry = cp[r]
        if (entry?.hex) {
          const n = normalizeHex(entry.hex)
          if (n) entry.hex = n
        }
      }
      dedupePaletteColors(kit as Parameters<typeof dedupePaletteColors>[0])
      dedupePaletteColors(kit as Parameters<typeof dedupePaletteColors>[0])
      try {
        kit.color_contrast_summary = buildContrastSummary(kit as Parameters<typeof buildContrastSummary>[0])
      } catch {
        /* ignore */
      }
    }

    const asset = await prisma.generatedAsset.create({
      data: {
        userId,
        guestToken,
        brandName,
        assetType:    typeof assetType === 'string' ? assetType : 'Brand Kit',
        imageUrl:     '',
        logoSvg:      null,
        wordmarkSvg:  null,
        promptUsed:   SYSTEM_PROMPT.slice(0, 200),
        brandKitData: kit as object,
      },
    })

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data:  { generationsUsed: { increment: 1 } },
      })
    }

    const res = NextResponse.json({ asset, message: 'Brand kit generated successfully' })
    if (newGuestToken && guestToken) {
      res.cookies.set(GUEST_COOKIE, guestToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure:   process.env.NODE_ENV === 'production',
        maxAge:   60 * 60 * 24 * 365,
        path:     '/',
      })
    }
    return res
  } catch (err: unknown) {
    console.error('[api/generate]', err)

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2022' || err.code === 'P2010') {
        return clientError(
          'Database schema is out of sync. Ensure migrations run on deploy (prisma migrate deploy).',
          503
        )
      }
      if (err.code === 'P2003') {
        return clientError('Invalid user reference.', 400)
      }
    }

    if (err instanceof APIError) {
      if (err.status === 401) {
        return clientError('OpenAI API key is invalid or expired.', 502)
      }
      if (err.status === 429) {
        return clientError('OpenAI rate limit — try again in a minute.', 429)
      }
      if (err.status === 402 || err.status === 403) {
        return clientError('OpenAI billing or access issue. Check your API account.', 502)
      }
      return clientError(err.message || 'AI service error.', 502)
    }

    const msg = err instanceof Error ? err.message : 'Unknown error'
    return clientError(
      process.env.NODE_ENV === 'development' ? msg : 'Generation failed. Please try again.',
      500
    )
  }
}
