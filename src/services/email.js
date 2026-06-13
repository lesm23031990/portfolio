import emailjs from '@emailjs/browser'

const PUBLIC_KEY = process.env.VUE_APP_EMAILJS_PUBLIC_KEY
const SERVICE_ID = process.env.VUE_APP_EMAILJS_SERVICE_ID
const TEMPLATE_ID = process.env.VUE_APP_EMAILJS_TEMPLATE_ID
const AUTO_REPLY_TEMPLATE_ID = process.env.VUE_APP_EMAILJS_AUTO_REPLY_TEMPLATE_ID

const isReady = PUBLIC_KEY && SERVICE_ID && TEMPLATE_ID

if (isReady) {
  emailjs.init({ publicKey: PUBLIC_KEY })
}

export function sendContactForm({ from_name, from_email, subject, message, schedule = false, contactEmail = '' }) {
  if (!isReady) {
    return Promise.reject(new Error(
      'EmailJS no está configurado. Agrega VUE_APP_EMAILJS_PUBLIC_KEY, VUE_APP_EMAILJS_SERVICE_ID y VUE_APP_EMAILJS_TEMPLATE_ID en las variables de entorno.'
    ))
  }

  const notification = emailjs.send(SERVICE_ID, TEMPLATE_ID, {
    from_name,
    from_email,
    subject,
    message,
    to_email: contactEmail,
  })

  if (schedule) {
    return notification
  }

  const autoReply = emailjs.send(SERVICE_ID, AUTO_REPLY_TEMPLATE_ID, {
    from_name: from_name,
    from_email: from_email,
    subject: subject,
    reply_to: from_email,
    to_email: from_email,
  })

  return Promise.all([notification, autoReply])
}
