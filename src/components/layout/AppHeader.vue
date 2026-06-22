<template>
  <header
    class="fixed inset-x-0 top-0 z-[100] h-auto pt-0 lg:px-6 after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-gradient-to-r after:from-rose-300/25 after:via-fuchsia-500/80 after:to-pink-300/25 px-0 pcx-0"
  >
    <div class="h-full w-full pt-0 pb-0 backdrop-blur-xl lg:px-4 px-0 transition-colors duration-300">
      <nav
        ref="navRef"
        class="flex min-h-[4.5rem] w-full items-center justify-end text-center md:grid md:min-h-[5.5rem] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-4"
        :aria-label="t('layout.nav.ariaLabel')"
      >
        <div class="hidden md:block" aria-hidden="true"></div>

        <div class="hidden md:flex md:min-w-0 md:items-center md:justify-center">
          <div
            class="mx-auto flex h-full w-full flex-wrap items-center justify-center border-b-[3px] border-fuchsia-500/30 px-6 sm:px-8 md:grid md:min-w-[60vw] md:max-w-5xl md:grid-cols-4 md:px-10 lg:px-12 xl:px-14"
          >
            <a
              v-for="item in navItems"
              :key="item.key"
              :href="item.href"
              class="group relative flex h-full items-center justify-center border-b-[3px] border-transparent px-3 py-2 text-[0.84rem] font-light uppercase tracking-[0.22em] transition duration-300 after:absolute after:left-1/2 after:top-full after:h-[3px] after:w-0 after:-translate-x-1/2 after:bg-gradient-to-r after:from-rose-400 after:via-fuchsia-500 after:to-pink-500 after:transition-all after:duration-300 hover:-translate-y-0.5 hover:text-rose-500 hover:after:w-full active:translate-y-0 active:scale-95 md:py-5 md:text-[0.96rem] lg:text-[1.03rem]"
              :class="navItemClasses(item)"
              :aria-current="activeSection === item.sectionId ? 'page' : undefined"
              @click.prevent="handleNavClick(item)"
            >
              {{ item.label }}
            </a>
          </div>
        </div>

        <div class="flex h-full items-center justify-end gap-3 self-center md:justify-self-end">
          <div class="hidden md:flex md:items-center md:gap-3">
            <label for="header-language" class="sr-only"></label>
            <select
              id="header-language"
              v-model="selectedLanguage"
              class="rounded-full border border-fuchsia-400/30 bg-white/70 px-4 py-2 text-[0.82rem] font-light uppercase tracking-[0.22em] text-rose-900/85 outline-none transition hover:border-fuchsia-300/60 focus:border-fuchsia-200"
              :aria-label="t('layout.language.ariaLabel')"
            >
              <option
                v-for="option in languageOptions"
                :key="option.value"
                :value="option.value"
                class="bg-slate-900 text-rose-50"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <button
            type="button"
            class="mr-3 inline-flex h-12 w-12 self-center items-center justify-center rounded-full border border-fuchsia-400/35 bg-white/70 text-rose-900/85 transition hover:border-fuchsia-300/60 hover:bg-white/80 md:hidden"
            :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
            :aria-controls="mobileMenuId"
            :aria-label="t('layout.nav.openMenu')"
            @click="toggleMobileMenu"
          >
            <span class="sr-only">{{ t('layout.nav.menuSrOnly') }}</span>
            <span class="relative flex h-5 w-5 flex-col items-center justify-center">
              <span
                class="absolute h-[1.5px] w-5 rounded-full bg-current transition duration-300"
                :class="isMobileMenuOpen ? 'translate-y-0 rotate-45' : '-translate-y-[6px]'"
              ></span>
              <span
                class="absolute h-[1.5px] w-5 rounded-full bg-current transition duration-300"
                :class="isMobileMenuOpen ? 'opacity-0' : 'opacity-100'"
              ></span>
              <span
                class="absolute h-[1.5px] w-5 rounded-full bg-current transition duration-300"
                :class="isMobileMenuOpen ? 'translate-y-0 -rotate-45' : 'translate-y-[6px]'"
              ></span>
            </span>
          </button>
        </div>
      </nav>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-[-10px] opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-[-10px] opacity-0"
      >
        <div
          v-if="isMobileMenuOpen"
          :id="mobileMenuId"
          class="md:hidden"
        >
          <div class="mt-3 rounded-[1.75rem] border border-fuchsia-400/25 bg-[#120812]/85 p-4 shadow-[0_18px_50px_rgba(76,11,63,0.32)] backdrop-blur-xl">
            <div class="flex flex-col gap-2">
              <a
                v-for="item in navItems"
                :key="`${item.key}-mobile`"
                :href="item.href"
                class="rounded-2xl border px-4 py-3 text-left text-[0.92rem] font-light uppercase tracking-[0.2em] transition"
                :class="mobileNavItemClasses(item)"
                :aria-current="activeSection === item.sectionId ? 'page' : undefined"
                @click.prevent="handleNavClick(item)"
              >
                {{ item.label }}
              </a>
            </div>

            <div class="mt-4 border-t border-fuchsia-400/20 pt-4">
              <label for="mobile-language" class="mb-2 block text-left text-[0.7rem] font-light uppercase tracking-[0.24em] text-rose-300/80">{{ t('layout.language.label') }}</label>
              <select
                id="mobile-language"
                v-model="selectedLanguage"
                class="w-full rounded-2xl border border-fuchsia-400/25 bg-white/10 px-4 py-3 text-[0.9rem] font-light uppercase tracking-[0.2em] text-rose-50 outline-none transition focus:border-fuchsia-200"
                :aria-label="t('layout.language.ariaLabel')"
              >
                <option
                  v-for="option in languageOptions"
                  :key="`${option.value}-mobile`"
                  :value="option.value"
                  class="bg-slate-900 text-rose-50"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { setLocale } from '@/i18n'
