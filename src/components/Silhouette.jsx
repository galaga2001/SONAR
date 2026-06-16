// Simple side-profile ship silhouettes drawn as SVG paths, rendered in dim
// phosphor green. Selected by silhouette_type.

const PATHS = {
  battleship: (
    <g>
      <path d="M5 42 L155 42 L148 52 L18 52 Z" />
      <rect x="35" y="34" width="90" height="8" />
      <rect x="60" y="22" width="14" height="12" />
      <rect x="78" y="26" width="8" height="8" />
      <path d="M66 8 L70 22 L62 22 Z" />
      <rect x="30" y="36" width="10" height="3" />
      <rect x="120" y="36" width="10" height="3" />
    </g>
  ),
  cruiser: (
    <g>
      <path d="M8 42 L152 42 L144 51 L20 51 Z" />
      <rect x="45" y="35" width="70" height="7" />
      <rect x="68" y="24" width="10" height="11" />
      <path d="M72 12 L75 24 L69 24 Z" />
      <rect x="100" y="30" width="6" height="5" />
    </g>
  ),
  destroyer: (
    <g>
      <path d="M10 44 L150 44 L142 51 L22 51 Z" />
      <rect x="55" y="38" width="50" height="6" />
      <rect x="70" y="28" width="8" height="10" />
      <rect x="85" y="32" width="6" height="6" />
      <path d="M73 18 L76 28 L70 28 Z" />
    </g>
  ),
  submarine: (
    <g>
      <path d="M12 44 q70 -14 140 0 q-70 12 -140 0 Z" />
      <rect x="72" y="30" width="16" height="14" rx="3" />
      <rect x="79" y="20" width="2" height="10" />
    </g>
  ),
  carrier: (
    <g>
      <path d="M5 40 L155 40 L148 50 L16 50 Z" />
      <rect x="5" y="36" width="150" height="4" />
      <rect x="110" y="22" width="12" height="14" />
      <rect x="113" y="14" width="2" height="8" />
    </g>
  ),
  transport: (
    <g>
      <path d="M10 42 L150 42 L143 51 L20 51 Z" />
      <rect x="50" y="32" width="60" height="10" />
      <rect x="62" y="22" width="9" height="10" />
      <rect x="80" y="22" width="9" height="10" />
    </g>
  ),
}

export default function Silhouette({ type, className = '' }) {
  const shape = PATHS[type] || PATHS.transport
  return (
    <svg
      viewBox="0 0 160 60"
      className={className}
      role="img"
      aria-label={`${type || 'vessel'} silhouette`}
      style={{ width: '100%', height: 'auto' }}
    >
      <g fill="#2e5c3e" stroke="#4caf74" strokeWidth="0.6" opacity="0.85">
        {shape}
      </g>
      <line x1="0" y1="51" x2="160" y2="51" stroke="#1f3d2a" strokeWidth="1" />
    </svg>
  )
}
