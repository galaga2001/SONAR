import { useEffect, useRef, useState, useMemo } from 'react'
import { MILESTONES } from '../data/overlays'
import { parseISO } from '../utils/format'

const START_YEAR = 1914
const END_YEAR = 1945
const TOTAL_MONTHS = (END_YEAR - START_YEAR) * 12 + 11 // 0..383
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

function idxToParts(idx) {
  return { year: START_YEAR + Math.floor(idx / 12), month: idx % 12 }
}
function milestoneToIdx(iso) {
  const [y, m] = iso.split('-').map(Number)
  return (y - START_YEAR) * 12 + (m - 1)
}

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Timeline({ monthIdx, setMonthIdx }) {
  const trackRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [fast, setFast] = useState(false)

  const { year, month } = idxToParts(monthIdx)

  // current milestone (one falling within the current month)
  const currentMilestone = useMemo(
    () => MILESTONES.find((m) => milestoneToIdx(m.date) === monthIdx),
    [monthIdx],
  )

  // ---- autoplay ----
  useEffect(() => {
    if (!playing || prefersReducedMotion) return
    const tick = fast ? 90 : 260
    const id = setInterval(() => {
      setMonthIdx((i) => {
        if (i >= TOTAL_MONTHS) {
          setPlaying(false)
          return i
        }
        return i + 1
      })
    }, tick)
    return () => clearInterval(id)
  }, [playing, fast, setMonthIdx])

  // ---- drag handling ----
  const updateFromClientX = (clientX) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const frac = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    setMonthIdx(Math.round(frac * TOTAL_MONTHS))
  }

  const startDrag = (e) => {
    setPlaying(false)
    e.currentTarget.setPointerCapture?.(e.pointerId)
    const move = (ev) => updateFromClientX(ev.clientX)
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    updateFromClientX(e.clientX)
  }

  const onKey = (e) => {
    if (e.key === 'ArrowLeft') setMonthIdx((i) => Math.max(0, i - 1))
    if (e.key === 'ArrowRight') setMonthIdx((i) => Math.min(TOTAL_MONTHS, i + 1))
    if (e.key === 'Home') setMonthIdx(0)
    if (e.key === 'End') setMonthIdx(TOTAL_MONTHS)
  }

  const pct = (monthIdx / TOTAL_MONTHS) * 100

  return (
    <div className="boot border-b border-sonar-border px-4 pb-3 pt-2">
      <div className="flex items-center gap-3">
        {/* transport controls */}
        <button
          className={`console-btn ${playing ? 'active' : ''}`}
          onClick={() => setPlaying((p) => !p)}
          disabled={prefersReducedMotion}
          title={prefersReducedMotion ? 'Auto-play disabled (reduced motion)' : ''}
          aria-label={playing ? 'Pause timeline' : 'Play timeline'}
        >
          {playing ? '❚❚ Pause' : '▶ Play'}
        </button>
        <button
          className={`console-btn ${fast ? 'active' : ''}`}
          onClick={() => setFast((f) => !f)}
          aria-pressed={fast}
        >
          {fast ? '» Fast' : '› Slow'}
        </button>

        {/* readout */}
        <div className="ml-auto text-right">
          <div className="font-mono text-2xl leading-none text-sonar-phosphor">
            {MONTHS[month]} {year}
          </div>
        </div>
      </div>

      {/* event callout */}
      <div className="h-5">
        {currentMilestone && (
          <div className="boot font-mono text-sm text-sonar-amber">
            // {currentMilestone.label}
          </div>
        )}
      </div>

      {/* the sweep line / track */}
      <div className="relative select-none px-1 pt-4 pb-1">
        <div
          ref={trackRef}
          className="relative h-[2px] w-full cursor-pointer bg-sonar-border"
          onPointerDown={startDrag}
        >
          {/* phosphor fill up to current */}
          <div
            className="absolute left-0 top-0 h-[2px] bg-sonar-phosphor"
            style={{ width: `${pct}%`, boxShadow: '0 0 6px rgba(76,175,116,0.8)' }}
          />

          {/* year ticks */}
          {Array.from({ length: END_YEAR - START_YEAR + 1 }).map((_, i) => {
            const left = (i / (END_YEAR - START_YEAR)) * 100
            const yr = START_YEAR + i
            return (
              <div key={yr} className="absolute top-0" style={{ left: `${left}%` }}>
                <div className="h-2 w-px bg-sonar-dim" />
                {yr % 5 === 0 && (
                  <div className="absolute -translate-x-1/2 pt-1 font-mono text-[9px] text-sonar-dim">
                    {yr}
                  </div>
                )}
              </div>
            )
          })}

          {/* milestone diamonds */}
          {MILESTONES.map((m) => {
            const left = (milestoneToIdx(m.date) / TOTAL_MONTHS) * 100
            return (
              <div
                key={m.date}
                className="absolute -top-[3px] -translate-x-1/2"
                style={{ left: `${left}%` }}
                title={m.label}
              >
                <div
                  className="h-2 w-2 rotate-45 bg-sonar-amber"
                  style={{ boxShadow: '0 0 4px rgba(201,125,46,0.8)' }}
                />
              </div>
            )
          })}

          {/* draggable handle */}
          <div
            role="slider"
            tabIndex={0}
            aria-label="Timeline scrubber"
            aria-valuemin={0}
            aria-valuemax={TOTAL_MONTHS}
            aria-valuenow={monthIdx}
            aria-valuetext={`${MONTHS[month]} ${year}`}
            onPointerDown={startDrag}
            onKeyDown={onKey}
            className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-sonar-phosphor bg-sonar-bg outline-none focus:ring-2 focus:ring-sonar-phosphor"
            style={{ left: `${pct}%`, boxShadow: '0 0 8px rgba(76,175,116,0.9)' }}
          />
        </div>
      </div>
    </div>
  )
}

// Helper exported for App to compute the visibility cutoff date.
export function monthIdxToCutoff(idx) {
  const { year, month } = idxToParts(idx)
  // last day of the current month
  return new Date(Date.UTC(year, month + 1, 0, 23, 59, 59))
}

export { TOTAL_MONTHS }
export const isVisibleAt = (wreck, cutoff) => parseISO(wreck.date_lost) <= cutoff
