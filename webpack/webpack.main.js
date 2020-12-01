const exec = require('child_process').exec
const { join } = require('path')
const { merge } = require('webpack-merge')
const { tsconfig, watch, workSpaceFolder, base } = require('./webpack.parts')
const tkill = require('tree-kill')

const mainSrc = join(workSpaceFolder, 'src/main/index.ts')
const appFolder = join(workSpaceFolder, 'app')

let mainProcess

module.exports = merge(base, watch, tsconfig, {
  target: 'electron-main',
  entry: {
    main: mainSrc,
  },
  output: {
    filename: 'main.js',
    path: appFolder,
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('Run electron main process', () => {
          if (mainProcess) {
            console.log('正在关闭已有 electron 进程')
            tkill(mainProcess.pid, (err) => {
              if (err) {
                console.error(`关闭失败\n${err}`)
              } else {
                console.log('已关闭, 并启动新的')
                mainProcess = exec('npx electron .')
              }
            })
          } else {
            console.log('正在启动新的 electron 进程')
            mainProcess = exec('npx electron .')
          }
        })
      },
    },
  ],
})
