import { metersToFeet } from '../utils/format'

// Stylised echo-sounder cross-section showing the wreck's resting depth between
// the surface and a notional seafloor.
export default function DepthSounder({ depth }) {
  const W = 240
  const H = 150
  const top = 14 // surface y
  const bottom = H - 14 // seafloor y
  // Seafloor sits a little below the wreck depth on the scale.
  const maxDepth = Math.max(depth * 1.25, depth + 40)
  const wreckY = top + ((bottom - top) * depth) / maxDepth
  const scanLines = 9

  return (
    <div className="border border-sonar-border bg-[#06100a] p-2">
      <div className="font-head text-[10px] tracking-widest text-sonar-dim mb-1">
        ECHO SOUNDER // DEPTH PROFILE
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="depth profile">
        {/* horizontal scan lines */}
        {Array.from({ length: scanLines }).map((_, i) => {
          const y = top + ((bottom - top) * i) / (scanLines - 1)
          return (
            <line
              key={i}
              x1="0"
              y1={y}
              x2={W - 34}
              y2={y}
              stroke="#1a3a3a"
              strokeWidth="0.5"
              opacity="0.6"
            />
          )
        })}

        {/* surface */}
        <line x1="0" y1={top} x2={W - 34} y2={top} stroke="#4caf74" strokeWidth="1.2" />
        <text x="2" y={top - 3} fill="#4caf74" fontSize="7" fontFamily="'Share Tech Mono'">
          SURFACE
        </text>

        {/* seafloor */}
        <path
          d={`M0 ${bottom} Q ${W / 3} ${bottom - 8} ${(W - 34) / 2} ${bottom} T ${W - 34} ${bottom}`}
          fill="none"
          stroke="#c97d2e"
          strokeWidth="1"
          opacity="0.7"
        />

        {/* drop line + wreck marker */}
        <line
          x1={(W - 34) / 2}
          y1={top}
          x2={(W - 34) / 2}
          y2={wreckY}
          stroke="#4caf74"
          strokeWidth="0.7"
          strokeDasharray="3 3"
          opacity="0.7"
        />
        <circle cx={(W - 34) / 2} cy={wreckY} r="4" fill="#aeffcf">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <text
          x={(W - 34) / 2 + 8}
          y={wreckY + 3}
          fill="#aeffcf"
          fontSize="8"
          fontFamily="'Share Tech Mono'"
        >
          WRECK
        </text>

        {/* depth scale on the right */}
        {Array.from({ length: 5 }).map((_, i) => {
          const frac = i / 4
          const y = top + (bottom - top) * frac
          const d = Math.round(maxDepth * frac)
          return (
            <text
              key={i}
              x={W - 30}
              y={y + 3}
              fill="#2e5c3e"
              fontSize="7"
              fontFamily="'Share Tech Mono'"
            >
              {d}m
            </text>
          )
        })}
      </svg>
      <div className="font-mono text-[11px] text-sonar-phosphor text-center mt-1">
        RESTING DEPTH: {depth} m / {metersToFeet(depth).toLocaleString()} ft
      </div>
    </div>
  )
}
