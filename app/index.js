//https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
// [1,2,3,4,5,6].diff( [3,4,5] )
// => [1, 2, 6]
Array.prototype.diff = function (a) {
  return this.filter(function (i) { return a.indexOf(i) < 0 })
}
const {storeStates, listSPath, listSList, shared, sortType} = require(`./states.js`)
const ebus = require(`./utils/eBus.js`)
require(`./sort.js`)
require(`./componentSwitcher.js`)

const AQUAController = require(`./components/controller.js`)
const AQUAMenu = require(`./components/menu.js`)
const AQUAMyMusic = require(`./components/myMusic.js`)
const AQUASettings = require(`./components/settings.js`)
const AQUACurrentPlaying = require(`./components/currentPlaying.js`)

customElements.define(`aqua-menu`, AQUAMenu)
customElements.define(`aqua-controller`, AQUAController)
customElements.define(`aqua-my-music`, AQUAMyMusic)
customElements.define(`aqua-settings`, AQUASettings)
customElements.define(`aqua-current-playing`, AQUACurrentPlaying)