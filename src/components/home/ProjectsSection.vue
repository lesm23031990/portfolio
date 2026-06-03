<template>
  <section id="proyectos" ref="sectionRef" class="projects-stage">
    <div ref="sectionInnerRef" class="projects-stage__inner">
      <div ref="terminalSlotRef" class="projects-stage__terminal-slot">
        <header ref="terminalRef" class="dash-terminal">
          <div class="dash-terminal__header">
            <div class="dash-terminal__dots">
              <span class="dot dot--red"></span>
              <span class="dot dot--yellow"></span>
              <span class="dot dot--green"></span>
            </div>
            <div class="dash-terminal__title">projects.sh - bash</div>
          </div>
          <div class="dash-terminal__body">
            <div class="dash-panel-head">
              <h3 class="dash-panel-head__title">
                <span class="dash-code-prefix">~ </span>
                <span>{{ typedProjectsTitle }}</span>
                <span v-if="!prefersReducedMotion" class="dash-panel-head__cursor" aria-hidden="true"></span>
              </h3>
              <p class="dash-panel-head__sub">{{ t('home.sections.projects.subtitle') }}</p>
            </div>
          </div>
        </header>
      </div>

      <div ref="viewportWrapperRef" class="projects-stage__viewport-wrapper">
        <div ref="viewportRef" class="projects-stage__viewport">
          <div ref="frameRef" class="projects-stage__frame" aria-hidden="true"></div>
          <div ref="trackRef" class="projects-stage__track">
            <div ref="projectsPaneRef" class="projects-stage__pane projects-stage__pane--projects">
              <div ref="gridRef" class="projects-grid">
                <a
                  v-for="(project, index) in projectItems"
                  :key="project.key"
                  :ref="(el) => setCardRef(el, index)"
                  class="project-card-link"
                  :href="project.repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="project.cta"
                >
                  <article :class="['project-card', index % 2 === 0 ? 'project-card--up' : 'project-card--down']">
                    <span class="project-card__id">{{ project.id }}</span>
                    <div class="project-card__visual" :style="project.previewStyle">
                      <div class="project-card__screen">
                        <div class="project-card__topbar"></div>
                        <div class="project-card__screen-grid">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                      <div class="project-card__overlay">{{ project.previewTag }}</div>
                    </div>
                    <div class="project-card__body">
                      <span class="project-card__line"></span>
                      <p class="project-card__stack">{{ project.stack }}</p>
                      <h4 class="project-card__title">{{ project.title }}</h4>
                      <p class="project-card__summary">{{ project.summary }}</p>
                    </div>
                  </article>
                </a>
              </div>
            </div>

            <div ref="portalRef" class="projects-stage__portal">
              <div class="portal-grid"></div>
              <div class="portal-light"></div>
            </div>

            <div ref="stackPaneRef" class="projects-stage__pane projects-stage__pane--stack">
              <StackSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from 'vue-i18n'

import StackSection from '@/components/home/StackSection.vue'

gsap.registerPlugin(ScrollTrigger)

const { t, locale, messages } = useI18n({ useScope: 'global' })

const sectionRef = ref(null)
const sectionInnerRef = ref(null)
const terminalSlotRef = ref(null)
const terminalRef = ref(null)
const viewportWrapperRef = ref(null)
const viewportRef = ref(null)
const frameRef = ref(null)
const trackRef = ref(null)
const projectsPaneRef = ref(null)
const stackPaneRef = ref(null)
const portalRef = ref(null)
const gridRef = ref(null)
const cardRefs = ref([])
const typedProjectsTitle = ref('')
const prefersReducedMotion = ref(false)
const isVisible = ref(false)
const hasTypedTitle = ref(false)
const titleDelayId = ref(null)
const titleIntervalId = ref(null)
const gsapContext = ref(null)
const resizeFrameId = ref(null)
let entryObserver = null

const projectThemes = {
  migration: { accent: '#ff33d4', accentSoft: '#7ad6ff', start: '#33105f', end: '#0b122a' },
  admin: { accent: '#7ad6ff', accentSoft: '#9effc9', start: '#09213a', end: '#081117' },
  portfolio: { accent: '#ff88f1', accentSoft: '#ffd166', start: '#2d0d2f', end: '#130f1f' },
  automation: { accent: '#9effc9', accentSoft: '#ff8df6', start: '#0a2b22', end: '#07141a' }
}

