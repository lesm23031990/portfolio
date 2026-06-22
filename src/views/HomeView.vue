<template>
  <div class="dashboard">
    <HomeBackground />
    <HeroSection />
    <div class="dashboard__bridge" aria-hidden="true"></div>
    <ProjectsSection />
    <div class="dashboard__bridge--dark" aria-hidden="true"></div>
    <ContactSection />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import HeroSection from '@/components/home/HeroSection.vue'
import HomeBackground from '@/components/home/HomeBackground.vue'

const ProjectsSection = defineAsyncComponent(() => import('@/components/home/ProjectsSection.vue'))
const ContactSection = defineAsyncComponent(() => import('@/components/home/ContactSection.vue'))
</script>

<style scoped>
.dashboard {
  --rose-bg: #fff9fc;
  --rose-bg-soft: #fff1f7;
  --rose-surface: rgba(255, 255, 255, 0.74);
  --rose-surface-strong: rgba(255, 255, 255, 0.9);
  --rose-border: rgba(222, 164, 192, 0.38);
  --rose-border-strong: rgba(213, 119, 162, 0.36);
  --rose-shadow: rgba(214, 123, 165, 0.18);
  --rose-text: #6f2f54;
  --rose-text-soft: #9d6a86;
  --rose-accent: #d46b9e;
  --rose-accent-strong: #be4f87;
  position: relative;
  min-height: 100vh;
  background: linear-gradient(160deg, #fffafe 0%, #fff3f9 46%, #fefcff 100%);
  color: var(--rose-text);
  width: 100%;
  max-width: 100%;
}

.dashboard__bridge {
  display: block;
  width: 100%;
  height: calc(80vh + 1px);
  margin-top: -1px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 243, 249, 0.03) 6%,
    rgba(255, 243, 249, 0.06) 12%,
    rgba(20, 10, 24, 0.08) 20%,
    rgba(20, 10, 24, 0.18) 28%,
    rgba(6, 6, 11, 0.35) 38%,
    rgba(6, 6, 11, 0.55) 48%,
    rgba(6, 6, 11, 0.72) 58%,
    rgba(6, 6, 11, 0.85) 68%,
    rgba(6, 6, 11, 0.94) 80%,
    #06060b 100%
  );
  pointer-events: none;
  position: relative;
  z-index: 5;
}

.dashboard__bridge--dark {
  display: block;
  width: 100%;
  height: calc(80vh + 1px);
  margin-top: -1px;
  background: linear-gradient(
    to bottom,
    #06060b 0%,
    rgba(6, 6, 11, 0.97) 10%,
    rgba(6, 6, 11, 0.88) 20%,
    rgba(6, 6, 11, 0.72) 30%,
    rgba(6, 6, 11, 0.50) 40%,
    rgba(6, 6, 11, 0.30) 50%,
    rgba(255, 243, 249, 0.12) 62%,
    rgba(255, 249, 252, 0.06) 74%,
    rgba(255, 249, 252, 0.02) 86%,
    transparent 100%
  );
  pointer-events: none;
  position: relative;
  z-index: 5;
}

section {
  display: block;
  width: 100%;
}
</style>
