<template>
  <svg class="circuit-mobile" :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="none">
    <g stroke="#ff00a2" fill="none" stroke-width="2.5" opacity="0.8">
      <path class="line-anim" :d="paths.M1" />
      <circle :cx="points.M1.x" :cy="points.M1.y" r="4" fill="#f472b6" />
      <path class="line-anim line-anim--delayed" :d="paths.M2" />
      <circle :cx="points.M2.x" :cy="points.M2.y" r="4" fill="#f472b6" />
      <path class="line-anim" :d="paths.M3" />
      <circle :cx="points.M3.x" :cy="points.M3.y" r="4" fill="#f472b6" />
      <path class="line-anim line-anim--delayed" :d="paths.M4" />
      <circle :cx="points.M4.x" :cy="points.M4.y" r="4" fill="#f472b6" />
      <path class="line-anim" :d="paths.M5" />
      <circle :cx="points.M5.x" :cy="points.M5.y" r="4" fill="currentColor" />
      <path class="line-anim" :d="paths.M6" />
      <circle :cx="points.M6.x" :cy="points.M6.y" r="4" fill="currentColor" />
    </g>
  </svg>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const width = ref(typeof window !== 'undefined' ? window.innerWidth : 768)
const height = ref(typeof window !== 'undefined' ? window.innerHeight : 1024)

let resizeTimer = null
const updateDimensions = () => {
  if (resizeTimer) return
  resizeTimer = setTimeout(() => {
    width.value = window.innerWidth
    height.value = window.innerHeight
    resizeTimer = null
  }, 150)
}

onMounted(() => window.addEventListener('resize', updateDimensions, { passive: true }))
onUnmounted(() => {
  window.removeEventListener('resize', updateDimensions)
  if (resizeTimer) clearTimeout(resizeTimer)
})

const points = computed(() => {
  const w = width.value
  const h = height.value
  const m = w * 0.22
  const off = w * 0.05

  return {
    M1: { x: m, y: h * 0.16 },
    M2: { x: m - off, y: h * 0.36 },
    M3: { x: w - m, y: h * 0.16 },
    M4: { x: w - (m - off), y: h * 0.33 },
    M5: { x: m - off * 0.5, y: h * 0.60 },
    M6: { x: w - (m - off * 0.5), y: h * 0.72 },
  }
})

const paths = computed(() => {
  const p = points.value
  const w = width.value
  const o = 20
  const o2 = o * 2
  const o3 = o * 2.6

  return {
    M1: `M ${-o},${p.M1.y - o * 0.6} L ${o2},${p.M1.y - o * 0.6} L ${o3},${p.M1.y} L ${p.M1.x},${p.M1.y}`,
    M2: `M ${w + o},${p.M2.y - o * 0.6} L ${w - o2},${p.M2.y - o * 0.6} L ${w - o3},${p.M2.y} L ${p.M2.x},${p.M2.y}`,
    M3: `M ${w + o},${p.M3.y - o * 0.6} L ${w - o2},${p.M3.y - o * 0.6} L ${w - o3},${p.M3.y} L ${p.M3.x},${p.M3.y}`,
    M4: `M ${-o},${p.M4.y - o * 0.6} L ${o2},${p.M4.y - o * 0.6} L ${o3},${p.M4.y} L ${p.M4.x},${p.M4.y}`,
    M5: `M ${-o},${p.M5.y + o} L ${o},${p.M5.y + o} L ${o2},${p.M5.y} L ${p.M5.x},${p.M5.y}`,
    M6: `M ${p.M6.x},${p.M6.y} L ${p.M6.x + o * 1.6},${p.M6.y} L ${p.M6.x + o3},${p.M6.y + o * 2} L ${w + o},${p.M6.y + o * 2}`,
  }
})
</script>

<style scoped>
.circuit-mobile {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 0%, black 70%, transparent 100%);
  filter: drop-shadow(0 0 4px rgba(255, 0, 162, 0.5));
}

.line-anim {
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200;
  animation: flux 8s ease-in-out infinite;
}

.line-anim--delayed {
  animation-delay: 3s;
}

@keyframes flux {
  0% { stroke-dashoffset: 1200; opacity: 0; }
  15% { opacity: 0.6; }
  45%, 85% { stroke-dashoffset: 0; opacity: 0.6; }
  100% { stroke-dashoffset: 0; opacity: 0; }
}
</style>
