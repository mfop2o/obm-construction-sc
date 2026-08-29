import type { CSSProperties } from 'react'

/* ============================================================================
   Arquitetural / engineering SVG visuals.
   Crafted in the OBM brand palette so the site looks premium WITHOUT relying
   on external imagery. Swap for real photography via src/data/images.ts when
   production assets are available.
   ========================================================================== */

interface VisualProps {
  className?: string
  style?: CSSProperties
}

/* ---- Construction site scene (hero) ------------------------------------- */
export function CraneScene({ className, style }: VisualProps) {
  return (
    <svg
      viewBox="0 0 800 600"
      className={className}
      style={style}
      role="img"
      aria-label="Construction site illustration"
      fill="none"
    >
      {/* blueprint grid */}
      <g stroke="#101820" strokeOpacity="0.06" strokeWidth="1">
        {Array.from({ length: 12 }).map((_, x) => (
          <line key={`v${x}`} x1={x * 66.7} y1="0" x2={x * 66.7} y2="600" />
        ))}
        {Array.from({ length: 9 }).map((_, y) => (
          <line key={`h${y}`} x1="0" y1={y * 66.7} x2="800" y2={y * 66.7} />
        ))}
      </g>

      {/* ground */}
      <rect x="0" y="520" width="800" height="80" fill="#101820" />

      {/* building under construction */}
      <rect x="120" y="180" width="260" height="340" fill="#1a232e" />
      <g stroke="#2c3a48" strokeWidth="1.5">
        {[0, 1, 2, 3, 4, 5].map((r) => (
          <line key={`b${r}`} x1="120" y1={220 + r * 50} x2="380" y2={220 + r * 50} />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((c) => (
          <line key={`c${c}`} x1={140 + c * 38} y1="180" x2={140 + c * 38} y2="520" />
        ))}
      </g>
      {/* scaffold */}
      <g stroke="#D99A2B" strokeOpacity="0.9" strokeWidth="3">
        <line x1="96" y1="520" x2="96" y2="150" />
        <line x1="140" y1="520" x2="140" y2="150" />
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`s${i}`} x1="88" y1={190 + i * 52} x2="148" y2={190 + i * 52} />
        ))}
      </g>

      {/* crane - mast */}
      <rect x="470" y="120" width="18" height="400" fill="#101820" />
      <g stroke="#101820" strokeWidth="3">
        <line x1="470" y1="160" x2="488" y2="160" />
        <line x1="470" y1="220" x2="488" y2="220" />
        <line x1="470" y1="280" x2="488" y2="280" />
        <line x1="470" y1="340" x2="488" y2="340" />
        <line x1="470" y1="400" x2="488" y2="400" />
        <line x1="470" y1="460" x2="488" y2="460" />
      </g>
      {/* crane - jib */}
      <g stroke="#101820" strokeWidth="6">
        <line x1="479" y1="120" x2="760" y2="120" />
        <line x1="479" y1="120" x2="479" y2="50" />
        <line x1="479" y1="50" x2="200" y2="50" />
      </g>
      {/* cables */}
      <g stroke="#D99A2B" strokeWidth="1.5">
        <line x1="650" y1="120" x2="620" y2="300" />
        <line x1="720" y1="120" x2="690" y2="300" />
        <line x1="760" y1="120" x2="720" y2="300" />
      </g>
      {/* counterweight */}
      <rect x="200" y="102" width="70" height="18" fill="#73777B" />
      {/* hook */}
      <g stroke="#D99A2B" strokeWidth="3" fill="none">
        <line x1="655" y1="120" x2="655" y2="180" />
        <path d="M645 180 a10 10 0 0 0 20 0" />
      </g>

      {/* crane base */}
      <rect x="440" y="520" width="80" height="16" fill="#101820" />
    </svg>
  )
}

