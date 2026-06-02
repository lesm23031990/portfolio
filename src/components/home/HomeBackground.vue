<template>
  <div class="dashboard__parallax" aria-hidden="true">
    <div class="dashboard__grid dashboard__grid--far" :style="layerGridStyle(0.02)" />
    <div class="dashboard__grid dashboard__grid--near" :style="layerGridStyle(0.06)" />
    <CircuitBackground :style="layerStyle(0.4)" />
    <div class="dashboard__orb dashboard__orb--a" :style="layerStyle(0.18, 0.015)" />
    <div class="dashboard__orb dashboard__orb--b" :style="layerStyle(-0.1, -0.01)" />
    <div class="dashboard__orb dashboard__orb--c" :style="layerStyle(0.06)" />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'

import CircuitBackground from '@/components/ui/CircuitBackground.vue'

const scrollY = shallowRef(0)
const rafId = ref(null)
const prefersReducedMotion = ref(false)

function onScroll() {
  if (rafId.value) return

  rafId.value = window.requestAnimationFrame(() => {
    const newY = window.scrollY || document.documentElement.scrollTop
    if (Math.abs(newY - scrollY.value) > 2) {
      scrollY.value = newY
    }
    rafId.value = null
  })
}

function layerStyle(speedY, rotate = 0) {
  if (prefersReducedMotion.value) return {}

  const y = scrollY.value
  const rotation = rotate ? y * rotate : 0

  return {
    transform: `translate3d(0, ${y * speedY}px, 0) rotate(${rotation}deg)`
  }
}

function layerGridStyle(speedY) {
  if (prefersReducedMotion.value) return {}

  return {
    '--grid-scroll-y': `${scrollY.value * speedY}px`
  }
}

onMounted(() => {
  if (window.matchMedia) {
    prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)

  if (rafId.value) {
    window.cancelAnimationFrame(rafId.value)
  }
})
</script>

<style scoped>
.dashboard__parallax {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  transform: none !important;
}

.dashboard__grid {
  position: absolute;
  top: -40%;
  left: -25%;
  right: -25%;
  bottom: -5%;
  background-image:
    linear-gradient(rgba(60, 30, 45, 0.25) 1px, transparent 1px),
    linear-gradient(90deg, rgba(60, 30, 45, 0.25) 1px, transparent 1px);
  background-size: 80px 80px;
  opacity: 0.5;
  transform-origin: 50% 100%;
  transform: perspective(500px) rotateX(22deg) translateY(var(--grid-scroll-y, 0px));
  will-change: transform;
}

.dashboard__grid--far {
  background-size: 120px 120px;
  opacity: 0.2;
  transform: perspective(500px) rotateX(26deg) translateY(calc(3% + var(--grid-scroll-y, 0px)));
}

.dashboard__grid--near {
  background-size: 48px 48px;
  opacity: 0.15;
  transform: perspective(500px) rotateX(18deg) translateY(calc(-2% + var(--grid-scroll-y, 0px)));
}

.dashboard__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.55;
  will-change: transform;
}

.dashboard__orb--a {
  width: min(90vw, 520px);
  height: min(90vw, 520px);
  top: -8%;
  right: -10%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 214, 232, 0.95), rgba(241, 168, 201, 0.72) 38%, transparent 72%);
}

.dashboard__orb--b {
  width: min(70vw, 420px);
  height: min(70vw, 420px);
  bottom: 10%;
  left: -15%;
  background: radial-gradient(circle at 70% 50%, rgba(246, 199, 224, 0.86), rgba(226, 158, 197, 0.66) 44%, transparent 72%);
}

.dashboard__orb--c {
  width: 240px;
  height: 240px;
  top: 42%;
  left: 35%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9), rgba(250, 214, 231, 0.45) 48%, transparent 70%);
  opacity: 0.58;
}
</style>
