<template>
  <section
    id="contacto"
    ref="sectionRef"
    class="contact-scene"
  >
    <div class="contact-scene__bg" aria-hidden="true">
      <CircuitBackground v-if="isDesktop" class="contact-scene__circuit" />
      <CircuitBackgroundMobile v-if="!isDesktop" class="contact-scene__circuit" />
      <div class="contact-scene__glow contact-scene__glow--left"></div>
      <div class="contact-scene__glow contact-scene__glow--right"></div>
    </div>

    <div class="contact-scene__inner">
      <div class="contact-scene__copy">
        <p ref="eyebrowRef" class="contact-scene__eyebrow">{{ t('home.sections.contact.title') }}</p>
        <h3 ref="titleRef" class="contact-scene__title">{{ t('home.contactPanel.title') }}</h3>
        <p ref="subRef" class="contact-scene__sub">{{ t('home.contactPanel.subtitle') }}</p>

        <div ref="actionsRef" class="contact-scene__actions">
          <button class="contact-action contact-action--primary" type="button" @click="showModal = true">
            {{ t('home.contactPanel.primaryCta') }}
          </button>
          <a
            class="contact-action contact-action--secondary"
            :href="contactLinkedin"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ t('home.contactPanel.secondaryCta') }}
          </a>
          <div class="contact-action contact-action--tertiary contact-dropdown">
            <button ref="cvTriggerRef" type="button" class="contact-dropdown__trigger" @click="toggleCvDropdown">
              {{ t('home.contactPanel.tertiaryCta') }}
              <span class="contact-dropdown__arrow">&#9662;</span>
            </button>

            <div v-if="cvDropdownOpen" class="contact-dropdown__menu" @click.self="cvDropdownOpen = false">
              <a
                v-if="contactCvUrlEs"
                class="contact-dropdown__item"
                :href="contactCvUrlEs"
                download="CV-Lorena-Salas-ES.pdf"
                @click="cvDropdownOpen = false"
              >
                {{ t('home.contactPanel.tertiaryCtaEs') }}
              </a>
              <a
                v-if="contactCvUrlEn"
                class="contact-dropdown__item"
                :href="contactCvUrlEn"
                download="CV-Lorena-Salas-EN.pdf"
                @click="cvDropdownOpen = false"
              >
                {{ t('home.contactPanel.tertiaryCtaEn') }}
              </a>
            </div>
          </div>
          <button class="contact-action contact-action--schedule" type="button" @click="openScheduleModal">
            {{ t('home.contactPanel.scheduleCta') }}
          </button>
        </div>

        <div ref="cardsRef" class="contact-scene__cards">
          <button class="contact-card contact-card--btn" type="button" @click="showModal = true">
            <span class="contact-card__label">{{ t('home.contactPanel.cards.email.label') }}</span>
            <strong class="contact-card__value">{{ contactEmail }}</strong>
            <span class="contact-card__meta">{{ t('home.contactPanel.cards.email.meta') }}</span>
          </button>

          <a
            class="contact-card"
            :href="contactLinkedin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="contact-card__label">{{ t('home.contactPanel.cards.linkedin.label') }}</span>
            <strong class="contact-card__value">{{ t('home.contact.linkedin') }}</strong>
            <span class="contact-card__meta">{{ t('home.contactPanel.cards.linkedin.meta') }}</span>
          </a>

          <a
            v-if="contactCvUrlEs"
            class="contact-card"
            :href="contactCvUrlEs"
            download="CV-Lorena-Salas-ES.pdf"
          >
            <span class="contact-card__label">{{ t('home.contactPanel.cards.cv.label') }}</span>
            <strong class="contact-card__value">{{ t('home.contactPanel.cards.cv.valueEs') }}</strong>
            <span class="contact-card__meta">{{ t('home.contactPanel.cards.cv.meta') }}</span>
          </a>
          <a
            v-if="contactCvUrlEn"
            class="contact-card"
            :href="contactCvUrlEn"
            download="CV-Lorena-Salas-EN.pdf"
          >
            <span class="contact-card__label">{{ t('home.contactPanel.cards.cv.label') }}</span>
            <strong class="contact-card__value">{{ t('home.contactPanel.cards.cv.valueEn') }}</strong>
            <span class="contact-card__meta">{{ t('home.contactPanel.cards.cv.meta') }}</span>
          </a>
        </div>
      </div>

      <div ref="portraitRef" class="contact-scene__portrait">
        <div class="portrait-shell">
          <div class="portrait-frame">
            <div class="portrait-placeholder" :class="{ 'portrait-placeholder--filled': contactPhoto }">
              <img v-if="contactPhoto" :src="contactPhoto" alt="Profile" class="portrait-img" />
              <template v-else>
                <span class="portrait-placeholder__tag">PHOTO SPACE</span>
                <div class="portrait-placeholder__glow"></div>
              </template>
            </div>
          </div>
          <div class="portrait-caption">
            <span>{{ t('home.contactPanel.cards.github.value') }}</span>
            <a
              :href="contactGithub"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ t('home.contactPanel.cards.github.meta') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

