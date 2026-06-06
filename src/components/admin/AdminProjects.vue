<template>
  <div class="admin-projects">
    <div class="toolbar">
      <button class="btn-add" @click="startAdd">+ Nuevo proyecto</button>
      <button class="btn-save" @click="handleSave">Guardar cambios</button>
      <span v-if="saved" class="saved-msg">✓ Guardado</span>
    </div>
    <p v-if="projects.length >= 4" class="limit-msg">Límite alcanzado: máximo 4 proyectos</p>
    <div class="project-list">
      <div v-for="(proj, i) in projects" :key="proj._key" class="project-card-admin">
        <div class="card-header">
          <span class="card-order">#{{ i + 1 }}</span>
          <label class="toggle">
            <input type="checkbox" v-model="proj.enabled" />
            {{ proj.enabled ? 'Activo' : 'Inactivo' }}
          </label>
          <button class="btn-delete" @click="removeProject(i)">Eliminar</button>
        </div>
        <div class="card-fields">
          <div class="field-row">
            <label>ID (clave única)</label>
            <input v-model="proj.id" :disabled="!proj._isNew" placeholder="ej: mi-proyecto" />
          </div>
          <div class="field-row">
            <label>Título ES</label>
            <input v-model="proj.title.es" placeholder="Título en español" />
          </div>
          <div class="field-row">
            <label>Título EN</label>
            <input v-model="proj.title.en" placeholder="Title in English" />
          </div>
          <div class="field-row">
            <label>Stack ES</label>
            <input v-model="proj.stack.es" placeholder="Vue · Laravel · APIs" />
          </div>
          <div class="field-row">
            <label>Stack EN</label>
            <input v-model="proj.stack.en" />
          </div>
          <div class="field-row">
            <label>Resumen ES</label>
            <textarea v-model="proj.summary.es" rows="2"></textarea>
          </div>
          <div class="field-row">
            <label>Resumen EN</label>
            <textarea v-model="proj.summary.en" rows="2"></textarea>
          </div>
          <div class="field-row">
            <label>Repo URL</label>
            <input v-model="proj.repo" placeholder="https://github.com/..." />
          </div>
          <div class="field-row">
            <label>CTA ES</label>
            <input v-model="proj.cta.es" placeholder="Texto del botón ES" />
          </div>
          <div class="field-row">
            <label>CTA EN</label>
            <input v-model="proj.cta.en" placeholder="Button text EN" />
          </div>
          <div class="field-row">
            <label>Preview tag</label>
            <input v-model="proj.previewTag" placeholder="Hover to reveal" />
          </div>
          <div class="field-row">
            <label>Tema / colores</label>
            <select v-model="proj.theme" class="theme-select">
              <option v-for="t in themeKeys" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="field-row field-row--wide">
            <label>Imagen del proyecto</label>
            <div class="image-upload-row">
              <input type="file" accept="image/*" @change="e => handleImageUpload(e, proj)" />
              <button v-if="proj.image" class="btn-remove-image" @click="proj.image = ''">Eliminar imagen</button>
            </div>
            <img v-if="proj.image" :src="proj.image" class="image-preview" alt="Preview" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContent } from '@/content/useContent'
import { reloadMessages } from '@/i18n'

const { content, save } = useContent()

const saved = ref(false)
let keyCounter = 0

const projects = ref([])
const themeKeys = computed(() => Object.keys(content.projectThemes || {}))

onMounted(() => {
  resetList()
})

function resetList() {
  const raw = JSON.parse(JSON.stringify(content.projects || []))
  projects.value = raw.map(p => ({ ...p, _key: ++keyCounter, _isNew: false }))
}

function startAdd() {
  if (projects.value.length >= 4) return
  projects.value.push({
    _key: ++keyCounter,
    _isNew: true,
    id: '',
    enabled: true,
    order: projects.value.length,
    title: { es: '', en: '' },
    stack: { es: '', en: '' },
    summary: { es: '', en: '' },
    repo: '',
    cta: { es: '', en: '' },
    previewTag: 'Hover to reveal',
    theme: themeKeys.value[0] || 'portfolio',
    image: ''
  })
}

function removeProject(index) {
  projects.value.splice(index, 1)
  projects.value.forEach((p, i) => { p.order = i })
}

function handleImageUpload(event, project) {
  const file = event.target.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) return
  const reader = new FileReader()
  reader.onload = () => { project.image = reader.result }
  reader.readAsDataURL(file)
}

function handleSave() {
  const ordered = projects.value.map((p, i) => {
    const data = Object.fromEntries(Object.entries(p).filter(([k]) => !k.startsWith('_'))) // eslint-disable-line no-unused-vars
    return { ...data, order: i }
  })
  const full = JSON.parse(JSON.stringify(content))
  full.projects = ordered
  save(full)
  reloadMessages()
  resetList()
  saved.value = true
  setTimeout(() => { saved.value = false }, 2000)
}
</script>

<style scoped>
.admin-projects { display: grid; gap: 1rem; }
.toolbar { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.btn-add {
  padding: 0.5rem 1.2rem; border: 1px solid rgba(109, 247, 200, 0.3);
  border-radius: 10px; background: rgba(109, 247, 200, 0.08);
  color: #6df7c8; font-family: inherit; font-size: 0.82rem; cursor: pointer;
}
.btn-save {
  padding: 0.5rem 1.2rem; border: 1px solid rgba(122, 214, 255, 0.3);
  border-radius: 10px; background: rgba(122, 214, 255, 0.08);
  color: #7ad6ff; font-family: inherit; font-size: 0.82rem; cursor: pointer;
}
.saved-msg { font-size: 0.78rem; color: #6df7c8; }
.limit-msg { font-size: 0.78rem; color: #ff5c7a; margin: 0; }
.project-list { display: grid; gap: 1.5rem; }
.project-card-admin {
  padding: 1.25rem; border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}
.card-header {
  display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;
}
.card-order { font-size: 0.72rem; color: rgba(255, 51, 212, 0.7); letter-spacing: 0.12em; }
.toggle { font-size: 0.72rem; color: rgba(255, 255, 255, 0.5); display: flex; align-items: center; gap: 0.3rem; }
.toggle input { accent-color: #6df7c8; }
.btn-delete {
  margin-left: auto; padding: 0.3rem 0.7rem; border: 1px solid rgba(255, 92, 122, 0.3);
  border-radius: 8px; background: transparent; color: #ff5c7a;
  font-family: inherit; font-size: 0.7rem; cursor: pointer;
}
.card-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.field-row { display: grid; gap: 0.2rem; }
.field-row label { font-size: 0.65rem; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; letter-spacing: 0.1em; }
.field-row input,
.field-row textarea,
.theme-select {
  padding: 0.4rem 0.6rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04); color: #f7f3ff;
  font-family: inherit; font-size: 0.8rem; outline: none;
}
.field-row textarea { resize: vertical; }
.theme-select option { background: #141622; }
.field-row--wide { grid-column: 1 / -1; }
.image-upload-row { display: flex; align-items: center; gap: 0.5rem; }
.image-upload-row input[type="file"] { font-size: 0.75rem; color: rgba(255, 255, 255, 0.6); }
.btn-remove-image {
  padding: 0.25rem 0.6rem; border: 1px solid rgba(255, 92, 122, 0.3);
  border-radius: 6px; background: transparent; color: #ff5c7a;
  font-family: inherit; font-size: 0.65rem; cursor: pointer;
}
.image-preview {
  max-width: 200px; max-height: 120px; border-radius: 8px;
  margin-top: 0.4rem; object-fit: cover; border: 1px solid rgba(255,255,255,0.08);
}
</style>
