import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSend = vi.fn()

vi.mock('@emailjs/browser', () => ({
  default: {
    init: vi.fn(),
    send: (...args) => mockSend(...args),
  },
}))

describe('sendContactForm', () => {
  beforeEach(() => {
    vi.resetModules()
    mockSend.mockReset()
  })

  it('rejects if env vars are missing', async () => {
    vi.stubGlobal('process', { env: {} })
    const { sendContactForm } = await import('../email')
    await expect(sendContactForm({
      from_name: 'Test',
      from_email: 'test@test.com',
      subject: 'Test',
      message: 'Hello',
    })).rejects.toThrow('EmailJS no está configurado')
  })

  it('calls emailjs.send with correct params', async () => {
    vi.stubGlobal('process', {
      env: {
        VUE_APP_EMAILJS_PUBLIC_KEY: 'test-key',
        VUE_APP_EMAILJS_SERVICE_ID: 'test-service',
        VUE_APP_EMAILJS_TEMPLATE_ID: 'test-template',
      },
    })
    mockSend.mockResolvedValue({ status: 200, text: 'OK' })
    const { sendContactForm } = await import('../email')
    const result = await sendContactForm({
      from_name: 'Test User',
      from_email: 'user@test.com',
      subject: 'Hello',
      message: 'Test message',
    })
    expect(mockSend).toHaveBeenCalledWith('test-service', 'test-template', {
      from_name: 'Test User',
      from_email: 'user@test.com',
      subject: 'Hello',
      message: 'Test message',
    })
    expect(result).toEqual({ status: 200, text: 'OK' })
  })
})
