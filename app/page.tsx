'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export const dynamic = 'force-dynamic'

export default function Home() {
  const { data: session } = useSession()

  const freeGenerationsLimit = 3
  const generationsUsed = ((session?.user as unknown) as { generationsUsed?: number })?.generationsUsed ?? 0
  const isProMember = ((session?.user as unknown) as { isProMember?: boolean })?.isProMember ?? false
  const generationsRemaining = Math.max(0, freeGenerationsLimit - generationsUsed)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          AI-Powered Brand Generation
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Create stunning brand assets in seconds with AI
        </p>

        {session ? (
          <div className="flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Go to Dashboard
            </Link>
            {!isProMember && (
              <Link
                href="/pricing"
                className="px-8 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>
        ) : (
          <div className="flex justify-center gap-4">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Get Started Free
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Sign In
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              🎨 Logo Generation
            </h3>
            <p className="text-gray-600">
              Create unique, professional logos tailored to your brand identity.
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              🎯 Color Palettes
            </h3>
            <p className="text-gray-600">
              Generate beautiful color schemes that work perfectly for your brand.
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ✨ Brand Assets
            </h3>
            <p className="text-gray-600">
              Get complete brand packages with all the assets you need.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Pricing
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="p-8 border border-gray-200 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
            <p className="text-gray-600 mb-6">Perfect for trying out SNAPBRAND</p>
            <div className="text-4xl font-bold text-gray-900 mb-6">
              $0<span className="text-lg text-gray-600">/month</span>
            </div>
            <ul className="space-y-3 mb-6 text-gray-600">
              <li>✓ 3 free generations</li>
              <li>✓ Basic brand assets</li>
              <li>✓ Download in PNG format</li>
            </ul>
            {!session ? (
              <Link
                href="/auth/signup"
                className="block text-center px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Get Started
              </Link>
            ) : isProMember ? (
              <button disabled className="w-full px-6 py-2 bg-gray-100 text-gray-500 rounded-lg font-semibold cursor-not-allowed">
                Current Plan
              </button>
            ) : (
              <div className="text-sm text-gray-600 text-center py-2">
                {generationsRemaining} generations remaining
              </div>
            )}
          </div>

          {/* Pro Plan */}
          <div className="p-8 border-2 border-blue-600 rounded-lg bg-blue-50">
            <div className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold mb-4">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro</h3>
            <p className="text-gray-600 mb-6">For professional creators</p>
            <div className="text-4xl font-bold text-gray-900 mb-6">
              $9.99<span className="text-lg text-gray-600">/month</span>
            </div>
            <ul className="space-y-3 mb-6 text-gray-600">
              <li>✓ Unlimited generations</li>
              <li>✓ Advanced brand assets</li>
              <li>✓ Download in PNG & SVG</li>
              <li>✓ Priority support</li>
              <li>✓ Commercial license</li>
            </ul>
            {!session ? (
              <Link
                href="/auth/signup"
                className="block text-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Start Free Trial
              </Link>
            ) : isProMember ? (
              <button disabled className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold cursor-not-allowed">
                Current Plan
              </button>
            ) : (
              <Link
                href="/pricing"
                className="block text-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Upgrade Now
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to create your brand?</h2>
          <p className="text-gray-400 mb-8">Start with 3 free generations today</p>
          {!session && (
            <Link
              href="/auth/signup"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Get Started
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
