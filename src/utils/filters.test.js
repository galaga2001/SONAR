import { describe, it, expect } from 'vitest'
import { filterWrecks } from './filters'

const DEFAULT_FILTERS = {
  query: '',
  war: 'All',
  type: 'All',
  cause: 'All',
  theater: 'All',
  nations: [],
}

const SAMPLE_WRECKS = [
  {
    id: 1,
    name: 'Bismarck',
    war: 'WW2',
    type: 'Battleship',
    cause: 'Gunfire',
    theater: 'North Atlantic',
    nation: 'Germany',
  },
  {
    id: 2,
    name: 'Hood',
    war: 'WW2',
    type: 'Battleship',
    cause: 'Gunfire',
    theater: 'North Atlantic',
    nation: 'United Kingdom',
  },
  {
    id: 3,
    name: 'U-47',
    war: 'WW2',
    type: 'Submarine',
    cause: 'Depth Charge',
    theater: 'North Atlantic',
    nation: 'Germany',
  },
  {
    id: 4,
    name: 'Lusitania',
    war: 'WW1',
    type: 'Transport',
    cause: 'Torpedo',
    theater: 'North Atlantic',
    nation: 'United Kingdom',
  },
  {
    id: 5,
    name: 'Yamato',
    war: 'WW2',
    type: 'Battleship',
    cause: 'Air Attack',
    theater: 'Pacific',
    nation: 'Japan',
  },
]

describe('filterWrecks', () => {
  it('returns all IDs when no filters are active', () => {
    const result = filterWrecks(SAMPLE_WRECKS, DEFAULT_FILTERS)
    expect(result.size).toBe(5)
    expect(result.has(1)).toBe(true)
    expect(result.has(5)).toBe(true)
  })

  it('filters by name query (case-insensitive)', () => {
    const result = filterWrecks(SAMPLE_WRECKS, { ...DEFAULT_FILTERS, query: 'bismarck' })
    expect(result.size).toBe(1)
    expect(result.has(1)).toBe(true)
  })

  it('returns empty set when query matches nothing', () => {
    const result = filterWrecks(SAMPLE_WRECKS, { ...DEFAULT_FILTERS, query: 'ZZZZZZ' })
    expect(result.size).toBe(0)
  })

  it('query matches partial names', () => {
    const result = filterWrecks(SAMPLE_WRECKS, { ...DEFAULT_FILTERS, query: 'u-' })
    expect(result.has(3)).toBe(true)
    expect(result.size).toBe(1)
  })

  it('ignores leading/trailing whitespace in query', () => {
    const result = filterWrecks(SAMPLE_WRECKS, { ...DEFAULT_FILTERS, query: '  Hood  ' })
    expect(result.has(2)).toBe(true)
    expect(result.size).toBe(1)
  })

  it('filters by war', () => {
    const result = filterWrecks(SAMPLE_WRECKS, { ...DEFAULT_FILTERS, war: 'WW1' })
    expect(result.size).toBe(1)
    expect(result.has(4)).toBe(true)
  })

  it('returns all when war is All', () => {
    const result = filterWrecks(SAMPLE_WRECKS, { ...DEFAULT_FILTERS, war: 'All' })
    expect(result.size).toBe(5)
  })

  it('filters by type', () => {
    const result = filterWrecks(SAMPLE_WRECKS, { ...DEFAULT_FILTERS, type: 'Submarine' })
    expect(result.size).toBe(1)
    expect(result.has(3)).toBe(true)
  })

  it('filters by cause', () => {
    const result = filterWrecks(SAMPLE_WRECKS, { ...DEFAULT_FILTERS, cause: 'Air Attack' })
    expect(result.size).toBe(1)
    expect(result.has(5)).toBe(true)
  })

  it('filters by theater', () => {
    const result = filterWrecks(SAMPLE_WRECKS, { ...DEFAULT_FILTERS, theater: 'Pacific' })
    expect(result.size).toBe(1)
    expect(result.has(5)).toBe(true)
  })

  it('filters by a single nation', () => {
    const result = filterWrecks(SAMPLE_WRECKS, { ...DEFAULT_FILTERS, nations: ['Japan'] })
    expect(result.size).toBe(1)
    expect(result.has(5)).toBe(true)
  })

  it('filters by multiple nations', () => {
    const result = filterWrecks(SAMPLE_WRECKS, {
      ...DEFAULT_FILTERS,
      nations: ['Germany', 'Japan'],
    })
    expect(result.size).toBe(3)
    expect(result.has(1)).toBe(true)
    expect(result.has(3)).toBe(true)
    expect(result.has(5)).toBe(true)
  })

  it('returns all when nations array is empty', () => {
    const result = filterWrecks(SAMPLE_WRECKS, { ...DEFAULT_FILTERS, nations: [] })
    expect(result.size).toBe(5)
  })

  it('combines multiple filters (AND logic)', () => {
    const result = filterWrecks(SAMPLE_WRECKS, {
      ...DEFAULT_FILTERS,
      war: 'WW2',
      type: 'Battleship',
      theater: 'North Atlantic',
    })
    expect(result.size).toBe(2)
    expect(result.has(1)).toBe(true) // Bismarck
    expect(result.has(2)).toBe(true) // Hood
    expect(result.has(5)).toBe(false) // Yamato is Pacific
  })

  it('returns empty set when combined filters match nothing', () => {
    const result = filterWrecks(SAMPLE_WRECKS, {
      ...DEFAULT_FILTERS,
      war: 'WW1',
      type: 'Battleship',
    })
    expect(result.size).toBe(0)
  })

  it('handles an empty wrecks array', () => {
    const result = filterWrecks([], DEFAULT_FILTERS)
    expect(result.size).toBe(0)
  })
})
