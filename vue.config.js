const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  lintOnSave: false, // 是否开启eslint保存检测
  publicPath: './', // 公共路径
  outputDir: 'basic_cli_package', // 打包后的文件名
  devServer: {
    open: false,
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false, // 热模块更新
    proxy: {
      '/tencent': {
        target: 'https://apis.map.qq.com', //源接口地址,network请求地址中api前面的部分
        changeOrigin: true, //改变源
        pathRewrite: {
          '^/tencent': ''
        }
      },
      '/api': {
        pathRewrite: {
          '^/api': ''
        },
        target: 'http://31.0.219.71', //源接口地址,network请求地址中api前面的部分
        changeOrigin: true, //改变源
      },
    
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@public', resolve('public'))
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        // 全局变量路径，不能使用路径别名
        path.resolve(__dirname, "./src/assets/global.less"),
      ],
    },
  },
};