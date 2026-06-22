import { onUnmounted, ref } from 'vue'

const scrollY = ref(0)
let rafId = null
let listeners = 0
let prefersReducedMotion = false

if (typeof window !== 'undefined' && window.matchMedia) {
  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function onScroll() {
  if (rafId) return
  rafId = window.requestAnimationFrame(() => {
    scrollY.value = window.scrollY || document.documentElement.scrollTop
    rafId = null
  })
}

export function useScrollY() {
  if (listeners === 0 && !prefersReducedMotion) {
    window.addEventListener('scroll', onScroll, { passive: true })
  }
  listeners++

  onUnmounted(() => {
    listeners--
    if (listeners <= 0) {
      window.removeEventListener('scroll', onScroll)
      if (rafId) window.cancelAnimationFrame(rafId)
      rafId = null
      listeners = 0
    }
  })

  return { scrollY }
}
