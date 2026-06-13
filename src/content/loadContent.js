import defaultContent from './content.json'

export const STORAGE_KEY = 'portfolio-content'

function isObject(val) {
  return val !== null && typeof val === 'object' && !Array.isArray(val)
}

function mergeArrayById(defaultArr, savedArr, idKey = 'id') {
  const map = new Map()
  for (const item of defaultArr) map.set(item[idKey], JSON.parse(JSON.stringify(item)))
  for (const item of savedArr) {
    if (map.has(item[idKey])) {
      Object.assign(map.get(item[idKey]), item)
    } else {
      map.set(item[idKey], JSON.parse(JSON.stringify(item)))
    }
  }
  return Array.from(map.values())
}

export function deepMerge(target, ...sources) {
  for (const source of sources) {
    if (!source) continue
    for (const key of Object.keys(source)) {
      const val = source[key]
      if (isObject(val) && isObject(target[key])) {
        target[key] = deepMerge({ ...target[key] }, val)
      } else {
        target[key] = val
      }
    }
  }
  return target
}

export function loadContent() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      const merged = deepMerge(JSON.parse(JSON.stringify(defaultContent)), parsed)
      merged.stackOrbs = mergeArrayById(defaultContent.stackOrbs || [], parsed.stackOrbs || [])
      merged.stackGroups = mergeArrayById(defaultContent.stackGroups || [], parsed.stackGroups || [], 'key')
      merged.projects = mergeArrayById(defaultContent.projects || [], parsed.projects || [])
      return merged
    }
  } catch (e) {
    // Failed to load saved content, using defaults
  }
  return JSON.parse(JSON.stringify(defaultContent))
}

export function saveContent(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    // Failed to save content
  }
  try {
    fetch('/api/save-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(() => { /* server unavailable in production */ })
  } catch (e) { /* ignore */ }
}

export function resetContent() {
  localStorage.removeItem(STORAGE_KEY)
}
