<template>
  <div ref="sectionRef" class="tcs">
    <div class="tcs__inner">

      <!-- Left column: IDE Window -->
      <div class="tcs__left">
        <div ref="consoleRef" class="tcs-ide">
          <div class="tcs-ide__tabbar">
            <div class="tcs-ide__tabs">
              <span class="tcs-ide__tab active">
                <span class="tcs-ide__tab-dot"></span>
                {{ activeItem?.filename || 'stack.js' }}
                <span class="tcs-ide__tab-close">✕</span>
              </span>
            </div>
            <div class="tcs-ide__win-ctl">
              <span class="tcs-ide__ctl ctl--min"></span>
              <span class="tcs-ide__ctl ctl--max"></span>
              <span class="tcs-ide__ctl ctl--close"></span>
            </div>
          </div>
          <div class="tcs-ide__body">
            <div class="tcs-ide__gutter"></div>
            <div class="tcs-ide__code">
              <div
                v-for="(line, i) in activeLines"
                :key="i"
                class="tcs-ide__line"
                :style="{ animationDelay: i * 20 + 'ms' }"
              >
                <span class="tcs-ide__num">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="tcs-ide__text" v-html="line"></span>
              </div>
            </div>
          </div>
          <div class="tcs-ide__statusbar">
            <span class="tcs-ide__status-item">{{ activeItem?.label || 'Stack' }}</span>
            <span class="tcs-ide__status-item">UTF-8</span>
            <span class="tcs-ide__status-item">Ln {{ activeLines.length }}</span>
          </div>
        </div>
      </div>

      <!-- Center column: Laptop -->
      <div class="tcs__center">
        <div ref="deviceRef" class="tcs-laptop">
          <div class="tcs-laptop__shadow"></div>
          <div class="tcs-laptop__body">
            <div class="tcs-laptop__accent"></div>

            <div class="tcs-laptop__lid">
              <div ref="screenRef" class="tcs-laptop__screen">
                <div class="tcs-laptop__screen-bg"></div>
                <div class="tcs-laptop__screen-content">
                  <div class="tcs-laptop__topbar">
                    <span class="tcs-laptop__topbar-icon">📁</span>
                    <span class="tcs-laptop__topbar-title">stack-viewer</span>
                    <div class="tcs-laptop__topbar-controls">
                      <span class="tcs-laptop__ctl ctl--min"></span>
                      <span class="tcs-laptop__ctl ctl--max"></span>
                      <span class="tcs-laptop__ctl ctl--close"></span>
                    </div>
                  </div>
                  <div class="tcs-laptop__screen-body">
                    <nav class="tcs-laptop__menu">
                      <div
                        v-for="(g, i) in groups"
                        :key="g.key"
                        class="tcs-laptop__menu-item"
                        :class="{ active: i === activeCategoryIndex }"
                        @click="selectCategory(i)"
                      >
                        <span class="tcs-laptop__menu-name">{{ g.label }}</span>
                      </div>
                    </nav>
                    <div class="tcs-laptop__main">
                      <div class="tcs-laptop__card">
                        <div class="tcs-laptop__card-icon" v-html="activeItem?.icon" :style="{ color: activeItem?.accent }"></div>
                        <div class="tcs-laptop__card-title" :style="{ color: activeItem?.accent }">{{ activeItem?.label }}</div>
                        <div class="tcs-laptop__card-version">{{ activeItem?.version }}</div>
                        <div class="tcs-laptop__card-code">
                          <div
                            v-for="(line, i) in (activeItem?.lines || []).slice(0, 3)"
                            :key="i"
                            class="tcs-laptop__card-line"
                            v-html="line"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="tcs-laptop__dots">
                    <span
                      v-for="(item, i) in activeItems"
                      :key="item.id"
                      class="tcs-laptop__dot"
                      :class="{ active: i === activeItemIndex }"
                      :style="{ '--dot-color': item.accent }"
                      @click="activeItemIndex = i; syncBubbles()"
                    ></span>
                  </div>
                </div>
              </div>
            </div>

            <div class="tcs-laptop__chin"></div>
          </div>
        </div>
      </div>

      <!-- Right column: Bubbles -->
      <div ref="bubbleAreaRef" class="tcs__right">
        <div
          v-for="(item, i) in activeItems"
          :key="item.id"
          :ref="(el) => { if (el) bubbleEls[i] = el }"
          class="tcs-bubble"
          :class="{
            'tcs-bubble--active': i === activeItemIndex,
            'tcs-bubble--idle': i !== activeItemIndex
          }"
          :style="getBubbleStyle(item, i)"
          @mouseenter="onBubbleEnter(i)"
        >
          <div class="tcs-bubble__icon" v-html="item.icon"></div>
          <span class="tcs-bubble__label">{{ item.label }}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import { useI18n } from 'vue-i18n'
