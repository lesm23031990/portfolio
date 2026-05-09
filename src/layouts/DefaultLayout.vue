<template>
  <div class="layout" :style="mouseVars">
    <AppHeader />

    <main class="main" :class="{ 'main--dashboard': isDashboard }">
      <RouterView />
    </main>

    <AppFooter :dark="isDashboard" />

    <div class="mouse-light"></div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const route = useRoute()
const isDashboard = computed(() => route.name === 'home')

const mouseX = ref(0)
const mouseY = ref(0)

const updateMouse = (e) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

onMounted(() => {
  window.addEventListener('mousemove', updateMouse)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMouse)
})

const mouseVars = computed(() => {
  return {
    '--mouse-x': `${mouseX.value}px`,
    '--mouse-y': `${mouseY.value}px`
  }
})
</script>

<style scoped>
.mouse-light {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  /* Z-index altísimo para que esté sobre el Main y el RouterView */
  z-index: 999999;
  background: radial-gradient(
    100px circle at var(--mouse-x) var(--mouse-y), 
    rgba(255, 0, 150, 0.4), /* Color fuerte para confirmar visión */
    transparent 80%
  );
  /* Esto hará que el rosa se mezcle con el blanco del fondo */
  mix-blend-mode: multiply; 
}
</style>
