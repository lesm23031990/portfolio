import emailjs from '@emailjs/browser'

const PUBLIC_KEY = 'zhXghdrSAnB4K3zeZ'
const SERVICE_ID = 'service_dd8avek'
const TEMPLATE_ID = 'template_ncrl9uv'

emailjs.init(PUBLIC_KEY)

export function sendContactForm({ from_name, from_email, subject, message }) {
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, {
    from_name,
    from_email,
    subject,
    message
  })
}
