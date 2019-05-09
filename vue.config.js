const path = require('path')
const webpack = require('webpack')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

function resolve (dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463

   */
  /*
  pages: {
    index: {
      entry: 'src/main.js',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  */
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // new BundleAnalyzerPlugin()
    ]
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@static', resolve('src/static'))
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          
          // 'primary-color': '#78bb60',
          // 'link-color': '#78bb60',
          'primary-color': '#78bb60',
          'link-color': '#78bb60',
          'border-radius-base': '4px',
          
        },
        javascriptEnabled: true,
      }
    }
  },

  devServer: {
    proxy: {
      // '/api': {
      //   // target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro',
      //   target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro',
      //   ws: false,
      //   changeOrigin: true
      // },
      // '/gateway': {
      //   target: 'https://www.easy-mock.com/mock/5b7bce071f130e5b7fe8cd7d/antd-pro',
      //   ws: false,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/gateway': '/api'
      //   }
      // }
      '/api': {    //将www.exaple.com印射为/apis
        // target: 'http://localhost:15050',  // 接口域名
        target: 'http://120.77.208.244:15050/',  // 接口域名
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true,  //是否跨域
        pathRewrite: {
            '^/api': ''   //需要rewrite的,
        }              
      }
    }
  },

  lintOnSave: undefined
}