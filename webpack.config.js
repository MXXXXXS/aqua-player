const { merge } = require('webpack-merge')
const { mode } = require('./webpack/webpack.parts')
const rendererConfig = require('./webpack/webpack.renderer')
const mainConfig = require('./webpack/webpack.main')

module.exports = [merge(mode, rendererConfig), merge(mode, mainConfig)]
