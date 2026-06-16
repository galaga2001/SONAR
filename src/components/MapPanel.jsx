import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import { THEATERS, UBOAT_CORRIDORS, CONVOY_ROUTES } from '../data/overlays'

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function centroid(coords) {
  const lat = coords.reduce((s, c) => s + c[0], 0) / coords.length
  const lng = coords.reduce((s, c) => s + c[1], 0) / coords.length
  return [lat, lng]
}

function textLabel(latlng, text, color) {
  return L.marker(latlng, {
    interactive: false,
    icon: L.divIcon({
      className: 'map-label',
      html: `<span style="font-family:Oswald,sans-serif;font-size:10px;letter-spacing:1px;color:${color};white-space:nowrap;text-shadow:0 0 4px #000;opacity:0.8">${text}</span>`,
      iconSize: [0, 0],
    }),
  })
}

// Build a wreck marker icon reflecting its current dimmed / selected state.
function makeWreckIcon(w, dimmed, selected) {
  const u = !w.discovered
  const size = u ? 16 : 14
  const hit = 32 // generous transparent click/hover target around the blip
  const cls = [
    'wreck-dot',
    u && 'undiscovered',
    dimmed && 'dimmed',
    selected && 'selected',
  ]
    .filter(Boolean)
    .join(' ')
  return L.divIcon({
    className: 'wreck-icon',
    html: `<span class="wreck-hit"><span class="${cls}" style="width:${size}px;height:${size}px;">${u ? '?' : ''}</span></span>`,
    iconSize: [hit, hit],
    iconAnchor: [hit / 2, hit / 2],
  })
}

// Phosphor cluster bubble showing the contact count.
function clusterIcon(cluster) {
  const n = cluster.getChildCount()
  const size = n < 8 ? 34 : n < 20 ? 42 : 50
  return L.divIcon({
    className: 'wreck-cluster-wrap',
    html: `<div class="wreck-cluster" style="width:${size}px;height:${size}px;">${n}</div>`,
    iconSize: [size, size],
  })
}

