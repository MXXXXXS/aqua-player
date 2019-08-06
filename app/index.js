const {storeStates, listSPath, listSList} = require(`./states.js`)
require(`./sort.js`)
const ebus = require(`./utils/eBus.js`)

const AQUAController = require(`./components/controller.js`)
const AQUASongs = require(`./components/songs.js`)
const AQUASingers = require(`./components/singers.js`)
const AQUAMenu = require(`./components/menu.js`)
const AQUAMyMusic = require(`./components/myMusic.js`)
const AQUAAlbums = require(`./components/albums.js`)
const AQUASettings = require(`./components/settings.js`)

const {RouterEL, Router} = require(`./utils/router.js`)
//https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
// [1,2,3,4,5,6].diff( [3,4,5] )
// => [1, 2, 6]
Array.prototype.diff = function (a) {
  return this.filter(function (i) { return a.indexOf(i) < 0 })
}

customElements.define(`aqua-menu`, AQUAMenu)
customElements.define(`aqua-controller`, AQUAController)
customElements.define(`aqua-my-music`, AQUAMyMusic)
customElements.define(`aqua-settings`, AQUASettings)

const songsItems = new RouterEL(`songsItems`, document, AQUASongs, AQUASingers, AQUAAlbums)
storeStates.addCb(`RSongsItems`, item => {
  songsItems.to(item)
})
songsItems.to(`AQUASongs`)

const menuItems = new Router(`menuItems`)
menuItems.add(`aqua-list`, `aqua-settings`)
storeStates.addCb(`RMenuItems`, item => {
  menuItems.show(item)
})
menuItems.show(`aqua-list`)
