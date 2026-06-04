<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">Admin Access</h1>
      <p class="login-desc">Inicia sesión para administrar el contenido</p>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="field">
          <label for="username">Usuario</label>
          <input id="username" v-model="username" type="text" autocomplete="username" required />
        </div>
        <div class="field">
          <label for="password">Contraseña</label>
          <input id="password" v-model="password" type="password" autocomplete="current-password" required />
        </div>
        <p v-if="error" class="login-error">{{ error }}</p>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>
      <a href="/" class="login-back">← Volver al portfolio</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { loginWithPassword } from '@/content/auth'

const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const ok = await loginWithPassword(username.value, password.value)
    if (ok) {
      router.push(route.query.redirect || '/admin')
    } else {
      error.value = 'Usuario o contraseña incorrectos'
    }
  } catch {
    error.value = 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh; display: grid; place-items: center;
  background: #0a0b10; font-family: 'JetBrains Mono', monospace; padding: 1rem;
}
.login-card {
  width: 100%; max-width: 400px; padding: 2.5rem 2rem;
  border-radius: 24px; border: 1px solid rgba(255, 51, 212, 0.2);
  background: linear-gradient(135deg, rgba(14, 16, 25, 0.98), rgba(8, 9, 14, 0.98));
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5);
  text-align: center;
}
.login-title {
  margin: 0 0 0.5rem; font-size: 1.3rem; font-weight: 400;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: #f7f3ff; text-shadow: 0 0 18px rgba(255, 51, 212, 0.18);
}
.login-desc {
  margin: 0 0 1.5rem; font-size: 0.78rem; color: rgba(255, 255, 255, 0.45);
}
.login-form {
  display: grid; gap: 1.25rem; text-align: left;
}
.field { display: grid; gap: 0.35rem; }
.field label {
  font-size: 0.72rem; letter-spacing: 0.12em;
  color: rgba(122, 214, 255, 0.82); text-transform: uppercase;
}
.field input {
  padding: 0.7rem 0.9rem; border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04); color: #f7f3ff;
  font-family: inherit; font-size: 0.9rem; outline: none;
  transition: border-color 0.25s;
}
.field input:focus { border-color: rgba(255, 51, 212, 0.5); }
.login-btn {
  padding: 0.75rem; border: 1px solid rgba(255, 51, 212, 0.3);
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(255, 51, 212, 0.15), rgba(122, 214, 255, 0.08));
  color: #f7f3ff; font-family: inherit; font-size: 0.88rem;
  letter-spacing: 0.12em; cursor: pointer; transition: all 0.25s;
}
.login-btn:hover:not(:disabled) {
  border-color: rgba(255, 51, 212, 0.6);
  box-shadow: 0 0 24px rgba(255, 51, 212, 0.12);
}
.login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.login-error { margin: 0; font-size: 0.78rem; color: #ff5c7a; }
.login-back {
  display: block; margin-top: 1.5rem; font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.35); text-decoration: none;
}
.login-back:hover { color: rgba(255, 255, 255, 0.65); }
</style>
