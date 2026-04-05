import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Brand kits are publicly accessible via their URL (shareable links)
    const asset = await prisma.generatedAsset.findUnique({
      where: { id: params.id },
    })

    if (!asset) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(asset)
  } catch (error) {
    console.error('Brand kit fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch brand kit' }, { status: 500 })
  }
}
