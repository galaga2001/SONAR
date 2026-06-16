/**
 * Pure filter predicate extracted from App.jsx so it can be unit-tested
 * without rendering the full component tree.
 *
 * Returns a Set of wreck IDs that match `filters`.
 * Non-matching wrecks are dimmed on the map rather than hidden, so this
 * runs independently of the timeline visibility check (visibleIds).
 */
export function filterWrecks(wrecks, filters) {
  const q = filters.query.trim().toLowerCase()
  const result = new Set()
  for (const w of wrecks) {
    if (q && !w.name.toLowerCase().includes(q)) continue
    if (filters.war !== 'All' && w.war !== filters.war) continue
    if (filters.type !== 'All' && w.type !== filters.type) continue
    if (filters.cause !== 'All' && w.cause !== filters.cause) continue
    if (filters.theater !== 'All' && w.theater !== filters.theater) continue
    if (filters.nations.length && !filters.nations.includes(w.nation)) continue
    result.add(w.id)
  }
  return result
}
