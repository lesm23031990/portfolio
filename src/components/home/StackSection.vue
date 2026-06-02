<template>
  <div id="stack" class="stack-stage" @mouseleave="setActiveGroup(defaultGroup)">
    <div class="stack-console">
      <div class="stack-console__body">
        <div class="stack-stage__grid">
          <div class="stack-copy">
            <header class="stack-copy__header">
              <p class="stack-copy__eyebrow">{{ t('home.sections.stack.title') }}</p>
              <h3 class="stack-copy__title">{{ t('home.stackScene.title') }}</h3>
              <p class="stack-copy__sub">{{ t('home.stackScene.subtitle') }}</p>
            </header>

            <div class="stack-legend" role="tablist" :aria-label="t('home.sections.stack.title')">
              <button
                v-for="(group, index) in stackGroups"
                :key="group.key"
                type="button"
                class="stack-legend__item"
                :class="{ 'stack-legend__item--active': activeGroup === group.key }"
                @mouseenter="setActiveGroup(group.key)"
                @focus="setActiveGroup(group.key)"
                @click="setActiveGroup(group.key)"
              >
                <span class="stack-legend__command">$ {{ String(index + 1).padStart(2, '0') }}</span>
                <span class="stack-legend__label">{{ group.label }}</span>
                <span class="stack-legend__desc">{{ group.description }}</span>
              </button>
            </div>

            <div class="stack-certifications">
              <p class="stack-certifications__eyebrow">{{ t('home.sections.certifications.title') }}</p>
              <p class="stack-certifications__headline">{{ t('home.certifications.headline') }}</p>
              <article class="stack-certifications__card">
                <span class="stack-certifications__issuer">{{ t('home.certifications.items.primary.issuer') }}</span>
                <strong class="stack-certifications__title">{{ t('home.certifications.items.primary.title') }}</strong>
                <span class="stack-certifications__meta">{{ t('home.certifications.items.primary.meta') }}</span>
              </article>
            </div>
          </div>

          <div class="stack-space">
            <div class="stack-space__hud">
              <span class="stack-space__eyebrow">ACTIVE LAYER</span>
              <strong class="stack-space__title">{{ activeStackGroup.label }}</strong>
              <span class="stack-space__desc">{{ activeStackGroup.description }}</span>
            </div>
            <div class="stack-space__floor"></div>
            <button
              v-for="orb in orbs"
              :key="orb.id"
              type="button"
              class="stack-orb"
              :class="{
                'stack-orb--active': activeGroup === orb.group,
                'stack-orb--muted': activeGroup !== orb.group
              }"
              :style="orb.style"
              @mouseenter="setActiveGroup(orb.group)"
              @focus="setActiveGroup(orb.group)"
            >
              <span class="stack-orb__shadow"></span>
              <span class="stack-orb__core">
                <span class="stack-orb__label">{{ orb.label }}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

const defaultGroup = 'frontend'
const activeGroup = ref(defaultGroup)

const stackGroups = computed(() => [
  {
    key: 'frontend',
    label: t('home.stackScene.groups.frontend.label'),
    description: t('home.stackScene.groups.frontend.description')
  },
  {
    key: 'backend',
    label: t('home.stackScene.groups.backend.label'),
    description: t('home.stackScene.groups.backend.description')
  },
  {
    key: 'apis',
    label: t('home.stackScene.groups.apis.label'),
    description: t('home.stackScene.groups.apis.description')
  },
  {
    key: 'data',
    label: t('home.stackScene.groups.data.label'),
    description: t('home.stackScene.groups.data.description')
  },
  {
    key: 'ux',
    label: t('home.stackScene.groups.ux.label'),
    description: t('home.stackScene.groups.ux.description')
  },
  {
    key: 'workflow',
    label: t('home.stackScene.groups.workflow.label'),
    description: t('home.stackScene.groups.workflow.description')
  }
])

const activeStackGroup = computed(() => (
  stackGroups.value.find((group) => group.key === activeGroup.value) || stackGroups.value[0]
))

