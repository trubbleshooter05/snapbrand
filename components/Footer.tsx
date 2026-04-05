import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gray-950/90 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SNAPBRAND. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
