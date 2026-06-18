<template>
  <LoadingOverlay v-if="loading" @finished="hideLoading" />
  <DefaultLayout v-if="useDefaultLayout" />
  <RouterView v-else />
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useLoading } from "@/composables/useLoading";

const DefaultLayout = defineAsyncComponent(() => import("@/layouts/DefaultLayout.vue"))
const LoadingOverlay = defineAsyncComponent(() => import("@/components/LoadingOverlay.vue"))

const route = useRoute()
const { loading, showLoading, hideLoading } = useLoading()

showLoading()

const useDefaultLayout = computed(() => route.meta.layout === 'default' || !route.meta.layout)
</script>

<style></style>
