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
          <a class="contact-action contact-action--primary" :href="contactEmailHref">
            {{ t('home.contactPanel.primaryCta') }}
          </a>
          <a
            class="contact-action contact-action--secondary"
            :href="contactLinkedin"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ t('home.contactPanel.secondaryCta') }}
          </a>
        </div>

        <div ref="cardsRef" class="contact-scene__cards">
          <a class="contact-card" :href="contactEmailHref">
            <span class="contact-card__label">{{ t('home.contactPanel.cards.email.label') }}</span>
            <strong class="contact-card__value">{{ contactEmail }}</strong>
            <span class="contact-card__meta">{{ t('home.contactPanel.cards.email.meta') }}</span>
          </a>

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
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CircuitBackground from '@/components/ui/CircuitBackground.vue'
import CircuitBackgroundMobile from '@/components/ui/CircuitBackgroundMobile.vue'

gsap.registerPlugin(ScrollTrigger)

const { t, locale, messages } = useI18n({ useScope: 'global' })

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
const contactEmailHref = computed(() => `mailto:${contactEmail.value}`)

onMounted(() => {
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
  gsap.set(eyebrow, { y: -18 })
  gsap.set(title, { y: -12, scale: 0.96 })
  gsap.set(sub, { y: 20 })
  gsap.set(actions.children, { y: 30 })
  gsap.set(cards.children, { y: 24 })
  gsap.set(portrait, { x: 36, scale: 0.97 })

  gsapCtx.value = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 82%',
      toggleActions: 'play none none reverse',
      invalidateOnRefresh: true
    },
    defaults: { ease: 'power3.out' }
  })
    .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.55 }, 0)
    .to(title, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6 }, '-=0.25')
    .to(sub, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.3')
    .to(actions.children, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.1 }, '-=0.25')
    .to(cards.children, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.12 }, '-=0.2')
    .to(portrait, { autoAlpha: 1, x: 0, scale: 1, duration: 0.7, ease: 'power2.out' }, '-=0.35')

  window.addEventListener('resize', onWidthResize, { passive: true })
})

onBeforeUnmount(() => {
  if (gsapCtx.value) {
    gsapCtx.value.scrollTrigger?.kill()
    gsapCtx.value.kill()
    gsapCtx.value = null
  }
  window.removeEventListener('resize', onWidthResize)
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
  padding: 2rem 1.25rem;
  overflow: hidden;
  background: linear-gradient(180deg, transparent 0%, #fff5fa 20%, #fff9fc 50%, #fff3f9 100%);
}

.contact-scene__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(14rem, 0.7fr);
  gap: clamp(1rem, 3vw, 2.5rem);
  align-items: center;
}

.contact-scene__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
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
  filter: blur(70px);
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
  margin: 0 0 0.6rem;
  font-size: 0.76rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--rose-accent);
  text-shadow: 0 0 12px rgba(212, 107, 158, 0.3);
}

.contact-scene__title {
  margin: 0;
  font-size: clamp(1.8rem, 3.8vw, 2.8rem);
  line-height: 1.08;
  font-weight: 300;
  color: var(--rose-text);
}

.contact-scene__sub {
  margin: 0.7rem 0 0;
  max-width: 32rem;
  color: var(--rose-text-soft);
  line-height: 1.6;
  font-size: 0.92rem;
}

.contact-scene__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 1.4rem;
}

.contact-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 11rem;
  padding: 0.75rem 1.15rem;
  border-radius: 999px;
  text-decoration: none;
  font-size: 0.88rem;
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
  box-shadow: 0 18px 34px rgba(212, 107, 158, 0.24);
}

.contact-action--secondary {
  background: rgba(255, 255, 255, 0.85);
  color: var(--rose-accent-strong);
  border: 1px solid var(--rose-border-strong);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.contact-scene__cards {
  display: grid;
  gap: 0.75rem;
  margin-top: 1.4rem;
}

.contact-card {
  display: grid;
  gap: 0.25rem;
  padding: 1rem 1.25rem;
  text-decoration: none;
  border-radius: 20px;
  color: var(--rose-text);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--rose-border-strong);
  box-shadow:
    0 18px 34px rgba(227, 182, 206, 0.22),
    0 0 0 1px rgba(255, 255, 255, 0.5),
    0 0 14px rgba(255, 0, 170, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease;
}

.contact-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 0, 170, 0.3);
  box-shadow:
    0 24px 40px rgba(227, 182, 206, 0.26),
    0 0 0 1px rgba(255, 255, 255, 0.6),
    0 0 24px rgba(255, 0, 170, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

.contact-card__label {
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--rose-accent);
}

.contact-card__value {
  font-size: clamp(0.9rem, 1.6vw, 1.05rem);
  font-weight: 500;
  word-break: break-all;
}

.contact-card__meta {
  color: var(--rose-text-soft);
  line-height: 1.5;
  font-size: 0.85rem;
}

.contact-scene__portrait {
  display: flex;
  justify-content: center;
}

.portrait-shell {
  width: min(100%, 16rem);
  display: grid;
  gap: 0.85rem;
}

.portrait-frame {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: 28px;
  padding: 0.85rem;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(255, 245, 250, 0.94)),
    linear-gradient(135deg, rgba(212, 107, 158, 0.18), rgba(255, 255, 255, 0.3));
  border: 1px solid var(--rose-border-strong);
  box-shadow:
    0 24px 48px rgba(214, 123, 165, 0.2),
    0 0 40px rgba(255, 0, 170, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.76);
  backdrop-filter: blur(14px);
}

.portrait-placeholder {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 22px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(247, 186, 214, 0.36) 32%, transparent 62%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 241, 247, 0.92));
}

.portrait-placeholder--filled {
  background: none;
}

.portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 22px;
}

.portrait-placeholder__tag {
  position: relative;
  z-index: 1;
  font-size: 0.76rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--rose-accent-strong);
}

.portrait-placeholder__glow {
  position: absolute;
  inset: auto 14% 8%;
  height: 26%;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.68), transparent 70%);
  filter: blur(26px);
}

.portrait-caption {
  display: grid;
  gap: 0.25rem;
  padding: 0.85rem 1rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid var(--rose-border-strong);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.portrait-caption span {
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--rose-accent);
}

.portrait-caption a {
  color: var(--rose-accent-strong);
  text-decoration: none;
  line-height: 1.5;
  font-size: 0.85rem;
}

.portrait-caption a:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .contact-scene {
    padding: 1.5rem 1rem;
    height: auto;
    min-height: 100dvh;
  }

  .contact-scene__inner {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .contact-scene__portrait {
    order: -1;
  }

  .portrait-shell {
    width: min(100%, 14rem);
  }
}
</style>
