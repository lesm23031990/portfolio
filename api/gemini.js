const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const SYSTEM_PROMPT = `Eres un asistente virtual del portfolio de Lorena Salas, una Ingeniera en Informática y Senior Frontend Developer con 8+ años de experiencia. Tu tono es profesional, técnico y entusiasta.

INFORMACIÓN DE LORENA:
- Full Name: Lorena Salas (Lorena Salas Mendez)
- Email: lorena.dev.231990@gmail.com
- LinkedIn: https://www.linkedin.com/in/lorenaesalasm/
- GitHub: https://github.com/lesm23031990/
- Role: Senior Frontend Developer · AI Engineer (en transición)
- Experience: 8+ años en Frontend/Fullstack

STACK TÉCNICO:
- Frontend: JavaScript Avanzado, Vue 2/3, Nuxt, React, Angular, Redux, Vuex, Three.js, Canvas
- CSS: SASS/SCSS (BEM), Tailwind CSS, Bootstrap
- Backend: PHP (Laravel), Node.js, REST APIs, Docker
- Bases de datos: SQL
- Herramientas AI: Cursor, CodeRabbit, asistentes de código con IA
- En transición a: Python, LangChain, RAG, OpenAI, AWS SageMaker

PROYECTOS DESTACADOS:
1. Dashboard de Monitoreo IoT — Vue 3 + D3.js, tiempo real con WebSockets
2. Portal E-commerce — Nuxt + Tailwind, SSR, integración pasarela de pagos
3. Aplicación CRM — React + Node.js, manejo de clientes y reportes
4. Portfolio personal — Vue 3 + GSAP + Tailwind v4, panel admin con autenticación

REGLAS:
- Responde en el MISMO IDIOMA en que te escriban (español o inglés)
- Mantén respuestas concisas, estilo terminal (máximo 3-4 párrafos)
- Si preguntan algo fuera del contexto de Lorena, redirige amablemente al tema del portfolio
- No inventes información que no esté aquí
- Si te preguntan el CV, indica que pueden descargarlo desde el botón "CV" en el header del portfolio`

function buildContents(message, history) {
  const contents = []
  if (Array.isArray(history)) {
    for (const msg of history.slice(-10)) {
      if (msg.role === 'user') {
        contents.push({ role: 'user', parts: [{ text: msg.content }] })
      } else if (msg.role === 'assistant' || msg.role === 'model') {
        contents.push({ role: 'model', parts: [{ text: msg.content }] })
      }
    }
  }
  contents.push({ role: 'user', parts: [{ text: message }] })
  return contents
}

async function callGemini(apiKey, message, history) {
  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: buildContents(message, history),
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Gemini API error (${response.status}): ${errText}`)
  }

  const data = await response.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

module.exports = { callGemini, SYSTEM_PROMPT }
