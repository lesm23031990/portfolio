<template>
  <LoadingOverlay v-if="loading" @finished="hideLoading" />
  <DefaultLayout />
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";

const store = useStore()

store.dispatch('showLoading')

const loading = computed(() => store.state.loading)

function hideLoading() {
  store.dispatch('hideLoading')
}
</script>

<style></style>
