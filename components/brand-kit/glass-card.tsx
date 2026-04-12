import type { ReactNode } from 'react'

type GlassCardProps = {
  children: ReactNode
  className?: string
}

/** Linear-style frosted surface on the brand kit shell (#0A0A0F). */
export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.22)] print:!border-neutral-200 print:!bg-neutral-100 print:!shadow-sm print:!backdrop-blur-none ${className}`}
    >
      {children}
    </div>
  )
}
