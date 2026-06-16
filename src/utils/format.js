// Convert a decimal coordinate to degrees / minutes / seconds notation.
export function toDMS(value, isLat) {
  const hemisphere = isLat
    ? value >= 0
      ? 'N'
      : 'S'
    : value >= 0
      ? 'E'
      : 'W'
  const abs = Math.abs(value)
  const deg = Math.floor(abs)
  const minFloat = (abs - deg) * 60
  const min = Math.floor(minFloat)
  const sec = Math.round((minFloat - min) * 60)
  return `${deg}°${String(min).padStart(2, '0')}'${String(sec).padStart(2, '0')}"${hemisphere}`
}

export function formatPosition(lat, lng) {
  return `${toDMS(lat, true)}  ${toDMS(lng, false)}`
}

const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
]

// "1942-11-13" -> "13 NOV 1942"
export function formatDate(iso) {
  if (!iso) return 'UNKNOWN'
  const [y, m, d] = iso.split('-')
  return `${d} ${MONTHS[parseInt(m, 10) - 1]} ${y}`
}

// "1942-11" style label from a Date
export function formatMonthYear(date) {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

export function metersToFeet(m) {
  return Math.round(m * 3.28084)
}

// Numbers with thousands separators.
export function commas(n) {
  return n.toLocaleString('en-US')
}

// Parse "YYYY-MM-DD" into a Date at UTC midnight (avoids TZ drift).
export function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}
