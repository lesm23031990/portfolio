import { describe, it, expect, beforeEach } from 'vitest'
import { deepMerge, mergeArrayById, STORAGE_KEY, resetContent } from '../loadContent'

describe('deepMerge', () => {
  it('merge shallow keys', () => {
    const result = deepMerge({ a: 1 }, { b: 2 })
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('deep merge nested objects', () => {
    const target = { a: { x: 1, y: 2 } }
    const source = { a: { y: 99, z: 3 } }
    const result = deepMerge(target, source)
    expect(result).toEqual({ a: { x: 1, y: 99, z: 3 } })
  })

  it('source overwrites target for same key', () => {
    const result = deepMerge({ a: 1 }, { a: 2 })
    expect(result.a).toBe(2)
  })

  it('ignores null/undefined sources', () => {
    const result = deepMerge({ a: 1 }, null, undefined, { b: 2 })
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('does not mutate original target', () => {
    const target = { a: { x: 1 } }
    const source = { a: { y: 2 } }
    deepMerge(target, source)
    expect(target).toEqual({ a: { x: 1, y: 2 } })
  })

  it('handles arrays as values (not merged)', () => {
    const result = deepMerge({ items: [1, 2] }, { items: [3, 4] })
    expect(result.items).toEqual([3, 4])
  })
})

describe('mergeArrayById', () => {
  const defaults = [
    { id: 'a', value: 1 },
    { id: 'b', value: 2 },
  ]

  it('returns defaults when no saved data', () => {
    const result = mergeArrayById(defaults, [])
    expect(result).toEqual(defaults)
  })

  it('merges saved data into defaults by id', () => {
    const saved = [{ id: 'a', value: 99 }]
    const result = mergeArrayById(defaults, saved)
    expect(result).toEqual([
      { id: 'a', value: 99 },
      { id: 'b', value: 2 },
    ])
  })

  it('adds new items from saved data', () => {
    const saved = [{ id: 'c', value: 3 }]
    const result = mergeArrayById(defaults, saved)
    expect(result).toHaveLength(3)
    expect(result.find(i => i.id === 'c').value).toBe(3)
  })

  it('uses custom id key', () => {
    const defaults = [{ key: 'x', val: 1 }]
    const saved = [{ key: 'x', val: 99 }]
    const result = mergeArrayById(defaults, saved, 'key')
    expect(result[0].val).toBe(99)
  })
})

describe('resetContent', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('removes the storage key', () => {
    localStorage.setItem(STORAGE_KEY, '{"test":true}')
    resetContent()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
