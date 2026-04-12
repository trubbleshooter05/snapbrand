import Link from 'next/link'

const SEO_GUIDE_LINKS = [
  { href: '/free-brand-kit-generator', label: 'Free brand kit generator' },
  { href: '/logo-and-brand-kit-generator', label: 'Logo & brand kit generator' },
  { href: '/brand-kit-for-real-estate-agents', label: 'Brand kit for real estate' },
  { href: '/brand-kit-for-small-business', label: 'Brand kit for small business' },
  { href: '/brand-kit-for-startups', label: 'Brand kit for startups' },
  { href: '/brand-kit-for-instagram', label: 'Brand kit for Instagram' },
  { href: '/brand-kit-for-ecommerce', label: 'Brand kit for ecommerce' },
]

const SEO_COMPARE_LINKS = [
  { href: '/snapbrand-vs-looka', label: 'SnapBrand vs Looka' },
  { href: '/snapbrand-vs-canva-brand-kit', label: 'SnapBrand vs Canva Brand Kit' },
  { href: '/snapbrand-vs-hatchful', label: 'SnapBrand vs Hatchful' },
]

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gray-950/90 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-xs text-gray-600 mb-8 max-w-2xl leading-relaxed">
          SnapBrand uses industry-standard hosting and HTTPS. Payments (where applicable) are processed by established
          providers; we do not store full card numbers on our application servers. See{' '}
          <Link href="/privacy" className="text-gray-500 hover:text-gray-400 underline underline-offset-2">
            Privacy
          </Link>{' '}
          for details.
        </p>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5 lg:items-start">
          <nav className="flex flex-col gap-2 text-sm text-gray-400">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Product</p>
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/#generate" className="hover:text-white transition-colors">
              Generate
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>
          <nav className="flex flex-col gap-2 text-sm text-gray-400">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Guides</p>
            {SEO_GUIDE_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </nav>
          <nav className="flex flex-col gap-2 text-sm text-gray-400">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Compare</p>
            {SEO_COMPARE_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </nav>
          <nav className="flex flex-col gap-2 text-sm text-gray-400">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Legal</p>
            {LEGAL_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </nav>
          <p className="text-sm text-gray-500 lg:text-right self-end lg:self-auto">
            &copy; {new Date().getFullYear()} SNAPBRAND. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
