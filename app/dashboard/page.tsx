'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

interface UserData {
  generationsUsed: number
  isProMember: boolean
}

interface Asset {
  id: string
  brandName: string
  assetType: string
  imageUrl: string
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])

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

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  const freeGenerationsLimit = 3
  const generationsUsed = userData?.generationsUsed ?? 0
  const isProMember = userData?.isProMember ?? false
  const generationsRemaining = Math.max(0, freeGenerationsLimit - generationsUsed)
  const canGenerate = isProMember || generationsRemaining > 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Welcome back!
      </h1>
      <p className="text-gray-600 mb-8">
        Create stunning brand assets with AI
      </p>

      {/* Plan Status */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Free Tier Info */}
        {!isProMember && (
          <div className="p-6 border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Free Plan
            </h2>
            <p className="text-gray-600 mb-4">
              You&apos;re using the free plan with limited generations
            </p>
            <div className="bg-white p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">
                  {generationsRemaining} / {freeGenerationsLimit} remaining
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${((freeGenerationsLimit - generationsRemaining) / freeGenerationsLimit) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <Link
              href="/pricing"
              className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Upgrade to Pro
            </Link>
          </div>
        )}

        {/* Pro Tier Info */}
        {isProMember && (
          <div className="p-6 border-2 border-blue-600 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Pro Plan
            </h2>
            <p className="text-gray-600 mb-4">
              Unlimited generations and premium features
            </p>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-lg font-bold text-blue-600">
                Unlimited Generations ✨
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Generation Tool */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Generate Brand Assets
        </h2>

        {!canGenerate && !isProMember && (
          <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg mb-6">
            <p className="font-semibold mb-2">Generation limit reached</p>
            <p className="text-sm mb-4">
              You&apos;ve used all 3 free generations. Upgrade to Pro to create unlimited assets.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-semibold text-sm"
            >
              Upgrade Now
            </Link>
          </div>
        )}

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Name
            </label>
            <input
              type="text"
              placeholder="Enter your brand name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Description
            </label>
            <textarea
              placeholder="Describe your brand, industry, and style preferences"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asset Type
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Logo</option>
              <option>Color Palette</option>
              <option>Complete Brand Package</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!canGenerate}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {canGenerate ? 'Generate Assets' : 'Upgrade to Generate'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-blue-900">💡 Tip:</span> Be as specific as possible in your description for better results. Include your industry, target audience, and preferred styles.
          </p>
        </div>
      </div>

      {/* Generated Assets */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Your Generated Assets
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {assets.length > 0 ? (
            assets.map((asset) => (
              <div key={asset.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="relative w-full h-48">
                  <Image
                    src={asset.imageUrl}
                    alt={asset.brandName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{asset.brandName}</h3>
                  <p className="text-sm text-gray-600">{asset.assetType}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 col-span-3">
              <p>No assets generated yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
