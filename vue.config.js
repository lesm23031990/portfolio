const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack (config) {
    // Hacer que url("/images/...") en CSS resuelva a public/images/
    config.resolve.alias.set('/images', path.resolve(__dirname, 'src/assets/images'))
  }
})
