import * as fs from 'fs'
import * as url from 'url'

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import relativeToWorkspace from '~/utils/relativeToWorkspace'

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
  frame = false,
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

  mainWindow.webContents.openDevTools()

  mainWindow
    .loadURL(mainPage)
    .then(() => {
      mainWindowLoaded(mainWindow)
    })
    .catch((err) => console.error(err))
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
  width,
  height,
}: {
  width: number
  height: number
  x: number
  y: number
}) {
  return new BrowserWindow({
    x: Math.round(x),
    y: Math.round(y),
    width,
    height,
    frame: false,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
    },
  })
}

function mainWindowLoaded(mainWindow: BrowserWindow) {
  ipcMain.on('activate view', (e, name, text) => {
    mainWindow.webContents.send('activate view', name, text)
  })

  ipcMain.on(
    'create sub window',
    (
      e,
      args: {
        stateName: string
        data: unknown
        file: string
        width: number
        height: number
        xy: [number, number]
      }
    ) => {
      const {
        stateName,
        data,
        xy: [elX, elY],
        file: pathname,
        width,
        height,
      } = args
      const [mainX, mainY] = mainWindow.getPosition()
      const subWindow = createSubWindow({
        width,
        height,
        x: mainX + elX,
        y: mainY + elY,
      })
      console.log('加载: ', pathname, '\n', fs.existsSync(pathname))

      const subPage = url.format({
        pathname,
        protocol: 'file',
        slashes: true,
      })
      subWindow
        .loadURL(subPage)
        .then(() => subPageLoaded(subWindow, stateName, data))
        .catch((err) => console.error(err))
    }
  )
}
async function subPageLoaded(
  subWindow: BrowserWindow,
  stateName: string,
  data: unknown
) {
  subWindow.webContents.send('data', stateName, data)
  // subWindow.webContents.openDevTools()

  await new Promise((res, rej) => {
    ipcMain.once('close sub window', () => {
      res()
    })

    subWindow.once('blur', () => {
      res()
    })
  })

  subWindow.close()
}