const projectsTitle = computed(() => t('home.sections.projects.title'))
const projectItems = computed(() => {
  const localizedItems = messages.value?.[locale.value]?.home?.projectShowcase?.items || {}
  return Object.entries(projectThemes).map(([key, theme], index) => {
    const item = localizedItems[key] || {}
    return {
      key,
      id: `${index + 1}`.padStart(2, '0'),
      title: item.title || '',
      stack: item.stack || '',
      summary: item.summary || '',
      previewTag: item.previewTag || '',
      repo: item.repo || '#',
      cta: item.cta || '',
      previewStyle: {
        '--preview-start': theme.start,
        '--preview-end': theme.end,
        '--preview-accent': theme.accent,
        '--preview-accent-soft': theme.accentSoft
      }
    }
  })
})

function emitDarkState(value) {
  document.body.classList.toggle('is-dark-mode', value)
  window.dispatchEvent(new CustomEvent('section-change', { detail: { isDark: value } }))
}

function clearTitleTimers() {
  if (titleDelayId.value) window.clearTimeout(titleDelayId.value)
  if (titleIntervalId.value) window.clearInterval(titleIntervalId.value)
  titleDelayId.value = null
  titleIntervalId.value = null
}

function typeTitle(forceRestart = false, bypassVisibility = false) {
  if (!bypassVisibility && !isVisible.value) return
  if (!forceRestart && hasTypedTitle.value) return

  clearTitleTimers()
  typedProjectsTitle.value = ''

  if (prefersReducedMotion.value) {
    typedProjectsTitle.value = projectsTitle.value
    hasTypedTitle.value = true
    return
  }

  hasTypedTitle.value = false
  let index = 0

  titleDelayId.value = window.setTimeout(() => {
    titleIntervalId.value = window.setInterval(() => {
      typedProjectsTitle.value += projectsTitle.value[index]
      index += 1
      if (index >= projectsTitle.value.length) {
        clearTitleTimers()
        hasTypedTitle.value = true
      }
    }, 60)
  }, 900)
}

function setCardRef(element, index) {
  if (element) cardRefs.value[index] = element
}

function getHeaderOffset() {
  const stickyHeader = document.querySelector('header.sticky')
  return Math.ceil(stickyHeader?.getBoundingClientRect().height || 88)
}

function getPaneGapPx() {
  return Math.round(Math.min(Math.max(window.innerWidth * 0.85, 300), 1800))
}

function getBaseGridGapPx() {
  return Math.round(Math.min(Math.max(window.innerWidth * 0.018, 16), 28))
}

function getExpandedGridGapPx() {
  return Math.round(getBaseGridGapPx() * 1.4)
}

function handleDepthPointerMove(event) {
  if (prefersReducedMotion.value || !sectionRef.value) return

  const rect = sectionRef.value.getBoundingClientRect()
  const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
  const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2

  gsap.to(sectionRef.value, {
    duration: 1.05,
    ease: 'expo.out',
    overwrite: 'auto',
    '--projects-parallax-x': `${Math.round(offsetX * 18)}px`,
    '--projects-parallax-y': `${Math.round(offsetY * 14)}px`,
    '--projects-parallax-x-soft': `${Math.round(offsetX * -10)}px`,
    '--projects-parallax-y-soft': `${Math.round(offsetY * -8)}px`
  })
}

function resetDepthPointer() {
  if (!sectionRef.value) return

  gsap.to(sectionRef.value, {
    duration: 1.2,
    ease: 'expo.out',
    overwrite: 'auto',
    '--projects-parallax-x': '0px',
    '--projects-parallax-y': '0px',
    '--projects-parallax-x-soft': '0px',
    '--projects-parallax-y-soft': '0px'
  })
}

function scheduleRefresh() {
  if (resizeFrameId.value) window.cancelAnimationFrame(resizeFrameId.value)
  resizeFrameId.value = window.requestAnimationFrame(() => {
    resizeFrameId.value = null
    if (sectionRef.value) {
      sectionRef.value.style.setProperty('--projects-header-offset', `${getHeaderOffset()}px`)
    }
    ScrollTrigger.refresh()
  })
}

