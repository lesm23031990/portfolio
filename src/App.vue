<template>
  <LoadingOverlay v-if="loading" @finished="hideLoading" />
  <DefaultLayout v-if="useDefaultLayout" />
  <RouterView v-else />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import { useLoading } from "@/composables/useLoading";

const route = useRoute()
const { loading, showLoading, hideLoading } = useLoading()

showLoading()

const useDefaultLayout = computed(() => route.meta.layout === 'default' || !route.meta.layout)
</script>

<style></style>
