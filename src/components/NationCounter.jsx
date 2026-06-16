import { useMemo } from 'react'
import { commas } from '../utils/format'

// Aggregates visible wrecks into Allied / Axis loss tables by nation.
export default function NationCounter({ wrecks }) {
  const { allied, axis } = useMemo(() => {
    const tally = {}
    for (const w of wrecks) {
      const key = `${w.side}|${w.nation}`
      if (!tally[key]) tally[key] = { side: w.side, nation: w.nation, count: 0, tons: 0 }
      tally[key].count += 1
      tally[key].tons += w.displacement_tons || 0
    }
    const rows = Object.values(tally).sort((a, b) => b.tons - a.tons)
    return {
      allied: rows.filter((r) => r.side === 'Allied'),
      axis: rows.filter((r) => r.side === 'Axis'),
    }
  }, [wrecks])

  const Table = ({ title, rows }) => (
    <div className="mb-3">
      <div className="font-head text-xs tracking-widest text-sonar-amber border-b border-sonar-border pb-1 mb-1">
        {title}
      </div>
      {rows.length === 0 && (
        <div className="text-sonar-dim text-[11px]">// NO LOSSES IN RANGE</div>
      )}
      {rows.map((r) => (
        <div
          key={r.nation}
          className="flex justify-between text-[11px] leading-5 text-sonar-phosphor"
        >
          <span className="truncate">{r.nation}</span>
          <span className="text-sonar-dim whitespace-nowrap pl-2">
            {r.count} / {commas(r.tons)} t
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="font-mono">
      <Table title="ALLIED LOSSES" rows={allied} />
      <Table title="AXIS LOSSES" rows={axis} />
    </div>
  )
}