watch(isVisible, (visibleNow) => {
  emitDarkState(visibleNow)
  if (visibleNow) typeTitle()
})

watch(projectsTitle, () => {
  hasTypedTitle.value = false
  if (isVisible.value) {
    typeTitle(true)
    return
  }
  typedProjectsTitle.value = ''
})

onMounted(async () => {
  if (window.matchMedia) {
    prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  await nextTick()

  const section = sectionRef.value
  const sectionInner = sectionInnerRef.value
  const terminalSlot = terminalSlotRef.value
  const terminal = terminalRef.value
  const viewportWrapper = viewportWrapperRef.value
  const viewport = viewportRef.value
  const frame = frameRef.value
  const track = trackRef.value
  const projectsPane = projectsPaneRef.value
  const stackPane = stackPaneRef.value
  const portal = portalRef.value
  const grid = gridRef.value
  const cards = cardRefs.value.filter(Boolean)

  if (!section || !sectionInner || !terminalSlot || !terminal || !viewportWrapper || !viewport || !frame || !track || !projectsPane || !stackPane || !portal || !grid || !cards.length) {
    return
  }

  if (gsapContext.value) {
    gsapContext.value.revert()
    gsapContext.value = null
  }

  ScrollTrigger.getAll().forEach((trigger) => {
    const ownsTrigger = trigger.vars.trigger instanceof Element && section.contains(trigger.vars.trigger)
    const ownsPin = trigger.pin instanceof Element && section.contains(trigger.pin)
    if (trigger.vars.trigger === section || trigger.pin === section || ownsTrigger || ownsPin) trigger.kill()
  })

  const updateLayoutMetrics = () => {
    const sectionWidth = Math.round(section.getBoundingClientRect().width || window.innerWidth)
    section.style.setProperty('--projects-header-offset', `${getHeaderOffset()}px`)
    section.style.setProperty('--projects-pane-gap', `${getPaneGapPx()}px`)
    section.style.setProperty('--projects-inner-side-padding', '1.5rem')
    section.style.setProperty('--viewport-width', `${sectionWidth}px`)
  }

  const getViewportHeight = (ratio) => {
    const wrapperHeight = viewportWrapper.clientHeight || window.innerHeight
    return `${Math.round(Math.min(window.innerHeight * ratio, wrapperHeight))}px`
  }

  const getTrackShift = () => -(Math.round(section.getBoundingClientRect().width || viewport.clientWidth) + getPaneGapPx())

  const getCardFitScale = (ratio, widthCoverage = 0.84, heightCoverage = 0.86) => {
    const sampleCard = cards[0]
    const baseCardWidth = sampleCard?.offsetWidth || 1
    const baseCardHeight = sampleCard?.offsetHeight || 1
    const availableWidth = Math.max(projectsPane.clientWidth * widthCoverage, 1)
    const availableHeight = Math.max(Math.min(window.innerHeight * ratio, viewportWrapper.clientHeight) * heightCoverage, 1)
    return Math.min(availableWidth / baseCardWidth, availableHeight / baseCardHeight)
  }

  updateLayoutMetrics()
  
  // Entry reveal animation
  gsap.fromTo(sectionInner,
    { autoAlpha: 0.12 },
    {
      autoAlpha: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'top top',
        scrub: true
      }
    }
  )

  gsap.set(sectionInner, { autoAlpha: 0.12, y: 132 })
  gsap.set(terminalSlot, { height: terminalSlot.offsetHeight, autoAlpha: 1 })
  gsap.set(viewport, { width: '92%', height: getViewportHeight(0.5), borderRadius: '34px' })
  gsap.set(frame, { '--frame-progress': 0, opacity: 1 })
  gsap.set(track, { x: 0 })
  gsap.set(grid, { scale: 0.45, yPercent: 12, gap: `${getBaseGridGapPx()}px`, transformOrigin: 'center center' })
  gsap.set(stackPane, { autoAlpha: 0.12, xPercent: 12, scale: 0.96, transformOrigin: 'center center' })
  gsap.set(terminal, { autoAlpha: 1, y: 0 })

  gsapContext.value = gsap.context(() => {
    gsap.timeline({
      defaults: { ease: 'expo.inOut' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=5600',
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefreshInit: updateLayoutMetrics,
        onToggle: (self) => {
          isVisible.value = self.isActive
        }
      }
    })
      .to(sectionInner, { autoAlpha: 1, y: 0, duration: 0.72, ease: 'expo.out' })
      .fromTo(viewport, { yPercent: 34 }, { yPercent: 0, width: '100%', height: () => getViewportHeight(0.78), duration: 1.18 }, 0.02)
      .to(grid, { scale: () => getCardFitScale(0.78, 0.84, 0.76), yPercent: -4, duration: 1.18 }, 0.02)
      .to(frame, { '--frame-progress': 1, duration: 0.8, ease: 'none' }, 1.06)
      .to(terminal, { autoAlpha: 0, y: -26, duration: 0.3 }, 1.3)
      .to(terminalSlot, { height: 0, autoAlpha: 0, duration: 0.48 }, 1.26)
      .to(viewport, { width: '100%', height: '100%', borderRadius: 0, duration: 1.02 }, 1.84)
      .to(section, { 
        '--projects-inner-top-padding': '0px',
        '--projects-inner-side-padding': '0px',
        duration: 1.02 
      }, 1.84)
      .to(grid, { scale: () => getCardFitScale(1, 0.8, 0.72), yPercent: -6, duration: 1.02 }, 1.84)
      .to(frame, { opacity: 0, duration: 0.34 }, 2.04)
      .to(grid, { scale: () => getCardFitScale(1, 0.88, 0.72), gap: `${getExpandedGridGapPx()}px`, duration: 0.48, ease: 'expo.out' }, 2.18)
      .to(track, { x: () => getTrackShift(), duration: 1.8, ease: 'none' }, 2.64)
      .to(portal.querySelector('.portal-grid'), { opacity: 0.6, y: -100, duration: 0.9, ease: 'power2.inOut' }, 2.64)
      .to(portal.querySelector('.portal-light'), { opacity: 1, scaleY: 1.5, duration: 0.9, ease: 'power2.inOut' }, 2.64)
      .to(portal.querySelector('.portal-grid'), { opacity: 0, y: -200, duration: 0.9, ease: 'power2.inOut' }, 3.54)
      .to(portal.querySelector('.portal-light'), { opacity: 0, scaleY: 0, duration: 0.9, ease: 'power2.inOut' }, 3.54)
      .to(stackPane, { autoAlpha: 1, xPercent: 0, scale: 1, duration: 0.94, ease: 'expo.out' }, 3.5)
  }, section)

  // IntersectionObserver: activate typewriter + entry animation as soon as section enters viewport
  entryObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !section.classList.contains('projects-stage--entered')) {
        section.classList.add('projects-stage--entered')
        typeTitle(false, true)
        entryObserver?.disconnect()
      }
    },
    { threshold: 0.08 }
  )
  entryObserver.observe(section)

  section.addEventListener('pointermove', handleDepthPointerMove)
  section.addEventListener('pointerleave', resetDepthPointer)
  window.addEventListener('resize', scheduleRefresh)
  ScrollTrigger.refresh()
})

