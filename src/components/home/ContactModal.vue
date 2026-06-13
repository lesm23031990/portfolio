<template>
  <Teleport to="body">
    <div class="contact-modal-overlay" @click.self="$emit('close')">
      <div class="contact-modal" role="dialog" :aria-label="t('contactForm.modalTitle')">
        <div class="contact-modal__header">
          <h3 class="contact-modal__title">{{ t('contactForm.modalTitle') }}</h3>
          <button type="button" class="contact-modal__close" :aria-label="t('contactForm.close')" @click="$emit('close')">
            &times;
          </button>
        </div>

        <div class="contact-modal__recipient">
          {{ t('contactForm.toLabel') }}: <strong>{{ contactEmail }}</strong>
        </div>

        <form class="contact-modal__form" @submit.prevent="handleSubmit">
          <div class="contact-modal__field">
            <label class="contact-modal__label" for="cf-name">{{ t('contactForm.nameLabel') }}</label>
            <input
              id="cf-name"
              v-model.trim="form.name"
              class="contact-modal__input"
              :class="{ 'contact-modal__input--error': errors.name }"
              :placeholder="t('contactForm.namePlaceholder')"
              type="text"
            />
            <p v-if="errors.name" class="contact-modal__error">{{ errors.name }}</p>
          </div>

          <div class="contact-modal__field">
            <label class="contact-modal__label" for="cf-email">{{ t('contactForm.emailLabel') }}</label>
            <input
              id="cf-email"
              v-model.trim="form.email"
              class="contact-modal__input"
              :class="{ 'contact-modal__input--error': errors.email }"
              :placeholder="t('contactForm.emailPlaceholder')"
              type="email"
            />
            <p v-if="errors.email" class="contact-modal__error">{{ errors.email }}</p>
          </div>

          <template v-if="!schedule">
            <div class="contact-modal__field">
              <label class="contact-modal__label" for="cf-subject">{{ t('contactForm.subjectLabel') }}</label>
              <input
                id="cf-subject"
                v-model.trim="form.subject"
                class="contact-modal__input"
                :class="{ 'contact-modal__input--error': errors.subject }"
                :placeholder="t('contactForm.subjectPlaceholder')"
                type="text"
              />
              <p v-if="errors.subject" class="contact-modal__error">{{ errors.subject }}</p>
            </div>

            <div class="contact-modal__field">
              <label class="contact-modal__label" for="cf-message">{{ t('contactForm.messageLabel') }}</label>
              <textarea
                id="cf-message"
                v-model.trim="form.message"
                class="contact-modal__textarea"
                :class="{ 'contact-modal__input--error': errors.message }"
                :placeholder="t('contactForm.messagePlaceholder')"
                rows="5"
              ></textarea>
              <p v-if="errors.message" class="contact-modal__error">{{ errors.message }}</p>
            </div>
          </template>

          <button
            type="submit"
            class="contact-modal__submit"
            :disabled="sending"
          >
            {{ sending ? t('contactForm.sending') : (schedule ? t('contactForm.scheduleSend') : t('contactForm.send')) }}
          </button>

          <p v-if="feedback" class="contact-modal__feedback" :class="feedback.type">
            <template v-if="feedback.link">
              {{ feedback.text }} <a :href="feedback.link" target="_blank" rel="noopener noreferrer" class="contact-modal__link">{{ feedback.link }}</a>
            </template>
            <template v-else>
              {{ feedback.text }}
            </template>
          </p>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { sendContactForm } from '@/services/email'

const props = defineProps({
  schedule: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

const { t, locale, messages } = useI18n({ useScope: 'global' })

const contactEmail = computed(() => {
  const raw = messages.value?.[locale.value]?.home?.contact?.email
  return typeof raw === 'string' ? raw : ''
})

const contactScheduleUrl = computed(() => messages.value?.[locale.value]?.home?.contact?.scheduleUrl || 'https://calendly.com/lorena-dev-231990/30min')

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const sending = ref(false)
const feedback = ref(null)

onMounted(() => {
  nextTick(() => document.getElementById('cf-name')?.focus())
  document.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown)
})

function onKeyDown(e) {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'Tab') trapFocus(e)
}

