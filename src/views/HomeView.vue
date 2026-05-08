<template>
  <div class="dashboard">
    <!-- Capas parallax fijas (velocidades distintas al scroll) -->
    <div class="dashboard__parallax" aria-hidden="true">
      <div class="dashboard__grid" :style="layerStyle(0.04)" />
      <div class="dashboard__orb dashboard__orb--a" :style="layerStyle(0.18, 0.015)" />
      <div class="dashboard__orb dashboard__orb--b" :style="layerStyle(-0.1, -0.01)" />
      <div class="dashboard__orb dashboard__orb--c" :style="layerStyle(0.06)" />
    </div>

    <section
      id="inicio"
      class="dash-section dash-section--hero"
      :class="{ 'dash-section--visible': visible.inicio }"
    >
      <p class="dash-hero-profile" :aria-label="profileText" aria-live="polite">
        <span>{{ typedProfileText }}</span>
        <span v-if="!prefersReducedMotion" class="dash-hero-profile__cursor" aria-hidden="true"></span>
      </p>
      <div class="dash-section__inner">
        <div class="dash-hero-card" :style="heroCardStyle">
          <p class="dash-hero-card__kicker">{{ $t('home.hero.kicker') }}</p>
          <h2 class="dash-hero-card__title">{{ $t('home.hero.title') }}</h2>
          <p class="dash-hero-card__lead">{{ $t('home.hero.lead') }}</p>
          <div class="dash-hero-card__actions">
            <a class="dash-btn dash-btn--primary" href="#proyectos">{{ $t('home.hero.ctaProjects') }}</a>
            <a class="dash-btn dash-btn--ghost" href="#contacto">{{ $t('home.hero.ctaContact') }}</a>
          </div>
        </div>
        <div class="dash-metrics" :style="metricsStyle">
          <div v-for="metric in metrics" :key="metric.key" class="dash-metric">
            <span class="dash-metric__value">{{ metric.value }}</span>
            <span class="dash-metric__label">{{ metric.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <section
      id="proyectos"
      class="dash-section"
      :class="{ 'dash-section--visible': visible.proyectos }"
    >
      <div class="dash-section__inner">
        <header class="dash-panel-head">
          <h3 class="dash-panel-head__title">{{ $t('home.sections.projects.title') }}</h3>
          <p class="dash-panel-head__sub">{{ $t('home.sections.projects.subtitle') }}</p>
        </header>
        <div class="dash-projects">
          <article
            v-for="(project, i) in projectItems"
            :key="project.key"
            class="dash-project"
            :style="projectCardStyle(i)"
          >
            <div class="dash-project__media" />
            <div class="dash-project__body">
              <h4 class="dash-project__title">{{ project.title }}</h4>
              <p class="dash-project__stack">{{ project.stack }}</p>
              <p class="dash-project__desc">{{ project.desc }}</p>
              <a v-if="project.href !== '#'" class="dash-link" :href="project.href" target="_blank" rel="noopener noreferrer">{{ project.cta }}</a>
              <span v-else class="dash-link dash-link--muted">{{ project.comingSoon }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section
      id="stack"
      class="dash-section"
      :class="{ 'dash-section--visible': visible.stack }"
    >
      <div class="dash-section__inner">
        <header class="dash-panel-head">
          <h3 class="dash-panel-head__title">{{ $t('home.sections.stack.title') }}</h3>
          <p class="dash-panel-head__sub">{{ $t('home.sections.stack.subtitle') }}</p>
        </header>
        <ul class="dash-tags">
          <li v-for="tag in stackTags" :key="tag" class="dash-tag">{{ tag }}</li>
        </ul>
      </div>
    </section>

    <section
      id="contacto"
      class="dash-section dash-section--footer"
      :class="{ 'dash-section--visible': visible.contacto }"
    >
      <div class="dash-section__inner">
        <header class="dash-panel-head">
          <h3 class="dash-panel-head__title">{{ $t('home.sections.contact.title') }}</h3>
          <p class="dash-panel-head__sub">{{ $t('home.sections.contact.subtitle') }}</p>
        </header>
        <div class="dash-contact">
          <a class="dash-contact__item" :href="contactEmailHref">{{ contactEmail }}</a>
          <a
            class="dash-contact__item"
            href="https://www.linkedin.com/in/lorenaesalasm/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ $t('home.contact.linkedin') }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import i18n from '@/i18n'

export default {
  name: 'HomeView',
  data() {
    return {
      scrollY: 0,
      rafId: null,
      visible: {
        inicio: true,
        proyectos: false,
        stack: false,
        contacto: false
      },
      observers: [],
      prefersReducedMotion: false,
      typedProfileText: '',
      typewriterIndex: 0,
      typewriterTimer: null,
      typewriterFrameId: null,
      typewriterReady: false,
      hasTypedProfile: false,
      audioContext: null,
      canPlayTypingSound: false
    }
  },
  computed: {
    profileText() {
      return this.$t('home.hero.profile')
    },
    contactEmail() {
      const activeLocale = i18n.global.locale.value
      const rawEmail = i18n.global.messages.value?.[activeLocale]?.home?.contact?.email
      return typeof rawEmail === 'string' ? rawEmail : ''
    },
    contactEmailHref() {
      return `mailto:${this.contactEmail}`
    },
    metrics() {
      return [
        {
          key: 'experience',
          value: this.$t('home.metrics.experience.value'),
          label: this.$t('home.metrics.experience.label')
        },
        {
          key: 'role',
          value: this.$t('home.metrics.role.value'),
          label: this.$t('home.metrics.role.label')
        },
        {
          key: 'core',
          value: this.$t('home.metrics.core.value'),
          label: this.$t('home.metrics.core.label')
        }
      ]
    },
    projectItems() {
      return [
        {
          key: 'migration',
          href: '#',
          title: this.$t('home.projects.migration.title'),
          stack: this.$t('home.projects.migration.stack'),
          desc: this.$t('home.projects.migration.desc'),
          cta: this.$t('home.projects.migration.cta'),
          comingSoon: this.$t('home.projects.migration.comingSoon')
        },
        {
          key: 'admin',
          href: '#',
          title: this.$t('home.projects.admin.title'),
          stack: this.$t('home.projects.admin.stack'),
          desc: this.$t('home.projects.admin.desc'),
          cta: this.$t('home.projects.admin.cta'),
          comingSoon: this.$t('home.projects.admin.comingSoon')
        },
        {
          key: 'portfolio',
          href: '#inicio',
          title: this.$t('home.projects.portfolio.title'),
          stack: this.$t('home.projects.portfolio.stack'),
          desc: this.$t('home.projects.portfolio.desc'),
          cta: this.$t('home.projects.portfolio.cta'),
          comingSoon: this.$t('home.projects.portfolio.comingSoon')
        }
      ]
    },
    stackTags() {
      return [
        this.$t('home.stackTags.vue'),
        this.$t('home.stackTags.javascript'),
        this.$t('home.stackTags.laravel'),
        this.$t('home.stackTags.php'),
        this.$t('home.stackTags.rest'),
        this.$t('home.stackTags.mysql'),
        this.$t('home.stackTags.postgresql'),
        this.$t('home.stackTags.git'),
        this.$t('home.stackTags.htmlCss'),
        this.$t('home.stackTags.responsive'),
        this.$t('home.stackTags.scrum')
      ]
    },
    heroCardStyle() {
      if (this.prefersReducedMotion) return {}
      const y = this.scrollY
      return {
        transform: `translate3d(0, ${y * -0.035}px, 0)`
      }
    },
    metricsStyle() {
      if (this.prefersReducedMotion) return {}
      const y = this.scrollY
      return {
        transform: `translate3d(0, ${y * -0.02}px, 0)`
      }
    }
  },
  watch: {
    contactEmail: {
      handler(value) {
        this.logContactEmailMetadata('contact-email-watch', value)
      },
      immediate: true
    },
    profileText() {
      if (!this.typewriterReady) {
        this.typedProfileText = ''
        this.typewriterIndex = 0
        this.hasTypedProfile = false
        return
      }
      this.queueTypewriterStart(true)
    },
    'visible.inicio'(isVisible) {
      if (isVisible) this.queueTypewriterStart()
    }
  },
  mounted() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    window.addEventListener('portfolio:overlay-finished', this.handleOverlayFinished)
    window.addEventListener('pointerdown', this.enableTypingSound, { once: true, passive: true })
    window.addEventListener('keydown', this.enableTypingSound, { once: true })
    this.onScroll()
    window.addEventListener('scroll', this.onScroll, { passive: true })
    if (!document.querySelector('.loading-overlay')) {
      this.typewriterReady = true
      this.queueTypewriterStart(true)
    }
    this.$nextTick(() => this.observeSections())
  },
  beforeUnmount() {
    window.removeEventListener('portfolio:overlay-finished', this.handleOverlayFinished)
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('pointerdown', this.enableTypingSound)
    window.removeEventListener('keydown', this.enableTypingSound)
    if (this.rafId) cancelAnimationFrame(this.rafId)
    if (this.typewriterTimer) clearTimeout(this.typewriterTimer)
    if (this.typewriterFrameId) cancelAnimationFrame(this.typewriterFrameId)
    if (this.audioContext) this.audioContext.close()
    this.observers.forEach((o) => o.disconnect())
    this.observers = []
  },
  methods: {
    handleOverlayFinished() {
      this.typewriterReady = true
      this.queueTypewriterStart(true)
    },
    enableTypingSound() {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext || this.prefersReducedMotion) return
      this.audioContext = this.audioContext || new AudioContext()
      this.canPlayTypingSound = true
    },
    queueTypewriterStart(forceRestart = false) {
      if (this.typewriterFrameId) cancelAnimationFrame(this.typewriterFrameId)
      if (!this.visible.inicio || !this.typewriterReady) return

      if (this.prefersReducedMotion) {
        if (forceRestart || !this.hasTypedProfile) this.restartTypewriter()
        return
      }

      if (!forceRestart && (this.typewriterTimer || this.hasTypedProfile)) return

      this.typewriterFrameId = requestAnimationFrame(() => {
        this.typewriterFrameId = requestAnimationFrame(() => {
          this.restartTypewriter()
          this.typewriterFrameId = null
        })
      })
    },
    restartTypewriter() {
      if (this.typewriterTimer) clearTimeout(this.typewriterTimer)
      this.typewriterTimer = null
      this.typewriterIndex = 0
      this.hasTypedProfile = false
      this.typedProfileText = this.prefersReducedMotion ? this.profileText : ''

      if (this.prefersReducedMotion) {
        this.hasTypedProfile = true
        return
      }

      if (this.visible.inicio && this.typewriterReady) {
        this.typewriterTimer = setTimeout(() => this.tickTypewriter(), 120)
      }
    },
    tickTypewriter() {
      if (this.typewriterIndex >= this.profileText.length) {
        this.typedProfileText = this.profileText
        this.hasTypedProfile = true
        this.typewriterTimer = null
        return
      }

      this.typewriterIndex += 1
      this.typedProfileText = this.profileText.slice(0, this.typewriterIndex)
      this.playTypingClick()
      const nextDelay = this.profileText[this.typewriterIndex] === ' ' ? 22 : 42
      this.typewriterTimer = setTimeout(() => this.tickTypewriter(), nextDelay)
    },
    playTypingClick() {
      if (!this.canPlayTypingSound || !this.audioContext) return

      const now = this.audioContext.currentTime
      const oscillator = this.audioContext.createOscillator()
      const gain = this.audioContext.createGain()
      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(760 + Math.random() * 120, now)
      gain.gain.setValueAtTime(0.018, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035)
      oscillator.connect(gain)
      gain.connect(this.audioContext.destination)
      oscillator.start(now)
      oscillator.stop(now + 0.035)
    },
    logContactEmailMetadata(source, value = this.contactEmail) {
      // #region agent log
      fetch('http://127.0.0.1:7592/ingest/f20cbc4f-e99d-4090-95ce-53ddee1a70ec',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'58aca7'},body:JSON.stringify({sessionId:'58aca7',runId:'post-fix',hypothesisId:'H1,H2,H4',location:'src/views/HomeView.vue:168',message:'contact email resolved without translation compilation',data:{source,locale:i18n.global.locale.value,messageMeta:{exists:typeof value==='string',length:typeof value==='string'?value.length:null,containsAt:typeof value==='string'?value.includes('@'):false,containsColon:typeof value==='string'?value.includes(':'):false}},timestamp:Date.now()})}).catch(()=>{})
      // #endregion
    },
    onScroll() {
      if (this.rafId) return
      this.rafId = requestAnimationFrame(() => {
        this.scrollY = window.scrollY || document.documentElement.scrollTop
        this.rafId = null
      })
    },
    layerStyle(speedY, rotate = 0) {
      if (this.prefersReducedMotion) return {}
      const y = this.scrollY
      const rot = rotate ? y * rotate : 0
      return {
        transform: `translate3d(0, ${y * speedY}px, 0) rotate(${rot}deg)`
      }
    },
    projectCardStyle(index) {
      if (this.prefersReducedMotion) return {}
      const y = this.scrollY
      const stagger = index * 12
      return {
        transform: `translate3d(0, ${(y - stagger) * -0.012}px, 0)`
      }
    },
    observeSections() {
      const ids = ['inicio', 'proyectos', 'stack', 'contacto']
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (!el) return
        const obs = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                this.visible[id] = true
              }
            })
          },
          { root: null, threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
        )
        obs.observe(el)
        this.observers.push(obs)
      })
    }
  }
}
</script>