onBeforeUnmount(() => {
  clearTitleTimers()
  if (entryObserver) entryObserver.disconnect()
  if (gsapContext.value) gsapContext.value.revert()
  if (resizeFrameId.value) window.cancelAnimationFrame(resizeFrameId.value)
  if (sectionRef.value) {
    sectionRef.value.removeEventListener('pointermove', handleDepthPointerMove)
    sectionRef.value.removeEventListener('pointerleave', resetDepthPointer)
  }
  window.removeEventListener('resize', scheduleRefresh)
  resetDepthPointer()
  emitDarkState(false)
})
</script>

<style scoped src="./home-shared.css"></style>

<style scoped>
.projects-stage {
  --projects-header-offset: 88px;
  --projects-pane-gap: clamp(7.5rem, 14vw, 16rem);
  --projects-inner-top-padding: clamp(2.5rem, 5vh, 4rem);
  --projects-parallax-x: 0px;
  --projects-parallax-y: 0px;
  --projects-parallax-x-soft: 0px;
  --projects-parallax-y-soft: 0px;
  --cine-text: #f7f3ff;
  --cine-text-soft: rgba(226, 232, 255, 0.72);
  --cine-accent: #ff33d4;
  --cine-accent-soft: #7ad6ff;
  position: relative;
  z-index: 10;
  isolation: isolate;
  min-height: 100vh;
  height: 100vh;
  box-sizing: border-box;
  overflow: clip;
}

