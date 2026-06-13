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
      <h3 class="section-title">CV Español</h3>
      <p class="section-hint">Sube el CV en español en PDF o ingresa una URL externa.</p>
      <div class="photo-upload-row">
        <button class="btn-upload" @click="triggerCvInput('es')">Subir PDF</button>
        <input ref="cvInputRefEs" type="file" accept=".pdf" @change="(e) => handleCvUpload(e, 'es')" hidden />
        <button v-if="cvUrlEs" class="btn-remove" @click="removeCv('es')">Eliminar CV</button>
      </div>
      <label class="field-label" style="margin-top:0.6rem">O URL externa del PDF</label>
      <input v-model="cvUrlEs" class="input-wide" placeholder="https://.../cv-es.pdf" />
    </div>

    <div class="section">
      <h3 class="section-title">CV English</h3>
      <p class="section-hint">Upload your CV in English as PDF or enter an external URL.</p>
      <div class="photo-upload-row">
        <button class="btn-upload" @click="triggerCvInput('en')">Upload PDF</button>
        <input ref="cvInputRefEn" type="file" accept=".pdf" @change="(e) => handleCvUpload(e, 'en')" hidden />
        <button v-if="cvUrlEn" class="btn-remove" @click="removeCv('en')">Remove CV</button>
      </div>
      <label class="field-label" style="margin-top:0.6rem">Or external PDF URL</label>
      <input v-model="cvUrlEn" class="input-wide" placeholder="https://.../cv-en.pdf" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useContent } from '@/content/useContent'
import { reloadMessages } from '@/i18n'

const { content, save } = useContent()

const photoInputRef = ref(null)
const cvInputRefEs = ref(null)
const cvInputRefEn = ref(null)
const photo = ref('')
const email = ref('')
const linkedinUrl = ref('')
const linkedin = ref('')
const githubUrl = ref('')
const cvUrlEs = ref('')
const cvUrlEn = ref('')
const error = ref('')

onMounted(() => {
  loadData()
})

function loadData() {
  photo.value = content.es?.home?.contact?.photo || content.en?.home?.contact?.photo || ''
  email.value = content.es?.home?.contact?.email || content.en?.home?.contact?.email || ''
  linkedinUrl.value = content.es?.home?.contact?.linkedinUrl || content.en?.home?.contact?.linkedinUrl || ''
  linkedin.value = content.es?.home?.contact?.linkedin || content.en?.home?.contact?.linkedin || ''
  githubUrl.value = content.es?.home?.contact?.githubUrl || content.en?.home?.contact?.githubUrl || ''
  cvUrlEs.value = content.es?.home?.contact?.cvUrl || ''
  cvUrlEn.value = content.en?.home?.contact?.cvUrl || ''
}

function triggerPhotoInput() {
  photoInputRef.value?.click()
}

function triggerCvInput(locale) {
  if (locale === 'es') cvInputRefEs.value?.click()
  else cvInputRefEn.value?.click()
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

function handleCvUpload(event, locale) {
  const file = event.target.files?.[0]
  if (!file) return
  if (file.type !== 'application/pdf') {
    error.value = locale === 'es' ? 'Solo se permiten archivos PDF' : 'Only PDF files allowed'
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    error.value = locale === 'es' ? 'El PDF no debe superar 10MB' : 'PDF must not exceed 10MB'
    return
  }
  error.value = ''
  const reader = new FileReader()
  reader.onload = () => {
    if (locale === 'es') cvUrlEs.value = reader.result
    else cvUrlEn.value = reader.result
  }
  reader.readAsDataURL(file)
}

function removeCv(locale) {
  if (locale === 'es') cvUrlEs.value = ''
  else cvUrlEn.value = ''
}

function handleSave() {
  error.value = ''
  if (!email.value && !linkedinUrl.value && !githubUrl.value) {
    error.value = 'Al menos un medio de contacto debe estar configurado'
    return
  }
  const full = JSON.parse(JSON.stringify(content))
  full.es = full.es || {}
  full.es.home = full.es.home || {}
  full.es.home.contact = {
    email: email.value.trim(),
    linkedin: linkedin.value.trim() || 'LinkedIn',
    linkedinUrl: linkedinUrl.value.trim(),
    githubUrl: githubUrl.value.trim(),
    cvUrl: cvUrlEs.value.trim(),
    photo: photo.value
  }
  full.en = full.en || {}
  full.en.home = full.en.home || {}
  full.en.home.contact = {
    email: email.value.trim(),
    linkedin: linkedin.value.trim() || 'LinkedIn',
    linkedinUrl: linkedinUrl.value.trim(),
    githubUrl: githubUrl.value.trim(),
    cvUrl: cvUrlEn.value.trim(),
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