<style scoped>
.dashboard {
  --rose-bg: #fff9fc;
  --rose-bg-soft: #fff1f7;
  --rose-surface: rgba(255, 255, 255, 0.74);
  --rose-surface-strong: rgba(255, 255, 255, 0.9);
  --rose-border: rgba(222, 164, 192, 0.38);
  --rose-border-strong: rgba(213, 119, 162, 0.36);
  --rose-shadow: rgba(214, 123, 165, 0.18);
  --rose-text: #6f2f54;
  --rose-text-soft: #9d6a86;
  --rose-accent: #d46b9e;
  --rose-accent-strong: #be4f87;
  position: relative;
  min-height: 100vh;
  background: linear-gradient(160deg, #fffafe 0%, #fff3f9 46%, #fefcff 100%);
  color: var(--rose-text);
  overflow-x: clip;
}

.dashboard__parallax {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.dashboard__grid {
  position: absolute;
  inset: -20%;
  background-image:
    linear-gradient(rgba(212, 107, 158, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212, 107, 158, 0.07) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.32;
  will-change: transform;
}

.dashboard__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.55;
  will-change: transform;
}

.dashboard__orb--a {
  width: min(90vw, 520px);
  height: min(90vw, 520px);
  top: -8%;
  right: -10%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 214, 232, 0.95), rgba(241, 168, 201, 0.72) 38%, transparent 72%);
}

