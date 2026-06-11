<template>
  <div class="admin-config">
    <div class="section">
      <h3 class="section-title">Credenciales de acceso</h3>
      <p class="section-hint">Usuario y contraseña para iniciar sesión en el panel admin.</p>
      <label class="field-label">Usuario</label>
      <input v-model="adminUser" class="input-wide" placeholder="admin" />
      <label class="field-label" style="margin-top:0.6rem">Nueva contraseña (dejar vacío para no cambiar)</label>
      <input v-model="adminPassword" type="password" class="input-wide" placeholder="········" autocomplete="new-password" />
      <label class="field-label" style="margin-top:0.6rem">Confirmar contraseña</label>
      <input v-model="adminPasswordConfirm" type="password" class="input-wide" placeholder="········" autocomplete="new-password" />
      <span v-if="error" class="error-msg" style="margin-top:0.5rem">{{ error }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useContent } from '@/content/useContent'
import { hashPassword } from '@/content/auth'
import { reloadMessages } from '@/i18n'

const { content, save } = useContent()

const adminUser = ref('')
const adminPassword = ref('')
const adminPasswordConfirm = ref('')
const saved = ref(false)
const error = ref('')

onMounted(() => {
  adminUser.value = content.adminUser || 'admin'
})

async function handleSave() {
  error.value = ''
  if (adminPassword.value || adminPasswordConfirm.value) {
    if (adminPassword.value !== adminPasswordConfirm.value) {
      error.value = 'Las contraseñas no coinciden'
      return
    }
    if (adminPassword.value.length < 6) {
      error.value = 'La contraseña debe tener al menos 6 caracteres'
      return
    }
  }
  const full = JSON.parse(JSON.stringify(content))
  full.adminUser = adminUser.value.trim() || 'admin'
  if (adminPassword.value) {
    full.adminPasswordHash = await hashPassword(adminPassword.value)
  }
  save(full)
  reloadMessages()
  adminPassword.value = ''
  adminPasswordConfirm.value = ''
  saved.value = true
  setTimeout(() => { saved.value = false }, 2000)
}

defineExpose({ handleSave })
</script>

<style scoped>
.admin-config { display: grid; gap: 1.2rem; max-width: 640px; }
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
</style>
