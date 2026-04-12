'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface UserData {
  generationsUsed: number
  isProMember: boolean
}

interface ColorEntry { hex: string; name: string; usage: string }

interface Asset {
  id: string
  brandName: string
  assetType: string
  imageUrl: string
  logoSvg: string | null
  wordmarkSvg: string | null
  createdAt: string
  brandKitData: {
    color_palette?: Record<string, ColorEntry>
  } | null
}

const ASSET_TYPES = ['Logo', 'Color Palette', 'Complete Brand Package'] as const

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [brandName, setBrandName] = useState('')
  const [brandDescription, setBrandDescription] = useState('')
  const [assetType, setAssetType] = useState<string>(ASSET_TYPES[0])
  const [generating, setGenerating] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData()
      fetchAssets()
    }
  }, [session])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/assets')
      if (response.ok) {
        const data = await response.json()
        setAssets(data)
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error)
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    const name = brandName.trim()
    const desc = brandDescription.trim()
    if (!name || !desc) {
      setFormError('Please enter a brand name and description.')
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: name,
          brandDescription: desc,
          assetType,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setFormError(typeof data.error === 'string' ? data.error : 'Generation failed. Try again.')
        return
      }
      // Redirect straight to the rich brand kit results page
      router.push(`/brand-kit/${data.asset.id}`)
    } catch (err) {
      console.error(err)
      setFormError('Network error. Is the dev server running?')
    } finally {
      setGenerating(false)
    }
  }

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-lg text-gray-400">Loading...</div>
      </div>
    )
  }

  const freeGenerationsLimit = 3
  const generationsUsed = userData?.generationsUsed ?? 0
  const isProMember = userData?.isProMember ?? false
  const generationsRemaining = Math.max(0, freeGenerationsLimit - generationsUsed)
  const canGenerate = isProMember || generationsRemaining > 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-white">
      <h1 className="text-4xl font-bold text-white mb-2">
        Welcome back!
      </h1>
      <p className="text-gray-400 mb-8">
        Create stunning brand assets with AI
      </p>

      {/* Plan Status */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {!isProMember && (
          <div
            className={[
              'p-6 rounded-2xl border border-white/10',
              'bg-slate-900/80 backdrop-blur-2xl',
            ].join(' ')}
          >
            <h2 className="text-xl font-semibold text-white mb-2">
              Free Plan
            </h2>
            <p className="text-gray-400 mb-4 text-sm">
              You&apos;re using the free plan with limited generations
            </p>
            <div className="bg-white/5 p-4 rounded-xl mb-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">
                  {generationsRemaining} / {freeGenerationsLimit} remaining
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${((freeGenerationsLimit - generationsRemaining) / freeGenerationsLimit) * 100}%`,
                  }}
                />
              </div>
            </div>
            <Link
              href="/pricing"
              className="block text-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold"
            >
              Upgrade to Pro
            </Link>
          </div>
        )}

        {isProMember && (
          <div
            className={[
              'p-6 rounded-2xl border border-indigo-500/40',
              'bg-slate-900/80 backdrop-blur-2xl',
            ].join(' ')}
          >
            <h2 className="text-xl font-semibold text-white mb-2">
              Pro Plan
            </h2>
            <p className="text-gray-400 mb-4 text-sm">
              Unlimited generations and premium features
            </p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-lg font-bold text-indigo-300">
                Unlimited Generations ✨
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Generation Tool */}
      <div
        className={[
          'rounded-2xl p-8 border border-white/10',
          'bg-slate-900/80 backdrop-blur-2xl',
        ].join(' ')}
      >
        <h2 className="text-2xl font-semibold text-white mb-6">
          Generate Brand Assets
        </h2>

        {!canGenerate && !isProMember && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-xl mb-6 text-sm">
            <p className="font-semibold mb-2">Generation limit reached</p>
            <p className="mb-4 text-amber-200/90">
              You&apos;ve used all 3 free generations. Upgrade to Pro to create unlimited assets.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 font-semibold text-sm"
            >
              Upgrade Now
            </Link>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleGenerate}>
          {formError && (
            <div className="p-4 bg-red-500/10 border border-red-500/40 text-red-200 rounded-xl text-sm">
              {formError}
            </div>
          )}

          <div>
            <label htmlFor="brandName" className="block text-sm font-medium text-gray-300 mb-2">
              Brand Name
            </label>
            <input
              id="brandName"
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Enter your brand name"
              disabled={!canGenerate || generating}
              className="w-full px-4 py-2.5 border border-white/15 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="brandDescription" className="block text-sm font-medium text-gray-300 mb-2">
              Brand Description
            </label>
            <textarea
              id="brandDescription"
              value={brandDescription}
              onChange={(e) => setBrandDescription(e.target.value)}
              placeholder="Describe your brand, industry, and style preferences"
              rows={4}
              disabled={!canGenerate || generating}
              className="w-full px-4 py-2.5 border border-white/15 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="assetType" className="block text-sm font-medium text-gray-300 mb-2">
              Asset Type
            </label>
            <select
              id="assetType"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              disabled={!canGenerate || generating}
              className="w-full px-4 py-2.5 border border-white/15 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
            >
              {ASSET_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!canGenerate || generating}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {generating ? 'Generating…' : canGenerate ? 'Generate Assets' : 'Upgrade to Generate'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-indigo-300">💡 Tip:</span>{' '}
            Be as specific as possible in your description for better results. Include your industry,
            target audience, and preferred styles.
          </p>
          <p className="text-xs text-gray-500 mt-3">
            Local dev needs <code className="text-gray-400">OPENAI_API_KEY</code> in{' '}
            <code className="text-gray-400">.env.local</code>. Without it, generation returns an error.
            Optional: <code className="text-gray-400">BLOB_READ_WRITE_TOKEN</code> for permanent image URLs on Vercel Blob.
          </p>
        </div>
      </div>

      {/* Generated Assets */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Your Generated Assets
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {assets.length > 0 ? (
            assets.map((asset) => {
              const palette = asset.brandKitData?.color_palette
              const paletteColors = palette ? Object.values(palette) : []
              const primaryHex = paletteColors[0]?.hex ?? '#4F46E5'
              return (
                <Link
                  key={asset.id}
                  href={`/brand-kit/${asset.id}`}
                  className="block border border-white/10 rounded-2xl overflow-hidden bg-slate-900/60 hover:border-indigo-500/50 transition-all duration-300 group"
                >
                  {/* Color bar */}
                  <div className="flex h-2">
                    {paletteColors.length > 0
                      ? paletteColors.map((c, i) => (
                          <div key={i} className="flex-1" style={{ backgroundColor: c.hex }} />
                        ))
                      : <div className="flex-1 bg-indigo-600" />}
                  </div>

                  {/* SVG monogram + info */}
                  <div className="p-5 flex items-center gap-4">
                    <div
                      className="w-14 h-14 shrink-0 rounded-xl overflow-hidden"
                      style={{ background: primaryHex }}
                    >
                      {asset.logoSvg ? (
                        <div
                          className="w-full h-full"
                          dangerouslySetInnerHTML={{ __html: asset.logoSvg }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                          {asset.brandName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                        {asset.brandName}
                      </p>
                      <p className="text-sm text-gray-400">{asset.assetType}</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="col-span-full min-h-[200px] border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center text-gray-500 bg-slate-900/40">
              <p>No assets generated yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
