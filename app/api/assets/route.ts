import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserAssets } from '@/lib/db'

export const dynamic = 'force-dynamic'

function isDynamicServerUsage(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    (error as { digest?: string }).digest === 'DYNAMIC_SERVER_USAGE'
  )
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const assets = await getUserAssets(session.user.id)

    return NextResponse.json(assets)
  } catch (error) {
    if (isDynamicServerUsage(error)) {
      return NextResponse.json({ error: 'Unavailable' }, { status: 503 })
    }
    console.error('Assets fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    )
  }
}
