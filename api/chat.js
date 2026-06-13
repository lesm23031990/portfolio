const { callGemini } = require('./gemini')

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured' })
  }

  try {
    const { message, history } = req.body

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' })
    }

    const reply = await callGemini(GEMINI_API_KEY, message, history)
    return res.status(200).json({ reply })
  } catch (err) {
    console.error('Chat API error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
