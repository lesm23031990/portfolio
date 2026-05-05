<template>
  <LoadingOverlay v-if="loading" @finished="hideLoading" />
  <DefaultLayout />
</template>

<script>
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";

export default {
  name: 'App',
  components: {
    DefaultLayout,
    LoadingOverlay
  },
  data() {
    return {}
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    }
  },
  methods: {
    hideLoading() {
      this.$store.dispatch('hideLoading');
    }
  },
  beforeCreate() {
    this.$store.dispatch('showLoading');
  }
}
</script>

<style></style>
