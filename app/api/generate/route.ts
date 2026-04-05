import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { OpenAI } from 'openai'
import { generateLogoSVG, generateWordmarkSVG } from '@/lib/generate-logo-svg'

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
    heading_font:   string
    body_font:      string
    heading_weight: string
    body_weight:    string
  }
  tagline_options: string[]
  brand_voice: {
    tone:        string
    personality: string
    sample_copy: string
  }
  logo_concepts:      string[]
  logo_image_prompt:  string
  logo_monogram: {
    letter: string
    shape:  'circle' | 'rounded-square' | 'hexagon' | 'diamond'
    style:  string
  }
}

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert brand strategist and creative director.
Generate a complete, creative brand kit based on the business info provided.
Return ONLY valid JSON — no markdown, no explanation, no backticks.

JSON shape:
{
  "brand_strategy": {
    "positioning": "one sentence brand positioning statement",
    "target_audience": "specific target audience description",
    "brand_personality": ["trait1", "trait2", "trait3"],
    "tone_of_voice": "description of tone",
    "unique_value_prop": "concise UVP"
  },
  "color_palette": {
    "primary":    { "hex": "#XXXXXX", "name": "Color Name", "usage": "main brand color" },
    "secondary":  { "hex": "#XXXXXX", "name": "Color Name", "usage": "..." },
    "accent":     { "hex": "#XXXXXX", "name": "Color Name", "usage": "..." },
    "background": { "hex": "#XXXXXX", "name": "Color Name", "usage": "..." },
    "text":       { "hex": "#XXXXXX", "name": "Color Name", "usage": "..." }
  },
  "typography": {
    "heading_font":   "Google Font Name",
    "body_font":      "Google Font Name",
    "heading_weight": "700",
    "body_weight":    "400"
  },
  "tagline_options": ["Tagline 1", "Tagline 2", "Tagline 3"],
  "brand_voice": {
    "tone":        "e.g. confident and approachable",
    "personality": "2-3 sentence brand personality description",
    "sample_copy": "One sample marketing sentence in brand voice"
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

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not configured.' },
      { status: 500 }
    )
  }

  const { brandName, brandDescription, assetType } = await request.json().catch(() => ({}))

  if (!brandName || !brandDescription) {
    return NextResponse.json(
      { error: 'brandName and brandDescription are required.' },
      { status: 400 }
    )
  }

  // ── Auth / rate-limit check ────────────────────────────────────────────────
  const session = await getServerSession(authOptions)
  let userId: string | null = null
  let guestToken: string | null = null
  let newGuestToken = false

  if (session?.user?.id) {
    // Authenticated user
    userId = session.user.id
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (!user.isProMember && user.generationsUsed >= FREE_LIMIT) {
      return NextResponse.json(
        { error: 'Generation limit reached. Upgrade to Pro for unlimited generations.' },
        { status: 403 }
      )
    }
  } else {
    // Anonymous user — rate-limit by cookie-stored guest token
    guestToken = request.cookies.get(GUEST_COOKIE)?.value ?? null
    if (!guestToken) {
      guestToken = crypto.randomUUID()
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

  // ── Step 1: GPT-4o structured brand kit ────────────────────────────────────
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
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  })

  let kit: BrandKitData
  try {
    kit = JSON.parse(kitResponse.choices[0].message.content ?? '{}') as BrandKitData
  } catch {
    return NextResponse.json(
      { error: 'GPT-4o returned invalid JSON. Please try again.' },
      { status: 500 }
    )
  }

  // ── Step 2: Programmatic SVG logo (no DALL-E) ──────────────────────────────
  const monogram = kit.logo_monogram ?? {}
  const primaryHex    = kit.color_palette?.primary?.hex    ?? '#4F46E5'
  const secondaryHex  = kit.color_palette?.secondary?.hex  ?? '#7C3AED'
  const headingFont   = kit.typography?.heading_font        ?? 'Inter'

  const logoSvg = generateLogoSVG({
    letter:          monogram.letter ?? brandName.charAt(0),
    primaryColor:    primaryHex,
    secondaryColor:  secondaryHex,
    backgroundColor: '#FFFFFF',
    shape:           (['circle', 'rounded-square', 'hexagon', 'diamond'].includes(monogram.shape)
                       ? monogram.shape
                       : 'rounded-square') as 'circle' | 'rounded-square' | 'hexagon' | 'diamond',
    fontFamily:      headingFont,
  })

  const wordmarkSvg = generateWordmarkSVG({
    brandName,
    primaryColor: primaryHex,
    fontFamily:   headingFont,
  })

  // ── Step 3: Save to DB ─────────────────────────────────────────────────────
  const asset = await prisma.generatedAsset.create({
    data: {
      userId,
      guestToken,
      brandName,
      assetType:    assetType ?? 'Brand Kit',
      imageUrl:     '',
      logoSvg,
      wordmarkSvg,
      promptUsed:   SYSTEM_PROMPT.slice(0, 200), // store a short ref
      brandKitData: kit as object,
    },
  })

  // Increment generation count for authenticated users
  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data:  { generationsUsed: { increment: 1 } },
    })
  }

  // ── Build response, set guest cookie if new ────────────────────────────────
  const res = NextResponse.json({ asset, message: 'Brand kit generated successfully' })
  if (newGuestToken && guestToken) {
    res.cookies.set(GUEST_COOKIE, guestToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 365, // 1 year
      path:     '/',
    })
  }
  return res
}
