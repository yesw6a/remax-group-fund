const path = require('path')
const cwd = process.cwd()
const sass = require('@remax/plugin-sass')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  configWebpack({ config }) {
    config.resolve.alias
      .merge({
        '@': path.resolve(cwd, 'src'),
      })
      .end()
    // 详细配置参考 copy-webpack-plugin
    config.plugin('copy').use(CopyPlugin, [[{ from: 'src/assets/image', to: 'assets/image' }]])
  },
  plugins: [sass()],
}
