const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081,
    host: '0.0.0.0',
    https: false,
    open: false,
    proxy: {
      // '/api': {
      //   // target: 'http://test-dqxswlsq.test176.cn/',
      //   target: 'http://127.0.0.1:9955/',
      //   ws: true,
      //   secure: false,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api': ''
      //   }
      // },
    },
  }
})
