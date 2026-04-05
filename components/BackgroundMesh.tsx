'use client'

export default function BackgroundMesh() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Top-left — Indigo #4F46E5 */}
      <div
        className="absolute -top-64 -left-64 w-[600px] h-[600px] rounded-full opacity-[0.18] animate-mesh-float"
        style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)' }}
      />

      {/* Bottom-right — Violet #7C3AED */}
      <div
        className="absolute -bottom-64 -right-64 w-[700px] h-[700px] rounded-full opacity-[0.18] animate-mesh-float-reverse"
        style={{
          background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
          animationDelay: '4s',
        }}
      />

      {/* Top-right secondary — Indigo */}
      <div
        className="absolute -top-32 -right-32 w-[380px] h-[380px] rounded-full opacity-[0.10] animate-mesh-float"
        style={{
          background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)',
          animationDelay: '8s',
        }}
      />

      {/* Centre accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[280px] rounded-full opacity-[0.07] animate-mesh-float-reverse"
        style={{
          background:
            'radial-gradient(ellipse, #4F46E5 0%, #7C3AED 50%, transparent 75%)',
          animationDelay: '12s',
        }}
      />
    </div>
  )
}
