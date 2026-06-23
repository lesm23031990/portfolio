<template>
  <section id="proyectos" ref="sectionRef" class="projects-stage">
    <div ref="sectionInnerRef" class="projects-stage__inner">
      <div ref="terminalSlotRef" class="projects-stage__terminal-slot">
        <header
          ref="terminalRef"
          class="dash-terminal"
          :class="{ 'dash-terminal--typing': isCurrentlyTyping }"
        >
          <div class="dash-terminal__header">
            <div class="dash-terminal__dots">
              <span class="dot dot--red"></span>
              <span class="dot dot--yellow"></span>
              <span class="dot dot--green"></span>
            </div>
            <div class="dash-terminal__title">projects.sh - bash</div>
          </div>
          <div class="dash-terminal__body" @click="handleTerminalClick">
            <div class="dash-panel-head">
              <h3 class="dash-panel-head__title">
                <span class="dash-code-prefix">~ </span>
                <span>{{ typedProjectsTitle }}</span>
                <span v-if="!prefersReducedMotion && isCurrentlyTyping && !hasTypedTitle" class="dash-panel-head__cursor" aria-hidden="true"></span>
              </h3>
              <p class="dash-panel-head__sub">
                <span>{{ typedProjectsSubtitle }}</span>
                <span v-if="!prefersReducedMotion && isCurrentlyTyping && hasTypedTitle" class="dash-panel-head__cursor" aria-hidden="true"></span>
              </p>
              <span
                v-if="!isCurrentlyTyping && hasTypedTitle && typedProjectsSubtitle.length === projectsSubtitle.length"
                class="dash-terminal__replay-hint"
              >▸ click to replay</span>
            </div>
          </div>
        </header>
      </div>

      <div ref="viewportWrapperRef" class="projects-stage__viewport-wrapper">
        <div ref="viewportRef" class="projects-stage__viewport">
          <div ref="frameRef" class="projects-stage__frame" aria-hidden="true"></div>
          <div ref="exitOverlayRef" class="projects-stage__exit-overlay"></div>
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
                    <article class="project-card">
                      <span class="project-card__id">{{ project.id }}</span>
                      <div class="project-card__visual" :style="project.previewStyle">
                        <div class="project-card__screen" :class="{ 'project-card__screen--img': !!project.image }" :style="project.image ? { backgroundImage: `url(${project.image})` } : {}">
                          <template v-if="!project.image">
                            <div class="project-card__topbar"></div>
                            <div class="project-card__screen-grid">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          </template>
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

            <div ref="decorativeRef" class="projects-stage__decorative">
              <span class="decorative-text">portafolio cinematográfico</span>
            </div>

            <div ref="portalRef" class="projects-stage__portal">
              <div class="portal-grid"></div>
              <div class="portal-light"></div>
            </div>

            <div ref="stackPaneRef" id="stack" class="projects-stage__pane projects-stage__pane--stack">
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
import { useContent } from '@/content/useContent'

import StackSection from '@/components/home/StackSection.vue'

gsap.registerPlugin(ScrollTrigger)

const { t, locale } = useI18n({ useScope: 'global' })
const { getProjects, getProjectTheme } = useContent()

const sectionRef = ref(null)
const sectionInnerRef = ref(null)
const terminalSlotRef = ref(null)
const terminalRef = ref(null)
const viewportWrapperRef = ref(null)
const viewportRef = ref(null)
const frameRef = ref(null)
const exitOverlayRef = ref(null)
const trackRef = ref(null)
const projectsPaneRef = ref(null)
const stackPaneRef = ref(null)
const portalRef = ref(null)
const gridRef = ref(null)
const decorativeRef = ref(null)
const cardRefs = ref([])
const typedProjectsTitle = ref('')
const typedProjectsSubtitle = ref('')
const prefersReducedMotion = ref(false)
const isVisible = ref(false)
const hasTypedTitle = ref(false)
const isCurrentlyTyping = ref(false)
const titleDelayId = ref(null)
const gsapContext = ref(null)
const resizeFrameId = ref(null)
const initObserver = ref(null)
let typewriterGen = 0
let typewriterReady = false
let typewriterStarted = false
let visibleObserver = null
let entryAnimationRan = false
const cardFloatAnimations = []