import { useContent } from '@/content/useContent'
import { stackOrbs } from '@/content/stackOrbs'

const sectionRef = ref(null)
const consoleRef = ref(null)
const deviceRef = ref(null)
const screenRef = ref(null)
const bubbleAreaRef = ref(null)

const { locale } = useI18n({ useScope: 'global' })
const { getStackGroups, getStackOrbs } = useContent()

const activeCategoryIndex = ref(0)
const activeItemIndex = ref(0)
const bubbleEls = ref([])
let bubbleTweens = []

const orbContent = stackOrbs

const groups = computed(() => getStackGroups(locale.value))
const allOrbs = computed(() => getStackOrbs(locale.value))

const activeGroup = computed(() => groups.value[activeCategoryIndex.value] || null)
const activeItems = computed(() => {
  const group = activeGroup.value
  if (!group) return []
  return allOrbs.value
    .filter(o => o.group === group.key)
    .map(o => ({
      ...o,
      ...(orbContent[o.id] || {}),
      accent: o.accent || '#7ad6ff',
      glow: o.glow || 'rgba(122, 214, 255, 0.35)'
    }))
})
const activeItem = computed(() => activeItems.value[activeItemIndex.value] || null)
const activeLines = computed(() => activeItem.value?.lines || [])

function selectCategory(i) {
  activeCategoryIndex.value = i
  activeItemIndex.value = 0
  nextTick(() => {
    syncBubbles()
    killBubbleFloat()
    initBubbleFloat()
  })
}

function syncBubbles() {
  const active = activeItemIndex.value
  Object.keys(bubbleEls.value).forEach((key) => {
    const el = bubbleEls.value[key]
    if (!el) return
    const i = Number(key)
    el.classList.toggle('tcs-bubble--active', i === active)
    el.classList.toggle('tcs-bubble--idle', i !== active)
    gsap.to(el, {
      scale: i === active ? 1.18 : 1,
      opacity: i === active ? 1 : 0.3,
      duration: 0.45,
      ease: 'power2.out',
      overwrite: 'auto'
    })
  })
}

function onBubbleEnter(i) {
  activeItemIndex.value = i
  syncBubbles()
}

function getBubbleStyle(item, i) {
  const count = activeItems.value.length
  const center = (count - 1) / 2
  const yOffset = window.innerWidth <= 860 ? 0 : (i - center) * 60
  return {
    '--bubble-accent': item.accent,
    '--bubble-glow': item.glow,
    '--bubble-x': '0px',
    '--bubble-y': yOffset + 'px',
    transitionDelay: (i * 0.12) + 's'
  }
}

function initBubbleFloat() {
  if (window.innerWidth <= 860) return
  const els = bubbleEls.value.filter(Boolean)
  if (!els.length) return
  els.forEach((el, i) => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true, delay: i * 0.4 })
    tl.to(el, {
      y: -8 + i * 3,
      x: 6 - i * 3,
      duration: 2.8 + i * 0.4,
      ease: 'sine.inOut'
    })
    bubbleTweens.push(tl)
  })
}

function killBubbleFloat() {
  bubbleTweens.forEach((tl) => tl.kill())
  bubbleTweens = []
}

onMounted(() => {
  nextTick(() => {
    initBubbleFloat()
  })
})

onBeforeUnmount(() => {
  killBubbleFloat()
})
</script>

<style scoped>
.tcs {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem;
}

.tcs__inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: stretch;
  gap: 0;
  min-height: 640px;
}

.tcs__left {
  flex: 0 0 30%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 0;
}

.tcs__center {
  flex: 0 0 62%;
  margin-left: -8%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 0.5rem;
  position: relative;
  z-index: 3;
}