.projects-stage::before {
  content: '';
  position: absolute;
  inset: -1px auto -1px 50%;
  width: 100%;
  transform:
    translateX(-50%)
    translate3d(var(--projects-parallax-x), var(--projects-parallax-y), 0)
    scale(1.04);
  background: #06060b;
  z-index: -1;
}

.projects-stage::after {
  content: '';
  position: absolute;
  inset: 6% auto auto 50%;
  width: 100%;
  height: 72%;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: -1;
}

.projects-stage__inner {
  position: relative;
  width: 100%;
  min-height: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 1rem;
  padding: var(--projects-inner-top-padding) var(--projects-inner-side-padding, 1.5rem) var(--projects-inner-side-padding, 1.5rem);
  box-sizing: border-box;
}

.projects-stage__terminal-slot {
  display: flex;
  justify-content: center;
  overflow: hidden;
  min-height: 0;
}

.dash-terminal {
  width: min(92vw, 1040px);
  margin: 0 auto;
  border-radius: 16px;
  pointer-events: auto;
  box-shadow:
    0 24px 90px rgba(0, 0, 0, 0.42),
    0 0 42px rgba(255, 51, 212, 0.12),
    0 0 76px rgba(122, 214, 255, 0.08);
}

.dash-panel-head__title {
  margin-bottom: 0.7rem;
  font-size: clamp(1.25rem, 2.2vw, 1.65rem);
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--cine-text);
  text-shadow:
    0 0 18px rgba(255, 51, 212, 0.18),
    0 0 28px rgba(122, 214, 255, 0.1);
}

.dash-panel-head__sub {
  margin: 0;
  max-width: 44rem;
  color: var(--cine-text-soft);
  line-height: 1.68;
  letter-spacing: 0.05em;
  font-size: 0.9rem;
}

.dash-panel-head__cursor {
  display: inline-block;
  width: 0.08em;
  height: 0.9em;
  margin-left: 0.08em;
  vertical-align: -0.08em;
  background: var(--cine-accent);
  box-shadow: 0 0 18px rgba(255, 0, 255, 0.72);
  animation: projects-cursor 0.78s steps(2, start) infinite;
}

@keyframes projects-cursor { 50% { opacity: 0; } }

.projects-stage__viewport-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

.projects-stage__viewport {
  position: relative;
  width: 88%;
  height: 46vh;
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  border-radius: 34px;
  background:
    linear-gradient(180deg, rgba(8, 10, 16, 0.92), rgba(5, 7, 12, 0.74)),
    rgba(7, 9, 14, 0.4);
  backdrop-filter: blur(18px);
  box-shadow:
    0 40px 120px rgba(0, 0, 0, 0.44),
    0 0 48px rgba(255, 51, 212, 0.09),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
}

.projects-stage__viewport::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 51, 212, 0.12), transparent 22%),
    radial-gradient(circle at 80% 28%, rgba(122, 214, 255, 0.12), transparent 22%),
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: auto, auto, 32px 32px, 32px 32px;
  opacity: 0.62;
  pointer-events: none;
}

.projects-stage__viewport::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 10%, transparent 88%, rgba(255, 0, 212, 0.06));
  pointer-events: none;
  z-index: 1;
}

.projects-stage__frame {
  --frame-progress: 0;
  position: absolute;
  inset: 0;
  z-index: 3;
  padding: 2px;
  border-radius: inherit;
  pointer-events: none;
  background: conic-gradient(from -90deg, rgba(255, 51, 212, 0.9) calc(var(--frame-progress) * 1turn), rgba(255, 255, 255, 0.03) 0);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
}

