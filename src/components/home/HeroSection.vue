<template>
  <section
    id="inicio"
    ref="sectionRef"
    class="dash-section dash-section--hero"
    :class="{ 'dash-section--visible': isVisible }"
  >
    <div class="dash-section__inner dash-section__inner--terminal">
      <div class="dash-terminal">
        <div class="dash-terminal__header">
          <div class="dash-terminal__dots">
            <span class="dot dot--red"></span>
            <span class="dot dot--yellow"></span>
            <span class="dot dot--green"></span>
          </div>
          <div class="dash-terminal__title">profile.js - vsc</div>
        </div>

        <div class="dash-terminal__body">
          <p class="dash-hero-profile" :aria-label="profileTextPlain" aria-live="polite">
            <span class="dash-code-prefix">&gt;&gt;&gt; </span>
            <span v-html="typedProfileText"></span>
            <span
              v-if="!prefersReducedMotion"
              class="dash-hero-profile__cursor"
              aria-hidden="true"
            ></span>
          </p>
        </div>
      </div>
    </div>

    <div class="dash-section__inner dash-section__inner--content">
      <div
        class="dash-hero-card"
        :class="{ 'dash-depth--ready': introReady }"
        :style="heroCardStyle"
        @pointermove="handleTilt('hero', $event)"
        @pointerleave="resetTilt('hero')"
      >
        <p class="dash-hero-card__kicker">{{ t('home.hero.kicker') }}</p>
        <h2 class="dash-hero-card__title">{{ t('home.hero.title') }}</h2>
        <p class="dash-hero-card__lead">{{ t('home.hero.lead') }}</p>

        <div class="dash-hero-card__actions">
          <a class="dash-btn dash-btn--primary" href="#proyectos">{{ t('home.hero.ctaProjects') }}</a>
          <a class="dash-btn dash-btn--ghost" href="#contacto">{{ t('home.hero.ctaContact') }}</a>
        </div>
      </div>

      <div
        class="dash-metrics"
        :class="{ 'dash-depth--ready': introReady }"
        :style="metricsStyle"
        @pointermove="handleTilt('metrics', $event)"
        @pointerleave="resetTilt('metrics')"
      >
        <div v-for="metric in metrics" :key="metric.key" class="dash-metric">
          <span class="dash-metric__value">{{ metric.value }}</span>
          <span class="dash-metric__label">{{ metric.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { t } = useI18n({ useScope: 'global' })

const sectionRef = ref(null)
const sectionObserver = ref(null)
const scrollY = ref(0)
const scrollRafId = ref(null)
const prefersReducedMotion = ref(false)
const typedProfileText = ref('')
const typewriterIndex = ref(0)
const typewriterTimer = ref(null)
const typewriterFrameId = ref(null)
const typewriterReady = ref(false)
const introReady = ref(false)
const hasTypedProfile = ref(false)
const audioContext = ref(null)
const canPlayTypingSound = ref(false)
const isVisible = ref(true)
const tilt = reactive({
  hero: { x: 0, y: 0 },
  metrics: { x: 0, y: 0 }
})

const profileText = computed(() => t('home.hero.profile'))
const profileTextPlain = computed(() => profileText.value.replace(/<br\s*\/?>/gi, ' '))
const profileTokens = computed(() => tokenizeProfile(profileText.value))

const metrics = computed(() => [
  {
    key: 'experience',
    value: t('home.metrics.experience.value'),
    label: t('home.metrics.experience.label')
  },
  {
    key: 'role',
    value: t('home.metrics.role.value'),
    label: t('home.metrics.role.label')
  },
  {
    key: 'core',
    value: t('home.metrics.core.value'),
    label: t('home.metrics.core.label')
  }
])

const heroCardStyle = computed(() => {
  if (prefersReducedMotion.value) return {}

  const heroTilt = tilt.hero
  const y = scrollY.value
  const scrollDrift = Math.sin(y * 0.006) * 8
  const hasTilt = Math.abs(heroTilt.x) > 0.01 || Math.abs(heroTilt.y) > 0.01

  return {
    '--float-shadow-x': `${heroTilt.x * -22}px`,
    '--float-shadow-counter-x': `${heroTilt.x * 10}px`,
    '--float-shadow-y': `${28 + heroTilt.y * 18 + scrollDrift}px`,
    '--float-shadow-blur': `${72 + Math.abs(heroTilt.x) * 18}px`,
    transform: hasTilt
      ? `translateY(${y * -0.045}px) rotateX(${heroTilt.y * -8}deg) rotateY(${heroTilt.x * 10}deg)`
      : `translateY(${y * -0.045}px)`
  }
})

const metricsStyle = computed(() => {
  if (prefersReducedMotion.value) return {}

  const metricsTilt = tilt.metrics
  const y = scrollY.value
  const scrollDrift = Math.cos(y * 0.006) * 7
  const hasTilt = Math.abs(metricsTilt.x) > 0.01 || Math.abs(metricsTilt.y) > 0.01

  return {
    '--float-shadow-x': `${metricsTilt.x * -18}px`,
    '--float-shadow-counter-x': `${metricsTilt.x * 8}px`,
    '--float-shadow-y': `${22 + metricsTilt.y * 14 + scrollDrift}px`,
    '--float-shadow-blur': `${52 + Math.abs(metricsTilt.x) * 14}px`,
    transform: hasTilt
      ? `translateY(${y * -0.03}px) rotateX(${metricsTilt.y * -6}deg) rotateY(${metricsTilt.x * 8}deg)`
      : `translateY(${y * -0.03}px)`
  }
})

function tokenizeProfile(html) {
  return html
    .split(/(<br\s*\/?>)/gi)
    .filter(Boolean)
    .flatMap((token) => (/^<br\s*\/?>$/i.test(token) ? [token] : token.split('')))
}

function queueIntroAnimation() {
  if (prefersReducedMotion.value) {
    introReady.value = true
    return
  }

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      introReady.value = true
    })
  })
}

function enableTypingSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass || prefersReducedMotion.value) return

  audioContext.value = audioContext.value || new AudioContextClass()
  canPlayTypingSound.value = true
}

function playTypingClick() {
  if (!canPlayTypingSound.value || !audioContext.value) return

  const now = audioContext.value.currentTime
  const oscillator = audioContext.value.createOscillator()
  const gain = audioContext.value.createGain()

  oscillator.type = 'square'
  oscillator.frequency.setValueAtTime(760 + Math.random() * 120, now)
  gain.gain.setValueAtTime(0.018, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035)
  oscillator.connect(gain)
  gain.connect(audioContext.value.destination)
  oscillator.start(now)
  oscillator.stop(now + 0.035)
}

function tickTypewriter() {
  if (typewriterIndex.value >= profileTokens.value.length) {
    typedProfileText.value = profileTokens.value.join('')
    hasTypedProfile.value = true
    typewriterTimer.value = null
    return
  }

  typewriterIndex.value += 1
  typedProfileText.value = profileTokens.value.slice(0, typewriterIndex.value).join('')
  playTypingClick()

  const nextToken = profileTokens.value[typewriterIndex.value]
  const nextDelay = nextToken === ' ' ? 22 : 42
  typewriterTimer.value = window.setTimeout(tickTypewriter, nextDelay)
}

function restartTypewriter() {
  if (typewriterTimer.value) {
    window.clearTimeout(typewriterTimer.value)
  }

  typewriterTimer.value = null
  typewriterIndex.value = 0
  hasTypedProfile.value = false
  typedProfileText.value = prefersReducedMotion.value ? profileTokens.value.join('') : ''

  if (prefersReducedMotion.value) {
    hasTypedProfile.value = true
    return
  }

  if (isVisible.value && typewriterReady.value) {
    typewriterTimer.value = window.setTimeout(tickTypewriter, 120)
  }
}

