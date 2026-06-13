const API_URL = '/api/chat'

const FALLBACK_HEADER = '⚠️ IA no disponible. Usando respuestas predefinidas:\n\n'

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function tryFetch(message, history) {
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
}

export async function sendChatMessage(message, history = []) {
  try {
    return await tryFetch(message, history)
  } catch (err) {
    console.warn('Chat API failed, retrying in 3s:', err.message)
  }

  await delay(1000)

  try {
    return await tryFetch(message, history)
  } catch (err) {
    console.warn('Chat API unavailable, using local fallback:', err.message)
    return FALLBACK_HEADER + localFallback(message)
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

  if (normalized.includes('github') || normalized.includes('contribucion') || normalized.includes('contribución')) {
    return 'Su GitHub personal tiene pocas contribuciones porque en Livelaps usaban SVN en vez de Git, y sus commits estaban asociados a un correo corporativo al que ya no tiene acceso. Todo su trabajo en Livelaps y Villartech está en repositorios privados corporativos. Su portfolio es su proyecto público más representativo: https://github.com/lesm23031990/'
  }

  if (normalized.includes('proyecto') || normalized.includes('project') || normalized.includes('repo') || normalized.includes('código') || normalized.includes('ejemplo')) {
    return 'Puedes ver su portfolio y código en GitHub: https://github.com/lesm23031990/. También puedes visitar Livelaps (https://livelaps.com) donde contribuyó y el sitio está activo. Villartech tiene su web corporativa (https://www.villartechnologies.com.ve/) aunque los proyectos específicos en los que trabajó podrían no estar vigentes.'
  }

  if (normalized.includes('cv') || normalized.includes('curriculum') || normalized.includes('resume')) {
    return 'Puedes descargar su CV desde el botón "CV" en la parte superior del portfolio.'
  }

  if (normalized.includes('experienc') || normalized.includes('trayectoria') || normalized.includes('anos') || normalized.includes('years')) {
    return 'Lorena tiene 8+ años de experiencia como desarrolladora Frontend/Fullstack. Ha trabajado con startups y empresas tecnológicas, desarrollando aplicaciones web complejas como contribuidora individual.'
  }

  if (normalized.includes('tarifa') || normalized.includes('precio') || normalized.includes('costo') || normalized.includes('pago') || normalized.includes('rate') || normalized.includes('hour')) {
    return 'Su tarifa está entre 20-25 USD/hora, negociable según el alcance y tipo de proyecto.'
  }

  if (normalized.includes('explic') || normalized.includes('concepto') || normalized.includes('no técnico') || normalized.includes('cliente') || normalized.includes('analog')) {
    return 'Lorena usa analogías del día a día para explicar tecnología. Por ejemplo: "una API es como un mesero — tú le pides, él va a la cocina y te trae lo que pediste". Evita jargon técnico, se adapta al nivel de la persona y confirma que entendió antes de continuar.'
  }

  return 'Soy el asistente virtual de Lorena. Puedo hablarte sobre su experiencia, stack técnico, proyectos, o cómo contactarla. ¿Qué te gustaría saber?'
}
