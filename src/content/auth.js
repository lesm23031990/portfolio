import { loadContent } from './loadContent'

const SESSION_KEY = 'portfolio-session'
const DEFAULT_USER = 'admin'
const DEFAULT_HASH = 'aa7e25a89b1c97bb11dff5df219aa1ac0e1a0d31628436f327b887312d885065'

function getCreds() {
  const content = loadContent()
  return {
    user: content.adminUser || DEFAULT_USER,
    hash: content.adminPasswordHash || DEFAULT_HASH
  }
}

export async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function loginWithPassword(username, password) {
  const { user, hash } = getCreds()
  if (username !== user) return false
  const inputHash = await hashPassword(password)
  if (inputHash !== hash) return false
  const session = JSON.stringify({ user, time: Date.now() })
  try { localStorage.setItem(SESSION_KEY, session) } catch { /* ignore */ }
  return true
}

export function isAuthenticated() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return false
    JSON.parse(raw)
    return true
  } catch {
    return false
  }
}

export function getSessionUser() {
  try {
    const session = localStorage.getItem(SESSION_KEY)
    if (!session) return null
    return JSON.parse(session).user || null
  } catch {
    return null
  }
}

export function logout() {
  try { localStorage.removeItem(SESSION_KEY) } catch { /* ignore */ }
}