function startCardFloat(cardElements) {
  if (prefersReducedMotion.value) return
  if (cardFloatAnimations.length > 0) return
  cardElements.forEach((card, index) => {
    const floatUp = index % 2 === 0
    const offset = 16
    const anim = gsap.to(card, {
      y: floatUp ? -offset : offset,
      duration: 2.6 + index * 0.3,
      repeat: -1,
      yoyo: true,
      ease: 'back.inOut(3)'
    })
    cardFloatAnimations.push(anim)
  })
}

const projectsTitle = computed(() => t('home.sections.projects.title'))
const projectsSubtitle = computed(() => t('home.sections.projects.subtitle'))
const projectItems = computed(() => {
  return getProjects(locale.value).map((project, index) => {
    const theme = getProjectTheme(project.theme)
    return {
      key: project.id,
      id: `${index + 1}`.padStart(2, '0'),
      title: project.title,
      stack: project.stack,
      summary: project.summary,
      previewTag: project.previewTag,
      repo: project.repo,
      cta: project.cta,
      image: project.image,
      previewStyle: {
        '--preview-start': theme.start || '#0b122a',
        '--preview-end': theme.end || '#06080f',
        '--preview-accent': theme.accent || '#ff33d4',
        '--preview-accent-soft': theme.accentSoft || '#7ad6ff'
      }
    }
  })
})

function clearTitleTimers() {
  if (titleDelayId.value) window.clearTimeout(titleDelayId.value)
  titleDelayId.value = null
}

function getCharDelay(char) {
  if (/[aeiouáéíóú]/i.test(char)) return 40 + Math.random() * 30
  if (/[.,!?;:]/.test(char)) return 100 + Math.random() * 60
  if (/[A-ZÑ]/.test(char)) return 70 + Math.random() * 40
  if (/[\d]/.test(char)) return 50 + Math.random() * 40
  if (/[-\s]/.test(char)) return 30 + Math.random() * 20
  return 60 + Math.random() * 40
}

function typeTitle(forceRestart = false, bypassVisibility = false) {
  if (!bypassVisibility && !isVisible.value) return
  if (!forceRestart && hasTypedTitle.value) return

  clearTitleTimers()
  const gen = ++typewriterGen

  typedProjectsTitle.value = ''
  typedProjectsSubtitle.value = ''
  hasTypedTitle.value = false
  isCurrentlyTyping.value = true

  const texts = [projectsTitle.value, projectsSubtitle.value]
  let textIndex = 0
  let charIndex = 0

  function typeNext() {
    if (gen !== typewriterGen) {
      isCurrentlyTyping.value = false
      return
    }

    if (textIndex === 0) {
      typedProjectsTitle.value = texts[0].slice(0, charIndex)
    } else {
      typedProjectsTitle.value = texts[0]
      typedProjectsSubtitle.value = texts[1].slice(0, charIndex)
    }

    if (textIndex < texts.length) {
      if (charIndex < texts[textIndex].length) {
        const char = texts[textIndex][charIndex]
        charIndex++
        if (char !== ' ') {
          setTimeout(typeNext, getCharDelay(char))
        } else {
          setTimeout(typeNext, 30 + Math.random() * 20)
        }
      } else {
        textIndex++
        charIndex = 0
        if (textIndex < texts.length) {
          setTimeout(typeNext, 400 + Math.random() * 200)
        } else {
          hasTypedTitle.value = true
          isCurrentlyTyping.value = false
        }
      }
    } else {
      hasTypedTitle.value = true
      isCurrentlyTyping.value = false
    }
  }

  titleDelayId.value = window.setTimeout(typeNext, 600 + Math.random() * 400)
}

function cancelTypewriter() {
  typewriterGen++
  isCurrentlyTyping.value = false
}

function handleTerminalClick() {
  if (isCurrentlyTyping.value) return
  typedProjectsTitle.value = ''
  typedProjectsSubtitle.value = ''
  hasTypedTitle.value = false
  typeTitle(true)
}

function setCardRef(element, index) {
  if (element) cardRefs.value[index] = element
}

