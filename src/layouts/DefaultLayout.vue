<template>
  <div class="layout">
    <AppHeader />

    <main class="main" :class="{ 'main--dashboard': isDashboard }">
      <RouterView />
    </main>

    <AppFooter :dark="isDashboard" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const route = useRoute()
const isDashboard = computed(() => route.name === 'home')
</script>