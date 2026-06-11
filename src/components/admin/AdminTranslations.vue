<template>
  <div class="admin-translations">
    <div class="locale-bar">
      <select v-model="editingLocale" class="locale-select">
        <option value="es">Español</option>
        <option value="en">English</option>
      </select>
    </div>
    <div class="flat-keys">
      <div v-for="(entry, path) in flatKeys" :key="path" class="key-row">
        <span class="key-path">{{ path }}</span>
        <input
          class="key-value"
          :value="entry.value"
          @input="updateKey(path, $event.target.value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useContent } from '@/content/useContent'
import { reloadMessages } from '@/i18n'

const { content, save } = useContent()

const editingLocale = ref('es')
const saved = ref(false)
const workingData = ref(null)

function loadLocale(locale) {
  workingData.value = JSON.parse(JSON.stringify(content[locale] || {}))
}

onMounted(() => {
  loadLocale('es')
})

watch(editingLocale, (locale) => {
  loadLocale(locale)
})

function flatten(obj, prefix = '') {
  const result = {}
  for (const key of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      Object.assign(result, flatten(obj[key], path))
    } else {
      result[path] = { value: obj[key] || '' }
    }
  }
  return result
}

const flatKeys = computed(() => {
  if (!workingData.value) return {}
  return flatten(workingData.value)
})

function updateKey(path, newValue) {
  const parts = path.split('.')
  let current = workingData.value
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {}
    current = current[parts[i]]
  }
  current[parts[parts.length - 1]] = newValue
}

function handleSave() {
  const full = JSON.parse(JSON.stringify(content))
  full[editingLocale.value] = workingData.value
  save(full)
  reloadMessages()
  saved.value = true
  setTimeout(() => { saved.value = false }, 2000)
}

defineExpose({ handleSave })
</script>

<style scoped>
.admin-translations {
  display: grid;
  gap: 1rem;
}
.locale-bar {
  display: flex;
  align-items: center;
}
.locale-select {
  padding: 0.5rem 0.8rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #f7f3ff;
  font-family: inherit;
  font-size: 0.82rem;
  outline: none;
}
.flat-keys {
  display: grid;
  gap: 0.5rem;
}
.key-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.02);
}
.key-path {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.35);
  word-break: break-all;
  font-family: monospace;
}
.key-value {
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #f7f3ff;
  font-family: inherit;
  font-size: 0.82rem;
  outline: none;
  transition: border-color 0.2s;
}
.key-value:focus {
  border-color: rgba(122, 214, 255, 0.4);
}
</style>