function queueTypewriterStart(forceRestart = false) {
  if (typewriterFrameId.value) {
    window.cancelAnimationFrame(typewriterFrameId.value)
  }

  if (!isVisible.value || !typewriterReady.value) return

  if (prefersReducedMotion.value) {
    if (forceRestart || !hasTypedProfile.value) {
      restartTypewriter()
    }
    return
  }

  if (!forceRestart && (typewriterTimer.value || hasTypedProfile.value)) return

  typewriterFrameId.value = window.requestAnimationFrame(() => {
    typewriterFrameId.value = window.requestAnimationFrame(() => {
      restartTypewriter()
      typewriterFrameId.value = null
    })
  })
}

function handleOverlayFinished() {
  typewriterReady.value = true
  queueIntroAnimation()
  queueTypewriterStart(true)
}

function handleTilt(target, event) {
  if (prefersReducedMotion.value || !tilt[target]) return

  const rect = event.currentTarget.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2

  tilt[target] = {
    x: Math.max(-1, Math.min(1, x)),
    y: Math.max(-1, Math.min(1, y))
  }
}

function resetTilt(target) {
  if (!tilt[target]) return
  tilt[target] = { x: 0, y: 0 }
}

function onScroll() {
  if (scrollRafId.value) return

  scrollRafId.value = window.requestAnimationFrame(() => {
    scrollY.value = window.scrollY || document.documentElement.scrollTop
    scrollRafId.value = null
  })
}

watch(profileText, () => {
  if (!typewriterReady.value) {
    typedProfileText.value = ''
    typewriterIndex.value = 0
    hasTypedProfile.value = false
    return
  }

  queueTypewriterStart(true)
})

watch(isVisible, (visibleNow) => {
  if (visibleNow) {
    queueTypewriterStart()
  }
})

onMounted(() => {
  if (window.matchMedia) {
    prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  sectionObserver.value = new IntersectionObserver(
    ([entry]) => {
      isVisible.value = entry.isIntersecting
    },
    { threshold: 0.2 }
  )

  if (sectionRef.value) {
    sectionObserver.value.observe(sectionRef.value)

    gsap.to(sectionRef.value.querySelectorAll('.dash-section__inner'), {
      y: 100,
      opacity: 0,
      stagger: 0.1,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })
  }

  window.addEventListener('portfolio:overlay-finished', handleOverlayFinished)
  window.addEventListener('pointerdown', enableTypingSound, { once: true, passive: true })
  window.addEventListener('keydown', enableTypingSound, { once: true })
  window.addEventListener('scroll', onScroll, { passive: true })

  onScroll()

  if (!document.querySelector('.loading-overlay')) {
    typewriterReady.value = true
    queueIntroAnimation()
    queueTypewriterStart(true)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('portfolio:overlay-finished', handleOverlayFinished)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('pointerdown', enableTypingSound)
  window.removeEventListener('keydown', enableTypingSound)

  if (scrollRafId.value) {
    window.cancelAnimationFrame(scrollRafId.value)
  }

  if (typewriterTimer.value) {
    window.clearTimeout(typewriterTimer.value)
  }

  if (typewriterFrameId.value) {
    window.cancelAnimationFrame(typewriterFrameId.value)
  }

  if (audioContext.value) {
    audioContext.value.close()
  }

  if (sectionObserver.value) {
    sectionObserver.value.disconnect()
  }
})
</script>

<style scoped src="./home-shared.css"></style>

<style scoped>
.dash-section {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  scroll-margin-top: 8rem;
  padding: 4.5rem 1.25rem;
  opacity: 1;
  transform: none;
  overflow: hidden;
}

.dash-section--hero {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding-top: max(4.5rem, calc(var(--header-height, 88px) + 1rem));
  background: transparent;
}

.dash-section__inner {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.dash-section__inner--content {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 2.5rem;
  align-items: end;
  perspective: 900px;
}

@media (min-width: 900px) {
  .dash-section__inner--content {
    grid-template-columns: 1.2fr 0.8fr;
    align-items: end;
  }
}

.dash-terminal {
  width: min(95vw, 800px);
  margin: 0 auto 2rem;
}

.dash-hero-profile {
  margin: 0;
  text-align: left;
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  color: #fff;
  min-height: 2em;
}

.dash-hero-profile__cursor {
  display: inline-block;
  width: 0.08em;
  height: 0.9em;
  margin-left: 0.08em;
  vertical-align: -0.08em;
  background: #d946ef;
  box-shadow: 0 0 18px rgba(217, 70, 239, 0.72);
  animation: profile-cursor 0.78s steps(2, start) infinite;
}

@keyframes profile-cursor {
  50% {
    opacity: 0;
  }
}

@keyframes card-depth-in {
  0% {
    opacity: 0;
    transform: translate3d(0, 34px, -80px) rotateX(7deg) scale(0.96);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotateX(0) scale(1);
  }
}

.dash-hero-card {
  opacity: 0;
  position: relative;
  padding: 2rem 2rem 2.25rem;
  border-radius: 28px;
  background: transparent;
  border: 1px solid var(--rose-border);
  box-shadow:
    var(--float-shadow-x, 0) var(--float-shadow-y, 30px) var(--float-shadow-blur, 74px) rgba(214, 123, 165, 0.32),
    var(--float-shadow-counter-x, 0) 14px 34px rgba(111, 47, 84, 0.12),
    0 4px 14px rgba(255, 255, 255, 0.9),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  transition:
    box-shadow 0.22s ease,
    transform 0.18s ease;
}

.dash-hero-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 245, 250, 0.86));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 0;
  pointer-events: none;
}

