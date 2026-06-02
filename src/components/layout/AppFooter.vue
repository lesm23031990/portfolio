<template>
  <footer class="app-footer" :class="{ 'app-footer--dashboard': dark }">
    <div class="mx-auto w-full max-w-[1200px] px-4">
      <p>{{ $t('layout.footer.copyright', { year, name: 'Lorena Salas' }) }}</p>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  dark: { type: Boolean, default: false }
})

const year = new Date().getFullYear()
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
  background: rgba(6, 8, 12, 0.98);
  color: rgba(228, 235, 250, 0.72);
  border-top: 1px solid rgba(122, 214, 255, 0.14);
}

.app-footer p {
  margin: 0;
  text-align: center;
}
</style>
