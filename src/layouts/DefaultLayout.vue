<template>
  <div class="layout" :style="mouseVars">
    <AppHeader />

    <main class="main pt-[4.5rem] md:pt-[5.5rem]" :class="{ 'main--dashboard': isDashboard }">
      <RouterView />
    </main>

    <AppFooter :dark="isDashboard" />
    <ChatWidget />

    <div v-if="showCursorFx" class="mouse-light" :class="{ 'mouse-light--intense': isDarkMode }"></div>
    <div class="mouse-trail-container" v-if="showCursorFx">
      <div 
        v-for="dot in trails" 
        :key="dot.id" 
        class="trail-dot" 
        :style="{ 
          left: dot.x + 'px', 
          top: dot.y + 'px',
          position: 'absolute' 
        }"
      ></div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ChatWidget from '@/components/chat/ChatWidget.vue'

const route = useRoute()
const isDashboard = computed(() => route.name === 'home')
const showCursorFx = computed(() => isDashboard.value)

const mouseX = ref(0)
const mouseY = ref(0)

const isDarkMode = ref(false)
const trails = ref([])

const updateMouse = (e) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

const handleSectionChange = (e) => {
  isDarkMode.value = e.detail.isDark;
};

const MAX_TRAILS = 150
let lastTrailTime = 0

const handleMouseMove = (e) => {
  if (!showCursorFx.value) return

  const now = Date.now()
  if (now - lastTrailTime < 10) return
  lastTrailTime = now

  const id = now + Math.random()
  trails.value.push({ id, x: e.clientX, y: e.clientY })

  if (trails.value.length > MAX_TRAILS) {
    trails.value.splice(0, trails.value.length - MAX_TRAILS)
  }

  setTimeout(() => {
    const index = trails.value.findIndex(t => t.id === id)
    if (index !== -1) trails.value.splice(index, 1)
  }, 1400)
}


onMounted(() => {
  window.addEventListener('mousemove', updateMouse)
  window.addEventListener('section-change', handleSectionChange)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMouse)
  window.removeEventListener('section-change', handleSectionChange)
  window.removeEventListener('mousemove', handleMouseMove)
})

const mouseVars = computed(() => {
  return {
    '--mouse-x': `${mouseX.value}px`,
    '--mouse-y': `${mouseY.value}px`
  }
})

watch(isDarkMode, (val) => {
  if (!val) trails.value = []; // Limpiamos el rastro al salir de la sección oscura
});

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

.mouse-trail-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;
  z-index: 40;
  overflow: hidden;
}

.trail-dot {
  width: 12px;
  height: 12px;
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.98) 0 18%, #ff4fd8 34%, #ff0096 62%, rgba(255, 0, 150, 0.16) 100%);
  border-radius: 50%;
  box-shadow:
    0 0 14px rgba(255, 0, 150, 0.95),
    0 0 34px rgba(255, 79, 216, 0.55);
  mix-blend-mode: screen;
  animation: trailLife 1.2s ease-out forwards;
}

@keyframes trailLife {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.8);
  }
  15% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.2);
  }
}

.main-container {
  overflow: visible !important; /* El scroll debe ser libre para que GSAP lo detecte */
  height: auto;
}
</style>
