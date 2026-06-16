# SONAR — Worldwide Naval Loss Registry

An interactive tracker for **World War I and World War II shipwrecks** across the
world's oceans, styled as a vintage naval radar/sonar console.

![SONAR](https://img.shields.io/badge/SONAR-WW1%E2%80%93WW2-4caf74)

## Features

- **Interactive map** (Leaflet + CartoDB Dark Matter) with custom phosphor wreck
  markers, an ambient radar sweep, and a proximity glow as the sweep arm passes.
- **Timeline scrubber** (1914–1945) — drag or auto-play to watch losses appear
  chronologically, with 17 milestone callouts (Pearl Harbor, Midway, Jutland…).
- **Search & filters** — by name, war, nation (multi-select), ship type, cause of
  loss, and theater. Non-matching wrecks dim rather than disappear.
- **Declassified dossier** for each vessel — full data readout, a class
  silhouette, a "Last Transmission" narrative, and an echo-sounder depth profile.
- **Nation loss counter** that updates live with the timeline and filters.
- **Map overlays** — theaters of war, U-boat patrol corridors, convoy routes, and
  an undiscovered-wrecks layer.
- **CRT aesthetic** — scanlines, vignette, phosphor boot-up fades, optional
  ambient ocean hum + sonar ping (synthesised via the Web Audio API).
- Respects `prefers-reduced-motion`; keyboard-navigable; responsive to tablet.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (default <http://localhost:5173>).

### Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  App.jsx                 main layout + state
  data/
    wrecks.json           seed dataset (32 historically accurate wrecks)
    overlays.js           theaters, corridors, convoy routes, milestones
  components/
    Header.jsx            title bar, loss counter, mute, about
    Timeline.jsx          draggable + auto-play timeline scrubber
    MapPanel.jsx          Leaflet map, markers, overlays, radar sweep
    Sidebar.jsx           filters + dossier wrapper
    Filters.jsx           search & filter controls
    WreckProfile.jsx      declassified vessel dossier
    NationCounter.jsx     allied/axis loss tables
    DepthSounder.jsx      echo-sounder depth cross-section
    Silhouette.jsx        SVG ship side-profiles
    AboutModal.jsx        about dialog
  utils/
    format.js             DMS coords, dates, unit conversions
    useAudio.js           Web Audio ambient hum + ping
```

## Note

All data is compiled for **historical and educational purposes**. Coordinates and
depths are approximate. Many of these sites are designated war graves and
protected by law.
