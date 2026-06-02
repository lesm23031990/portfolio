<template>
  <section id="inicio" ref="sectionRef" class="dash-section dash-section--hero">
    <div
      v-if="!prefersReducedMotion"
      ref="trailRef"
      class="dash-neon-trail"
      aria-hidden="true"
    >
      <span
        v-for="i in trailCount"
        :key="i"
        :ref="(el) => { if (el) trailDots[i] = el }"
        class="dash-neon-trail__dot"
      ></span>
    </div>

    <div class="dash-section__inner dash-section__inner--terminal">
      <div
        ref="terminalRef"
        class="dash-terminal"
        :class="{
          'dash-terminal--hovered': isTerminalHovered,
          'dash-terminal--typing': isCurrentlyTyping
        }"
        @pointerenter="isTerminalHovered = true"
        @pointerleave="isTerminalHovered = false"
        @click="handleTerminalClick"
      >
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
              class="dash-hero-profile__cursor"
              aria-hidden="true"
            ></span>
          </p>
          <span
            v-if="!isCurrentlyTyping && isTerminalHovered && hasTypedProfile"
            class="dash-terminal__replay-hint"
          >▸ click to replay</span>
        </div>
      </div>
    </div>

    <div ref="contentRef" class="dash-section__inner dash-section__inner--content">
      <div
        ref="heroCardRef"
        class="dash-hero-card dash-hero-card--3d"
        :class="{ 'dash-depth--ready': introReady }"
        @pointermove="handleTilt($event)"
        @pointerleave="resetTilt"
      >
        <div class="dash-hero-card__glow"></div>
        <p class="dash-hero-card__kicker">{{ t('home.hero.kicker') }}</p>
        <h2 class="dash-hero-card__title">{{ t('home.hero.title') }}</h2>
        <p class="dash-hero-card__lead">{{ t('home.hero.lead') }}</p>
        <div class="dash-hero-card__actions">
          <a class="dash-btn dash-btn--primary" href="#proyectos">{{ t('home.hero.ctaProjects') }}</a>
          <a class="dash-btn dash-btn--ghost" href="#contacto">{{ t('home.hero.ctaContact') }}</a>
        </div>
      </div>

      <div
        ref="metricsRef"
        class="dash-metrics"
        :class="{ 'dash-depth--ready': introReady }"
        @pointermove="handleMetricsTilt($event)"
        @pointerleave="resetMetricsTilt"
      >
        <div v-for="metric in metrics" :key="metric.key" class="dash-metric dash-metric--3d">
          <span class="dash-metric__value">{{ metric.value }}</span>
          <span class="dash-metric__label">{{ metric.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'

const { t } = useI18n({ useScope: 'global' })

const sectionRef = ref(null)
const heroCardRef = ref(null)
const metricsRef = ref(null)
const terminalRef = ref(null)
const trailRef = ref(null)
const contentRef = ref(null)

const prefersReducedMotion = ref(false)
const typedProfileText = ref('')
const introReady = ref(false)
const hasTypedProfile = ref(false)
const isVisible = ref(true)
const isTerminalHovered = ref(false)
const isCurrentlyTyping = ref(false)
const scrollY = shallowRef(0)

const trailCount = 8
const trailDots = {}

const audioContext = ref(null)
const canPlayTypingSound = ref(false)

const profileText = computed(() => t('home.hero.profile'))
const profileTextPlain = computed(() => profileText.value.replace(/<br\s*\/?>/gi, ' '))
const profileTokens = computed(() => tokenizeProfile(profileText.value))

const metrics = computed(() => [
  { key: 'experience', value: t('home.metrics.experience.value'), label: t('home.metrics.experience.label') },
  { key: 'role', value: t('home.metrics.role.value'), label: t('home.metrics.role.label') },
  { key: 'core', value: t('home.metrics.core.value'), label: t('home.metrics.core.label') }
])

let ctx = null
let tiltTween = null
let metricsTiltTween = null
let parallaxCard = null
let parallaxMetrics = null
let trailQuickTos = []
let sectionObserver = null
let typewriterGen = 0

function tokenizeProfile(html) {
  return html
    .split(/(<br\s*\/?>)/gi)
    .filter(Boolean)
    .flatMap((token) => (/^<br\s*\/?>$/i.test(token) ? [token] : token.split('')))
}

function enableTypingSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass || prefersReducedMotion.value) return
  if (!audioContext.value) {
    try {
      audioContext.value = new AudioContextClass()
    } catch {
      return
    }
  }
  if (audioContext.value.state === 'suspended') {
    audioContext.value.resume()
  }
  canPlayTypingSound.value = true
}

function playTypingClick() {
  if (!canPlayTypingSound.value || !audioContext.value) return
  try {
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
  } catch {
    // AudioContext may be closed during cleanup
  }
}

