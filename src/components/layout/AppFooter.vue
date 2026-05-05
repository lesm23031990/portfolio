<template>
  <footer class="app-footer" :class="{ 'app-footer--dashboard': dark }">
    <div class="mx-auto w-full max-w-[1200px] px-4">
      <p>&copy; {{ year }} Lorena Salas · Portfolio</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  props: {
    dark: { type: Boolean, default: false }
  },
  data() {
    return {
      year: new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.app-footer {
  padding: 1.25rem 0;
  background: #f5f5f5;
  color: #333;
  border-top: 1px solid #e5e5e5;
  font-size: 0.9rem;
}

.app-footer--dashboard {
  background: rgba(255, 247, 251, 0.94);
  color: #9d6a86;
  border-top: 1px solid rgba(222, 164, 192, 0.35);
}

.app-footer p {
  margin: 0;
  text-align: center;
}
</style>