let stickyHeader, cachedHeaderHeight = 88
function getHeaderOffset() {
  if (!stickyHeader) {
    stickyHeader = document.querySelector('header.sticky')
    if (stickyHeader) cachedHeaderHeight = Math.ceil(stickyHeader.getBoundingClientRect().height)
  }
  return cachedHeaderHeight
}

let setParallaxX, setParallaxY, setParallaxXSoft, setParallaxYSoft
let pointermoveRAF = null

function initParallaxSetters() {
  const el = sectionRef.value
  if (!el) return
  setParallaxX = gsap.quickSetter(el, '--projects-parallax-x', 'px')
  setParallaxY = gsap.quickSetter(el, '--projects-parallax-y', 'px')
  setParallaxXSoft = gsap.quickSetter(el, '--projects-parallax-x-soft', 'px')
  setParallaxYSoft = gsap.quickSetter(el, '--projects-parallax-y-soft', 'px')
}

function handleDepthPointerMove(event) {
  if (prefersReducedMotion.value || !sectionRef.value) return
  if (pointermoveRAF) return
  pointermoveRAF = window.requestAnimationFrame(() => {
    pointermoveRAF = null
    if (!setParallaxX) initParallaxSetters()

    const rect = sectionRef.value.getBoundingClientRect()
    const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2

    setParallaxX(Math.round(offsetX * 18))
    setParallaxY(Math.round(offsetY * 14))
    setParallaxXSoft(Math.round(offsetX * -10))
    setParallaxYSoft(Math.round(offsetY * -8))
  })
}

