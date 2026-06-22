<template>
  <div id="stack" class="stack-stage">
    <div class="stack-stage__grid" aria-hidden="true"></div>
    <TechConsoleShowcase />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const TechConsoleShowcase = defineAsyncComponent(() => import('./TechConsoleShowcase.vue'))
</script>

<style scoped>
.stack-stage {
  position: relative;
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.stack-stage__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(122, 214, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(122, 214, 255, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  transform-origin: 50% 100%;
  transform: perspective(500px) rotateX(24deg);
  pointer-events: none;
  z-index: 0;
}
</style>
