import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { OpenAI } from 'openai'
import { put } from '@vercel/blob'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ─── Structured brand kit type ────────────────────────────────────────────────
export interface BrandKitData {
  brand_strategy: {
    positioning: string
    target_audience: string
    brand_personality: string[]
    tone_of_voice: string
    unique_value_prop: string
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
  logo_concepts: string[]
  logo_image_prompt: string // DALL-E prompt produced by GPT-4o, no text
}

const BRAND_KIT_SYSTEM_PROMPT = `You are an expert brand strategist and creative director.
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
    "Concept 1: visual description for designer",
    "Concept 2: visual description for designer",
    "Concept 3: visual description for designer"
  ],
  "logo_image_prompt": "Detailed DALL-E prompt for a logo ICON. Must produce: professional icon, clean vector-style, no text, no words, no letters, symbol only."
}`

// No-text DALL-E prompt wrapper
function buildDallePrompt(basePrompt: string, brandName: string): string {
  return `${basePrompt}

CRITICAL REQUIREMENTS — strictly enforce all of these:
- Do NOT include ANY text, letters, words, numbers, or typography anywhere in the image.
- No brand name "${brandName}", no tagline, no labels, no captions.
- Pure icon/symbol only. Abstract or illustrative mark.
- Clean white or very light neutral background.
- Modern, minimal, professional vector-style flat design.
- Suitable for use as an app icon or logo mark.`
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is not set. Add it to .env.local.' },
        { status: 500 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { brandName, brandDescription, assetType } = await request.json()

    if (!brandName || !brandDescription) {
      return NextResponse.json(
        { error: 'Missing required fields: brandName and brandDescription' },
        { status: 400 }
      )
    }

    // Check user limits
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    if (!user.isProMember && user.generationsUsed >= 3) {
      return NextResponse.json(
        { error: 'Generation limit reached. Upgrade to Pro.' },
        { status: 403 }
      )
    }

    // ── Step 1: GPT-4o → structured brand kit JSON ────────────────────────────
    const userPrompt = `Business name: ${brandName}
Asset type requested: ${assetType}
Description: ${brandDescription}`

    const kitResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: BRAND_KIT_SYSTEM_PROMPT },
        { role: 'user',   content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    })

    let brandKit: BrandKitData
    try {
      brandKit = JSON.parse(kitResponse.choices[0].message.content ?? '{}') as BrandKitData
    } catch {
      return NextResponse.json(
        { error: 'GPT-4o returned invalid JSON. Please try again.' },
        { status: 500 }
      )
    }

    // ── Step 2: DALL-E 3 → text-free logo icon ───────────────────────────────
    const dallePrompt = buildDallePrompt(
      brandKit.logo_image_prompt ?? `Professional logo icon for a brand called "${brandName}". ${brandDescription}`,
      brandName
    )

    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: dallePrompt,
      n: 1,
      size: '1024x1024',
    })

    const openAiUrl = imageResponse.data?.[0]?.url
    if (!openAiUrl) {
      return NextResponse.json({ error: 'DALL-E returned no image URL.' }, { status: 500 })
    }

    // ── Step 3: Persist image (Blob in prod, OpenAI URL in dev) ──────────────
    let persistedUrl = openAiUrl

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const imgBuffer = await fetch(openAiUrl).then((r) => r.arrayBuffer())
        const filename = `${brandName.toLowerCase().replace(/\s+/g, '-')}-${String(assetType).toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`
        const blob = await put(filename, imgBuffer, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        })
        persistedUrl = blob.url
      } catch (blobErr) {
        console.error('Blob upload failed, falling back to OpenAI URL:', blobErr)
      }
    }

    // ── Step 4: Save to DB ────────────────────────────────────────────────────
    const asset = await prisma.generatedAsset.create({
      data: {
        userId:       session.user.id,
        brandName,
        assetType,
        imageUrl:     persistedUrl,
        promptUsed:   dallePrompt,
        brandKitData: brandKit as object,
      },
    })

    await prisma.user.update({
      where: { id: session.user.id },
      data:  { generationsUsed: { increment: 1 } },
    })

    return NextResponse.json({ asset, message: 'Asset generated successfully' })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json({ error: 'Failed to generate asset' }, { status: 500 })
  }
}