.dash-hero-card > * {
  position: relative;
  z-index: 1;
}

.dash-hero-card__kicker {
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rose-accent);
  margin-bottom: 0.75rem;
}

.dash-hero-card__title {
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 300;
  line-height: 1.15;
  margin-bottom: 1rem;
}

.dash-hero-card__lead {
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--rose-text-soft);
  max-width: 36rem;
  margin-bottom: 1.75rem;
}

.dash-hero-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.dash-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  font-weight: 300;
  font-size: 0.95rem;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.dash-btn--primary {
  background: linear-gradient(135deg, #f7bad6, #d46b9e);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: 0 18px 34px rgba(212, 107, 158, 0.24);
}

.dash-btn--primary:hover {
  transform: translateY(-2px);
}

.dash-btn--ghost {
  background: rgba(255, 255, 255, 0.6);
  color: var(--rose-accent-strong);
  border: 1px solid var(--rose-border);
}

.dash-btn--ghost:hover {
  border-color: var(--rose-accent);
  color: var(--rose-accent-strong);
}

.dash-metrics {
  opacity: 0;
  display: grid;
  gap: 1rem;
  transition: transform 0.18s ease;
}

.dash-depth--ready {
  opacity: 1;
  animation: card-depth-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

.dash-metrics.dash-depth--ready {
  animation-delay: 0.14s;
}

@media (min-width: 900px) {
  .dash-metrics {
    margin-bottom: 0.5rem;
  }
}

.dash-metric {
  position: relative;
  padding: 1.1rem 1.25rem;
  border-radius: 22px;
  background: transparent;
  border: 1px solid var(--rose-border);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  box-shadow:
    var(--float-shadow-x, 0) var(--float-shadow-y, 24px) var(--float-shadow-blur, 54px) rgba(227, 182, 206, 0.3),
    var(--float-shadow-counter-x, 0) 10px 26px rgba(111, 47, 84, 0.1),
    0 2px 10px rgba(255, 255, 255, 0.82),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  transition:
    box-shadow 0.22s ease,
    transform 0.22s ease;
}

.dash-metric::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  z-index: 0;
  pointer-events: none;
}

.dash-metric > * {
  position: relative;
  z-index: 1;
}

.dash-metric__value {
  font-size: 1.35rem;
  font-weight: 300;
  color: var(--rose-accent-strong);
}

.dash-metric__label {
  font-size: 0.8rem;
  color: var(--rose-text-soft);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

@media (prefers-reduced-motion: reduce) {
  .dash-hero-card,
  .dash-metrics {
    animation: none;
    transition: none;
  }
}
</style>
