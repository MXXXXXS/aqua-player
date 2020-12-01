import * as path from 'path'
import * as fs from 'fs'
import * as url from 'url'

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import relativeToWorkspace from '~/utils/relativeToWorkspace'
import { ipc } from '~/renderer/states'
import { fstat } from 'fs'

function createMainWindow() {
  const pathname = relativeToWorkspace('app/renderer/index.html')
  console.log(pathname)

  createWindow({ pathname })
}

function createWindow({
  pathname,
  x,
  y,
  height = 900,
  width = 1800,
  minHeight = 500,
  minWidth = 360,
  frame = true,
  node = true,
}: {
  pathname: string
  x?: number
  y?: number
  width?: number
  height?: number
  minHeight?: number
  minWidth?: number
  frame?: boolean
  node?: boolean
}) {
  // 各个页面
  // 主页面
  const mainPage = url.format({
    pathname,
    protocol: 'file',
    slashes: true,
  })
  const mainWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    minHeight,
    minWidth,
    frame,
    webPreferences: {
      nodeIntegration: node,
    },
  })

  mainWindow.loadURL(mainPage).catch((err) => console.error(err))

  mainWindow.webContents.openDevTools()

  fn(mainWindow)
}

// app生命周期
app
  .whenReady()
  .then(createMainWindow)
  .catch((err) => console.error(err))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

// 添加音乐文件夹
ipcMain.on('open file explorer', (e) => {
  dialog
    .showOpenDialog({
      properties: ['openDirectory', 'multiSelections'],
    })
    .then((files) => {
      if (files) e.sender.send('add these folders', files)
    })
    .catch((err) => console.error(err))
})

// 创建子窗口
function createSubWindow({
  x,
  y,
  pathname,
}: {
  pathname: string
  x: number
  y: number
}) {
  const subWindow = new BrowserWindow({
    x: Math.round(x),
    y: Math.round(y),
    webPreferences: {
      nodeIntegration: true,
    },
  })
  console.log('加载: ', pathname, '\n', fs.existsSync(pathname))

  const subPage = url.format({
    pathname,
    protocol: 'file',
    slashes: true,
  })
  subWindow.loadURL(subPage).catch((err) => console.error(err))

  subWindow.webContents.openDevTools()
  // subWindow.once('blur', () => {
  //   subWindow.close()
  // })
}

function fn(mainWindow: BrowserWindow) {
  ipcMain.on(
    'create sub window',
    (
      e,
      args: {
        file: string
        xy: [number, number]
      }
    ) => {
      const [elX, elY] = args.xy
      const pathname = args.file
      const [mainX, mainY] = mainWindow.getPosition()
      createSubWindow({
        pathname,
        x: mainX + elX,
        y: mainY + elY,
      })
    }
  )
}