export default function MapPanel({
  wrecks,
  filteredIds,
  visibleIds,
  selectedId,
  onSelect,
}) {
  const mapEl = useRef(null)
  const mapRef = useRef(null)
  const clusterRef = useRef(null)
  const markersRef = useRef(new Map()) // id -> { marker, wreck }
  const shownRef = useRef(new Set()) // ids currently in the cluster group
  const iconStateRef = useRef(new Map()) // id -> "dimmed/selected" cache
  const layersRef = useRef({})
  const sweepRef = useRef(null)

  const [overlays, setOverlays] = useState({
    theaters: false,
    uboat: false,
    convoys: false,
    undiscovered: true,
  })

  // ---- init map once ----
  useEffect(() => {
    const map = L.map(mapEl.current, {
      center: [40, -20],
      zoom: 3,
      worldCopyJump: true,
      minZoom: 2,
      maxZoom: 8,
    })
    mapRef.current = map

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; OpenStreetMap &copy; CARTO — data for historical/educational use',
        subdomains: 'abcd',
        maxZoom: 19,
      },
    ).addTo(map)

    // ---- build overlay layer groups ----
    const theaterGroup = L.layerGroup()
    THEATERS.forEach((t) => {
      const poly = L.polygon(t.coords, {
        color: '#4caf74',
        weight: 1,
        opacity: 0.5,
        dashArray: '4 6',
        fillColor: '#1a3a3a',
        fillOpacity: 0.12,
        interactive: false,
        className: 'theater-poly',
      })
      theaterGroup.addLayer(poly)
      theaterGroup.addLayer(textLabel(centroid(t.coords), t.label, '#4caf74'))
    })

    const uboatGroup = L.layerGroup()
    UBOAT_CORRIDORS.forEach((c) => {
      uboatGroup.addLayer(
        L.polyline(c.coords, {
          color: '#c97d2e',
          weight: 2,
          opacity: 0.7,
          dashArray: '2 8',
          interactive: false,
        }),
      )
      uboatGroup.addLayer(textLabel(c.coords[Math.floor(c.coords.length / 2)], c.label, '#c97d2e'))
    })

    const convoyGroup = L.layerGroup()
    CONVOY_ROUTES.forEach((c) => {
      convoyGroup.addLayer(
        L.polyline(c.coords, {
          color: '#3f8f8f',
          weight: 2,
          opacity: 0.8,
          interactive: false,
        }),
      )
      convoyGroup.addLayer(textLabel(c.coords[Math.floor(c.coords.length / 2)], c.label, '#5fb0b0'))
    })

    layersRef.current = { theaterGroup, uboatGroup, convoyGroup }

    // inject SVG hatch pattern for theater polygons (best-effort)
    setTimeout(() => {
      try {
        const svg = mapEl.current.querySelector('.leaflet-overlay-pane svg')
        if (svg && !svg.querySelector('#sonar-hatch')) {
          const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
          defs.innerHTML =
            '<pattern id="sonar-hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#4caf74" stroke-width="1" opacity="0.18"/></pattern>'
          svg.insertBefore(defs, svg.firstChild)
        }
        mapEl.current
          .querySelectorAll('.theater-poly')
          .forEach((p) => p.setAttribute('fill', 'url(#sonar-hatch)'))
      } catch (e) {
        /* hatch is decorative; ignore */
      }
    }, 300)

    // ---- cluster group ----
    const cluster = L.markerClusterGroup({
      maxClusterRadius: 48,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 7,
      iconCreateFunction: clusterIcon,
    })
    cluster.addTo(map)
    clusterRef.current = cluster

    // ---- build markers (added to cluster by the membership effect) ----
    wrecks.forEach((w) => {
      const marker = L.marker([w.lat, w.lng], {
        icon: makeWreckIcon(w, false, false),
        keyboard: true,
        title: w.name,
      })
      marker.on('click', () => onSelect(w.id))
      marker.bindTooltip(w.name, {
        direction: 'top',
        className: 'wreck-tooltip',
        offset: [0, -6],
      })
      markersRef.current.set(w.id, { marker, wreck: w })
    })

    setTimeout(() => map.invalidateSize(), 200)

    // keep tiles filled when the map container is resized (e.g. sidebar drag)
    let rafId
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => map.invalidateSize({ animate: false }))
    })
    ro.observe(mapEl.current)

    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafId)
      map.remove()
      mapRef.current = null
      markersRef.current.clear()
      shownRef.current.clear()
      iconStateRef.current.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- toggle overlay layers ----
  useEffect(() => {
    const map = mapRef.current
    const { theaterGroup, uboatGroup, convoyGroup } = layersRef.current
    if (!map) return
    const sync = (group, on) => {
      if (!group) return
      if (on && !map.hasLayer(group)) group.addTo(map)
      if (!on && map.hasLayer(group)) map.removeLayer(group)
    }
    sync(theaterGroup, overlays.theaters)
    sync(uboatGroup, overlays.uboat)
    sync(convoyGroup, overlays.convoys)
    if (overlays.theaters) {
      setTimeout(() => {
        mapEl.current
          ?.querySelectorAll('.theater-poly')
          .forEach((p) => p.setAttribute('fill', 'url(#sonar-hatch)'))
      }, 50)
    }
  }, [overlays.theaters, overlays.uboat, overlays.convoys])

  // ---- membership (timeline / undiscovered) + icon state (dim / selected) ----
  useEffect(() => {
    const cluster = clusterRef.current
    if (!cluster) return
    const toAdd = []
    const toRemove = []

    markersRef.current.forEach(({ marker, wreck }, id) => {
      const u = !wreck.discovered
      const shouldShow = visibleIds.has(id) && !(u && !overlays.undiscovered)
      const isShown = shownRef.current.has(id)
      if (shouldShow && !isShown) {
        toAdd.push(marker)
        shownRef.current.add(id)
      } else if (!shouldShow && isShown) {
        toRemove.push(marker)
        shownRef.current.delete(id)
      }

      // icon state — only rebuild when it actually changes
      const dimmed = !filteredIds.has(id)
      const selected = id === selectedId
      const key = `${dimmed ? 1 : 0}${selected ? 1 : 0}`
      if (iconStateRef.current.get(id) !== key) {
        marker.setIcon(makeWreckIcon(wreck, dimmed, selected))
        iconStateRef.current.set(id, key)
      }
    })

    if (toRemove.length) cluster.removeLayers(toRemove)
    if (toAdd.length) cluster.addLayers(toAdd)
  }, [visibleIds, filteredIds, selectedId, overlays.undiscovered])

  // ---- reveal the selected wreck, expanding its cluster if needed ----
  useEffect(() => {
    const cluster = clusterRef.current
    if (!cluster || !selectedId) return
    const entry = markersRef.current.get(selectedId)
    if (!entry || !shownRef.current.has(selectedId)) return
    cluster.zoomToShowLayer(entry.marker, () => {})
  }, [selectedId])

  // ---- radar sweep + proximity glow ----
  useEffect(() => {
    if (prefersReducedMotion) return
    const map = mapRef.current
    if (!map) return
    let raf
    const start = performance.now()
    const PERIOD = 12000

    const loop = (now) => {
      const angle = (((now - start) % PERIOD) / PERIOD) * 360
      const size = map.getSize()
      const cx = size.x / 2
      const cy = size.y / 2
      markersRef.current.forEach(({ marker }) => {
        // null when the marker is clustered or off the timeline — skip it
        const el = marker.getElement()
        if (!el) return
        const dot = el.querySelector('.wreck-dot')
        if (!dot || dot.classList.contains('selected')) return
        const pt = map.latLngToContainerPoint(marker.getLatLng())
        const dx = pt.x - cx
        const dy = pt.y - cy
        let a = (Math.atan2(dx, -dy) * 180) / Math.PI
        if (a < 0) a += 360
        let diff = Math.abs(a - angle)
        if (diff > 180) diff = 360 - diff
        if (diff < 4 && !dot.classList.contains('swept')) {
          dot.classList.add('swept')
          setTimeout(() => dot.classList.remove('swept'), 2000)
        }
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const Toggle = ({ k, children }) => (
    <button
      className={`console-btn ${overlays[k] ? 'active' : ''}`}
      onClick={() => setOverlays((o) => ({ ...o, [k]: !o[k] }))}
      aria-pressed={overlays[k]}
    >
      {children}
    </button>
  )

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap gap-1 border-b border-sonar-border p-2">
        <Toggle k="theaters">Theaters</Toggle>
        <Toggle k="uboat">U-Boat Corridors</Toggle>
        <Toggle k="convoys">Convoy Routes</Toggle>
        <Toggle k="undiscovered">Undiscovered</Toggle>
      </div>
      <div className="relative flex-1">
        <div ref={mapEl} className="sonar-map absolute inset-0" />
        {!prefersReducedMotion && (
          <div className="radar-sweep" ref={sweepRef} aria-hidden="true">
            <div className="arm" />
          </div>
        )}
      </div>
    </div>
  )
}
