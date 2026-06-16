import Silhouette from './Silhouette'
import DepthSounder from './DepthSounder'
import { formatDate, formatPosition, metersToFeet, commas } from '../utils/format'

function Field({ label, value }) {
  return (
    <div className="flex items-baseline text-[12px] leading-6">
      <span className="font-head tracking-wider text-sonar-dim shrink-0">{label}</span>
      <span
        className="mx-1 flex-1 overflow-hidden text-sonar-border"
        style={{ letterSpacing: '1px' }}
        aria-hidden="true"
      >
        ....................................................
      </span>
      <span className="text-right font-mono text-sonar-phosphor">{value}</span>
    </div>
  )
}

export default function WreckProfile({ wreck, onClose }) {
  if (!wreck) {
    return (
      <div className="boot p-4 font-mono text-sm text-sonar-dim">
        // NO VESSEL SELECTED
        <br />
        <br />
        Select a contact on the map to open its dossier.
      </div>
    )
  }

  const cause = wreck.cause_detail
    ? `${wreck.cause} — ${wreck.cause_detail}`
    : wreck.cause

  const STATUS_COLORS = {
    Located: '#6ff0a6',
    Undiscovered: '#c97d2e',
    'Partially Salvaged': '#c97d2e',
    Salvaged: '#c97d2e',
    Scrapped: '#cf5a3a',
  }
  const statusColor = STATUS_COLORS[wreck.status] || '#4caf74'
  const statusText =
    wreck.status === 'Located' && wreck.discovery_year
      ? `${wreck.status} (${wreck.discovery_year})`
      : wreck.status

  return (
    <article className="boot p-3" tabIndex={-1} aria-label={`Dossier for ${wreck.name}`}>
      <div className="flex items-center justify-between border-b border-sonar-border pb-1 mb-2">
        <h2 className="font-head text-xl tracking-widest text-sonar-phosphor">
          {wreck.name}
        </h2>
        <button className="console-btn" onClick={onClose} aria-label="Close dossier">
          ✕
        </button>
      </div>

      <div className="font-mono text-[10px] text-sonar-amber mb-2">
        // DECLASSIFIED NAVAL DOSSIER — {wreck.war}
      </div>

      <div className="space-y-0.5">
        <Field label="VESSEL DESIGNATION" value={wreck.name} />
        <Field label="CLASS / TYPE" value={wreck.class} />
        <Field label="DISPLACEMENT" value={`${commas(wreck.displacement_tons)} tons`} />
        <Field label="NATION" value={wreck.nation} />
        <Field label="COMMISSIONED" value={wreck.commissioned_year} />
        <Field label="DATE OF LOSS" value={formatDate(wreck.date_lost)} />
        <Field label="POSITION" value={formatPosition(wreck.lat, wreck.lng)} />
        <Field
          label="DEPTH"
          value={`${wreck.depth_m} m / ${commas(metersToFeet(wreck.depth_m))} ft`}
        />
        <Field label="CAUSE OF LOSS" value={cause} />
        <Field label="THEATER" value={wreck.theater} />
        <Field label="CAMPAIGN" value={wreck.campaign} />
        <Field label="KNOWN CARGO" value={wreck.cargo || '—'} />
        <Field label="DIVE ACCESS" value={wreck.dive_access} />
        <Field
          label="STATUS"
          value={<span style={{ color: statusColor }}>{statusText}</span>}
        />
      </div>

      <div className="my-3 border-y border-sonar-border py-2">
        <div className="font-head text-[10px] tracking-widest text-sonar-dim mb-1">
          CLASS SILHOUETTE — {wreck.type.toUpperCase()}
        </div>
        <Silhouette type={wreck.silhouette_type} />
      </div>

      <div className="mb-3">
        <div className="font-head text-[10px] tracking-widest text-sonar-dim mb-1">
          LAST TRANSMISSION
        </div>
        <p className="cursor-blink font-mono text-[12px] leading-5 text-sonar-phosphor">
          {wreck.narrative}
        </p>
      </div>

      <DepthSounder depth={wreck.depth_m} />
    </article>
  )
}