function getCharDelay(char) {
  if (/[aeiouáéíóú]/i.test(char)) return 40 + Math.random() * 30
  if (/[.,!?;:]/.test(char)) return 100 + Math.random() * 60
  if (/[A-ZÑ]/.test(char)) return 70 + Math.random() * 40
  if (/[\d]/.test(char)) return 50 + Math.random() * 40
  if (/[-\s]/.test(char)) return 30 + Math.random() * 20
  return 60 + Math.random() * 40
}

function startTypewriter() {
  const gen = ++typewriterGen

  typedProfileText.value = ''
  hasTypedProfile.value = false
  isCurrentlyTyping.value = true

  if (!canPlayTypingSound.value) enableTypingSound()

  const tokens = profileTokens.value
  let i = 0

  function typeNext() {
    if (gen !== typewriterGen) {
      isCurrentlyTyping.value = false
      return
    }

    typedProfileText.value = tokens.slice(0, i).join('')

    if (i < tokens.length) {
      const token = tokens[i]
      i++
      const isBreak = /^<br\s*\/?>$/i.test(token)

      if (isBreak) {
        setTimeout(typeNext, 300 + Math.random() * 200)
      } else if (token !== ' ') {
        playTypingClick()
        setTimeout(typeNext, getCharDelay(token))
      } else {
        setTimeout(typeNext, 30 + Math.random() * 20)
      }
    } else {
      hasTypedProfile.value = true
      isCurrentlyTyping.value = false
    }
  }

  setTimeout(typeNext, 600 + Math.random() * 400)
}

function cancelTypewriter() {
  typewriterGen++
  isCurrentlyTyping.value = false
}

function restartTypewriter() {
  cancelTypewriter()
  if (isVisible.value) startTypewriter()
}

