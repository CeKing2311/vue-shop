const path = require("path");
module.exports = {
  //基本路径
  publicPath: process.env.NODE_ENV === "production" ? "" : "/",
  // 输出文件目录
  outputDir: process.env.NODE_ENV === "production" ? "dist" : "devdist",
  //assetsDir: 'assets',
  lintOnSave: true,
  // 配置生产环境和开发环境的打包入口
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      // 通过 externals 加载外部CDN资源      
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axiox: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      config.plugin('html').tap(args => {
        args[0].isProd = true;
        return args
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false;
        return args
      })
    })
  },
  configureWebpack: config => {
    config.resolve = {
      extensions: ['.js', '.json', '.vue'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        'public': path.resolve(__dirname, './public'),
        'components': path.resolve(__dirname, './src/components'),
      }
    }
  },

  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?是否在构建样式地图，false将提高构建速度
    sourceMap: false,
    //此项设置为false 会影响element-ui 引入时样式失效
    requireModuleExtension: true,
    // css预设器配置项
    loaderOptions: {
      //   sass: {
      //     prependData: `@import "./src/assets/css/goobal.css";`
      //   }
    }
    // 启用 CSS modules for all css / pre-processor files.
    //modules: false
  },
  parallel: require("os").cpus().length > 1,
  //pwa插件相关配置
  pwa: {},

};