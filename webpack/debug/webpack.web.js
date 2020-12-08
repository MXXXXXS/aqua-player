const { basename, resolve, join } = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const { merge } = require('webpack-merge')

const { base, tsconfig } = require('../webpack.parts')

const inputTsFile = process.argv[2]
const inputFileNameWithOutExt = basename(inputTsFile, '.ts')
const outputDir = resolve('debug')
const outputJsFileName = outputDir + '/' + inputFileNameWithOutExt

console.log('编译入口文件: ', inputTsFile)
console.log('编译出口文件: ', outputJsFileName + '.js')

const webpackConfig = merge(base, tsconfig, {
  target: 'node',
  entry: { [inputFileNameWithOutExt]: inputTsFile },
  output: {
    filename: '[name].js',
    path: outputDir,
  },
  mode: 'development',
  devtool: 'source-map',
  plugins: [new CleanWebpackPlugin(), new HtmlWebpackPlugin({
    template: inputTsFile.replace('.ts', '.html'),
  })],
})

webpack(webpackConfig, (err, states) => {
  if (err || states.hasErrors()) {
    console.error(err)
    console.log(states.toString())
  }
})