.dashboard__orb--b {
  width: min(70vw, 420px);
  height: min(70vw, 420px);
  bottom: 10%;
  left: -15%;
  background: radial-gradient(circle at 70% 50%, rgba(246, 199, 224, 0.86), rgba(226, 158, 197, 0.66) 44%, transparent 72%);
}

.dashboard__orb--c {
  width: 240px;
  height: 240px;
  top: 42%;
  left: 35%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9), rgba(250, 214, 231, 0.45) 48%, transparent 70%);
  opacity: 0.58;
}

.dash-section {
  position: relative;
  z-index: 1;
  min-height: min(92vh, 900px);
  display: flex;
  align-items: center;
  scroll-margin-top: 8rem;
  padding: 4.5rem 1.25rem;
  opacity: 0;
  transform: translate3d(0, 36px, 0);
  transition:
    opacity 0.65s ease,
    transform 0.65s ease;
}

.dash-section--visible {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.dash-section--hero {
  min-height: 100vh;
  padding-top: 8rem;
  opacity: 1;
  transform: none;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
}

.dash-section--hero::before {
  content: '';
  position: absolute;
  inset: 1.5rem 0 0;
  z-index: 0;
  background: #f7edf4 url('../assets/hero-pcb-bg.svg') center / cover no-repeat;
  pointer-events: none;
  transform: translate3d(0, 0, 0);
}

.dash-section--hero::after {
  content: '';
  position: absolute;
  inset: 1.5rem 0 0;
  z-index: 0;
  background:
    linear-gradient(180deg, rgba(255, 248, 252, 0.78), rgba(255, 235, 244, 0.58) 36%, rgba(255, 248, 252, 0.8));
  pointer-events: none;
  transform: translate3d(0, 0, 0);
}

.dash-hero-profile {
  position: relative;
  z-index: 1;
  width: min(100%, 1120px);
  max-width: min(92vw, 52rem);
  min-height: 4.8em;
  margin: 0 auto;
  padding: 0 1.25rem;
  font-size: clamp(1.65rem, 5vw, 4rem);
  font-weight: 300;
  line-height: 1.12;
  letter-spacing: 0.02em;
  text-align: center;
  text-wrap: balance;
  white-space: normal;
  word-break: keep-all;
  background: linear-gradient(90deg, #e11d8f, #d946ef 42%, #f472b6 68%, #fb7185);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 14px 28px rgba(217, 70, 239, 0.28));
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

.dash-section__inner {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.dash-section--hero .dash-section__inner {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 2.5rem;
  align-items: end;
}

@keyframes profile-cursor {
  50% {
    opacity: 0;
  }
}

@media (min-width: 900px) {
  .dash-section--hero .dash-section__inner {
    grid-template-columns: 1.2fr 0.8fr;
    align-items: end;
  }
}

.dash-hero-card {
  padding: 2rem 2rem 2.25rem;
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 245, 250, 0.84));
  border: 1px solid var(--rose-border);
  box-shadow:
    0 24px 56px var(--rose-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  will-change: transform;
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
  display: grid;
  gap: 1rem;
  will-change: transform;
}

@media (min-width: 900px) {
  .dash-metrics {
    margin-bottom: 0.5rem;
  }
}

.dash-metric {
  padding: 1.1rem 1.25rem;
  border-radius: 22px;
  background: var(--rose-surface);
  border: 1px solid var(--rose-border);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  box-shadow: 0 18px 32px rgba(227, 182, 206, 0.18);
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

.dash-panel-head {
  margin-bottom: 2rem;
}

.dash-panel-head__title {
  font-size: clamp(1.5rem, 3vw, 1.85rem);
  font-weight: 300;
  margin-bottom: 0.5rem;
}

.dash-panel-head__sub {
  color: var(--rose-text-soft);
  font-size: 0.98rem;
  max-width: 40rem;
  line-height: 1.55;
}

.dash-projects {
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 720px) {
  .dash-projects {
    grid-template-columns: repeat(3, 1fr);
  }
}

.dash-project {
  border-radius: 24px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid var(--rose-border);
  display: flex;
  flex-direction: column;
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;
  will-change: transform;
  box-shadow: 0 18px 34px rgba(227, 182, 206, 0.16);
}

.dash-project:hover {
  border-color: var(--rose-border-strong);
  box-shadow: 0 24px 42px rgba(214, 123, 165, 0.2);
}

.dash-project__media {
  height: 120px;
  background: linear-gradient(135deg, rgba(250, 208, 227, 0.92), rgba(244, 235, 241, 0.95));
}

.dash-project__body {
  padding: 1.15rem 1.25rem 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.dash-project__title {
  font-size: 1.05rem;
  font-weight: 300;
}

.dash-project__stack {
  font-size: 0.78rem;
  color: var(--rose-accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dash-project__desc {
  font-size: 0.9rem;
  color: var(--rose-text-soft);
  line-height: 1.5;
  flex: 1;
}

.dash-link {
  font-size: 0.9rem;
  font-weight: 300;
  color: var(--rose-accent-strong);
  text-decoration: none;
  margin-top: 0.25rem;
}

.dash-link:hover {
  text-decoration: underline;
}

.dash-link--muted {
  color: #c18aa7;
  cursor: default;
}

.dash-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.dash-tag {
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  font-size: 0.85rem;
  background: var(--rose-surface-strong);
  border: 1px solid var(--rose-border);
  color: var(--rose-accent-strong);
  box-shadow: 0 10px 20px rgba(227, 182, 206, 0.15);
}

.dash-section--footer {
  min-height: auto;
  padding-bottom: 5rem;
}

.dash-contact {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dash-contact__item {
  font-size: 1.05rem;
  color: var(--rose-accent-strong);
  text-decoration: none;
  word-break: break-word;
}

.dash-contact__item:hover {
  text-decoration: underline;
}
</style>