<ContactModal v-if="showModal" :schedule="scheduleMode" :message="scheduleMessage" @close="showModal = false; scheduleMode = false; scheduleMessage = ''" />
</template>

<script setup>
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const CircuitBackground = defineAsyncComponent(() => import('@/components/ui/CircuitBackground.vue'))
const CircuitBackgroundMobile = defineAsyncComponent(() => import('@/components/ui/CircuitBackgroundMobile.vue'))
const ContactModal = defineAsyncComponent(() => import('./ContactModal.vue'))

gsap.registerPlugin(ScrollTrigger)

const { t, locale, messages } = useI18n({ useScope: 'global' })

const showModal = ref(false)
const scheduleMode = ref(false)
const scheduleMessage = ref('')
const cvDropdownOpen = ref(false)
const cvTriggerRef = ref(null)

const sectionRef = ref(null)
const eyebrowRef = ref(null)
const titleRef = ref(null)
const subRef = ref(null)
const actionsRef = ref(null)
const cardsRef = ref(null)
const portraitRef = ref(null)

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920)
const isDesktop = ref(windowWidth.value >= 768)
const gsapCtx = ref(null)

let widthTimer = null

function updateWidth() {
  windowWidth.value = window.innerWidth
  isDesktop.value = windowWidth.value >= 768
}

function openScheduleModal() {
  scheduleMode.value = true
  showModal.value = true
}

function toggleCvDropdown() {
  cvDropdownOpen.value = !cvDropdownOpen.value
}

function handleClickOutside(e) {
  if (cvDropdownOpen.value) {
    const dropdown = e.target.closest('.contact-dropdown')
    if (!dropdown) cvDropdownOpen.value = false
  }
}

function onWidthResize() {
  if (widthTimer) return
  widthTimer = window.requestAnimationFrame(() => {
    updateWidth()
    widthTimer = null
  })
}

const contactEmail = computed(() => {
  const rawEmail = messages.value?.[locale.value]?.home?.contact?.email
  return typeof rawEmail === 'string' ? rawEmail : ''
})
const contactLinkedin = computed(() => messages.value?.[locale.value]?.home?.contact?.linkedinUrl || '#')
const contactGithub = computed(() => messages.value?.[locale.value]?.home?.contact?.githubUrl || '#')
const contactPhoto = computed(() => messages.value?.[locale.value]?.home?.contact?.photo || '')
const contactCvUrlEs = computed(() => {
  const raw = messages.value?.es?.home?.contact?.cvUrl
  return typeof raw === 'string' ? raw : ''
})
const contactCvUrlEn = computed(() => {
  const raw = messages.value?.en?.home?.contact?.cvUrl
  return typeof raw === 'string' ? raw : ''
})