function trapFocus(e) {
  const modal = document.querySelector('.contact-modal')
  if (!modal) return
  const focusable = modal.querySelectorAll('button, input, textarea, select, [tabindex]:not([tabindex="-1"])')
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  let valid = true
  errors.name = ''
  errors.email = ''
  errors.subject = ''
  errors.message = ''

  if (!form.name) {
    errors.name = t('contactForm.validation.nameRequired')
    valid = false
  }
  if (!form.email) {
    errors.email = t('contactForm.validation.emailRequired')
    valid = false
  } else if (!emailRegex.test(form.email)) {
    errors.email = t('contactForm.validation.emailInvalid')
    valid = false
  }
  if (!props.schedule) {
    if (!form.subject) {
      errors.subject = t('contactForm.validation.subjectRequired')
      valid = false
    }
    if (!form.message) {
      errors.message = t('contactForm.validation.messageRequired')
      valid = false
    } else if (form.message.length < 10) {
      errors.message = t('contactForm.validation.messageMin')
      valid = false
    }
  }

  return valid
}

async function handleSubmit() {
  if (!validate()) return

  sending.value = true
  feedback.value = null

  try {
    const subject = props.schedule ? 'Quiero agendar una videollamada' : form.subject
    const message = props.schedule
      ? `El usuario ${form.name} (${form.email}) solicita agendar una videollamada.`
      : form.message

    await sendContactForm({
      from_name: form.name,
      from_email: form.email,
      subject,
      message,
      schedule: props.schedule,
      contactEmail: contactEmail.value,
    })
    feedback.value = props.schedule
      ? { type: 'success', text: `${t('contactForm.success')} ${t('contactForm.scheduleSuccess')}:`, link: contactScheduleUrl.value }
      : { type: 'success', text: t('contactForm.success') }
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch (err) {
    const msg = err?.message || err?.text || t('contactForm.error')
    feedback.value = { type: 'error', text: msg }
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.contact-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(15, 8, 12, 0.55);
  backdrop-filter: blur(8px);
}

.contact-modal {
  width: min(36rem, calc(100vw - 2rem));
  max-height: calc(100vh - 3rem);
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 20px;
  border: 1px solid var(--rose-border-strong);
  box-shadow: 0 24px 48px rgba(214, 123, 165, 0.2);
  padding: 1.5rem;
}

.contact-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--rose-border);
}

.contact-modal__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--rose-text);
}

.contact-modal__close {
  border: 0;
  background: transparent;
  color: var(--rose-text-soft);
  font-size: 1.6rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.contact-modal__close:hover {
  color: var(--rose-accent-strong);
}

.contact-modal__form {
  display: grid;
  gap: 1rem;
}

.contact-modal__field {
  display: grid;
  gap: 0.3rem;
}

.contact-modal__label {
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--rose-accent);
  font-weight: 400;
}

.contact-modal__input,
.contact-modal__textarea {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  border: 1px solid var(--rose-border);
  background: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  color: var(--rose-text);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.contact-modal__input:focus,
.contact-modal__textarea:focus {
  outline: none;
  border-color: var(--rose-accent);
  box-shadow: 0 0 0 3px rgba(212, 107, 158, 0.15);
}

.contact-modal__input--error,
.contact-modal__textarea--error {
  border-color: #e74c3c;
}

.contact-modal__textarea {
  resize: vertical;
  min-height: 6rem;
  font-family: inherit;
}

.contact-modal__error {
  margin: 0;
  font-size: 0.72rem;
  color: #e74c3c;
}

.contact-modal__submit {
  width: 100%;
  padding: 0.7rem 1rem;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #f7bad6, #d46b9e);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.contact-modal__submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(212, 107, 158, 0.3);
}

.contact-modal__submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.contact-modal__feedback {
  margin: 0;
  font-size: 0.82rem;
  text-align: center;
  padding: 0.6rem;
  border-radius: 10px;
}

.contact-modal__link {
  color: var(--rose-accent-strong);
  word-break: break-all;
  font-size: 0.75rem;
}

.contact-modal__feedback.success {
  color: #2e7d32;
  background: rgba(46, 125, 50, 0.08);
}

.contact-modal__feedback.error {
  color: #c62828;
  background: rgba(198, 40, 40, 0.08);
}
</style>
