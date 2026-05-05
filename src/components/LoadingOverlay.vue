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

<script>
export default {
  name: 'LoadingOverlay',
  props: {
    /** Duración en ms para simular 0→100 (si no se usa progress externo) */
    duration: { type: Number, default: 3500 },
    /** Si se pasa, se usa este valor en lugar del progreso interno */
    progress: { type: Number, default: null }
  },
  emits: ['finished', 'update:progress'],
  data() {
    return {
      internalProgress: 0,
      isComplete: false
    }
  },
  computed: {
    currentProgress() {
      return this.progress !== null ? this.progress : this.internalProgress
    },
    displayPercent() {
      return Math.min(100, Math.round(this.currentProgress))
    },
    isCompleteComputed() {
      return this.currentProgress >= 100
    },
    progressStyle() {
      const p = Math.min(100, this.currentProgress)
      const circumference = 2 * Math.PI * 54
      const offset = circumference - (p / 100) * circumference
      return { strokeDasharray: `${circumference} ${circumference}`, strokeDashoffset: offset }
    }
  },
  watch: {
    isCompleteComputed: {
      handler(v) {
        if (v && !this.isComplete) {
          this.isComplete = true
          this.$emit('update:progress', 100)
          // Dar tiempo a la animación de desvanecido antes de emitir finished
          setTimeout(() => {
            this.$emit('finished')
          }, 800)
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.progress !== null) return
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const p = Math.min(100, (elapsed / this.duration) * 100)
      this.internalProgress = p
      this.$emit('update:progress', p)
      if (p < 100) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }
}
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
  background: rgba(255, 255, 255, 0.12);
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
}

.loader-progress__svg {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.loader-progress__track {
  stroke: rgba(255, 255, 255, 0.2);
}

.loader-progress__fill {
  stroke: rgba(255, 255, 255, 0.9);
  transition: stroke-dashoffset 0.15s linear;
}

/* Spinner circular interno (siempre girando) */
.loader-spinner {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: rgba(255, 255, 255, 0.85);
  border-right-color: rgba(255, 255, 255, 0.4);
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
  color: #fff;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.loader-percent__unit {
  font-size: 1.25rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.9);
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
