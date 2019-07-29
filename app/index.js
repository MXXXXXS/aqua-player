const AQUAController = require(`./components/controller.js`)
const AQUASongs = require(`./components/songs.js`)
const AQUASingers = require(`./components/singers.js`)
const AQUAMenu = require(`./components/menu.js`)
const AQUAMyMusic = require(`./components/myMusic.js`)

window.customElements.define(`aqua-menu`, AQUAMenu)
window.customElements.define(`aqua-songs`, AQUASongs)
window.customElements.define(`aqua-singers`, AQUASingers)
window.customElements.define(`aqua-controller`, AQUAController)
window.customElements.define(`aqua-my-music`, AQUAMyMusic)

// const IDB = require(`./utils/indexDB.js`)

// const db = new IDB(`aqua-player`, `song`)

