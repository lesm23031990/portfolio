<template>
  <div class="dashboard">
    <HomeBackground />
    <HeroSection />
    <div class="dashboard__bridge" aria-hidden="true"></div>
    <ProjectsSection />
    <ContactSection />
  </div>
</template>

<script setup>
import ContactSection from '@/components/home/ContactSection.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import HomeBackground from '@/components/home/HomeBackground.vue'
import ProjectsSection from '@/components/home/ProjectsSection.vue'
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
  height: 100vh;
  background: linear-gradient(
    to bottom,
    rgba(255, 249, 252, 0) 0%,
    rgba(255, 243, 249, 0.04) 30%,
    rgba(20, 10, 24, 0.2) 50%,
    rgba(6, 6, 11, 0.7) 75%,
    rgba(6, 6, 11, 1) 100%
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
