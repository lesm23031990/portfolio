<template>
  <div class="admin-page">
    <header class="admin-topbar">
      <div class="admin-topbar__brand">
        <h2>Admin</h2>
        <span class="admin-topbar__brand-sub">Content manager</span>
      </div>
      <nav class="admin-topbar__nav">
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
      <div class="admin-topbar__right">
        <span class="admin-topbar__email">{{ sessionUser }}</span>
        <button class="admin-logout" @click="handleLogout">Cerrar sesión</button>
        <a href="/" class="admin-topbar__back">← Portfolio</a>
      </div>
    </header>
    <aside class="admin-sidebar">
      <div class="admin-sidebar__info">
        <h1 class="admin-sidebar__title">{{ currentTab.label }}</h1>
        <p class="admin-sidebar__desc">{{ currentTab.desc }}</p>
      </div>
      <div class="admin-sidebar__actions">
        <button class="sidebar-btn sidebar-btn--save" @click="handleSidebarSave">
          Guardar cambios
        </button>
        <span v-if="sidebarSaved" class="sidebar-saved">✓ Guardado</span>
        <button
          v-if="activeTab === 'projects'"
          class="sidebar-btn sidebar-btn--add"
          @click="projectsRef?.startAdd()"
        >
          + Nuevo proyecto
        </button>
        <template v-if="activeTab === 'stack'">
          <button class="sidebar-btn sidebar-btn--add" @click="stackRef?.addGroup()">+ Grupo</button>
          <button class="sidebar-btn sidebar-btn--add" @click="stackRef?.addOrb()">+ Orbe</button>
        </template>
      </div>
      <button class="admin-export" @click="handleExport">⬇ Exportar JSON</button>
    </aside>
    <main class="admin-main">
      <AdminTranslations v-if="activeTab === 'translations'" :key="saveKey" ref="translationsRef" />
      <AdminProjects v-else-if="activeTab === 'projects'" :key="saveKey" ref="projectsRef" />
      <AdminStack v-else-if="activeTab === 'stack'" :key="saveKey" ref="stackRef" />
      <AdminContact v-else-if="activeTab === 'contact'" :key="saveKey" ref="contactRef" />
      <AdminConfig v-else-if="activeTab === 'config'" :key="saveKey" ref="configRef" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { logout, getSessionUser } from '@/content/auth'
import { useContent } from '@/content/useContent'
import AdminTranslations from '@/components/admin/AdminTranslations.vue'
import AdminProjects from '@/components/admin/AdminProjects.vue'
import AdminStack from '@/components/admin/AdminStack.vue'
import AdminContact from '@/components/admin/AdminContact.vue'
import AdminConfig from '@/components/admin/AdminConfig.vue'

const router = useRouter()
const activeTab = ref('translations')
const saveKey = ref(0)
const sidebarSaved = ref(false)

const translationsRef = ref(null)
const projectsRef = ref(null)
const stackRef = ref(null)
const contactRef = ref(null)
const configRef = ref(null)

const sessionUser = getSessionUser()
const { content } = useContent()

const tabs = [
  { key: 'translations', label: 'Traducciones', desc: 'Editar textos por idioma' },
  { key: 'projects', label: 'Proyectos', desc: 'Administrar proyectos (máx. 4)' },
  { key: 'stack', label: 'Stack', desc: 'Administrar tecnologías y orbes' },
  { key: 'contact', label: 'Contacto', desc: 'Foto de perfil y redes sociales' },
  { key: 'config', label: 'Config', desc: 'Credenciales de acceso' }
]

const currentTab = computed(() => tabs.find(t => t.key === activeTab.value) || tabs[0])

function handleLogout() {
  logout()
  router.push('/login')
}