.projects-stage__track {
  display: flex;
  align-items: stretch;
  width: max-content;
  height: 100%;
  flex: 1 0 auto;
}

.projects-stage__portal {
  position: relative;
  height: 100%;
  width: var(--projects-pane-gap);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  perspective: 1000px;
  flex-shrink: 0;
}

.portal-grid {
  position: absolute;
  inset: -50%;
  background-image: 
    linear-gradient(rgba(255, 51, 212, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 51, 212, 0.15) 1px, transparent 1px);
  background-size: 60px 60px;
  transform: rotateX(60deg) translateZ(-100px);
  opacity: 0;
}

.portal-light {
  position: absolute;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, var(--cine-accent), transparent);
  box-shadow: 0 0 40px var(--cine-accent);
  opacity: 0;
  transform: scaleY(0);
}

.projects-stage__pane {
  min-width: 0;
  height: 100%;
  width: var(--viewport-width, 100%);
  flex-shrink: 0;
}

.projects-stage__pane--projects {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 2.5vh, 2rem) clamp(1.2rem, 3vw, 2.25rem);
}

.projects-stage__pane--stack {
  display: flex;
  align-items: stretch;
  padding: clamp(1rem, 3vw, 2.25rem);
  background:
    radial-gradient(circle at 16% 20%, rgba(122, 214, 255, 0.08), transparent 24%),
    radial-gradient(circle at 84% 72%, rgba(255, 51, 212, 0.08), transparent 24%);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(16rem, 18vw));
  align-items: center;
  gap: clamp(1.15rem, 2vw, 1.8rem);
  width: max-content;
  transform: scale(0.45);
  transform-origin: center center;
}

.project-card-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.project-card {
  position: relative;
  width: min(19vw, 288px);
  min-width: 16rem;
  height: min(58vh, 510px);
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(14, 16, 25, 0.98), rgba(8, 9, 14, 0.98));
  border: 1px solid rgba(255, 0, 212, 0.14);
  box-shadow:
    0 30px 70px rgba(0, 0, 0, 0.36),
    0 0 28px rgba(255, 51, 212, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
}

.project-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 51, 212, 0.08), transparent 36%, transparent 64%, rgba(122, 214, 255, 0.08));
  pointer-events: none;
  z-index: 0;
}

.project-card__id {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
  font-family: monospace;
  color: rgba(255, 51, 212, 0.82);
  font-size: 0.74rem;
  letter-spacing: 0.16em;
}

.project-card__visual {
  position: relative;
  flex: 0 0 56%;
  background: linear-gradient(135deg, var(--preview-start), var(--preview-end));
}

.project-card__screen {
  position: absolute;
  inset: 1.1rem;
  display: grid;
  grid-template-rows: 1.2rem 1fr;
  gap: 0.8rem;
  padding: 1rem;
  border-radius: 20px;
  background: rgba(7, 10, 18, 0.56);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 0 24px rgba(122, 214, 255, 0.06);
  transition: transform 0.35s ease;
}

.project-card__topbar {
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
}

.project-card__screen-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.project-card__screen-grid span {
  border-radius: 18px;
  background: linear-gradient(135deg, var(--preview-accent), var(--preview-accent-soft));
  opacity: 0.78;
}

.project-card__overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: end center;
  padding: 1.15rem;
  background: linear-gradient(180deg, rgba(7, 8, 12, 0.04), rgba(7, 8, 12, 0.8));
  color: rgba(245, 246, 249, 0.84);
  letter-spacing: 0.18em;
  font-size: 0.7rem;
  text-transform: uppercase;
  transition: opacity 0.3s ease;
}

.project-card__body {
  position: relative;
  z-index: 1;
  padding: 1.15rem 1.15rem 1.3rem;
  background: linear-gradient(to top, rgba(10, 11, 16, 1), rgba(10, 11, 16, 0.18));
}

.project-card__line {
  display: block;
  width: 20%;
  height: 2px;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, var(--cine-accent), var(--cine-accent-soft));
  box-shadow:
    0 0 10px rgba(255, 51, 212, 0.42),
    0 0 18px rgba(122, 214, 255, 0.24);
  transition: width 0.5s ease;
}

