const { resolve } = require('path')

// 生产与开发环境区分
const { NODE_ENV } = process.env
const isProduction = NODE_ENV === 'production'

exports.tsconfig = {
  devtool: isProduction ? undefined : 'source-map',
  module: {
    rules: [
      {
        test: /\.(ts|m?js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
}

// constants
exports.workSpaceFolder = resolve(__dirname, '../')
const publicPath = ''
// _

exports.mode = {
  mode: isProduction ? 'production' : 'development',
}

// devServer
exports.watch = { watch: !isProduction }

exports.devServer = {
  devServer: {
    open: true,
    compress: true,
    contentBase: publicPath,
    host: 'localhost',
    port: 8080,
    watchContentBase: true,
  },
}
// _

exports.base = {
  resolve: {
    alias: {
      '~': 'src',
      r: 'src/renderer',
      c: 'src/renderer/components',
      ru: 'src/renderer/utils',
    },
  },
  context: this.workSpaceFolder,
  node: {
    __filename: true,
    __dirname: true,
  },
}