function resetDepthPointer() {
  if (prefersReducedMotion.value || !sectionRef.value) return
  pointermoveRAF = null

  gsap.to(sectionRef.value, {
    duration: 0.6,
    ease: 'power2.out',
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
  if (visibleNow) {
    cardFloatAnimations.forEach(a => a.resume())
    if (typewriterStarted) return
    runEntryAnimation()
    typewriterStarted = true
    typeTitle(true)
  } else {
    cardFloatAnimations.forEach(a => a.pause())
    cancelTypewriter()
  }
})

function runEntryAnimation() {
  if (entryAnimationRan) return
  entryAnimationRan = true
  const t = terminalRef.value
  const vw = viewportWrapperRef.value
  const v = viewportRef.value
  if (!t || !vw || !v) return
  if (prefersReducedMotion.value) {
    gsap.set(t, { autoAlpha: 1, y: 0 })
    gsap.set(vw, { autoAlpha: 1, y: 0 })
    gsap.set(v, { scale: 1 })
    return
  }
  gsap.to(t, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' })
  gsap.to(vw, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.2')
  gsap.to(v, { scale: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
}

watch(projectsTitle, () => {
  if (!typewriterReady) return
  cancelTypewriter()
  hasTypedTitle.value = false
  if (isVisible.value) {
    typeTitle(true)
    return
  }
  typedProjectsTitle.value = ''
  typedProjectsSubtitle.value = ''
})

let gsapInitialized = false

onMounted(async () => {
  if (window.matchMedia) {
    prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  await nextTick()

  const section = sectionRef.value
  if (!section) return

  const deferredInit = async () => {
    if (gsapInitialized) return
    gsapInitialized = true

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
    const decorative = decorativeRef.value

    if (!sectionInner || !terminalSlot || !terminal || !viewportWrapper || !viewport || !frame || !exitOverlayRef.value || !track || !projectsPane || !stackPane || !portal || !grid || !cards.length || !decorative) {
      gsapInitialized = false
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

  const paneGap = Math.round(Math.min(Math.max(window.innerWidth * 0.85, 300), 1800))
  const baseGridGap = Math.round(Math.min(Math.max(window.innerWidth * 0.018, 16), 28))
  const portalGrid = portal.querySelector('.portal-grid')
  const portalLight = portal.querySelector('.portal-light')
  let cardBaseWidth, cardBaseHeight

  // Cached layout values — refreshed on resize, NOT on every scroll frame
  let cachedViewportHeight78 = ''
  let cachedCardFitScale1 = 1
  let cachedCardFitScale2 = 1
  let cachedTrackShift = 0

  function alignDecorativeText() {
    const totalCardWidths = cards.reduce((sum, c) => sum + c.offsetWidth, 0)
    const expandedGap = Math.round(baseGridGap * 1.4)
    const totalGaps = (cards.length - 1) * expandedGap
    const finalScale = cachedCardFitScale2
    const gridVisualWidth = (totalCardWidths + totalGaps) * finalScale
    const panePadLeft = parseFloat(getComputedStyle(projectsPane).paddingLeft) || 0
    const decoMargin = Math.round(panePadLeft + gridVisualWidth - projectsPane.offsetWidth + 200)
    section.style.setProperty('--decorative-left', `${decoMargin}px`)
  }

  const getViewportHeight = (ratio) => {
    const wrapperHeight = viewportWrapper.clientHeight || window.innerHeight
    return `${Math.round(Math.min(window.innerHeight * ratio, wrapperHeight))}px`
  }

  const getTrackShift = () => {
    const decoWidth = decorative.offsetWidth || 0
    const decoMargin = parseFloat(section.style.getPropertyValue('--decorative-left')) || 0
    return -(Math.round(section.getBoundingClientRect().width || viewport.clientWidth) + decoMargin + decoWidth + paneGap)
  }

  const getCardFitScale = (ratio, widthCoverage = 0.84, heightCoverage = 0.86) => {
    if (!cardBaseWidth) {
      cardBaseWidth = cards[0]?.offsetWidth || 1
      cardBaseHeight = cards[0]?.offsetHeight || 1
    }
    const availableWidth = Math.max(projectsPane.clientWidth * widthCoverage, 1)
    const availableHeight = Math.max(Math.min(window.innerHeight * ratio, viewportWrapper.clientHeight) * heightCoverage, 1)
    return Math.min(availableWidth / cardBaseWidth, availableHeight / cardBaseHeight)
  }

  function refreshLayoutCache() {
    cachedViewportHeight78 = getViewportHeight(0.78)
    cachedCardFitScale1 = getCardFitScale(1, 0.8, 0.72)
    cachedCardFitScale2 = getCardFitScale(1, 0.88, 0.72)
    cachedTrackShift = getTrackShift()
  }

  function updateLayoutMetrics() {
    const sectionWidth = Math.round(section.getBoundingClientRect().width || window.innerWidth)
    section.style.setProperty('--projects-header-offset', `${getHeaderOffset()}px`)
    section.style.setProperty('--projects-pane-gap', `${paneGap}px`)
    section.style.setProperty('--projects-inner-side-padding', '1.5rem')
    section.style.setProperty('--viewport-width', `${sectionWidth}px`)
    alignDecorativeText()
    refreshLayoutCache()
  }

  updateLayoutMetrics()

  // ── Initial state: elements hidden for entry animation ──
  gsap.set(sectionInner, { autoAlpha: 1, y: 0 })
  gsap.set(terminalSlot, { height: terminalSlot.offsetHeight, autoAlpha: 1 })
  gsap.set(terminal, { autoAlpha: 0, y: -18 })
  gsap.set(viewportWrapper, { autoAlpha: 0, y: 12 })
  gsap.set(viewport, { width: '92%', height: getViewportHeight(0.5), borderRadius: '34px', scale: 0.97 })
  gsap.set(frame, { '--frame-progress': 0, opacity: 1 })
  gsap.set(track, { x: 0 })
  gsap.set(grid, { scale: 1, yPercent: 0, gap: `${baseGridGap}px`, transformOrigin: 'center center' })
  gsap.set(stackPane, { autoAlpha: 1, xPercent: 0, scale: 1 })
  gsap.set(decorative, { autoAlpha: 1 })
  gsap.set(exitOverlayRef.value, { autoAlpha: 0 })
  gsap.set(frame, { filter: 'blur(0px)' })

  const accentEl = stackPane.querySelector('.tcs-laptop__accent')
  const stackEls = stackPane.querySelectorAll('.tcs__left, .tcs__center, .tcs__right')
  if (stackEls.length) gsap.set(stackEls, { autoAlpha: 1, y: 0 })
  if (accentEl) gsap.set(accentEl, { scaleX: 1, opacity: 0.5, filter: 'blur(0px)' })

  gsapContext.value = gsap.context(() => {
    gsap.timeline({
      defaults: { ease: 'expo.inOut' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=6800',
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
      .to(viewport, { height: cachedViewportHeight78, duration: 1.18 }, 0)
      .to(frame, { '--frame-progress': 1, duration: 0.8, ease: 'none' }, 0)
      .to(terminal, { autoAlpha: 0, y: -26, duration: 0.3 }, 0.8)
      .to(terminalSlot, { height: 0, padding: 0, autoAlpha: 0, duration: 0.48 }, 0.76)
      .to(viewport, { width: '100%', height: '100%', borderRadius: 0, duration: 1.02 }, 1.34)
      .to(section, {
        '--projects-inner-top-padding': '0px',
        '--projects-inner-side-padding': '0px',
        duration: 1.02
      }, 1.34)
      .to(sectionInner, { gap: 0, duration: 1.02 }, 1.34)
      .to(grid, { scale: cachedCardFitScale1, yPercent: -6, duration: 1.02 }, 1.34)
      .to(frame, { opacity: 0, duration: 0.34 }, 1.54)
      .to(grid, { scale: cachedCardFitScale2, gap: `${Math.round(baseGridGap * 1.4)}px`, duration: 0.48, ease: 'expo.out' }, 1.68)
      .call(startCardFloat, [cards], 1.9)
      .to(track, { x: cachedTrackShift, duration: 3.6, ease: 'none' }, 2.14)
      .to(portalGrid, { opacity: 0.6, y: -100, duration: 1.8, ease: 'power2.inOut' }, 2.14)
      .to(portalLight, { opacity: 1, scaleY: 1.5, duration: 1.8, ease: 'power2.inOut' }, 2.14)
      .to(portalGrid, { opacity: 0, y: -200, duration: 1.8, ease: 'power2.inOut' }, 3.94)
      .to(portalLight, { opacity: 0, scaleY: 0, duration: 1.8, ease: 'power2.inOut' }, 3.94)
      // ── Exit: inverse entry — window shrinks, neon border appears then blurs ──
      .to(frame, { opacity: 1, '--frame-progress': 1, filter: 'blur(0px)', duration: 0.35, ease: 'power2.out' }, 5.8)
      .to(viewport, {
        scale: 0.86,
        borderRadius: '28px',
        y: '6%',
        paddingBottom: '2.5rem',
        duration: 0.8,
        ease: 'power2.inOut'
      }, 6.0)
      .to(exitOverlayRef.value, { autoAlpha: 0.3, duration: 0.6, ease: 'power2.out' }, 6.0)
      .to(frame, {
        opacity: 0.3,
        '--frame-progress': 0.3,
        filter: 'blur(5px)',
        duration: 1.2,
        ease: 'power1.in'
      }, 6.5)
      .to(exitOverlayRef.value, { autoAlpha: 0.65, duration: 0.8, ease: 'power2.out' }, 7.1)
      .to(frame, { opacity: 0, filter: 'blur(14px)', duration: 0.6 }, 7.9)
      .to(sectionInner, { autoAlpha: 0, duration: 0.7, ease: 'power2.in' }, 8.5)
  }, section)

  section.addEventListener('pointermove', handleDepthPointerMove)
  section.addEventListener('pointerleave', resetDepthPointer)
  window.addEventListener('resize', scheduleRefresh)
  ScrollTrigger.refresh()

  typewriterReady = true
  if (isVisible.value) {
    runEntryAnimation()
    typewriterStarted = true
    typeTitle(true)
  }
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      observer.disconnect()
      deferredInit()
    }
  }, { rootMargin: '0px 0px 600px 0px' })

  if (window.location.hash === '#proyectos') {
    observer.disconnect()
    deferredInit()
  } else {
    observer.observe(section)
    initObserver.value = observer
  }

  visibleObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      isVisible.value = true
      visibleObserver.disconnect()
    }
  }, { threshold: 0, rootMargin: '0px' })
  visibleObserver.observe(section)
})

onBeforeUnmount(() => {
  cancelTypewriter()
  clearTitleTimers()
  cardFloatAnimations.forEach(anim => anim.kill())
  cardFloatAnimations.length = 0
  if (gsapContext.value) gsapContext.value.revert()
  if (resizeFrameId.value) window.cancelAnimationFrame(resizeFrameId.value)
  if (pointermoveRAF) window.cancelAnimationFrame(pointermoveRAF)
  if (initObserver.value) initObserver.value.disconnect()
  if (visibleObserver) visibleObserver.disconnect()
  if (sectionRef.value) {
    sectionRef.value.removeEventListener('pointermove', handleDepthPointerMove)
    sectionRef.value.removeEventListener('pointerleave', resetDepthPointer)
  }
  window.removeEventListener('resize', scheduleRefresh)
  resetDepthPointer()
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
  will-change: transform;
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
  will-change: transform, opacity;
}

.projects-stage__terminal-slot {
  display: flex;
  justify-content: center;
  overflow: hidden;
  min-height: 0;
  padding-top: calc(var(--projects-header-offset, 88px) + 1.5rem);
  padding-bottom: 1rem;
}

.dash-panel-head {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
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

.dash-terminal__body {
  padding-bottom: 3.5rem;
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

.dash-terminal--typing .dash-panel-head__cursor {
  animation-duration: 0.4s;
}

@keyframes projects-cursor { 50% { opacity: 0; } }

.dash-terminal__replay-hint {
  display: inline-block;
  margin-top: 0.75rem;
  font-size: 0.72rem;
  font-family: 'Fira Code', 'Courier New', monospace;
  color: rgba(255, 255, 255, 0.25);
  letter-spacing: 0.05em;
  animation: projects-hint-pulse 2s ease-in-out infinite;
  user-select: none;
}

@keyframes projects-hint-pulse {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.6; }
}

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
  transform-origin: center center;
  will-change: transform;
  background:
    linear-gradient(180deg, rgba(8, 10, 16, 0.96), rgba(5, 7, 12, 0.92));
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
  will-change: opacity, filter;
  background: conic-gradient(from -90deg, rgba(255, 51, 212, 0.9) calc(var(--frame-progress) * 1turn), rgba(255, 255, 255, 0.03) 0);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
}

.projects-stage__exit-overlay {
  position: absolute;
  inset: 0;
  z-index: 4;
  background: #06060b;
  pointer-events: none;
  will-change: opacity;
}

.projects-stage__track {
  display: flex;
  align-items: stretch;
  width: max-content;
  height: 100%;
  flex: 1 0 auto;
  will-change: transform;
  transform: translateZ(0);
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
  justify-content: flex-start;
  padding: clamp(5rem, 10vh, 8rem) clamp(3rem, 5vw, 5rem) clamp(1rem, 2.5vh, 2rem) clamp(10rem, 15vw, 16rem);
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
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: clamp(1.15rem, 2vw, 1.8rem);
  width: max-content;
  transform: scale(0.45);
  transform-origin: center center;
  will-change: transform;
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
  max-height: 80vh;
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
  transition: border-color 0.35s ease, box-shadow 0.35s ease;
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
  overflow: hidden;
}

.project-card__screen--img {
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
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

.projects-stage__decorative {
  height: 100%;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 0 clamp(6rem, 10vw, 12rem) 0 0;
  margin-left: var(--decorative-left, 350px);
  will-change: transform;
}

.decorative-text {
  font-size: clamp(3.5rem, 7vw, 6rem);
  font-weight: 800;
  color: rgba(255, 51, 212, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  white-space: nowrap;
  user-select: none;
  line-height: 1.1;
  text-shadow:
    0 0 40px rgba(255, 51, 212, 0.12),
    0 0 120px rgba(255, 51, 212, 0.08);
}

@media (max-width: 1100px) {
  .projects-stage__pane--stack { padding: 1rem; }
  .project-card { width: min(42vw, 320px); height: min(54vh, 460px); }
}

@media (max-width: 860px) {
  .projects-stage__viewport { width: 100%; }
}

@media (max-width: 700px) {
  .projects-stage {
    --projects-overlap: clamp(3rem, 8vh, 4.5rem);
  }

  .projects-stage__viewport { border-radius: 24px; }
  .projects-grid { gap: 1rem; }
  .project-card { width: min(58vw, 240px); min-width: 12rem; height: min(46vh, 360px); border-radius: 22px; }
  .project-card__summary { display: none; }
}

</style>
