import emailjs from '@emailjs/browser'

const PUBLIC_KEY = process.env.VUE_APP_EMAILJS_PUBLIC_KEY
const SERVICE_ID = process.env.VUE_APP_EMAILJS_SERVICE_ID
const TEMPLATE_ID = process.env.VUE_APP_EMAILJS_TEMPLATE_ID

emailjs.init(PUBLIC_KEY)

export function sendContactForm({ from_name, from_email, subject, message }) {
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, {
    from_name,
    from_email,
    subject,
    message
  })
}
