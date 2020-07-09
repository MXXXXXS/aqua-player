const path = require('path')
const url = require('url')

const { app, BrowserWindow, ipcMain, dialog } = require('electron')

let mainWindow

function createWindow() { // 各个页面

  // 主页面
  const mainPage = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  })
  mainWindow = new BrowserWindow({
    width: 2500,
    height: 900,
    minHeight: 500,
    minWidth: 360,
    webPreferences: {
      nodeIntegration: true
      // devTools: true
    }
  })

  mainWindow.loadURL(mainPage)

  // 添加文件夹页面
  // const addToPage = url.format({
  //   pathname: path.join(__dirname, 'addToPage.html'),
  //   protocol: 'file',
  //   slashes: true
  // })

  // const addToWindow = new BrowserWindow({
  //   parent: mainWindow,
  //   width: 350,
  //   height: 800,
  //   titleBarStyle: 'hidden'
  // })

  // addToWindow.loadURL(addToPage)

  // 窗口和渲染进程通信

  ipcMain.on('add folder', (e) => {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }, files => {
      if (files) e.sender.send('add these', files)
    })
  })

  // ipcMain.on('show addTo', e => {
  //   addToWindow.show()
  // })

  // ipcMain.on('close addTo', e => {
  //   addToWindow.close()
  // })
}

// app生命周期

app.on('ready', function () {
  createWindow()
  mainWindow.webContents.openDevTools()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow.show()
  }
})