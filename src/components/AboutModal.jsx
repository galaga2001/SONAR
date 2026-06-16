export default function AboutModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[9500] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="About SONAR"
    >
      <div
        className="boot max-w-lg border border-sonar-phosphor bg-sonar-bg p-6 shadow-[0_0_30px_rgba(76,175,116,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-head text-2xl tracking-widest text-sonar-phosphor">
            ABOUT SONAR
          </h2>
          <button
            className="console-btn"
            onClick={onClose}
            aria-label="Close about dialog"
          >
            CLOSE ✕
          </button>
        </div>
        <p className="font-mono text-sm leading-6 text-sonar-phosphor mb-4">
          SONAR is an interactive registry charting the naval losses of the First
          and Second World Wars across the world's oceans. Slide through time,
          filter by nation, theater and cause, and open a vessel to read its
          dossier — from the great fleet actions to the lonely wrecks still
          waiting to be found on the seabed.
        </p>
        <p className="font-mono text-xs leading-5 text-sonar-dim">
          // All data is compiled for historical and educational purposes.
          Coordinates and depths are approximate. Many of these sites are
          designated war graves and protected by law — they should be treated
          with respect.
        </p>
      </div>
    </div>
  )
}
