<template>
  <div class="admin-page">
    <aside class="admin-sidebar">
      <div class="admin-brand">
        <h2>Admin</h2>
        <span class="admin-brand-sub">Content manager</span>
      </div>
      <nav class="admin-nav">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="admin-nav__item"
          :class="{ 'admin-nav__item--active': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </nav>
      <div class="admin-sidebar-footer">
        <span class="admin-email">{{ sessionUser }}</span>
        <button class="admin-logout" @click="handleLogout">Cerrar sesión</button>
        <a href="/" class="admin-back-link">← Portfolio</a>
      </div>
    </aside>
    <main class="admin-main">
      <header class="admin-header">
        <h1 class="admin-header__title">{{ currentTab.label }}</h1>
        <p class="admin-header__desc">{{ currentTab.desc }}</p>
      </header>
      <div class="admin-content">
        <AdminTranslations v-if="activeTab === 'translations'" :key="saveKey" />
        <AdminProjects v-else-if="activeTab === 'projects'" :key="saveKey" />
        <AdminStack v-else-if="activeTab === 'stack'" :key="saveKey" />
        <AdminConfig v-else-if="activeTab === 'config'" :key="saveKey" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { logout, getSessionUser } from '@/content/auth'
import AdminTranslations from '@/components/admin/AdminTranslations.vue'
import AdminProjects from '@/components/admin/AdminProjects.vue'
import AdminStack from '@/components/admin/AdminStack.vue'
import AdminConfig from '@/components/admin/AdminConfig.vue'

const router = useRouter()
const activeTab = ref('translations')
const saveKey = ref(0)

const sessionUser = getSessionUser()

const tabs = [
  { key: 'translations', label: 'Traducciones', desc: 'Editar textos por idioma' },
  { key: 'projects', label: 'Proyectos', desc: 'Administrar proyectos (máx. 4)' },
  { key: 'stack', label: 'Stack', desc: 'Administrar tecnologías y orbes' },
  { key: 'config', label: 'Config', desc: 'Credenciales de acceso' }
]

const currentTab = computed(() => tabs.find(t => t.key === activeTab.value) || tabs[0])

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-page {
  display: flex;
  min-height: 100vh;
  background: #0a0b10;
  color: #f7f3ff;
  font-family: 'JetBrains Mono', monospace;
}
.admin-sidebar {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(14, 16, 25, 0.6);
}
.admin-brand h2 {
  margin: 0;
  font-size: 1.1rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #ff33d4;
}
.admin-brand-sub {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.1em;
}
.admin-nav {
  display: grid;
  gap: 0.4rem;
  margin-top: 2rem;
  flex: 1;
}
.admin-nav__item {
  padding: 0.7rem 0.9rem;
  border: 1px solid transparent;
  border-radius: 12px;
  text-align: left;
  font-family: inherit;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.6);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}
.admin-nav__item:hover {
  color: #f7f3ff;
  background: rgba(255, 255, 255, 0.04);
}
.admin-nav__item--active {
  color: #f7f3ff;
  border-color: rgba(255, 51, 212, 0.25);
  background: rgba(255, 51, 212, 0.08);
}
.admin-sidebar-footer {
  display: grid;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.admin-email {
  font-size: 0.62rem; color: rgba(255, 255, 255, 0.3);
  text-align: center; word-break: break-all;
}
.admin-logout {
  padding: 0.5rem;
  border: 1px solid rgba(255, 92, 122, 0.3);
  border-radius: 10px;
  background: transparent;
  color: #ff5c7a;
  font-family: inherit;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}
.admin-logout:hover {
  background: rgba(255, 92, 122, 0.1);
}
.admin-back-link {
  text-align: center;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.3);
  text-decoration: none;
}
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.admin-header {
  padding: 1.5rem 2rem 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.admin-header__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.admin-header__desc {
  margin: 0.3rem 0 0;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.4);
}
.admin-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem 3rem;
}
</style>
