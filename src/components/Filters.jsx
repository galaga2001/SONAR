const SHIP_TYPES = [
  'Battleship',
  'Destroyer',
  'U-Boat/Submarine',
  'Cruiser',
  'Transport/Cargo',
  'Carrier',
  'Minesweeper',
  'Other',
]
const CAUSES = [
  'Torpedo',
  'Air Attack',
  'Mine',
  'Gunfire',
  'Scuttled',
  'Storm',
  'Collision',
  'Unknown',
]

export default function Filters({ filters, setFilters, nations, theaters, resultCount }) {
  const update = (patch) => setFilters((f) => ({ ...f, ...patch }))

  const toggleNation = (nation) => {
    update({
      nations: filters.nations.includes(nation)
        ? filters.nations.filter((n) => n !== nation)
        : [...filters.nations, nation],
    })
  }

  return (
    <div className="boot border-b border-sonar-border p-3 space-y-2">
      <input
        type="search"
        className="sonar-input"
        placeholder="SEARCH VESSEL NAME…"
        value={filters.query}
        onChange={(e) => update({ query: e.target.value })}
        aria-label="Search vessel name"
      />

      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="font-head text-[10px] tracking-widest text-sonar-dim">WAR</span>
          <select
            className="sonar-select"
            value={filters.war}
            onChange={(e) => update({ war: e.target.value })}
          >
            <option value="All">ALL</option>
            <option value="WW1">WW1</option>
            <option value="WW2">WW2</option>
          </select>
        </label>

        <label className="block">
          <span className="font-head text-[10px] tracking-widest text-sonar-dim">TYPE</span>
          <select
            className="sonar-select"
            value={filters.type}
            onChange={(e) => update({ type: e.target.value })}
          >
            <option value="All">ALL</option>
            {SHIP_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.toUpperCase()}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="font-head text-[10px] tracking-widest text-sonar-dim">CAUSE</span>
          <select
            className="sonar-select"
            value={filters.cause}
            onChange={(e) => update({ cause: e.target.value })}
          >
            <option value="All">ALL</option>
            {CAUSES.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="font-head text-[10px] tracking-widest text-sonar-dim">THEATER</span>
          <select
            className="sonar-select"
            value={filters.theater}
            onChange={(e) => update({ theater: e.target.value })}
          >
            <option value="All">ALL</option>
            {theaters.map((t) => (
              <option key={t} value={t}>
                {t.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <span className="font-head text-[10px] tracking-widest text-sonar-dim">
          NATION (MULTI-SELECT)
        </span>
        <div className="mt-1 flex flex-wrap gap-1">
          {nations.map((n) => (
            <button
              key={n}
              className={`console-btn ${filters.nations.includes(n) ? 'active' : ''}`}
              onClick={() => toggleNation(n)}
              aria-pressed={filters.nations.includes(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="font-mono text-xs text-sonar-amber pt-1">
        // {resultCount} VESSELS LOCATED
      </div>
    </div>
  )
}
