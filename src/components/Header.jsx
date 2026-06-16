import { useState } from 'react'
import NationCounter from './NationCounter'

export default function Header({ visibleWrecks, muted, onToggleMute, onAbout }) {
  const [showLosses, setShowLosses] = useState(false)

  return (
    <header className="boot relative flex items-center justify-between border-b border-sonar-border px-4 py-2">
      {/* CLASSIFIED stamp (decorative) */}
      <div
        className="pointer-events-none absolute right-44 top-1 select-none font-head text-3xl font-bold tracking-widest"
        style={{
          color: '#b3261e',
          opacity: 0.18,
          transform: 'rotate(-12deg)',
          border: '3px solid #b3261e',
          padding: '0 8px',
        }}
        aria-hidden="true"
      >
        CLASSIFIED
      </div>

      <div>
        <h1 className="font-head text-3xl font-bold leading-none tracking-[0.2em] text-sonar-phosphor">
          SONAR
        </h1>
        <p className="font-mono text-[11px] text-sonar-dim">
          WORLDWIDE NAVAL LOSS REGISTRY // WW1–WW2
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            className={`console-btn ${showLosses ? 'active' : ''}`}
            onClick={() => setShowLosses((s) => !s)}
            aria-expanded={showLosses}
          >
            ◍ Loss Counter
          </button>
          {showLosses && (
            <div className="boot absolute right-0 top-full z-[9600] mt-1 max-h-[70vh] w-72 overflow-y-auto border border-sonar-border bg-sonar-bg p-3 shadow-[0_0_20px_rgba(0,0,0,0.7)]">
              <div className="font-mono text-[10px] text-sonar-dim mb-2">
                // {visibleWrecks.length} VESSELS IN CURRENT VIEW
              </div>
              <NationCounter wrecks={visibleWrecks} />
            </div>
          )}
        </div>

        <button
          className="console-btn"
          onClick={onToggleMute}
          aria-pressed={!muted}
          title={muted ? 'Unmute ambient audio' : 'Mute ambient audio'}
        >
          {muted ? '🔇 Muted' : '🔊 Audio'}
        </button>

        <button className="console-btn" onClick={onAbout}>
          About
        </button>
      </div>
    </header>
  )
}
