const API_URL = '/api/chat'

export async function sendChatMessage(message, history = []) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.reply
  } catch (err) {
    console.warn('Chat API unavailable, using local fallback:', err.message)
    return localFallback(message)
  }
}

function localFallback(input) {
  const normalized = input.toLowerCase()

  if (normalized.includes('stack') || normalized.includes('tecnolog') || normalized.includes('tools')) {
    return 'Lorena domina: Vue 2/3, Nuxt, React, Angular, JavaScript, TypeScript, Tailwind CSS, Node.js, PHP/Laravel, Docker. Actualmente en transición a AI Engineering con Python, LangChain y AWS SageMaker.'
  }

  if (normalized.includes('contact') || normalized.includes('correo') || normalized.includes('email') || normalized.includes('linkedin')) {
    return 'Puedes contactar a Lorena en lorena.dev.231990@gmail.com o conectar por LinkedIn: https://www.linkedin.com/in/lorenaesalasm/'
  }

  if (normalized.includes('proyecto') || normalized.includes('project') || normalized.includes('repo')) {
    return 'Lorena ha trabajado en: Dashboard IoT (Vue 3 + D3.js), Portal E-commerce (Nuxt + Tailwind), CRM (React + Node.js), y este portfolio (Vue 3 + GSAP). Todo en su GitHub: https://github.com/lesm23031990/'
  }

  if (normalized.includes('cv') || normalized.includes('curriculum') || normalized.includes('resume')) {
    return 'Puedes descargar su CV desde el botón "CV" en la parte superior del portfolio.'
  }

  if (normalized.includes('experienc') || normalized.includes('experienc') || normalized.includes('trayectoria') || normalized.includes('anos') || normalized.includes('years')) {
    return 'Lorena tiene 8+ años de experiencia como desarrolladora Frontend/Fullstack. Ha trabajado con startups y empresas tecnológicas, liderando equipos y desarrollando aplicaciones web complejas.'
  }

  return 'Soy el asistente virtual de Lorena. Puedo hablarte sobre su experiencia, stack técnico, proyectos, o cómo contactarla. ¿Qué te gustaría saber?'
}
