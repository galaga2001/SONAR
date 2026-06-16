import { useMemo, useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MapPanel from './components/MapPanel'
import AboutModal from './components/AboutModal'
import Timeline, { monthIdxToCutoff, isVisibleAt, TOTAL_MONTHS } from './components/Timeline'
import useAudio from './utils/useAudio'
import { filterWrecks } from './utils/filters'
import wrecksData from './data/wrecks.json'

const wrecks = wrecksData

export default function App() {
  const [monthIdx, setMonthIdx] = useState(TOTAL_MONTHS) // start at war's end (all visible)
  const [selectedId, setSelectedId] = useState(null)
  const [muted, setMuted] = useState(true)
  const [aboutOpen, setAboutOpen] = useState(false)

  // ---- resizable sidebar (desktop only) ----
  const DEFAULT_SIDEBAR = 460
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  )
  const [sidebarW, setSidebarW] = useState(() => {
    const saved = Number(localStorage.getItem('sonar-sidebar-w'))
    return saved >= 280 ? saved : DEFAULT_SIDEBAR
  })

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const clampW = useCallback(
    (w) => Math.min(Math.max(w, 300), window.innerWidth - 420),
    [],
  )

  const startResize = (e) => {
    e.preventDefault()
    const move = (ev) => setSidebarW(clampW(window.innerWidth - ev.clientX))
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      setSidebarW((w) => {
        localStorage.setItem('sonar-sidebar-w', String(w))
        return w
      })
    }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const resetResize = () => {
    setSidebarW(DEFAULT_SIDEBAR)
    localStorage.setItem('sonar-sidebar-w', String(DEFAULT_SIDEBAR))
  }

  const [filters, setFilters] = useState({
    query: '',
    war: 'All',
    type: 'All',
    cause: 'All',
    theater: 'All',
    nations: [],
  })

  const { ping } = useAudio(muted)

  // distinct option lists derived from the dataset
  const nations = useMemo(
    () => [...new Set(wrecks.map((w) => w.nation))].sort(),
    [],
  )
  const theaters = useMemo(
    () => [...new Set(wrecks.map((w) => w.theater))].sort(),
    [],
  )

  // timeline cutoff -> which wrecks have been sunk yet
  const cutoff = useMemo(() => monthIdxToCutoff(monthIdx), [monthIdx])
  const visibleIds = useMemo(() => {
    const set = new Set()
    for (const w of wrecks) if (isVisibleAt(w, cutoff)) set.add(w.id)
    return set
  }, [cutoff])

  // filter matching (independent of timeline; non-matches dim rather than vanish)
  const filteredIds = useMemo(() => filterWrecks(wrecks, filters), [filters])

  // wrecks currently counted: visible on timeline AND matching filters
  const countedWrecks = useMemo(
    () => wrecks.filter((w) => visibleIds.has(w.id) && filteredIds.has(w.id)),
    [visibleIds, filteredIds],
  )

  const selectedWreck = useMemo(
    () => wrecks.find((w) => w.id === selectedId) || null,
    [selectedId],
  )

  const handleSelect = (id) => {
    setSelectedId(id)
    ping()
  }

  // keyboard: Esc closes profile / modal
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (aboutOpen) setAboutOpen(false)
        else if (selectedId) setSelectedId(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [aboutOpen, selectedId])

  return (
    <div className="flex h-full flex-col">
      <Header
        visibleWrecks={countedWrecks}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        onAbout={() => setAboutOpen(true)}
      />

      <Timeline monthIdx={monthIdx} setMonthIdx={setMonthIdx} />

      <main className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <section
          className="min-h-[40vh] flex-1 border-sonar-border"
          aria-label="Wreck map"
        >
          <MapPanel
            wrecks={wrecks}
            filteredIds={filteredIds}
            visibleIds={visibleIds}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </section>

        {/* draggable divider (desktop only) */}
        {isDesktop && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar (double-click to reset)"
            tabIndex={0}
            onPointerDown={startResize}
            onDoubleClick={resetResize}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') setSidebarW((w) => clampW(w + 24))
              if (e.key === 'ArrowRight') setSidebarW((w) => clampW(w - 24))
            }}
            className="group relative w-1.5 shrink-0 cursor-col-resize bg-sonar-border transition-colors hover:bg-sonar-phosphor focus:outline-none focus:bg-sonar-phosphor"
            title="Drag to resize • double-click to reset"
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] leading-[3px] text-sonar-bg opacity-60 group-hover:opacity-100">
              ⋮⋮
            </div>
          </div>
        )}

        <aside
          className="overflow-hidden border-sonar-border max-lg:border-t"
          style={isDesktop ? { width: sidebarW, flex: '0 0 auto' } : undefined}
          aria-label="Search and vessel dossier"
        >
          <Sidebar
            filters={filters}
            setFilters={setFilters}
            nations={nations}
            theaters={theaters}
            resultCount={countedWrecks.length}
            results={countedWrecks}
            selectedId={selectedId}
            selectedWreck={selectedWreck}
            onSelect={handleSelect}
            onCloseProfile={() => setSelectedId(null)}
          />
        </aside>
      </main>

      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}

      <div className="crt-overlay" aria-hidden="true" />
    </div>
  )
}
