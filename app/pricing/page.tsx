'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export const dynamic = 'force-dynamic'

export default function PricingPage() {
  const { data: session } = useSession()
  const isProMember = ((session?.user as unknown) as { isProMember?: boolean })?.isProMember ?? false
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (!session) {
      window.location.href = '/auth/signup'
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          email: session.user.email,
        }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600">
          Choose the plan that&apos;s right for you
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <div className="border border-gray-300 rounded-lg p-8 bg-white">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
          <p className="text-gray-600 mb-4">Perfect for trying SNAPBRAND</p>

          <div className="mb-6">
            <div className="text-4xl font-bold text-gray-900">
              $0<span className="text-lg text-gray-600">/month</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <span>3 free generations</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <span>Basic brand assets</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <span>PNG format export</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-3">✗</span>
              <span className="line-through">SVG format</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-3">✗</span>
              <span className="line-through">Commercial license</span>
            </li>
          </ul>

          {!session ? (
            <Link
              href="/auth/signup"
              className="block text-center px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Get Started
            </Link>
          ) : isProMember ? (
            <button disabled className="w-full px-6 py-3 bg-gray-100 text-gray-500 rounded-lg font-semibold cursor-not-allowed">
              Current Plan
            </button>
          ) : (
            <div className="text-center px-6 py-3 bg-blue-50 text-blue-900 rounded-lg font-semibold">
              You&apos;re on this plan
            </div>
          )}
        </div>

        {/* Pro Plan */}
        <div className="border-2 border-blue-600 rounded-lg p-8 bg-gradient-to-br from-blue-50 to-indigo-50 relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
            <span className="inline-block px-4 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
              Most Popular
            </span>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
          <p className="text-gray-600 mb-4">For professional creators</p>

          <div className="mb-6">
            <div className="text-4xl font-bold text-gray-900">
              $9.99<span className="text-lg text-gray-600">/month</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Billed monthly</p>
          </div>

          <ul className="space-y-4 mb-8 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <span>Unlimited generations</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <span>Advanced brand assets</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <span>PNG & SVG export</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <span>Commercial license</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <span>Priority support</span>
            </li>
          </ul>

          {!session ? (
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Start Free Trial'}
            </button>
          ) : isProMember ? (
            <button disabled className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold cursor-not-allowed">
              Current Plan
            </button>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Upgrade to Pro'}
            </button>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Can I cancel my subscription anytime?
            </h3>
            <p className="text-gray-600">
              Yes, you can cancel your subscription at any time with no penalties or additional fees.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Do you offer refunds?
            </h3>
            <p className="text-gray-600">
              We offer a 7-day money-back guarantee if you&apos;re not satisfied with the service.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Can I use the generated assets commercially?
            </h3>
            <p className="text-gray-600">
              Free plan assets are for personal use only. Pro plan includes a commercial license allowing you to use assets for commercial purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
