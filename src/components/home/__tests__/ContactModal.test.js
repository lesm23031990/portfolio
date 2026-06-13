import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import ContactModal from '../ContactModal.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'es',
  messages: {
    es: {
      contactForm: {
        validation: {
          nameRequired: 'El nombre es obligatorio',
          emailRequired: 'El email es obligatorio',
          emailInvalid: 'Email no válido',
          subjectRequired: 'El asunto es obligatorio',
          messageRequired: 'El mensaje es obligatorio',
          messageMin: 'El mensaje debe tener al menos 10 caracteres',
        },
      },
    },
  },
})

function createWrapper() {
  return mount(ContactModal, {
    global: {
      plugins: [i18n],
      stubs: {
        teleport: true,
      },
    },
    props: {
      visible: true,
    },
  })
}

describe('ContactModal validation', () => {
  it('shows name required error when name is empty', async () => {
    const wrapper = createWrapper()
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('El nombre es obligatorio')
  })

  it('shows email required error when email is empty', async () => {
    const wrapper = createWrapper()
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('El email es obligatorio')
  })

  it('shows email invalid error for bad email', async () => {
    const wrapper = createWrapper()
    wrapper.vm.form.name = 'Test'
    wrapper.vm.form.email = 'bad-email'
    wrapper.vm.form.subject = 'Test'
    wrapper.vm.form.message = 'Hello world this is long enough'
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Email no válido')
  })

  it('shows message required error when message is empty', async () => {
    const wrapper = createWrapper()
    wrapper.vm.form.name = 'Test'
    wrapper.vm.form.email = 'test@test.com'
    wrapper.vm.form.subject = 'Test'
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('El mensaje es obligatorio')
  })

  it('shows message min error for short message', async () => {
    const wrapper = createWrapper()
    wrapper.vm.form.name = 'Test'
    wrapper.vm.form.email = 'test@test.com'
    wrapper.vm.form.subject = 'Test'
    wrapper.vm.form.message = 'Hi'
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('El mensaje debe tener al menos 10 caracteres')
  })

  it('passes validation with valid data', async () => {
    const wrapper = createWrapper()
    wrapper.vm.form.name = 'Test User'
    wrapper.vm.form.email = 'test@test.com'
    wrapper.vm.form.subject = 'Test Subject'
    wrapper.vm.form.message = 'Hello, this is a test message that is long enough'
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).not.toContain('obligatorio')
    expect(wrapper.text()).not.toContain('válido')
  })
})
