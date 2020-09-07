const path = require("path");
module.exports = {
  //基本路径
  publicPath: process.env.NODE_ENV === "production" ? "" : "/",
  // 输出文件目录
  outputDir: process.env.NODE_ENV === "production" ? "dist" : "devdist",
  //assetsDir: 'assets',
  lintOnSave: true,
  chainWebpack: config => {
    //config.resolve.symlinks(true) //热更新
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
  // webpack-dev-server 相关配置
  devServer: {
    open: false,
    host: "0.0.0.0",
    port: 8080,
    https: false, //编译失败时刷新页面
    hot: true, //开启热加载
    hotOnly: false,
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: null, //设置代理
    before: app => {}
  },
  //第三方插件配置
  pluginOptions: {}
};