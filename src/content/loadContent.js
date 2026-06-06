import defaultContent from './content.json'

export const STORAGE_KEY = 'portfolio-content'

function isObject(val) {
  return val !== null && typeof val === 'object' && !Array.isArray(val)
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
      return deepMerge(JSON.parse(JSON.stringify(defaultContent)), parsed)
    }
  } catch (e) {
    console.warn('[content] Failed to load saved content, using defaults')
  }
  return JSON.parse(JSON.stringify(defaultContent))
}

export function saveContent(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('[content] Failed to save content', e)
  }
}

export function resetContent() {
  localStorage.removeItem(STORAGE_KEY)
}
