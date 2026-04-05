'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="border-b border-white/10 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-indigo-300 via-white to-violet-300 bg-clip-text text-transparent logo-glow tracking-tight"
        >
          ✨ SNAPBRAND
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
            Pricing
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                Dashboard
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{session.user?.email}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 bg-white/10 border border-white/10 text-white rounded-lg hover:bg-white/15 transition-all text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
