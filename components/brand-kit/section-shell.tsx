import type { ReactNode } from 'react'

type SectionShellProps = {
  children: ReactNode
  className?: string
  /** Wider column for dense grids (e.g. application preview). */
  wide?: boolean
}

export function SectionShell({ children, className = '', wide }: SectionShellProps) {
  return (
    <section
      className={`mx-auto border-t border-white/10 px-6 py-24 md:py-32 print:border-neutral-200 print:py-16 ${wide ? 'max-w-6xl' : 'max-w-5xl'} ${className}`}
    >
      {children}
    </section>
  )
}
