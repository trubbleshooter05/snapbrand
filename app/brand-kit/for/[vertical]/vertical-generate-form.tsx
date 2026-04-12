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

  /* Light fields on dark page — same pattern as homepage / dashboard (max contrast). */
  const fieldClass =
    'w-full px-4 py-3 rounded-xl border border-zinc-600/40 bg-white text-gray-900 placeholder:text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <div className="relative z-10 isolate rounded-2xl border border-white/15 bg-zinc-900/90 shadow-2xl shadow-black/50 p-6 md:p-8 text-left ring-1 ring-white/10">
      <form onSubmit={handleGenerate} className="space-y-5">
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
          <label htmlFor="brand-name" className="block text-sm font-medium text-zinc-100 mb-2">
            Brand name
          </label>
          <input
            id="brand-name"
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="e.g. your business name"
            required
            disabled={generating}
            autoComplete="organization"
            className={fieldClass}
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <label htmlFor="business-type" className="block text-sm font-medium text-zinc-100">
              Business type
            </label>
            <span className="text-[11px] text-zinc-400 shrink-0">Set for this page</span>
          </div>
          <input
            id="business-type"
            type="text"
            value={businessType}
            readOnly
            aria-readonly="true"
            title="Business type for this industry page"
            className={`${fieldClass} cursor-default bg-zinc-100 text-gray-900 ring-1 ring-indigo-400/40`}
          />
        </div>

        <div>
          <label htmlFor="brand-description" className="block text-sm font-medium text-zinc-100 mb-2">
            Describe your brand
          </label>
          <textarea
            id="brand-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your business, audience, and style…"
            rows={4}
            required
            disabled={generating}
            className={`${fieldClass} resize-y min-h-[120px] leading-relaxed`}
          />
        </div>

        <button
          type="submit"
          disabled={generating}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-950/50"
        >
          {generating ? (
            <span className="animate-pulse">✨ Generating your brand kit…</span>
          ) : (
            '✨ Generate My Brand Kit — Free'
          )}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-400 mt-5">
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
