import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { OpenAI } from 'openai'
import { put } from '@vercel/blob'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { brandName, brandDescription, assetType } = await request.json()

    if (!brandName || !brandDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check user's generation count and pro status
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user can generate
    const freeLimit = 3
    if (!user.isProMember && user.generationsUsed >= freeLimit) {
      return NextResponse.json(
        { error: 'Generation limit reached. Upgrade to Pro.' },
        { status: 403 }
      )
    }

    // Generate description for image
    const prompt = `Create a detailed prompt for generating a professional ${assetType.toLowerCase()} for a brand called "${brandName}".

Brand description: ${brandDescription}

The prompt should be specific, creative, and suitable for DALL-E 3 or similar image generation AI.`

    const descriptionResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
    })

    const imagePrompt = descriptionResponse.choices[0].message.content || ''

    // Generate image
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
    })

    if (!imageResponse.data || !imageResponse.data[0] || !imageResponse.data[0].url) {
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      )
    }

    const imageUrl = imageResponse.data[0].url

    // Download image and upload to Vercel Blob
    const imageResponse2 = await fetch(imageUrl)
    const buffer = await imageResponse2.arrayBuffer()

    const filename = `${brandName.toLowerCase().replace(/\s+/g, '-')}-${assetType.toLowerCase()}-${Date.now()}.png`

    const blobUrl = await put(filename, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    // Save asset to database
    const asset = await prisma.generatedAsset.create({
      data: {
        userId: session.user.id,
        brandName,
        assetType,
        imageUrl: blobUrl.url,
        promptUsed: imagePrompt,
      },
    })

    // Update generation count
    await prisma.user.update({
      where: { id: session.user.id },
      data: { generationsUsed: { increment: 1 } },
    })

    return NextResponse.json({
      asset,
      message: 'Asset generated successfully',
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate asset' },
      { status: 500 }
    )
  }
}