/* ── IDE Window ── */
.tcs-ide {
  width: 100%;
  max-width: 100%;
  background: rgba(10, 8, 16, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 28px 56px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(97, 218, 251, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(4px);
  position: relative;
  z-index: 1;
}

.tcs-ide__tabbar {
  display: flex;
  align-items: center;
  height: 28px;
  background: rgba(6, 5, 12, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.tcs-ide__tabs {
  flex: 1;
  display: flex;
  align-items: stretch;
  overflow: hidden;
}

.tcs-ide__tab {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 10px;
  font-size: 0.58rem;
  font-family: 'JetBrains Mono', monospace;
  color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.02);
  border-right: 1px solid rgba(255, 255, 255, 0.04);
  white-space: nowrap;
  user-select: none;
}

.tcs-ide__tab.active {
  color: rgba(255, 255, 255, 0.75);
  background: transparent;
  border-bottom: 2px solid #ff14a2;
}

.tcs-ide__tab-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff14a2;
  flex-shrink: 0;
}

.tcs-ide__tab-close {
  font-size: 0.5rem;
  color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  margin-left: 2px;
}

.tcs-ide__tab-close:hover {
  color: rgba(255, 255, 255, 0.6);
}

.tcs-ide__win-ctl {
  display: flex;
  gap: 4px;
  padding: 0 8px;
  align-items: center;
}

.tcs-ide__ctl {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.tcs-ide__body {
  display: flex;
  min-height: 240px;
}

.tcs-ide__gutter {
  width: 3px;
  background: rgba(255, 20, 162, 0.06);
  flex-shrink: 0;
}

.tcs-ide__code {
  flex: 1;
  padding: 10px 10px 10px 6px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.7rem;
  line-height: 1.7;
  overflow: hidden;
}

.tcs-ide__line {
  display: flex;
  gap: 8px;
  white-space: pre;
  opacity: 0;
  animation: tcs-line-in 0.3s ease-out forwards;
}

@keyframes tcs-line-in {
  to { opacity: 1; }
}

.tcs-ide__num {
  color: rgba(255, 255, 255, 0.1);
  font-size: 0.6rem;
  min-width: 2em;
  text-align: right;
  user-select: none;
}

.tcs-ide__text {
  color: rgba(238, 255, 255, 0.82);
}

.tcs-ide__statusbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 3px 10px;
  background: rgba(6, 5, 12, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  color: rgba(255, 255, 255, 0.15);
  user-select: none;
}

.tcs-ide__status-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tcs-ide__status-item:not(:last-child)::after {
  content: '';
  width: 1px;
  height: 8px;
  background: rgba(255, 255, 255, 0.06);
  margin-left: 12px;
}

/* ── Laptop ── */
.tcs-laptop {
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tcs-laptop__shadow {
  position: absolute;
  bottom: -6%;
  left: 4%;
  right: 4%;
  height: 20%;
  background: radial-gradient(ellipse at 50% 100%, rgba(0, 0, 0, 0.35), transparent 70%);
  filter: blur(20px);
  z-index: 0;
}

.tcs-laptop__body {
  position: relative;
  width: 100%;
  perspective: 1200px;
}

.tcs-laptop__accent {
  position: absolute;
  top: -1px;
  left: 10%;
  right: 10%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #ff14a2, #7ad6ff, transparent);
  border-radius: 2px;
  z-index: 5;
  will-change: filter, transform;
}

.tcs-laptop__lid {
  position: relative;
  width: 100%;
  padding-bottom: 65%;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(22, 20, 36, 0.96), rgba(16, 14, 26, 0.96));
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: visible;
  box-shadow:
    0 12px 48px rgba(0, 0, 0, 0.4),
    0 0 80px rgba(97, 218, 251, 0.02);
  transform: rotateX(2deg);
}

/* Top edge — visible thickness when tilted */
.tcs-laptop__lid::before {
  content: '';
  position: absolute;
  top: -12px;
  left: 4%;
  right: 4%;
  height: 12px;
  background: linear-gradient(180deg, rgba(18, 16, 28, 0.8), rgba(22, 20, 36, 0.95));
  border-radius: 4px 4px 0 0;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-bottom: none;
  transform: rotateX(-90deg);
  transform-origin: bottom center;
}

/* Bottom edge — visible thickness */
.tcs-laptop__lid::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 4%;
  right: 4%;
  height: 10px;
  background: linear-gradient(180deg, rgba(16, 14, 26, 0.95), rgba(12, 10, 20, 0.7));
  border-radius: 0 0 4px 4px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-top: none;
  transform: rotateX(-90deg);
  transform-origin: top center;
}

/* Side edges */
.tcs-laptop__lid .tcs-laptop__screen::before {
  content: '';
  position: absolute;
  top: 0;
  left: -8px;
  width: 8px;
  height: 100%;
  background: linear-gradient(180deg, rgba(18, 16, 28, 0.9), rgba(14, 12, 22, 0.9));
  border-radius: 4px 0 0 4px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-right: none;
  z-index: 0;
}

.tcs-laptop__lid .tcs-laptop__screen::after {
  content: '';
  position: absolute;
  top: 0;
  right: -8px;
  width: 8px;
  height: 100%;
  background: linear-gradient(180deg, rgba(14, 12, 24, 0.85), rgba(10, 8, 18, 0.85));
  border-radius: 0 4px 4px 0;
  border: 1px solid rgba(255, 255, 255, 0.02);
  border-left: none;
  z-index: 0;
}

.tcs-laptop__screen {
  position: absolute;
  inset: 8px;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(4, 5, 10, 0.98);
  box-shadow:
    inset 0 0 60px rgba(0, 0, 0, 0.8),
    0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.tcs-laptop__screen-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 30%, rgba(97, 218, 251, 0.035), transparent 60%),
    radial-gradient(ellipse at 50% 70%, rgba(255, 20, 162, 0.02), transparent 50%),
    linear-gradient(180deg, rgba(8, 6, 18, 0.98), rgba(6, 5, 14, 0.98));
}

.tcs-laptop__screen-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 5% 4%;
}

