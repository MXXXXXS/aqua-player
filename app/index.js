const AQUAController = require(`./components/controller.js`)
const AQUAList = require(`./components/list.js`)
const AQUAMenu = require(`./components/menu.js`)

window.customElements.define(`aqua-menu`, AQUAMenu)
window.customElements.define(`aqua-list`, AQUAList)
window.customElements.define(`aqua-controller`, AQUAController)

// const IDB = require(`./utils/indexDB.js`)

// const db = new IDB(`aqua-player`, `song`)