function queueIntroAnimation() {
  if (prefersReducedMotion.value) {
    introReady.value = true
    return
  }
  gsap.delayedCall(0.05, () => {
    introReady.value = true
    gsap.fromTo(
      heroCardRef.value,
      { y: 40, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', overwrite: 'auto' }
    )
    gsap.fromTo(
      metricsRef.value,
      { y: 40, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, delay: 0.14, ease: 'power3.out', overwrite: 'auto' }
    )
  })
}

function handleOverlayFinished() {
  queueIntroAnimation()
  restartTypewriter()
}

watch(profileText, () => {
  hasTypedProfile.value = false
  restartTypewriter()
})

function handleTilt(event) {
  if (prefersReducedMotion.value || !heroCardRef.value) return
  const rect = heroCardRef.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
  const cx = gsap.utils.clamp(-1, 1, x)
  const cy = gsap.utils.clamp(-1, 1, y)

  if (tiltTween) tiltTween.kill()
  tiltTween = gsap.to(heroCardRef.value, {
    rotateX: cy * -8,
    rotateY: cx * 10,
    transformPerspective: 900,
    duration: 0.45,
    ease: 'power2.out',
    overwrite: 'auto'
  })
}

function resetTilt() {
  if (tiltTween) tiltTween.kill()
  tiltTween = gsap.to(heroCardRef.value, {
    rotateX: 0,
    rotateY: 0,
    duration: 0.65,
    ease: 'power3.out',
    overwrite: 'auto'
  })
}

function handleMetricsTilt(event) {
  if (prefersReducedMotion.value || !metricsRef.value) return
  const rect = metricsRef.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
  const cx = gsap.utils.clamp(-1, 1, x)
  const cy = gsap.utils.clamp(-1, 1, y)

  if (metricsTiltTween) metricsTiltTween.kill()
  metricsTiltTween = gsap.to(metricsRef.value, {
    rotateX: cy * -6,
    rotateY: cx * 8,
    transformPerspective: 900,
    duration: 0.45,
    ease: 'power2.out',
    overwrite: 'auto'
  })
}

function resetMetricsTilt() {
  if (metricsTiltTween) metricsTiltTween.kill()
  metricsTiltTween = gsap.to(metricsRef.value, {
    rotateX: 0,
    rotateY: 0,
    duration: 0.65,
    ease: 'power3.out',
    overwrite: 'auto'
  })
}

function handleTerminalClick() {
  if (isCurrentlyTyping.value) return
  typedProfileText.value = ''
  hasTypedProfile.value = false
  startTypewriter()
}

function initNeonTrail() {
  if (prefersReducedMotion.value || !trailRef.value) return

  const dots = Array.from({ length: trailCount }, (_, i) => trailDots[i + 1]).filter(Boolean)
  if (!dots.length) return

  gsap.set(dots, { x: -100, y: -100, opacity: 0, scale: 0 })

  trailQuickTos = dots.map((dot) => ({
    x: gsap.quickTo(dot, 'x', { duration: 0.5, ease: 'power2.out' }),
    y: gsap.quickTo(dot, 'y', { duration: 0.5, ease: 'power2.out' })
  }))

  const staggeredTimeline = gsap.timeline({ repeat: -1, yoyo: true })
  staggeredTimeline.to(dots, {
    opacity: 0.6,
    scale: 1,
    duration: 0.6,
    stagger: 0.05,
    ease: 'power2.out'
  })

  const mouse = { x: -100, y: -100 }
  let rafId = null

  function onMove(e) {
    mouse.x = e.clientX
    mouse.y = e.clientY
    if (!rafId) {
      rafId = window.requestAnimationFrame(() => {
        trailQuickTos.forEach((qt, i) => {
          const inertia = 1 + i * 0.12
          qt.x(mouse.x + (i % 2 === 0 ? -10 : 10) * inertia)
          qt.y(mouse.y + (i % 2 === 0 ? -8 : 8) * inertia + i * 4)
        })
        rafId = null
      })
    }
  }

  window.addEventListener('pointermove', onMove, { passive: true })

  ctx.add(() => {
    window.removeEventListener('pointermove', onMove)
    if (rafId) window.cancelAnimationFrame(rafId)
  })
}

function initParallax() {
  if (prefersReducedMotion.value) return

  parallaxCard = gsap.quickTo(heroCardRef.value, 'y', {
    duration: 0.3,
    ease: 'power1.out'
  })

  parallaxMetrics = gsap.quickTo(metricsRef.value, 'y', {
    duration: 0.3,
    ease: 'power1.out'
  })

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop
    scrollY.value = y
    parallaxCard(y * -0.045)
    parallaxMetrics(y * -0.03)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  ctx.add(() => window.removeEventListener('scroll', onScroll))
}

function initTiltOnHover() {
  if (prefersReducedMotion.value || !heroCardRef.value) return

  const card = heroCardRef.value

  card.addEventListener('pointerenter', () => {
    gsap.to(card, {
      '--glow-opacity': 1,
      '--glow-scale': 1,
      duration: 0.4,
      ease: 'power2.out'
    })
  })

  card.addEventListener('pointerleave', () => {
    gsap.to(card, {
      '--glow-opacity': 0,
      '--glow-scale': 0.8,
      duration: 0.6,
      ease: 'power3.out'
    })
  })
}

onMounted(() => {
  if (window.matchMedia) {
    prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  ctx = gsap.context(() => {
    initNeonTrail()
    initParallax()
    initTiltOnHover()
  }, sectionRef)

  sectionObserver = new IntersectionObserver(
    ([entry]) => {
      isVisible.value = entry.isIntersecting
      if (entry.isIntersecting && !hasTypedProfile.value && !isCurrentlyTyping.value) {
        restartTypewriter()
      }
    },
    { threshold: 0.2 }
  )

  if (sectionRef.value) {
    sectionObserver.observe(sectionRef.value)
  }

  window.addEventListener('portfolio:overlay-finished', handleOverlayFinished)
  window.addEventListener('pointerdown', enableTypingSound, { once: true, passive: true })
  window.addEventListener('keydown', enableTypingSound, { once: true })

  if (!document.querySelector('.loading-overlay')) {
    queueIntroAnimation()
    gsap.delayedCall(0.3, restartTypewriter)
  }

  setTimeout(() => {
    if (!hasTypedProfile.value && !isCurrentlyTyping.value) {
      restartTypewriter()
    }
  }, 2000)
})

onBeforeUnmount(() => {
  window.removeEventListener('portfolio:overlay-finished', handleOverlayFinished)
  window.removeEventListener('pointerdown', enableTypingSound)
  window.removeEventListener('keydown', enableTypingSound)

  cancelTypewriter()
  if (tiltTween) tiltTween.kill()
  if (metricsTiltTween) metricsTiltTween.kill()
  if (audioContext.value) audioContext.value.close()
  if (sectionObserver) sectionObserver.disconnect()
  if (ctx) ctx.revert()
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
  width: 0.12em;
  height: 1em;
  margin-left: 0.06em;
  vertical-align: -0.1em;
  background: #ff14a2;
  box-shadow:
    0 0 6px #ff14a2,
    0 0 14px rgba(255, 20, 162, 0.7),
    0 0 28px rgba(255, 20, 162, 0.4);
  animation: profile-cursor-blink 1s ease-in-out infinite;
  border-radius: 1px;
}

.dash-terminal--typing .dash-hero-profile__cursor {
  animation-duration: 0.4s;
  animation-timing-function: steps(2, start);
}

.dash-terminal--hovered .dash-hero-profile__cursor {
  animation-duration: 0.5s;
  box-shadow:
    0 0 8px #ff14a2,
    0 0 22px rgba(255, 20, 162, 0.9),
    0 0 44px rgba(255, 20, 162, 0.5);
}

.dash-terminal--hovered {
  border-color: rgba(255, 0, 162, 0.4);
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(255, 0, 162, 0.2),
    0 0 60px rgba(255, 0, 162, 0.1);
  cursor: text;
}

.dash-terminal__replay-hint {
  display: inline-block;
  margin-top: 0.75rem;
  font-size: 0.72rem;
  font-family: 'Fira Code', 'Courier New', monospace;
  color: rgba(255, 255, 255, 0.25);
  letter-spacing: 0.05em;
  animation: hint-pulse 2s ease-in-out infinite;
  user-select: none;
}

@keyframes profile-cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.15; }
}

@keyframes hint-pulse {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.6; }
}

