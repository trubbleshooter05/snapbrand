'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  businessType: string
  examplePrompt: string
}

export function VerticalGenerateForm({ businessType, examplePrompt }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const isProMember =
    ((session?.user as unknown) as { isProMember?: boolean })?.isProMember ?? false

  const [brandName, setBrandName] = useState('')
  const [description, setDescription] = useState(examplePrompt)
  const [generating, setGenerating] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!brandName.trim() || !description.trim()) {
      setFormError('Please enter a brand name and description.')
      return
    }
    setGenerating(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: brandName.trim(),
          brandDescription: `${businessType}: ${description.trim()}`,
          assetType: 'Brand Kit',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (res.status === 403) {
          setFormError(data.error ?? 'Free limit reached. Sign up to continue!')
        } else {
          setFormError(data.error ?? 'Something went wrong. Please try again.')
        }
        return
      }
      router.push(`/brand-kit/${data.asset.id}`)
    } catch {
      setFormError('Network error. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 text-left">
      <form onSubmit={handleGenerate} className="space-y-4">
        {formError && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-sm">
            {formError}
            {formError.toLowerCase().includes('sign up') && (
              <Link href="/auth/signup" className="ml-2 underline text-indigo-400 hover:text-indigo-300">
                Sign up free →
              </Link>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Brand Name</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="e.g. your business name"
            required
            disabled={generating}
            className="w-full px-4 py-3 border border-white/15 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Business type</label>
          <input
            type="text"
            value={businessType}
            readOnly
            className="w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 text-gray-200 cursor-default"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Describe your brand</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your business, audience, and style…"
            rows={4}
            required
            disabled={generating}
            className="w-full px-4 py-3 border border-white/15 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={generating}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {generating ? (
            <span className="animate-pulse">✨ Generating your brand kit…</span>
          ) : (
            '✨ Generate My Brand Kit — Free'
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        No signup required · 3 free generations · Takes ~15 seconds
      </p>

      {session && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-white/10 pt-4">
          <p className="text-sm text-gray-500">Logged in as {session.user?.email}</p>
          <div className="flex gap-3">
            <Link href="/dashboard" className="text-sm text-indigo-400 hover:text-indigo-300">
              Dashboard →
            </Link>
            {!isProMember && (
              <Link href="/pricing" className="text-sm text-gray-400 hover:text-white">
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