.project-card__stack {
  margin: 0;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(122, 214, 255, 0.84);
}

.project-card__title {
  margin: 0.7rem 0 0;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.32;
  letter-spacing: 0.05em;
  color: var(--cine-text);
  text-shadow: 0 0 12px rgba(255, 51, 212, 0.08);
}

.project-card__summary {
  margin: 0.8rem 0 0;
  color: var(--cine-text-soft);
  font-size: 0.82rem;
  line-height: 1.64;
  letter-spacing: 0.02em;
}

.project-card-link:hover .project-card,
.project-card-link:focus-visible .project-card {
  border-color: rgba(255, 51, 212, 0.4);
  box-shadow:
    0 38px 92px rgba(0, 0, 0, 0.44),
    0 0 34px rgba(255, 51, 212, 0.16),
    0 0 54px rgba(122, 214, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.project-card-link:hover .project-card__screen,
.project-card-link:focus-visible .project-card__screen {
  transform: scale(1.06);
}

.project-card-link:hover .project-card__overlay,
.project-card-link:focus-visible .project-card__overlay {
  opacity: 0;
}

.project-card-link:hover .project-card__line,
.project-card-link:focus-visible .project-card__line {
  width: 82%;
}

.project-card--up { animation: project-float-up 4.8s ease-in-out infinite; }
.project-card--down { animation: project-float-down 5.4s ease-in-out infinite; animation-delay: -1.2s; }

@keyframes project-float-up {
  0%, 100% { transform: translateY(10px); }
  50% { transform: translateY(-10px); }
}

@keyframes project-float-down {
  0%, 100% { transform: translateY(-8px); }
  50% { transform: translateY(12px); }
}

/* ── Entry animation ── */
.projects-stage__inner,
.dash-terminal {
  filter: blur(10px);
  transition: filter 0.7s ease;
}

.projects-stage--entered .projects-stage__inner,
.projects-stage--entered .dash-terminal {
  filter: blur(0);
}

.projects-stage__viewport-wrapper {
  filter: blur(6px);
  clip-path: inset(0 0 4% 0);
  transition: filter 0.9s ease 0.15s, clip-path 0.9s ease 0.15s;
}

.projects-stage--entered .projects-stage__viewport-wrapper {
  filter: blur(0);
  clip-path: inset(0);
}

@keyframes project-card-enter {
  from { opacity: 0; transform: translateY(18px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.project-card-link {
  opacity: 0;
  animation: project-card-enter 0.5s ease both;
  animation-play-state: paused;
}

.projects-stage--entered .project-card-link {
  animation-play-state: running;
}

.projects-stage--entered .project-card-link:nth-child(1) { animation-delay: 0.25s; }
.projects-stage--entered .project-card-link:nth-child(2) { animation-delay: 0.33s; }
.projects-stage--entered .project-card-link:nth-child(3) { animation-delay: 0.41s; }
.projects-stage--entered .project-card-link:nth-child(4) { animation-delay: 0.49s; }

@media (prefers-reduced-motion: reduce) {
  .projects-stage__inner,
  .dash-terminal,
  .projects-stage__viewport-wrapper,
  .project-card-link { filter: none; clip-path: none; opacity: 1; animation: none; }
}

@media (max-width: 1100px) {
  .projects-stage__pane--stack { padding: 1rem; }
  .projects-grid { grid-template-columns: repeat(4, minmax(14rem, 42vw)); }
  .project-card { width: min(42vw, 320px); height: min(54vh, 460px); }
}

@media (max-width: 700px) {
  .projects-stage {
    --projects-overlap: clamp(3rem, 8vh, 4.5rem);
  }

  .projects-stage__viewport { width: 100%; border-radius: 24px; }
  .projects-grid { grid-template-columns: repeat(4, minmax(12rem, 58vw)); gap: 1rem; }
  .project-card { width: min(58vw, 240px); min-width: 12rem; height: min(46vh, 360px); border-radius: 22px; }
}

@media (prefers-reduced-motion: reduce) {
  .project-card--up,
  .project-card--down { animation: none; }
}
</style>