.dash-hero-card {
  position: relative;
  padding: 2rem 2rem 2.25rem;
  border-radius: 28px;
  background: transparent;
  border: 1px solid var(--rose-border);
  box-shadow:
    var(--float-shadow-x, 0px) var(--float-shadow-y, 30px) var(--float-shadow-blur, 74px) rgba(214, 123, 165, 0.32),
    var(--float-shadow-counter-x, 0px) 14px 34px rgba(111, 47, 84, 0.12),
    0 4px 14px rgba(255, 255, 255, 0.9),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  will-change: transform, box-shadow;
  transform-style: preserve-3d;
  overflow: hidden;
}

.dash-hero-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 245, 250, 0.88));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 0;
  pointer-events: none;
}

.dash-hero-card__glow {
  position: absolute;
  inset: -50%;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    circle at 50% 0%,
    rgba(255, 20, 162, 0.12),
    transparent 60%
  );
  opacity: var(--glow-opacity, 0);
  scale: var(--glow-scale, 0.8);
  transition: opacity 0.5s ease, scale 0.5s ease;
  border-radius: inherit;
}

.dash-hero-card > *:not(.dash-hero-card__glow):not(::before) {
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
    transform 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
  position: relative;
  z-index: 1;
  transform-style: preserve-3d;
}

.dash-btn--primary {
  background: linear-gradient(135deg, #f7bad6, #d46b9e);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: 0 18px 34px rgba(212, 107, 158, 0.24);
}

.dash-btn--primary:hover {
  transform: translateY(-2px) translateZ(4px);
  box-shadow:
    0 22px 40px rgba(212, 107, 158, 0.35),
    0 0 20px rgba(255, 20, 162, 0.15);
}

.dash-btn--ghost {
  background: rgba(255, 255, 255, 0.6);
  color: var(--rose-accent-strong);
  border: 1px solid var(--rose-border);
}

.dash-btn--ghost:hover {
  border-color: var(--rose-accent);
  color: var(--rose-accent-strong);
  transform: translateY(-2px) translateZ(4px);
  box-shadow: 0 8px 20px rgba(212, 107, 158, 0.15);
}

.dash-metrics {
  display: grid;
  gap: 1rem;
  will-change: transform;
  transform-style: preserve-3d;
}

.dash-depth--ready {
  opacity: 1;
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
    var(--float-shadow-x, 0px) var(--float-shadow-y, 24px) var(--float-shadow-blur, 54px) rgba(227, 182, 206, 0.3),
    var(--float-shadow-counter-x, 0px) 10px 26px rgba(111, 47, 84, 0.1),
    0 2px 10px rgba(255, 255, 255, 0.82),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
  will-change: transform, box-shadow;
  transform-style: preserve-3d;
  overflow: hidden;
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

.dash-metric:hover {
  transform: translateY(-3px) translateZ(6px);
  box-shadow:
    var(--float-shadow-x, 0px) var(--float-shadow-y, 30px) var(--float-shadow-blur, 60px) rgba(227, 182, 206, 0.4),
    var(--float-shadow-counter-x, 0px) 12px 30px rgba(111, 47, 84, 0.15),
    0 2px 10px rgba(255, 255, 255, 0.82),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
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

.dash-neon-trail {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  overflow: hidden;
}

.dash-neon-trail__dot {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff14a2;
  box-shadow:
    0 0 8px #ff14a2,
    0 0 18px rgba(255, 20, 162, 0.6),
    0 0 30px rgba(255, 20, 162, 0.3);
  will-change: transform, opacity;
  margin-top: -3px;
  margin-left: -3px;
}

@media (prefers-reduced-motion: reduce) {
  .dash-hero-card,
  .dash-metrics {
    animation: none;
    transition: none;
  }

  .dash-neon-trail {
    display: none;
  }
}
</style>