async function handleSidebarSave() {
  sidebarSaved.value = false
  try {
    if (activeTab.value === 'translations') {
      translationsRef.value?.handleSave()
    } else if (activeTab.value === 'projects') {
      projectsRef.value?.handleSave()
    } else if (activeTab.value === 'stack') {
      stackRef.value?.handleSave()
    } else if (activeTab.value === 'contact') {
      contactRef.value?.handleSave()
    } else if (activeTab.value === 'config') {
      await configRef.value?.handleSave()
    }
    sidebarSaved.value = true
    setTimeout(() => { sidebarSaved.value = false }, 2000)
  } catch (_) { /* ignore */ }
}

function handleExport() {
  const json = JSON.stringify(content, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'content.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #0a0b10;
  color: #f7f3ff;
  font-family: 'JetBrains Mono', monospace;
}

/* ── Top Bar (fixed, horizontal) ── */
.admin-topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 52px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0 1.5rem;
  background: rgba(14, 16, 25, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  z-index: 100;
}

.admin-topbar__brand {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-shrink: 0;
}

.admin-topbar__brand h2 {
  margin: 0;
  font-size: 1rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #ff33d4;
}

.admin-topbar__brand-sub {
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.1em;
}

.admin-topbar__nav {
  display: flex;
  gap: 0.25rem;
  flex: 1;
  justify-content: center;
}

.admin-topbar__right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.admin-topbar__email {
  font-size: 0.62rem;
  color: rgba(255, 255, 255, 0.3);
}

.admin-topbar__back {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.3);
  text-decoration: none;
  transition: color 0.2s;
}

.admin-topbar__back:hover {
  color: #f7f3ff;
}

/* ── Nav Items ── */
.admin-nav__item {
  padding: 0.45rem 0.9rem;
  border: 1px solid transparent;
  border-radius: 12px;
  text-align: center;
  font-family: inherit;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.6);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
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

/* ── Logout ── */
.admin-logout {
  padding: 0.35rem 0.65rem;
  border: 1px solid rgba(255, 92, 122, 0.3);
  border-radius: 10px;
  background: transparent;
  color: #ff5c7a;
  font-family: inherit;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.admin-logout:hover {
  background: rgba(255, 92, 122, 0.1);
}

/* ── Sidebar (fixed, below topbar) ── */
.admin-sidebar {
  position: fixed;
  top: 52px;
  left: 0;
  bottom: 0;
  width: 200px;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(14, 16, 25, 0.6);
  z-index: 90;
}

.admin-sidebar__info {
  margin-bottom: 0.5rem;
}

/* ── Sidebar Actions ── */
.admin-sidebar__actions {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.sidebar-btn {
  padding: 0.45rem 0.75rem;
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.72rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  white-space: nowrap;
}

.sidebar-btn--save {
  border: 1px solid rgba(122, 214, 255, 0.3);
  background: rgba(122, 214, 255, 0.08);
  color: #7ad6ff;
}

.sidebar-btn--save:hover {
  border-color: rgba(122, 214, 255, 0.6);
}

.sidebar-btn--add {
  border: 1px solid rgba(109, 247, 200, 0.3);
  background: rgba(109, 247, 200, 0.08);
  color: #6df7c8;
}

.sidebar-btn--add:hover {
  border-color: rgba(109, 247, 200, 0.6);
}

.sidebar-saved {
  font-size: 0.7rem;
  color: #6df7c8;
  text-align: center;
}

.admin-sidebar__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.admin-sidebar__desc {
  margin: 0.5rem 0 0;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.4);
}

/* ── Export ── */
.admin-export {
  padding: 0.5rem;
  border: 1px solid rgba(109, 247, 200, 0.3);
  border-radius: 10px;
  background: transparent;
  color: #6df7c8;
  font-family: inherit;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.admin-export:hover {
  background: rgba(109, 247, 200, 0.1);
}

/* ── Main ── */
.admin-main {
  margin-left: 200px;
  margin-top: 52px;
  padding: 1.5rem 2rem 3rem;
  min-height: calc(100vh - 52px);
}
</style>
