const {readdirSync} = require('fs')
const { join, basename } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')

const { tsconfig, watch, workSpaceFolder, base } = require('./webpack.parts')

const subWindows = join(workSpaceFolder, 'src/renderer/subWindows/pages')
const entryPrefix = join(workSpaceFolder, 'src/renderer')

const mainPage = {
  'index': 'index.ts',
}


const subPageNames = readdirSync(subWindows, {
  encoding: 'utf8'
})

const subPages = subPageNames.reduce((subPages, subPageName) => {
  subPages[`subWindows/pages/${subPageName}/index`] = `subWindows/pages/${subPageName}/index.ts`
  return subPages
}, {})

const pages = Object.assign({}, mainPage, subPages)

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
