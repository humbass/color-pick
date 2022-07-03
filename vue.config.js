const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/pickupcolor/' : '/',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'sass',
      patterns: []
    }
  },
  pages: {
    index: {
      entry: 'src/pages/index/main.js',
      template: 'public/index.html'
    },
    support: {
      entry: 'src/pages/support/main.js',
      template: 'public/index.html'
    },
  }
})
