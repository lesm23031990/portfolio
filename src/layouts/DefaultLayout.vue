<template>
  <div class="layout">
    <AppHeader />

    <main class="main pt-[4.5rem] md:pt-[5.5rem]" :class="{ 'main--dashboard': isDashboard }">
      <RouterView />
    </main>

    <AppFooter :dark="isDashboard" />
    <ChatWidget />

    <div v-if="showCursorFx" class="mouse-light" :class="{ 'mouse-light--intense': isDarkMode }"></div>
    <canvas v-if="showCursorFx" ref="trailCanvasRef" class="mouse-trail-canvas"></canvas>

  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const ChatWidget = defineAsyncComponent(() => import('@/components/chat/ChatWidget.vue'))

const route = useRoute()
const isDashboard = computed(() => route.name === 'home')
const showCursorFx = computed(() => isDashboard.value)

const trailCanvasRef = ref(null)
const isDarkMode = ref(false)

const handleSectionChange = (e) => {
  isDarkMode.value = e.detail.isDark
}

// ── CSS glow: escribe directo al root, sin Vue reactivity ──
function updateGlow(e) {
  const root = document.documentElement
  root.style.setProperty('--mouse-x', e.clientX + 'px')
  root.style.setProperty('--mouse-y', e.clientY + 'px')
}

// ── Canvas mouse trail ──
// Offscreen gradient cache (se renderiza una vez)
const G_SIZE = 20
const gCanvas = document.createElement('canvas')
gCanvas.width = gCanvas.height = G_SIZE
const gCtx = gCanvas.getContext('2d')
const grad = gCtx.createRadialGradient(10, 10, 0, 10, 10, 10)
grad.addColorStop(0, '#fff')
grad.addColorStop(0.18, 'rgba(255,79,216,0.95)')
grad.addColorStop(0.62, 'rgba(255,0,150,0.8)')
grad.addColorStop(1, 'rgba(255,0,150,0)')
gCtx.fillStyle = grad
gCtx.fillRect(0, 0, G_SIZE, G_SIZE)

// Ring buffer
const MAX_POINTS = 200
const trailPts = new Array(MAX_POINTS)
let ringHead = 0
let ringTail = 0
let trailRafId = null
let lastTrailTime = 0

function pushTrailPoint(x, y) {
  trailPts[ringHead] = { x, y, born: performance.now() }
  ringHead = (ringHead + 1) % MAX_POINTS
  if (ringHead === ringTail) ringTail = (ringTail + 1) % MAX_POINTS
}

function resizeTrailCanvas() {
  const canvas = trailCanvasRef.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function drawTrail() {
  const canvas = trailCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const now = performance.now()
  const lifespan = 1200

  // Avanza tail sobre puntos muertos
  while (ringTail !== ringHead) {
    if (now - trailPts[ringTail].born < lifespan) break
    ringTail = (ringTail + 1) % MAX_POINTS
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.globalCompositeOperation = 'screen'

  if (ringTail !== ringHead) {
    let i = ringTail
    while (i !== ringHead) {
      const pt = trailPts[i]
      const age = now - pt.born
      const progress = age / lifespan
      const radius = 6 + progress * 4
      const alpha = 1 - progress
      const scale = radius / 10
      const s = G_SIZE * scale
      ctx.globalAlpha = alpha
      ctx.drawImage(gCanvas, pt.x - s / 2, pt.y - s / 2, s, s)
      i = (i + 1) % MAX_POINTS
    }
  }

  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'

  if (ringTail !== ringHead) {
    trailRafId = requestAnimationFrame(drawTrail)
  } else {
    trailRafId = null
  }
}

const handleMouseMove = (e) => {
  if (!showCursorFx.value) return
  updateGlow(e)
  const now = performance.now()
  if (now - lastTrailTime < 12) return
  lastTrailTime = now
  pushTrailPoint(e.clientX, e.clientY)
  if (!trailRafId) trailRafId = requestAnimationFrame(drawTrail)
}

onMounted(() => {
  resizeTrailCanvas()
  window.addEventListener('section-change', handleSectionChange)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', resizeTrailCanvas)
})

onUnmounted(() => {
  if (trailRafId) cancelAnimationFrame(trailRafId)
  trailRafId = null
  ringHead = 0
  ringTail = 0
  window.removeEventListener('section-change', handleSectionChange)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', resizeTrailCanvas)
})
</script>

<style scoped>
.layout {
  width: 100%;
  overflow-x: hidden;
}

.mouse-light {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  /* Z-index altísimo para que esté sobre el Main y el RouterView */
  z-index: 30;
  background: radial-gradient(
    140px circle at var(--mouse-x) var(--mouse-y),
    rgba(255, 0, 170, 0.18),
    rgba(255, 0, 170, 0.08) 32%,
    transparent 78%
  );
  mix-blend-mode: screen;
}

.mouse-light--intense {
  background: radial-gradient(
    160px circle at var(--mouse-x) var(--mouse-y),
    rgba(255, 0, 170, 0.32),
    rgba(122, 214, 255, 0.12) 34%,
    transparent 80%
  );
}

.mouse-trail-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  z-index: 40;
}

.main-container {
  overflow: visible !important; /* El scroll debe ser libre para que GSAP lo detecte */
  height: auto;
}
</style>
