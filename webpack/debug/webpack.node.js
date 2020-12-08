const { basename, resolve } = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const { merge } = require('webpack-merge')

const { base, tsconfig } = require('../webpack.parts')

const inputTsFile = process.argv[2]
const inputFileNameWithOutExt = basename(inputTsFile, '.ts')
const outputDir = resolve('debug')

console.log('编译入口文件: ', inputTsFile)
console.log('编译出口文件: ', (outputDir, inputFileNameWithOutExt + '.js'))

const webpackConfig = merge(base, tsconfig, {
  target: 'node',
  entry: { [inputFileNameWithOutExt]: inputTsFile },
  output: {
    filename: '[name].js',
    path: outputDir,
  },
  mode: 'development',
  devtool: 'source-map',
  plugins: [new CleanWebpackPlugin()],
})

webpack(webpackConfig, (err, states) => {
  if (err || states.hasErrors()) {
    console.error(err)
    console.log(states.toString())
  }
})
