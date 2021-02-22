const path = require('path');
const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')

function resolve(dir = '') {
  return path.join(__dirname, './src', dir);
}

module.exports = {
  publicPath: './',
  outputDir: 'dist-h5-'+process.env.VUE_APP_TITLE,
  assetsDir: 'static',
  productionSourceMap: false,
  runtimeCompiler: true,
  devServer: {
    port: 6255,
    disableHostCheck: true,
  },
  lintOnSave: false,// 关闭eslint
  chainWebpack: config => {
    // 在chainWebpack中添加下面的代码
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
  },
  configureWebpack: {
    resolve: {
      alias: {
        core: resolve('core')
      }
    },
    optimization: {
      runtimeChunk: {
        name: entrypoint => `runtime~${entrypoint.name}`
      },
      splitChunks: {
        minChunks: 2,
        minSize: 20000,
        maxAsyncRequests: 20,
        maxInitialRequests: 30,
        name: false
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data:
          '@import "@/assets/scss/_var.scss";@import "@/assets/scss/_mixin.scss";'
      },
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 37.5,
            propList: ['*'],
            selectorBlackList: ['van-circle__layer']
          })
        ]
      }
    }
  }
};
