<template>
  <div class="admin-contact">
    <div class="section">
      <h3 class="section-title">Foto de perfil</h3>
      <p class="section-hint">Sube una foto para la sección de contacto. Se recomienda formato 4:5.</p>
      <div class="photo-upload-row">
        <button class="btn-upload" @click="triggerPhotoInput">Subir foto</button>
        <input ref="photoInputRef" type="file" accept="image/*" @change="handlePhotoUpload" hidden />
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

    <div class="section">
      <h3 class="section-title">CV / Curriculum</h3>
      <p class="section-hint">Sube tu CV en PDF o ingresa una URL externa.</p>
      <div class="photo-upload-row">
        <button class="btn-upload" @click="triggerCvInput">Subir PDF</button>
        <input ref="cvInputRef" type="file" accept=".pdf" @change="handleCvUpload" hidden />
        <button v-if="cvUrl" class="btn-remove" @click="removeCv">Eliminar CV</button>
      </div>
      <label class="field-label" style="margin-top:0.6rem">O URL externa del PDF</label>
      <input v-model="cvUrl" class="input-wide" placeholder="https://.../cv.pdf" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useContent } from '@/content/useContent'
import { reloadMessages } from '@/i18n'

const { content, save } = useContent()

const photoInputRef = ref(null)
const cvInputRef = ref(null)
const photo = ref('')
const email = ref('')
const linkedinUrl = ref('')
const linkedin = ref('')
const githubUrl = ref('')
const cvUrl = ref('')
const error = ref('')

onMounted(() => {
  loadData()
})

function loadData() {
  const contact = content.es?.home?.contact || content.en?.home?.contact || content.home?.contact || {}
  photo.value = contact.photo || ''
  email.value = contact.email || ''
  linkedinUrl.value = contact.linkedinUrl || ''
  linkedin.value = contact.linkedin || ''
  githubUrl.value = contact.githubUrl || ''
  cvUrl.value = contact.cvUrl || ''
}

function triggerPhotoInput() {
  photoInputRef.value?.click()
}

function triggerCvInput() {
  cvInputRef.value?.click()
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
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      const maxDim = 800
      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        if (width > height) { height = Math.round(height * maxDim / width); width = maxDim }
        else { width = Math.round(width * maxDim / height); height = maxDim }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      photo.value = canvas.toDataURL('image/jpeg', 0.8)
    }
    img.src = reader.result
  }
  reader.readAsDataURL(file)
}

function removePhoto() {
  photo.value = ''
}

function handleCvUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (file.type !== 'application/pdf') {
    error.value = 'Solo se permiten archivos PDF'
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    error.value = 'El PDF no debe superar 10MB'
    return
  }
  error.value = ''
  const reader = new FileReader()
  reader.onload = () => { cvUrl.value = reader.result }
  reader.readAsDataURL(file)
}

function removeCv() {
  cvUrl.value = ''
}

function handleSave() {
  error.value = ''
  if (!email.value && !linkedinUrl.value && !githubUrl.value) {
    error.value = 'Al menos un medio de contacto debe estar configurado'
    return
  }
  const contactData = {
    email: email.value.trim(),
    linkedin: linkedin.value.trim() || 'LinkedIn',
    linkedinUrl: linkedinUrl.value.trim(),
    githubUrl: githubUrl.value.trim(),
    cvUrl: cvUrl.value.trim(),
    photo: photo.value
  }
  const full = JSON.parse(JSON.stringify(content))
  full.es = full.es || {}
  full.es.home = full.es.home || {}
  full.es.home.contact = { ...contactData }
  full.en = full.en || {}
  full.en.home = full.en.home || {}
  full.en.home.contact = { ...contactData }
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
.btn-upload {
  padding: 0.45rem 1rem; border: 1px solid rgba(122, 214, 255, 0.3);
  border-radius: 10px; background: rgba(122, 214, 255, 0.1);
  color: #7ad6ff; font-family: inherit; font-size: 0.72rem;
  cursor: pointer; transition: all 0.2s;
}
.btn-upload:hover { background: rgba(122, 214, 255, 0.2); }
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