/* ── Top Bar ── */
.tcs-laptop__topbar {
  display: flex;
  align-items: center;
  padding: 0 6px;
  height: 28px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.tcs-laptop__topbar-title {
  flex: 1;
  text-align: center;
  font-size: 0.55rem;
  font-family: 'JetBrains Mono', monospace;
  color: rgba(255, 255, 255, 0.2);
  letter-spacing: 0.04em;
  user-select: none;
}

.tcs-laptop__topbar-icon {
  font-size: 0.65rem;
  line-height: 1;
  user-select: none;
}

.tcs-laptop__topbar-controls {
  display: flex;
  gap: 4px;
  align-items: center;
}

.tcs-laptop__ctl {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.ctl--min { background: #ffbd2e; }
.ctl--max { background: #27c93f; }
.ctl--close { background: #ff5f56; }

/* ── Screen Body: sidebar + content ── */
.tcs-laptop__screen-body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.tcs-laptop__menu {
  width: 50%;
  max-width: 280px;
  background: rgba(12, 10, 22, 0.97);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  flex-shrink: 0;
}

.tcs-laptop__menu-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-left: 3px solid transparent;
}

.tcs-laptop__menu-item:hover {
  background: rgba(255, 255, 255, 0.04);
}

.tcs-laptop__menu-item.active {
  background: rgba(255, 255, 255, 0.06);
  border-left-color: var(--item-accent, #ff14a2);
}

.tcs-laptop__menu-name {
  font-size: 0.65rem;
  font-family: 'JetBrains Mono', monospace;
  color: rgba(255, 255, 255, 0.65);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tcs-laptop__menu-item.active .tcs-laptop__menu-name {
  color: var(--item-accent, #ff14a2);
}

/* ── Main Content Card ── */
.tcs-laptop__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2% 6% 4%;
  gap: 6px;
  min-height: 0;
}

.tcs-laptop__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 100%;
  text-align: center;
}

.tcs-laptop__card-icon {
  width: 36px;
  height: 36px;
  margin-bottom: 4px;
}

.tcs-laptop__card-title {
  font-size: 0.7rem;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  letter-spacing: 0.04em;
  transition: color 0.4s ease;
}

.tcs-laptop__card-version {
  font-size: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  color: rgba(255, 255, 255, 0.2);
  letter-spacing: 0.06em;
}

.tcs-laptop__card-code {
  width: 100%;
  margin-top: 8px;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.5rem;
  line-height: 1.6;
  text-align: left;
  overflow: hidden;
}

.tcs-laptop__card-line {
  white-space: pre;
  opacity: 0.75;
}

/* ── Page Dots ── */
.tcs-laptop__dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 6px 0 6px;
  flex-shrink: 0;
}

.tcs-laptop__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
}

.tcs-laptop__dot.active {
  background: var(--dot-color, #ff14a2);
  box-shadow: 0 0 10px var(--dot-color, transparent);
  width: 22px;
  border-radius: 2px;
}

/* Chin (bottom bezel) */
.tcs-laptop__chin {
  width: 90%;
  height: 16px;
  margin: -1px auto 0;
  background: linear-gradient(180deg, rgba(18, 16, 28, 0.9), rgba(22, 20, 34, 0.6));
  border-radius: 0 0 8px 8px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-top: none;
  position: relative;
  z-index: 1;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* ── Right Column: Bubbles ── */
.tcs__right {
  flex: 0 0 18%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  min-height: 320px;
}

.tcs-bubble {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 18px 22px 14px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  cursor: pointer;
  z-index: 5;
  will-change: transform, opacity;
  user-select: none;
  transition:
    border-color 0.4s ease,
    box-shadow 0.4s ease;
  transform: translate(var(--bubble-x, 0), var(--bubble-y, 0));
}

.tcs-bubble:hover {
  border-color: var(--bubble-accent, rgba(255, 255, 255, 0.15));
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.2),
    0 0 30px var(--bubble-glow, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
}

.tcs-bubble--active {
  border-color: var(--bubble-accent, rgba(255, 20, 162, 0.3));
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.25),
    0 0 40px var(--bubble-glow, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.07);
}

.tcs-bubble__icon {
  width: 38px;
  height: 38px;
  color: var(--bubble-accent, #fff);
  transition: color 0.4s ease;
}

.tcs-bubble--active .tcs-bubble__icon {
  filter: drop-shadow(0 0 8px var(--bubble-glow, transparent));
}

.tcs-bubble__label {
  font-size: 0.65rem;
  font-family: 'JetBrains Mono', monospace;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  transition: color 0.4s ease;
}

.tcs-bubble--active .tcs-bubble__label {
  color: var(--bubble-accent, #fff);
}

/* ── Responsive ── */
@media (max-width: 860px) {
  .tcs {
    padding: 1.5rem 0.75rem;
  }

  .tcs__inner {
    flex-direction: column;
    align-items: center;
    min-height: auto;
    gap: 0.5rem;
  }

  .tcs__left {
    flex: none;
    width: 100%;
    padding-top: 0;
    align-items: center;
  }

  .tcs__center {
    flex: none;
    width: 100%;
    margin-left: 0;
    align-items: center;
  }

  .tcs-laptop {
    max-width: 520px;
  }

  .tcs__right {
    flex: none;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    min-height: auto;
    padding: 0.5rem 0 0;
  }

  .tcs-bubble {
    transform: none !important;
    padding: 12px 16px 10px;
  }

  .tcs-bubble__icon {
    width: 28px;
    height: 28px;
  }

  .tcs-bubble__label {
    font-size: 0.55rem;
  }

  .tcs-ide__body {
    min-height: 0;
    max-height: 180px;
  }

  .tcs-ide__code {
    font-size: 0.68rem;
    padding: 8px 10px;
  }
}

@media (max-width: 640px) {
  .tcs-laptop__screen-body {
    flex-direction: column;
  }

  .tcs-laptop__menu {
    width: 100%;
    max-width: 100%;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 2px 0;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .tcs-laptop__menu::-webkit-scrollbar {
    display: none;
  }

  .tcs-laptop__menu-item {
    padding: 6px 10px;
    border-left: none;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .tcs-laptop__menu-item.active {
    border-left-color: transparent;
    border-bottom-color: var(--item-accent, #ff14a2);
  }

  .tcs-laptop__main {
    padding: 4% 4% 6%;
  }

  .tcs-laptop__card-icon {
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 480px) {
  .tcs {
    padding: 1rem 0.5rem;
  }

  .tcs-ide__body {
    min-height: 0;
    max-height: 140px;
  }

  .tcs-ide__code {
    font-size: 0.55rem;
    padding: 6px 8px;
    line-height: 1.6;
  }

  .tcs-ide__num {
    font-size: 0.45rem;
    min-width: 1.3em;
  }

  .tcs-laptop {
    max-width: 440px;
  }

  .tcs__right {
    gap: 0.5rem;
  }

  .tcs-bubble {
    padding: 8px 12px 6px;
    gap: 3px;
    border-radius: 14px;
  }

  .tcs-bubble__icon {
    width: 22px;
    height: 22px;
  }

  .tcs-bubble__label {
    font-size: 0.48rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tcs-ide__line {
    animation: none;
    opacity: 1;
  }
}
</style>