onMounted(() => {
  window.addEventListener('open-schedule-modal', (e) => {
    scheduleMessage.value = e.detail?.message || ''
    scheduleMode.value = true
    showModal.value = true
  })

  const section = sectionRef.value
  const eyebrow = eyebrowRef.value
  const title = titleRef.value
  const sub = subRef.value
  const actions = actionsRef.value
  const cards = cardsRef.value
  const portrait = portraitRef.value
  if (!section || !eyebrow || !title || !sub || !actions || !cards || !portrait) return

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    gsap.set([eyebrow, title, sub, actions.children, cards.children, portrait], {
      autoAlpha: 1,
      y: 0,
      x: 0,
      scale: 1
    })
    return
  }

  gsap.set([eyebrow, title, sub, actions.children, cards.children, portrait], {
    autoAlpha: 0
  })
  gsap.set(eyebrow, { y: -14, opacity: 0 })
  gsap.set(title, { y: -20, scale: 0.9, opacity: 0 })
  gsap.set(sub, { y: 16, opacity: 0 })
  gsap.set(actions.children, { y: 24, opacity: 0 })
  gsap.set(cards.children, { y: 20, opacity: 0 })
  gsap.set(portrait, { x: 40, scale: 0.95, opacity: 0 })

  gsapCtx.value = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
      invalidateOnRefresh: true
    },
    defaults: { ease: 'power4.out' }
  })
    .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0)
    .to(title, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.4)' }, '-=0.2')
    .to(sub, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.25')
    .to(actions.children, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'back.out(1.2)' }, '-=0.2')
    .to(cards.children, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.1, ease: 'power3.out' }, '-=0.15')
    .to(portrait, { autoAlpha: 1, x: 0, scale: 1, duration: 0.8, ease: 'power2.out' }, '-=0.35')

  window.addEventListener('resize', onWidthResize, { passive: true })
  document.addEventListener('click', handleClickOutside, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('open-schedule-modal', () => {})
  if (gsapCtx.value) {
    gsapCtx.value.scrollTrigger?.kill()
    gsapCtx.value.kill()
    gsapCtx.value = null
  }
  window.removeEventListener('resize', onWidthResize)
  document.removeEventListener('click', handleClickOutside)
  if (widthTimer) window.cancelAnimationFrame(widthTimer)
})
</script>

<style scoped>
.contact-scene {
  position: relative;
  height: 100dvh;
  min-height: 100dvh;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  background: linear-gradient(180deg, transparent 0%, #fff5fa 20%, #fff9fc 50%, #fff3f9 100%);
}

.contact-scene__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(12rem, 0.55fr);
  gap: clamp(0.75rem, 2vw, 1.5rem);
  align-items: center;
}

.contact-scene__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.contact-scene__circuit {
  opacity: 0.3;
  mix-blend-mode: screen;
  mask-image: linear-gradient(to bottom, black 0%, black 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 0%, black 100%);
  filter: drop-shadow(0 0 6px rgba(255, 0, 162, 0.3));
  will-change: filter;
}

.contact-scene__glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(24px);
  opacity: 0.25;
}

.contact-scene__glow--left {
  width: min(38vw, 24rem);
  height: min(38vw, 24rem);
  top: 10%;
  left: -8%;
  background: radial-gradient(circle, rgba(255, 0, 170, 0.5), transparent 70%);
}

.contact-scene__glow--right {
  width: min(28vw, 20rem);
  height: min(28vw, 20rem);
  right: -4%;
  bottom: 8%;
  background: radial-gradient(circle, rgba(122, 214, 255, 0.4), transparent 72%);
}

.contact-scene__eyebrow {
  margin: 0 0 0.3rem;
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--rose-accent);
}

.contact-scene__title {
  margin: 0;
  font-size: clamp(1.3rem, 2.8vw, 2rem);
  line-height: 1.1;
  font-weight: 300;
  color: var(--rose-text);
}

.contact-scene__sub {
  margin: 0.4rem 0 0;
  max-width: 30rem;
  color: var(--rose-text-soft);
  line-height: 1.4;
  font-size: 0.82rem;
}

.contact-scene__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.8rem;
}

.contact-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 9rem;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  text-decoration: none;
  font-size: 0.8rem;
  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease;
}

.contact-action:hover {
  transform: translateY(-2px);
}