/* ---- Abstract building facade (projects) -------------------------------- */
export function BuildingFacade({
  className,
  style,
  variant = 0,
}: VisualProps & { variant?: number }) {
  const facades = [
    { base: '#1a232e', line: '#33404f', accent: 0 },
    { base: '#101820', line: '#33404f', accent: 1 },
    { base: '#232c38', line: '#3a4857', accent: 2 },
  ]
  const f = facades[variant % facades.length]

  return (
    <svg
      viewBox="0 0 560 720"
      className={className}
      style={style}
      role="img"
      aria-label="Building facade illustration"
      fill="none"
    >
      <rect width="560" height="720" fill={f.base} />
      <g stroke={f.line} strokeWidth="2">
        {Array.from({ length: 9 }).map((_, r) => (
          <line key={`r${r}`} x1="40" y1={90 + r * 72} x2="520" y2={90 + r * 72} />
        ))}
        {Array.from({ length: 7 }).map((_, c) => (
          <line key={`c${c}`} x1={60 + c * 74} y1="40" x2={60 + c * 74} y2="680" />
        ))}
      </g>
      {/* windows */}
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 6 }).map((__, c) => {
          const lit = (r * 2 + c) % (f.accent + 3) === 0
          return (
            <rect
              key={`w${r}-${c}`}
              x={74 + c * 74}
              y={104 + r * 72}
              width="40"
              height="44"
              fill={lit ? '#D99A2B' : '#0d141b'}
              opacity={lit ? 0.9 : 0.6}
            />
          )
        }),
      )}
    </svg>
  )
}

/* ---- Infrastructure / road visual --------------------------------------- */
export function RoadWorks({ className, style }: VisualProps) {
  return (
    <svg
      viewBox="0 0 560 400"
      className={className}
      style={style}
      role="img"
      aria-label="Infrastructure illustration"
      fill="none"
    >
      <rect width="560" height="400" fill="#18212b" />
      <path d="M0 320 L560 220 V400 H0 Z" fill="#101820" />
      <g stroke="#D99A2B" strokeOpacity="0.7" strokeWidth="3">
        <path d="M0 340 L560 240" />
        <path d="M0 360 L560 260" />
      </g>
      <g stroke="#73777B" strokeWidth="6" opacity="0.8">
        <line x1="90" y1="400" x2="90" y2="250" />
        <line x1="470" y1="400" x2="470" y2="150" />
      </g>
      {/* lamp posts */}
      <g stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="3">
        <line x1="140" y1="400" x2="140" y2="300" />
        <line x1="140" y1="300" x2="170" y2="300" />
        <line x1="340" y1="400" x2="340" y2="300" />
        <line x1="340" y1="300" x2="370" y2="300" />
      </g>
      <circle cx="170" cy="300" r="6" fill="#D99A2B" />
      <circle cx="370" cy="300" r="6" fill="#D99A2B" />
    </svg>
  )
}

/* ---- Structural framework / blueprint ----------------------------------- */
export function Framework({ className, style }: VisualProps) {
  return (
    <svg
      viewBox="0 0 560 400"
      className={className}
      style={style}
      role="img"
      aria-label="Structural framework illustration"
      fill="none"
    >
      <rect width="560" height="400" fill="#101820" />
      <g stroke="#2c3a48" strokeWidth="2">
        <path d="M40 360 L520 60" />
        <path d="M40 340 L520 40" />
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={80 + i * 130}
            y1="360"
            x2={80 + i * 130}
            y2={60 + i * 130}
          />
        ))}
      </g>
      <circle cx="520" cy="60" r="14" stroke="#D99A2B" strokeWidth="2" />
      <circle cx="40" cy="360" r="14" stroke="#D99A2B" strokeWidth="2" />
      <g fill="#73777B" opacity="0.5">
        <circle cx="210" cy="270" r="5" />
        <circle cx="470" cy="110" r="5" />
        <circle cx="340" cy="210" r="5" />
      </g>
    </svg>
  )
}
