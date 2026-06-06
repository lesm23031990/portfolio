<template>
  <LoadingOverlay v-if="loading" @finished="hideLoading" />
  <DefaultLayout v-if="useDefaultLayout" />
  <RouterView v-else />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";

const route = useRoute()
const store = useStore()

store.dispatch('showLoading')

const loading = computed(() => store.state.loading)
const useDefaultLayout = computed(() => route.meta.layout === 'default' || !route.meta.layout)

function hideLoading() {
  store.dispatch('hideLoading')
}
</script>

<style></style>
