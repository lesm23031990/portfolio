const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const fs = require('fs')
const { callGroq } = require('./api/groq')

module.exports = defineConfig({
  transpileDependencies: ['@emailjs/browser'],
  chainWebpack (config) {
    config.resolve.alias.set('/images', path.resolve(__dirname, 'src/assets/images'))

    config.plugin('define').tap((args) => {
      args[0]['__VUE_PROD_HYDRATION_MISMATCH_DETAILS__'] = JSON.stringify(false)
      return args
    })

    if (process.env.NODE_ENV === 'production') {
      config.optimization.splitChunks({
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vue: {
            test: /[\\/]node_modules[\\/](vue|vue-router|vue-i18n)[\\/]/,
            name: 'vendor-vue',
            chunks: 'all',
            priority: 20
          },
          gsap: {
            test: /[\\/]node_modules[\\/]gsap[\\/]/,
            name: 'vendor-gsap',
            chunks: 'all',
            priority: 10
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor-other',
            chunks: 'all',
            priority: 1,
            minChunks: 2
          }
        }
      })
    }
  },
  devServer: {
    setupMiddlewares(middlewares, devServer) {
      devServer.app.post('/api/save-content', (req, res) => {
        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', () => {
          try {
            const contentPath = path.resolve(__dirname, 'src/content/content.json')
            const parsed = JSON.parse(body)
            fs.writeFileSync(contentPath, JSON.stringify(parsed, null, 2) + '\n', 'utf-8')
              res.json({ ok: true })
          } catch (e) {
              res.status(500).json({ ok: false, error: e.message })
          }
        })
      })

      devServer.app.post('/api/chat', async (req, res) => {
        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', async () => {
          try {
            const { message, history } = JSON.parse(body)
            if (!message) {
              return res.status(400).json({ error: 'message is required' })
            }
            const apiKey = process.env.GROQ_API_KEY
            if (!apiKey) {
              return res.status(500).json({ error: 'GROQ_API_KEY not set in .env' })
            }
            const reply = await callGroq(apiKey, message, history)
            res.json({ reply })
          } catch (err) {
            console.error('Chat dev error:', err)
            res.status(500).json({ error: 'Internal server error' })
          }
        })
      })

      return middlewares
    }
  }
})
