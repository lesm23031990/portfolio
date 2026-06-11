const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const fs = require('fs')

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack (config) {
    config.resolve.alias.set('/images', path.resolve(__dirname, 'src/assets/images'))

    config.plugin('define').tap((args) => {
      args[0]['__VUE_PROD_HYDRATION_MISMATCH_DETAILS__'] = JSON.stringify(false)
      return args
    })
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
            console.log('[content] content.json actualizado')
            res.json({ ok: true })
          } catch (e) {
            console.error('[content] Error al guardar:', e)
            res.status(500).json({ ok: false, error: e.message })
          }
        })
      })
      return middlewares
    }
  }
})