const orbBlueprints = [
  { id: 'orb-vue', group: 'frontend', labelKey: 'home.stackTags.vue', x: '14%', y: '20%', size: '10rem', accent: '#7ad6ff', glow: '#2d8cff', delay: '0s' },
  { id: 'orb-js', group: 'frontend', labelKey: 'home.stackTags.javascript', x: '38%', y: '8%', size: '8rem', accent: '#ffd166', glow: '#ff9b54', delay: '-1.1s' },
  { id: 'orb-laravel', group: 'backend', labelKey: 'home.stackTags.laravel', x: '64%', y: '18%', size: '11rem', accent: '#ff5c7a', glow: '#ff33d4', delay: '-0.8s' },
  { id: 'orb-api', group: 'apis', labelKey: 'home.stackTags.rest', x: '78%', y: '44%', size: '8.5rem', accent: '#5cf2ff', glow: '#7ad6ff', delay: '-2.1s' },
  { id: 'orb-db', group: 'data', labelKey: 'home.stackTags.postgresql', x: '28%', y: '54%', size: '12rem', accent: '#6df7c8', glow: '#0bd39c', delay: '-1.7s' },
  { id: 'orb-mysql', group: 'data', labelKey: 'home.stackTags.mysql', x: '52%', y: '58%', size: '7.4rem', accent: '#84b6ff', glow: '#4b7bff', delay: '-0.4s' },
  { id: 'orb-ui', group: 'ux', labelKey: 'home.stackTags.htmlCss', x: '10%', y: '70%', size: '8.2rem', accent: '#ff8df6', glow: '#c950ff', delay: '-1.5s' },
  { id: 'orb-flow', group: 'workflow', labelKey: 'home.stackTags.scrum', x: '70%', y: '74%', size: '9rem', accent: '#b4ff8a', glow: '#3ed17f', delay: '-2.6s' }
]

const orbs = computed(() =>
  orbBlueprints.map((orb) => ({
    ...orb,
    label: t(orb.labelKey),
    style: {
      '--orb-size': orb.size,
      '--orb-accent': orb.accent,
      '--orb-glow': orb.glow,
      '--orb-x': orb.x,
      '--orb-y': orb.y,
      '--orb-delay': orb.delay
    }
  }))
)

function setActiveGroup(group) {
  activeGroup.value = group
}
</script>

<style scoped>
.stack-stage {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100%;
  padding: 0;
}

.stack-console {
  height: 100%;
  border-radius: 24px;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(8, 10, 16, 0.6), rgba(5, 7, 12, 0.4));
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.stack-console__body {
  height: 100%;
  padding: 2rem;
}

.stack-stage__grid {
  width: 100%;
  height: 100%;
  min-height: 100%;
  display: grid;
  grid-template-columns: minmax(17rem, 0.74fr) minmax(0, 1.26fr);
  gap: clamp(2rem, 5vw, 4rem);
  align-items: stretch;
}

.stack-copy {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 1.6rem;
}

.stack-copy__eyebrow {
  margin: 0 0 0.75rem;
  font-size: 0.68rem;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: rgba(122, 214, 255, 0.82);
}

.stack-copy__title {
  margin: 0;
  font-size: clamp(1.2rem, 1.9vw, 1.55rem);
  line-height: 1.28;
  font-weight: 500;
  color: var(--cine-text);
  max-width: 16ch;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-shadow:
    0 0 16px rgba(255, 51, 212, 0.16),
    0 0 28px rgba(122, 214, 255, 0.08);
}

.stack-copy__sub {
  margin: 1rem 0 0;
  color: var(--cine-text-soft);
  line-height: 1.78;
  letter-spacing: 0.03em;
  max-width: 28rem;
  font-size: 0.86rem;
}

.stack-legend {
  display: grid;
  align-content: start;
  gap: 0.85rem;
}

.stack-legend__item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.35rem 0.95rem;
  text-align: left;
  align-items: start;
  padding: 1rem 1.05rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background:
    linear-gradient(135deg, rgba(255, 51, 212, 0.07), rgba(122, 214, 255, 0.035)),
    rgba(255, 255, 255, 0.02);
  color: var(--cine-text);
  cursor: pointer;
  box-shadow:
    0 18px 36px rgba(0, 0, 0, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition:
    transform 0.35s ease,
    border-color 0.35s ease,
    color 0.35s ease,
    box-shadow 0.35s ease;
}

