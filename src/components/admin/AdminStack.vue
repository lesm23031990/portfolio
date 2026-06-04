<template>
  <div class="admin-stack">
    <h3 class="section-title">Grupos</h3>
    <p class="section-hint">Los grupos definen las categorías del stack (Frontend, Backend, etc.)</p>
    <div class="group-list">
      <div v-for="(group, i) in groups" :key="group._key" class="group-card">
        <div class="card-header">
          <span class="card-order">#{{ i + 1 }}</span>
          <button class="btn-delete" @click="removeGroup(i)">Eliminar</button>
        </div>
        <div class="card-fields">
          <div class="field-row">
            <label>Key</label>
            <input v-model="group.key" :disabled="!group._isNew" />
          </div>
          <div class="field-row">
            <label>Label ES</label>
            <input v-model="group.label.es" />
          </div>
          <div class="field-row">
            <label>Label EN</label>
            <input v-model="group.label.en" />
          </div>
          <div class="field-row">
            <label>Descripción ES</label>
            <textarea v-model="group.description.es" rows="2"></textarea>
          </div>
          <div class="field-row">
            <label>Descripción EN</label>
            <textarea v-model="group.description.en" rows="2"></textarea>
          </div>
        </div>
      </div>
    </div>
    <button class="btn-add" @click="addGroup">+ Añadir grupo</button>

    <h3 class="section-title" style="margin-top:2rem">Orbes (Tecnologías)</h3>
    <p class="section-hint">Cada orbe representa una tecnología en el mapa del stack.</p>
    <div class="orb-list">
      <div v-for="(orb, i) in orbs" :key="orb._key" class="orb-card">
        <div class="card-header">
          <span class="card-order">#{{ i + 1 }}</span>
          <button class="btn-delete" @click="removeOrb(i)">Eliminar</button>
        </div>
        <div class="card-fields card-fields--3col">
          <div class="field-row"><label>ID</label><input v-model="orb.id" :disabled="!orb._isNew" /></div>
          <div class="field-row">
            <label>Grupo</label>
            <select v-model="orb.group" class="theme-select">
              <option v-for="g in groups" :key="g.key" :value="g.key">{{ g.key }}</option>
            </select>
          </div>
          <div class="field-row"><label>Label ES</label><input v-model="orb.label.es" /></div>
          <div class="field-row"><label>Label EN</label><input v-model="orb.label.en" /></div>
          <div class="field-row"><label>X (%)</label><input v-model="orb.x" placeholder="14%" /></div>
          <div class="field-row"><label>Y (%)</label><input v-model="orb.y" placeholder="20%" /></div>
          <div class="field-row"><label>Tamaño</label><input v-model="orb.size" placeholder="10rem" /></div>
          <div class="field-row"><label>Color acento</label><input v-model="orb.accent" placeholder="#7ad6ff" /></div>
          <div class="field-row"><label>Brillo</label><input v-model="orb.glow" placeholder="#2d8cff" /></div>
          <div class="field-row"><label>Delay</label><input v-model="orb.delay" placeholder="0s" /></div>
        </div>
      </div>
    </div>
    <div class="toolbar" style="margin-top:1rem">
      <button class="btn-add" @click="addOrb">+ Añadir orbe</button>
      <button class="btn-save" @click="handleSave">Guardar cambios</button>
      <span v-if="saved" class="saved-msg">✓ Guardado</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useContent } from '@/content/useContent'
import { reloadMessages } from '@/i18n'

const { content, save } = useContent()

const saved = ref(false)
let keyCounter = 0
const groups = ref([])
const orbs = ref([])

onMounted(() => {
  resetAll()
})

function resetAll() {
  groups.value = (JSON.parse(JSON.stringify(content.stackGroups || []))).map(g => ({
    ...g, _key: ++keyCounter, _isNew: false
  }))
  orbs.value = (JSON.parse(JSON.stringify(content.stackOrbs || []))).map(o => ({
    ...o, _key: ++keyCounter, _isNew: false
  }))
}

function addGroup() {
  groups.value.push({
    _key: ++keyCounter, _isNew: true,
    key: '', order: groups.value.length,
    label: { es: '', en: '' },
    description: { es: '', en: '' }
  })
}

function removeGroup(index) {
  groups.value.splice(index, 1)
  groups.value.forEach((g, i) => { g.order = i })
}

function addOrb() {
  orbs.value.push({
    _key: ++keyCounter, _isNew: true,
    id: '', group: groups.value[0]?.key || 'frontend',
    label: { es: '', en: '' },
    x: '50%', y: '50%', size: '8rem',
    accent: '#7ad6ff', glow: '#2d8cff', delay: '0s'
  })
}

function removeOrb(index) {
  orbs.value.splice(index, 1)
}

function handleSave() {
  const cleanGroups = groups.value.map(g => {
    const data = Object.fromEntries(Object.entries(g).filter(([k]) => !k.startsWith('_')))
    return data
  })
  const cleanOrbs = orbs.value.map(o => {
    const data = Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith('_')))
    return data
  })
  const full = JSON.parse(JSON.stringify(content))
  full.stackGroups = cleanGroups
  full.stackOrbs = cleanOrbs
  save(full)
  reloadMessages()
  resetAll()
  saved.value = true
  setTimeout(() => { saved.value = false }, 2000)
}
</script>

<style scoped>
.admin-stack { display: grid; gap: 0.75rem; }
.section-title {
  margin: 0; font-size: 0.95rem; font-weight: 400;
  letter-spacing: 0.12em; text-transform: uppercase; color: #7ad6ff;
}
.section-hint { margin: 0; font-size: 0.72rem; color: rgba(255,255,255,0.3); }
.toolbar { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.btn-add {
  padding: 0.5rem 1.2rem; border: 1px solid rgba(109,247,200,0.3);
  border-radius: 10px; background: rgba(109,247,200,0.08);
  color: #6df7c8; font-family: inherit; font-size: 0.82rem; cursor: pointer;
}
.btn-save {
  padding: 0.5rem 1.2rem; border: 1px solid rgba(122,214,255,0.3);
  border-radius: 10px; background: rgba(122,214,255,0.08);
  color: #7ad6ff; font-family: inherit; font-size: 0.82rem; cursor: pointer;
}
.saved-msg { font-size: 0.78rem; color: #6df7c8; }
.group-list, .orb-list { display: grid; gap: 1rem; }
.group-card, .orb-card {
  padding: 1rem; border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
}
.card-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
.card-order { font-size: 0.7rem; color: rgba(255,51,212,0.6); letter-spacing: 0.12em; }
.btn-delete {
  margin-left: auto; padding: 0.25rem 0.6rem; border: 1px solid rgba(255,92,122,0.3);
  border-radius: 8px; background: transparent; color: #ff5c7a;
  font-family: inherit; font-size: 0.7rem; cursor: pointer;
}
.card-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
.card-fields--3col { grid-template-columns: 1fr 1fr 1fr; }
.field-row { display: grid; gap: 0.15rem; }
.field-row label { font-size: 0.62rem; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.1em; }
.field-row input, .field-row textarea, .theme-select {
  padding: 0.35rem 0.5rem; border-radius: 7px; border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04); color: #f7f3ff;
  font-family: inherit; font-size: 0.78rem; outline: none;
}
.field-row textarea { resize: vertical; }
.theme-select option { background: #141622; }
</style>
