<template>
  <Transition name="overlay">
    <div
      class="loading-overlay"
      role="status"
      :aria-label="$t('common.loading.ariaLabel')"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div class="loading-overlay__backdrop" />
      <div class="loading-overlay__content" :class="{ 'loading-overlay__content--complete': isComplete }">
        <!-- Barra de progreso circular grande (0–100 %) -->
        <div class="loader-progress">
          <svg class="loader-progress__svg" viewBox="0 0 120 120">
            <circle
              class="loader-progress__track"
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke-width="8"
            />
            <circle
              class="loader-progress__fill"
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke-width="8"
              stroke-linecap="round"
              :style="progressStyle"
            />
          </svg>
          <!-- Spinner circular interno (siempre girando) -->
          <div class="loader-spinner" />
          <!-- Porcentaje numérico en el centro -->
          <div class="loader-percent">
            <span class="loader-percent__value">{{ displayPercent }}</span>
            <span class="loader-percent__unit">%</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'

const props = defineProps({
  duration: { type: Number, default: 800 },
  progress: { type: Number, default: null }
})

const emit = defineEmits(['finished', 'update:progress'])

const internalProgress = ref(0)
const isComplete = ref(false)

const currentProgress = computed(() => props.progress !== null ? props.progress : internalProgress.value)
const displayPercent = computed(() => Math.min(100, Math.round(currentProgress.value)))
const isCompleteComputed = computed(() => currentProgress.value >= 100)

const progressStyle = computed(() => {
  const p = Math.min(100, currentProgress.value)
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (p / 100) * circumference
  return { strokeDasharray: `${circumference} ${circumference}`, strokeDashoffset: offset }
})

watch(isCompleteComputed, (v) => {
  if (v && !isComplete.value) {
    isComplete.value = true
    emit('update:progress', 100)
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('portfolio:overlay-finished'))
      }
      emit('finished')
    }, 300)
  } else if (!v && isComplete.value) {
    isComplete.value = false
  }
}, { immediate: true })

onMounted(() => {
  if (props.progress !== null) return
  setTimeout(() => {
    internalProgress.value = 100
  }, props.duration)
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Fondo tipo vidrio esmerilado */
.loading-overlay__backdrop {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, rgba(255, 250, 254, 0.82), rgba(255, 241, 247, 0.88));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.loading-overlay__content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.loading-overlay__content--complete {
  opacity: 0;
  transform: scale(0.92);
}

/* Contenedor del progreso + spinner + número */
.loader-progress {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  box-shadow:
    0 26px 60px rgba(214, 123, 165, 0.26),
    inset 0 0 34px rgba(255, 255, 255, 0.32);
}

.loader-progress__svg {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.loader-progress__track {
  stroke: rgba(190, 79, 135, 0.16);
}

.loader-progress__fill {
  stroke: #d46b9e;
  filter: drop-shadow(0 0 10px rgba(217, 70, 239, 0.56));
  transition: stroke-dashoffset 0.15s linear;
}

/* Spinner circular interno (siempre girando) */
.loader-spinner {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: rgba(217, 70, 239, 0.9);
  border-right-color: rgba(244, 114, 182, 0.56);
  box-shadow: 0 0 24px rgba(217, 70, 239, 0.24);
  animation: spin 0.9s linear infinite;
}

/* Número en el centro */
.loader-percent {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.loader-percent__value {
  font-size: 2.25rem;
  font-weight: 300;
  color: #be4f87;
  letter-spacing: -0.02em;
  text-shadow: 0 10px 24px rgba(214, 123, 165, 0.34);
}

.loader-percent__unit {
  font-size: 1.25rem;
  font-weight: 300;
  color: rgba(212, 107, 158, 0.86);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Entrada/salida del overlay */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.35s ease;
}

.overlay-leave-active .loading-overlay__backdrop {
  transition: backdrop-filter 0.4s ease, background 0.4s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
