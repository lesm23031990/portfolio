<template>
  <section
    id="contacto"
    ref="sectionRef"
    class="contact-scene"
    :class="{ 'contact-scene--visible': isVisible }"
  >
    <div class="contact-scene__bg" aria-hidden="true">
      <CircuitBackground class="contact-scene__circuit" />
      <div class="contact-scene__glow contact-scene__glow--left"></div>
      <div class="contact-scene__glow contact-scene__glow--right"></div>
    </div>

    <div class="contact-scene__inner">
      <div class="contact-scene__copy">
        <p class="contact-scene__eyebrow">{{ t('home.sections.contact.title') }}</p>
        <h3 class="contact-scene__title">{{ t('home.contactPanel.title') }}</h3>
        <p class="contact-scene__sub">{{ t('home.contactPanel.subtitle') }}</p>

        <div class="contact-scene__actions">
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

        <div class="contact-scene__cards">
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

      <div class="contact-scene__portrait">
        <div class="portrait-shell">
          <div class="portrait-frame">
            <div class="portrait-placeholder">
              <span class="portrait-placeholder__tag">PHOTO SPACE</span>
              <div class="portrait-placeholder__glow"></div>
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CircuitBackground from '@/components/ui/CircuitBackground.vue'

const { t, locale, messages } = useI18n({ useScope: 'global' })

const sectionRef = ref(null)
const sectionObserver = ref(null)
const isVisible = ref(false)

const contactEmail = computed(() => {
  const rawEmail = messages.value?.[locale.value]?.home?.contact?.email
  return typeof rawEmail === 'string' ? rawEmail : ''
})
const contactLinkedin = computed(() => messages.value?.[locale.value]?.home?.contact?.linkedinUrl || '#')
const contactGithub = computed(() => messages.value?.[locale.value]?.home?.contact?.githubUrl || '#')
const contactEmailHref = computed(() => `mailto:${contactEmail.value}`)

function emitDarkState(value) {
  document.body.classList.toggle('is-dark-mode', false)
  window.dispatchEvent(
    new CustomEvent('section-change', {
      detail: { isDark: value }
    })
  )
}

watch(isVisible, () => {
  emitDarkState(false)
})

onMounted(() => {
  sectionObserver.value = new IntersectionObserver(
    ([entry]) => {
      isVisible.value = entry.isIntersecting
    },
    { threshold: 0.18 }
  )

  if (sectionRef.value) {
    sectionObserver.value.observe(sectionRef.value)
  }
})

onBeforeUnmount(() => {
  if (sectionObserver.value) {
    sectionObserver.value.disconnect()
  }

  emitDarkState(false)
})
</script>

<style scoped>
.contact-scene {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 4rem 1.25rem;
  opacity: 0;
  transform: translate3d(0, 48px, 0);
  overflow: hidden;
  transition:
    opacity 0.75s ease,
    transform 0.75s ease;
}

.contact-scene--visible {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.contact-scene__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.9fr);
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: center;
}

.contact-scene__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.contact-scene__circuit {
  opacity: 0.2;
  mix-blend-mode: screen;
  mask-image: linear-gradient(to bottom, black 0%, black 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 0%, black 100%);
}

.contact-scene__glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(70px);
  opacity: 0.22;
}

.contact-scene__glow--left {
  width: min(42vw, 28rem);
  height: min(42vw, 28rem);
  top: 10%;
  left: -8%;
  background: radial-gradient(circle, rgba(255, 0, 170, 0.6), transparent 70%);
}

.contact-scene__glow--right {
  width: min(32vw, 24rem);
  height: min(32vw, 24rem);
  right: -4%;
  bottom: 8%;
  background: radial-gradient(circle, rgba(122, 214, 255, 0.5), transparent 72%);
}

.contact-scene__eyebrow {
  margin: 0 0 0.8rem;
  font-size: 0.76rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--rose-accent);
}

.contact-scene__title {
  margin: 0;
  font-size: clamp(2.15rem, 4.6vw, 3.3rem);
  line-height: 1.08;
  font-weight: 300;
  color: var(--rose-text);
}

.contact-scene__sub {
  margin: 1rem 0 0;
  max-width: 34rem;
  color: var(--rose-text-soft);
  line-height: 1.78;
}

.contact-scene__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.8rem;
}

.contact-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 12rem;
  padding: 0.9rem 1.25rem;
  border-radius: 999px;
  text-decoration: none;
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
  background: rgba(255, 255, 255, 0.68);
  color: var(--rose-accent-strong);
  border: 1px solid var(--rose-border);
}

.contact-scene__cards {
  display: grid;
  gap: 1rem;
  margin-top: 1.8rem;
}

.contact-card {
  display: grid;
  gap: 0.35rem;
  padding: 1.1rem 1.2rem;
  text-decoration: none;
  border-radius: 24px;
  color: var(--rose-text);
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 0, 170, 0.14);
  box-shadow:
    0 18px 34px rgba(227, 182, 206, 0.22),
    0 0 0 1px rgba(255, 255, 255, 0.36),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(14px);
  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease;
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 24px 40px rgba(227, 182, 206, 0.26),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
}

.contact-card__label {
  font-size: 0.74rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--rose-accent);
}

.contact-card__value {
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 500;
}

.contact-card__meta {
  color: var(--rose-text-soft);
  line-height: 1.55;
}

.contact-scene__portrait {
  display: flex;
  justify-content: center;
}

.portrait-shell {
  width: min(100%, 26rem);
  display: grid;
  gap: 1rem;
}

.portrait-frame {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: 32px;
  padding: 1rem;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.74), rgba(255, 245, 250, 0.88)),
    linear-gradient(135deg, rgba(212, 107, 158, 0.18), rgba(255, 255, 255, 0.3));
  border: 1px solid var(--rose-border);
  box-shadow:
    0 24px 48px rgba(214, 123, 165, 0.2),
    0 0 40px rgba(255, 0, 170, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
}

.portrait-placeholder {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 26px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(247, 186, 214, 0.36) 32%, transparent 62%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 241, 247, 0.92));
}

.portrait-placeholder__tag {
  position: relative;
  z-index: 1;
  font-size: 0.82rem;
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
  gap: 0.35rem;
  padding: 1rem 1.15rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--rose-border);
}

.portrait-caption span {
  font-size: 0.74rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--rose-accent);
}

.portrait-caption a {
  color: var(--rose-accent-strong);
  text-decoration: none;
  line-height: 1.55;
}

.portrait-caption a:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .contact-scene__inner {
    grid-template-columns: 1fr;
  }
}
</style>
