const path = require(`path`)
const url = require(`url`)

const {app, BrowserWindow} = require(`electron`)

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({width: 800, height: 500, webPreferences: {
    nodeIntegration: true
  }})

  const mainPage = url.format({
    pathname: path.join(__dirname, `index.html`),
    protocol: `file`,
    slashes: true
  })
  console.log(mainPage)

  mainWindow.webContents.openDevTools()
  
  mainWindow.loadURL(mainPage)

  mainWindow.on(`closed`, function () {
    mainWindow = null
  })
}

app.on(`ready`, function () {
  createWindow()
})

app.on(`window-all-closed`, function () {
  if (process.platform !== `darwin`) {
    app.quit()
  }
})

app.on(`activate`, () => {
  if (win === null) {
    createWindow()
  }
})