.stack-legend__item:hover,
.stack-legend__item:focus-visible,
.stack-legend__item--active {
  transform: translateY(-2px);
  border-color: rgba(255, 51, 212, 0.28);
  color: #ffffff;
  box-shadow:
    0 22px 50px rgba(0, 0, 0, 0.24),
    0 0 30px rgba(255, 51, 212, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.stack-legend__command {
  grid-row: 1 / span 2;
  align-self: center;
  font-family: monospace;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  color: rgba(255, 51, 212, 0.82);
}

.stack-legend__label {
  font-size: 0.88rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.stack-legend__desc {
  color: var(--cine-text-soft);
  line-height: 1.72;
  font-size: 0.8rem;
}

.stack-certifications {
  display: grid;
  gap: 0.8rem;
  align-content: end;
}

.stack-certifications__eyebrow {
  margin: 0;
  font-size: 0.66rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(122, 214, 255, 0.82);
}

.stack-certifications__card {
  display: grid;
  gap: 0.5rem;
  padding: 1.05rem 1.1rem;
  border-radius: 18px;
  border: 1px solid rgba(255, 51, 212, 0.14);
  background:
    linear-gradient(135deg, rgba(255, 51, 212, 0.07), rgba(122, 214, 255, 0.04)),
    rgba(255, 255, 255, 0.02);
  box-shadow:
    0 24px 44px rgba(0, 0, 0, 0.18),
    0 0 24px rgba(255, 51, 212, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.stack-certifications__headline {
  margin: 0;
  color: var(--cine-text-soft);
  line-height: 1.72;
  font-size: 0.8rem;
}

.stack-certifications__issuer {
  font-size: 0.64rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--cine-text-soft);
}

.stack-certifications__title {
  font-size: 0.86rem;
  line-height: 1.68;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--cine-text);
}

.stack-certifications__meta {
  color: var(--cine-text-soft);
  line-height: 1.72;
  font-size: 0.78rem;
}

.stack-space {
  position: relative;
  min-height: 100%;
  overflow: visible;
  perspective: 1400px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: linear-gradient(180deg, rgba(8, 10, 16, 0.6), rgba(6, 8, 12, 0.5));
}

.stack-space::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 20%, rgba(255, 51, 212, 0.04), transparent 16%),
    radial-gradient(circle at 80% 26%, rgba(122, 214, 255, 0.04), transparent 18%);
  pointer-events: none;
}

.stack-space::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 18% 26%, rgba(255, 255, 255, 0.1) 0 1px, transparent 2px),
    radial-gradient(circle at 52% 14%, rgba(255, 255, 255, 0.08) 0 1px, transparent 2px),
    radial-gradient(circle at 74% 62%, rgba(255, 255, 255, 0.09) 0 1px, transparent 2px),
    radial-gradient(circle at 34% 80%, rgba(255, 255, 255, 0.06) 0 1px, transparent 2px);
  opacity: 0.4;
  pointer-events: none;
}

.stack-space__hud {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
  display: grid;
  gap: 0.35rem;
  max-width: 16rem;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(8, 10, 16, 0.58);
  backdrop-filter: blur(14px);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.24);
}

.stack-space__eyebrow {
  font-size: 0.62rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(122, 214, 255, 0.82);
}

.stack-space__title {
  color: var(--cine-text);
  font-size: 0.88rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.stack-space__desc {
  color: var(--cine-text-soft);
  line-height: 1.72;
  font-size: 0.78rem;
}

.stack-space__floor {
  position: absolute;
  left: 8%;
  right: 6%;
  bottom: 8%;
  height: 22%;
  border-radius: 999px;
  background:
    radial-gradient(circle at center, rgba(122, 214, 255, 0.12), transparent 45%),
    radial-gradient(circle at center, rgba(255, 51, 212, 0.12), transparent 60%);
  filter: blur(28px);
  opacity: 0.68;
  pointer-events: none;
}

.stack-orb {
  position: absolute;
  top: var(--orb-y);
  left: var(--orb-x);
  width: var(--orb-size);
  height: var(--orb-size);
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  transform: translate(-50%, -50%) translateZ(0);
  animation: orb-drift 7s ease-in-out infinite;
  animation-delay: var(--orb-delay);
  transition:
    transform 0.45s ease,
    opacity 0.45s ease,
    filter 0.45s ease;
}

.stack-orb__shadow {
  position: absolute;
  left: 50%;
  bottom: -18%;
  width: 70%;
  height: 18%;
  transform: translateX(-50%);
  border-radius: 999px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.42), transparent 68%);
  filter: blur(10px);
  opacity: 0.74;
}

.stack-orb__core {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
  background:
    radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.1) 24%, transparent 44%),
    radial-gradient(circle at 40% 35%, var(--orb-accent), var(--orb-glow) 40%, rgba(8, 12, 18, 0.8) 100%);
  box-shadow:
    0 12px 24px rgba(0, 0, 0, 0.2),
    0 0 16px color-mix(in srgb, var(--orb-glow) 40%, transparent);
}

.stack-orb__core::after {
  content: '';
  position: absolute;
  inset: 22%;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.stack-orb__label {
  position: relative;
  z-index: 1;
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.45;
}

.stack-orb--muted {
  opacity: 0.44;
  filter: saturate(0.82);
}

.stack-orb--active,
.stack-orb:hover,
.stack-orb:focus-visible {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.14) translateZ(60px);
  z-index: 3;
}

@keyframes orb-drift {
  0%,
  100% {
    translate: 0 -6px;
  }

  50% {
    translate: 0 8px;
  }
}

@media (max-width: 980px) {
  .stack-console__body {
    height: auto;
  }

  .stack-stage__grid {
    grid-template-columns: 1fr;
  }

  .stack-space {
    min-height: 26rem;
  }
}

@media (max-width: 640px) {
  .stack-stage {
    padding-top: 0.5rem;
  }

  .stack-orb {
    width: calc(var(--orb-size) * 0.8);
    height: calc(var(--orb-size) * 0.8);
  }
}

@media (prefers-reduced-motion: reduce) {
  .stack-orb {
    animation: none;
  }
}
</style>