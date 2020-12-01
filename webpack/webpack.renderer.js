const { join, basename } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')

const { tsconfig, watch, workSpaceFolder, base } = require('./webpack.parts')

const entryPrefix = join(workSpaceFolder, 'src/renderer')

const pages = {
  'index': 'index.ts',
  'subWindows/sortBy/index': 'subWindows/sortBy/index.ts'
}

const entries = {}
const htmlPages = []

Object.entries(pages).forEach(([entryName, entryPath]) => {
  entries[entryName] = join(entryPrefix, entryPath)
  const htmlPagePath = entryPath.replace('.ts', '.html')
  htmlPages.push(new HtmlWebpackPlugin({
    template: join(entryPrefix, htmlPagePath),
    filename: entryName.replace('index', 'index.html'),
    chunks: [entryName],
    meta: {
      charset: "UTF-8",
      name: "viewport",
      content: "width=device-width, initial-scale=1.0"
    }
  }))
})

const output = {
  filename: '[name].js',
  path: join(workSpaceFolder, 'app/renderer'),
}


module.exports = merge(base, watch, tsconfig, {
  target: 'electron-renderer',
  entry: entries,
  output,
  plugins: [...htmlPages],
})
