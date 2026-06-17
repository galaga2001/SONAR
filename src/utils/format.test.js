import { describe, it, expect } from 'vitest'
import {
  toDMS,
  formatPosition,
  formatDate,
  formatMonthYear,
  metersToFeet,
  commas,
  parseISO,
} from './format'

describe('toDMS', () => {
  it('formats a positive latitude as North', () => {
    expect(toDMS(51.5, true)).toBe('51°30\'00"N')
  })

  it('formats a negative latitude as South', () => {
    expect(toDMS(-33.9, true)).toBe('33°54\'00"S')
  })

  it('formats a positive longitude as East', () => {
    expect(toDMS(139.7, false)).toBe('139°42\'00"E')
  })

  it('formats a negative longitude as West', () => {
    expect(toDMS(-71.0, false)).toBe('71°00\'00"W')
  })

  it('pads single-digit minutes and seconds with zeros', () => {
    expect(toDMS(1.0833, true)).toBe('1°05\'00"N')
  })

  it('handles zero', () => {
    expect(toDMS(0, true)).toBe('0°00\'00"N')
    expect(toDMS(0, false)).toBe('0°00\'00"E')
  })
})

describe('formatPosition', () => {
  it('combines lat and lng into a two-part string', () => {
    const result = formatPosition(48.8566, 2.3522)
    expect(result).toContain('N')
    expect(result).toContain('E')
  })
})

describe('formatDate', () => {
  it('converts ISO date string to display format', () => {
    expect(formatDate('1942-11-13')).toBe('13 NOV 1942')
  })

  it('returns UNKNOWN for null', () => {
    expect(formatDate(null)).toBe('UNKNOWN')
  })

  it('returns UNKNOWN for undefined', () => {
    expect(formatDate(undefined)).toBe('UNKNOWN')
  })

  it('returns UNKNOWN for empty string', () => {
    expect(formatDate('')).toBe('UNKNOWN')
  })

  it('formats January correctly (month index 1)', () => {
    expect(formatDate('1939-01-01')).toBe('01 JAN 1939')
  })

  it('formats December correctly (month index 12)', () => {
    expect(formatDate('1945-12-31')).toBe('31 DEC 1945')
  })

  it('pads single-digit day', () => {
    expect(formatDate('1941-12-07')).toBe('07 DEC 1941')
  })
})

describe('formatMonthYear', () => {
  it('formats a Date as MON YYYY', () => {
    const d = new Date(1942, 5, 1) // June 1942
    expect(formatMonthYear(d)).toBe('JUN 1942')
  })

  it('formats January correctly', () => {
    const d = new Date(1939, 0, 1)
    expect(formatMonthYear(d)).toBe('JAN 1939')
  })

  it('formats December correctly', () => {
    const d = new Date(1945, 11, 1)
    expect(formatMonthYear(d)).toBe('DEC 1945')
  })
})

describe('metersToFeet', () => {
  it('converts 0 meters to 0 feet', () => {
    expect(metersToFeet(0)).toBe(0)
  })

  it('converts 1000 meters to approximately 3281 feet', () => {
    expect(metersToFeet(1000)).toBe(3281)
  })

  it('converts 100 meters to approximately 328 feet', () => {
    expect(metersToFeet(100)).toBe(328)
  })

  it('returns an integer', () => {
    expect(Number.isInteger(metersToFeet(50.5))).toBe(true)
  })
})

describe('commas', () => {
  it('formats a number with thousands separator', () => {
    expect(commas(1000)).toBe('1,000')
  })

  it('formats a large number', () => {
    expect(commas(45000)).toBe('45,000')
  })

  it('leaves small numbers unchanged', () => {
    expect(commas(999)).toBe('999')
  })

  it('handles zero', () => {
    expect(commas(0)).toBe('0')
  })
})

describe('parseISO', () => {
  it('parses a date string into a UTC Date', () => {
    const d = parseISO('1941-12-07')
    expect(d.getUTCFullYear()).toBe(1941)
    expect(d.getUTCMonth()).toBe(11) // December is month 11
    expect(d.getUTCDate()).toBe(7)
  })

  it('does not drift due to timezone offset', () => {
    const d = parseISO('1939-09-01')
    expect(d.getUTCFullYear()).toBe(1939)
    expect(d.getUTCMonth()).toBe(8) // September is month 8
    expect(d.getUTCDate()).toBe(1)
  })

  it('returns midnight UTC', () => {
    const d = parseISO('1945-05-08')
    expect(d.getUTCHours()).toBe(0)
    expect(d.getUTCMinutes()).toBe(0)
  })
})