import { useScrollY } from '@/composables/useScrollY'

const route = useRoute()
const { locale, t } = useI18n()
const activeSection = ref('inicio')
const navRef = ref(null)
const isMobileMenuOpen = ref(false)

const mobileMenuId = 'primary-mobile-nav'

const selectedLanguage = computed({
  get: () => locale.value,
  set: (value) => setLocale(value)
})

const navItems = computed(() => [
  { key: 'home', label: t('layout.nav.items.home'), href: '#inicio', sectionId: 'inicio', home: true },
  { key: 'projects', label: t('layout.nav.items.projects'), href: '#proyectos', sectionId: 'proyectos' },
  { key: 'stack', label: t('layout.nav.items.stack'), href: '#stack', sectionId: 'stack' },
  { key: 'contact', label: t('layout.nav.items.contact'), href: '#contacto', sectionId: 'contacto' }
])

const languageOptions = computed(() => [
  { value: 'es', label: t('layout.language.options.es') },
  { value: 'en', label: t('layout.language.options.en') }
])

const isHomeRoute = computed(() => route.name === 'home')

function navItemClasses(item) {
  const isActive = isHomeRoute.value && activeSection.value === item.sectionId
  return isActive
    ? [
        'bg-gradient-to-r from-rose-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_10px_22px_rgba(214,123,165,0.34)] -translate-y-0.5 hover:-translate-y-1 hover:drop-shadow-[0_14px_30px_rgba(214,123,165,0.42)] after:h-[5px] after:w-full hover:after:scale-x-110',
        item.home
          ? 'text-rose-500/90'
          : ''
      ]
    : [
        'text-rose-400/85',
        item.home
          ? 'text-rose-500/90'
          : ''
      ]
}

