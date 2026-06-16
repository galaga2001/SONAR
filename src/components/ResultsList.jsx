import { useMemo } from 'react'
import { formatDate } from '../utils/format'

const STATUS_TAG = {
  Undiscovered: { label: 'UNDISCOVERED', color: '#c97d2e' },
  'Partially Salvaged': { label: 'PT. SALVAGED', color: '#c97d2e' },
  Salvaged: { label: 'SALVAGED', color: '#c97d2e' },
  Scrapped: { label: 'SCRAPPED', color: '#cf5a3a' },
}

// Scrollable, clickable list of the currently located vessels. Sorted by date
// of loss. Selecting a row drives the same selection as clicking the map.
export default function ResultsList({ wrecks, selectedId, onSelect }) {
  const sorted = useMemo(
    () => [...wrecks].sort((a, b) => a.date_lost.localeCompare(b.date_lost)),
    [wrecks],
  )

  if (sorted.length === 0) {
    return (
      <div className="boot p-4 font-mono text-sm text-sonar-dim">
        // NO VESSELS MATCH CURRENT FILTERS
        <br />
        <br />
        Widen the filters or advance the timeline to locate contacts.
      </div>
    )
  }

  return (
    <ul className="boot divide-y divide-sonar-border" aria-label="Located vessels">
      {sorted.map((w) => {
        const selected = w.id === selectedId
        return (
          <li key={w.id}>
            <button
              onClick={() => onSelect(w.id)}
              aria-current={selected}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-sonar-border/50 focus:bg-sonar-border/60 focus:outline-none ${
                selected ? 'bg-sonar-border' : ''
              }`}
            >
              {/* side indicator */}
              <span
                className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                style={{
                  background: w.side === 'Allied' ? '#6ff0a6' : '#c97d2e',
                  boxShadow: `0 0 5px ${w.side === 'Allied' ? '#4caf74' : '#c97d2e'}`,
                }}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate font-head text-sm tracking-wide text-sonar-phosphor">
                    {w.name}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-sonar-dim">
                    {w.war}
                  </span>
                </span>
                <span className="flex items-baseline justify-between gap-2 font-mono text-[10px] text-sonar-dim">
                  <span className="truncate">
                    {w.nation} · {w.type}
                    {STATUS_TAG[w.status] && (
                      <span style={{ color: STATUS_TAG[w.status].color }}>
                        {' · '}
                        {STATUS_TAG[w.status].label}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0">{formatDate(w.date_lost)}</span>
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
