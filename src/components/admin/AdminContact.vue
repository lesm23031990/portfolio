<template>
  <div class="admin-contact">
    <div class="section">
      <h3 class="section-title">Foto de perfil</h3>
      <p class="section-hint">Sube una foto para la sección de contacto. Se recomienda formato 4:5.</p>
      <div class="photo-upload-row">
        <input type="file" accept="image/*" @change="handlePhotoUpload" />
        <button v-if="photo" class="btn-remove" @click="removePhoto">Eliminar foto</button>
      </div>
      <img v-if="photo" :src="photo" class="photo-preview" alt="Profile preview" />
    </div>

    <div class="section">
      <h3 class="section-title">Redes sociales</h3>
      <p class="section-hint">URLs de tus perfiles públicos.</p>
      <label class="field-label">Email</label>
      <input v-model="email" class="input-wide" type="email" placeholder="email@ejemplo.com" />

      <label class="field-label" style="margin-top:0.6rem">LinkedIn URL</label>
      <input v-model="linkedinUrl" class="input-wide" placeholder="https://linkedin.com/in/..." />

      <label class="field-label" style="margin-top:0.6rem">LinkedIn (texto visible)</label>
      <input v-model="linkedin" class="input-wide" placeholder="LinkedIn" />

      <label class="field-label" style="margin-top:0.6rem">GitHub URL</label>
      <input v-model="githubUrl" class="input-wide" placeholder="https://github.com/..." />

      <span v-if="error" class="error-msg" style="margin-top:0.5rem">{{ error }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useContent } from '@/content/useContent'
import { reloadMessages } from '@/i18n'

const { content, save } = useContent()

const photo = ref('')
const email = ref('')
const linkedinUrl = ref('')
const linkedin = ref('')
const githubUrl = ref('')
const error = ref('')

onMounted(() => {
  loadData()
})

function loadData() {
  const contact = content.home?.contact || {}
  photo.value = contact.photo || ''
  email.value = contact.email || ''
  linkedinUrl.value = contact.linkedinUrl || ''
  linkedin.value = contact.linkedin || ''
  githubUrl.value = contact.githubUrl || ''
}

function handlePhotoUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'La imagen no debe superar 5MB'
    return
  }
  error.value = ''
  const reader = new FileReader()
  reader.onload = () => { photo.value = reader.result }
  reader.readAsDataURL(file)
}

function removePhoto() {
  photo.value = ''
}

function handleSave() {
  error.value = ''
  if (!email.value && !linkedinUrl.value && !githubUrl.value) {
    error.value = 'Al menos un medio de contacto debe estar configurado'
    return
  }
  const full = JSON.parse(JSON.stringify(content))
  full.home = full.home || {}
  full.home.contact = {
    email: email.value.trim(),
    linkedin: linkedin.value.trim() || 'LinkedIn',
    linkedinUrl: linkedinUrl.value.trim(),
    githubUrl: githubUrl.value.trim(),
    photo: photo.value
  }
  save(full)
  reloadMessages()
}

defineExpose({ handleSave })
</script>

<style scoped>
.admin-contact { display: grid; gap: 1.5rem; max-width: 640px; }
.section { display: grid; gap: 0.3rem; }
.section-title {
  margin: 0; font-size: 0.9rem; font-weight: 400;
  letter-spacing: 0.12em; text-transform: uppercase; color: #7ad6ff;
}
.section-hint {
  margin: 0 0 0.3rem; font-size: 0.72rem; color: rgba(255, 255, 255, 0.35);
}
.field-label {
  font-size: 0.68rem; letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.5); text-transform: uppercase;
}
.input-wide {
  padding: 0.6rem 0.8rem; border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04); color: #f7f3ff;
  font-family: inherit; font-size: 0.82rem; outline: none;
}
.input-wide:focus { border-color: rgba(122, 214, 255, 0.4); }
.error-msg { font-size: 0.78rem; color: #ff5c7a; }
.photo-upload-row { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.3rem; }
.photo-upload-row input[type="file"] { font-size: 0.75rem; color: rgba(255, 255, 255, 0.6); }
.btn-remove {
  padding: 0.25rem 0.6rem; border: 1px solid rgba(255, 92, 122, 0.3);
  border-radius: 6px; background: transparent; color: #ff5c7a;
  font-family: inherit; font-size: 0.65rem; cursor: pointer;
}
.photo-preview {
  max-width: 240px; max-height: 300px; border-radius: 12px;
  margin-top: 0.5rem; object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