function mobileNavItemClasses(item) {
  const isActive = isHomeRoute.value && activeSection.value === item.sectionId

  return isActive
    ? 'border-rose-300/60 bg-white/12 text-rose-100'
    : 'border-white/10 text-rose-50/90 hover:border-rose-300/40 hover:bg-white/6'
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function scrollToSection(sectionId) {
  if (sectionId === 'stack') {
    scrollToStack()
    return
  }
  const el = document.getElementById(sectionId)
  if (!el) {
    const observer = new MutationObserver(() => {
      const target = document.getElementById(sectionId)
      if (target) {
        scrollToElement(target)
        observer.disconnect()
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
    setTimeout(() => { observer.disconnect() }, 6000)
    return
  }
  scrollToElement(el)
}

function scrollToElement(el) {
  const header = document.querySelector('header.sticky')
  const headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 88
  const spacer = el.closest('.pin-spacer')
  if (spacer) {
    const target = spacer.offsetTop - headerH
    window.scrollTo({ top: target, behavior: 'smooth' })
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - headerH
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

function scrollToStack() {
  const projectsSection = document.getElementById('proyectos')
  if (projectsSection) {
    doScrollToStack(projectsSection)
    return
  }
  const observer = new MutationObserver(() => {
    const section = document.getElementById('proyectos')
    if (section) {
      doScrollToStack(section)
      observer.disconnect()
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
  setTimeout(() => { observer.disconnect() }, 6000)
}

function doScrollToStack(section) {
  const spacer = section.closest('.pin-spacer')
  if (spacer) {
    const scrollRange = spacer.offsetHeight - section.offsetHeight
    const target = spacer.offsetTop + scrollRange * 0.64
    window.scrollTo({ top: target, behavior: 'smooth' })
  } else {
    const header = document.querySelector('header.sticky')
    const headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 88
    const sectionTop = section.getBoundingClientRect().top + window.scrollY - headerH
    window.scrollTo({ top: sectionTop + 4000, behavior: 'smooth' })
  }
}

const { scrollY } = useScrollY()

const sectionIds = ['inicio', 'proyectos', 'stack', 'contacto']
let sectionBounds = []
let boundsReady = false

function calcSectionBounds() {
  sectionBounds = sectionIds.map(id => {
    const el = document.getElementById(id)
    if (!el) return null

    if (id === 'stack') {
      const proyEl = document.getElementById('proyectos')
      if (!proyEl) return null
      const spacer = proyEl.closest('.pin-spacer')
      if (!spacer) return null
      const scrollRange = spacer.offsetHeight - proyEl.offsetHeight
      const stackStart = spacer.offsetTop + scrollRange * 0.64
      return { id, top: stackStart, bottom: spacer.offsetTop + spacer.offsetHeight }
    }

    if (id === 'proyectos') {
      const spacer = el.closest('.pin-spacer')
      if (spacer) {
        const scrollRange = spacer.offsetHeight - el.offsetHeight
        const proyEnd = spacer.offsetTop + scrollRange * 0.64
        return { id, top: spacer.offsetTop, bottom: proyEnd }
      }
      const top = el.offsetTop
      return { id, top, bottom: top + el.offsetHeight }
    }

    const spacer = el.closest('.pin-spacer')
    if (spacer) {
      const top = spacer.offsetTop
      return { id, top, bottom: top + spacer.offsetHeight }
    }
    const top = el.offsetTop
    return { id, top, bottom: top + el.offsetHeight }
  }).filter(Boolean)

  const allSections = sectionBounds.length === sectionIds.length
  const proyectosReady = document.getElementById('proyectos')?.closest('.pin-spacer')
  boundsReady = allSections && !!proyectosReady
}

let navClickPending = null
let navClickTimer = null

function handleNavClick(item) {
  closeMobileMenu()
  activeSection.value = item.sectionId
  navClickPending = item.sectionId
  if (navClickTimer) clearTimeout(navClickTimer)
  navClickTimer = setTimeout(() => { navClickPending = null }, 1200)
  history.replaceState(null, '', `#${item.sectionId}`)
  scrollToSection(item.sectionId)
}

watch(scrollY, () => {
  if (!isHomeRoute.value) return
  if (!boundsReady) calcSectionBounds()
  if (!sectionBounds.length) return

  const mid = scrollY.value + window.innerHeight / 2

  if (navClickPending) {
    const target = sectionBounds.find(s => s.id === navClickPending)
    if (!target) return
    if (mid >= target.top && mid < target.bottom) {
      navClickPending = null
    }
    return
  }

  let found = sectionBounds[0]?.id || 'inicio'
  for (const s of sectionBounds) {
    if (mid >= s.top && mid < s.bottom) {
      found = s.id
      break
    }
  }
  if (found !== activeSection.value) {
    activeSection.value = found
  }
})

function onResize() {
  closeMobileMenu()
  boundsReady = false
}

function onHashChange() {
  closeMobileMenu()
}

watch(() => route.fullPath, () => {
  closeMobileMenu()
  boundsReady = false
})

watch(isHomeRoute, (val) => {
  if (!val) {
    activeSection.value = ''
    boundsReady = false
  }
})

onMounted(() => {
  window.addEventListener('resize', onResize)
  window.addEventListener('hashchange', onHashChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('hashchange', onHashChange)
  if (navClickTimer) clearTimeout(navClickTimer)
})
</script>

<style scoped>
.pcx-0 {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

</style>