.contact-action--primary {
  background: linear-gradient(135deg, #f7bad6, #d46b9e);
  color: #fff;
}

.contact-action--secondary {
  background: rgba(255, 255, 255, 0.85);
  color: var(--rose-accent-strong);
  border: 1px solid var(--rose-border-strong);
}

.contact-action--tertiary {
  background: transparent;
  color: var(--rose-accent-strong);
  border: 1px dashed var(--rose-border-strong);
}

.contact-action--schedule {
  background: linear-gradient(135deg, #7ad6ff, #d46b9e);
  color: #fff;
}

.contact-scene__cards {
  display: grid;
  gap: 0.35rem;
  margin-top: 0.6rem;
}

.contact-card {
  display: grid;
  gap: 0.1rem;
  padding: 0.55rem 0.9rem;
  text-decoration: none;
  border-radius: 12px;
  color: var(--rose-text);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--rose-border-strong);
  transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  font-family: inherit;
  font-size: inherit;
  text-align: inherit;
  width: 100%;
  cursor: pointer;
}

.contact-card:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(212, 107, 158, 0.12);
}

.contact-card__label {
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rose-accent);
}

.contact-card__value {
  font-size: clamp(0.78rem, 1.2vw, 0.88rem);
  font-weight: 500;
  word-break: break-all;
}

.contact-card__meta {
  color: var(--rose-text-soft);
  line-height: 1.3;
  font-size: 0.7rem;
}

.contact-scene__portrait {
  display: flex;
  justify-content: center;
}

.portrait-shell {
  width: min(100%, 14rem);
  display: grid;
  gap: 0.5rem;
}

.portrait-frame {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: 20px;
  padding: 0.5rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(255, 245, 250, 0.94));
  border: 1px solid var(--rose-border-strong);
  animation: portrait-float 4s ease-in-out 1.5s infinite alternate;
}

@keyframes portrait-float {
  from { rotate: -1.5deg; }
  to   { rotate: 1.5deg; }
}

.portrait-placeholder {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 241, 247, 0.92));
}

.portrait-placeholder--filled {
  background: none;
}

.portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
}

.portrait-placeholder__tag {
  position: relative;
  z-index: 1;
  font-size: 0.65rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--rose-accent-strong);
}

.portrait-placeholder__glow {
  display: none;
}

.portrait-caption {
  display: grid;
  gap: 0.15rem;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--rose-border-strong);
}

.portrait-caption span {
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rose-accent);
}

.portrait-caption a {
  color: var(--rose-accent-strong);
  text-decoration: none;
  line-height: 1.4;
  font-size: 0.75rem;
}

.portrait-caption a:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .contact-scene {
    padding: 1rem;
    height: auto;
    min-height: 100dvh;
  }

  .contact-scene__inner {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .contact-scene__portrait {
    order: 1;
    display: flex;
    justify-content: center;
  }

  .portrait-shell {
    width: 100%;
    max-width: 18rem;
  }

  .portrait-frame {
    padding: 0.45rem;
    border-radius: 16px;
  }

  .portrait-placeholder {
    border-radius: 12px;
  }

  .portrait-img {
    border-radius: 12px;
  }

  .portrait-caption {
    padding: 0.55rem 0.8rem;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid var(--rose-border-strong);
  }
}

.contact-dropdown {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  min-width: 9rem;
}

.contact-dropdown__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.55rem 1rem;
  border: 1px dashed var(--rose-border-strong);
  border-radius: 999px;
  background: transparent;
  color: var(--rose-accent-strong);
  font-size: 0.8rem;
  font-family: inherit;
  cursor: pointer;
  transition: transform 0.24s ease, box-shadow 0.24s ease;
}

.contact-dropdown__trigger:hover {
  transform: translateY(-2px);
}

.contact-dropdown__arrow {
  font-size: 0.6rem;
  line-height: 1;
  transition: transform 0.2s ease;
}

.contact-dropdown__menu {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  margin-bottom: 0.35rem;
  z-index: 100;
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid var(--rose-border-strong);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px var(--rose-shadow);
}

.contact-dropdown__item {
  display: block;
  padding: 0.6rem 1rem;
  color: var(--rose-accent-strong);
  text-decoration: none;
  font-size: 0.8rem;
  transition: background 0.2s ease;
}

.contact-dropdown__item:hover {
  background: rgba(212, 107, 158, 0.08);
}

.contact-dropdown__item:not(:last-child) {
  border-bottom: 1px solid var(--rose-border);
}
</style>
