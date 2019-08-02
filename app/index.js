const Router = require(`./utils/router.js`)
const {storeStates} = require(`./states.js`)
const AQUAController = require(`./components/controller.js`)
const AQUASongs = require(`./components/songs.js`)
const AQUASingers = require(`./components/singers.js`)
const AQUAMenu = require(`./components/menu.js`)
const AQUAMyMusic = require(`./components/myMusic.js`)
const AQUAAlbums = require(`./components/albums.js`)
const AQUASettings = require(`./components/settings.js`)

//https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
// [1,2,3,4,5,6].diff( [3,4,5] )
// => [1, 2, 6]
Array.prototype.diff = function (a) {
  return this.filter(function (i) { return a.indexOf(i) < 0 })
}

window.customElements.define(`aqua-menu`, AQUAMenu)
window.customElements.define(`aqua-songs`, AQUASongs)
window.customElements.define(`aqua-singers`, AQUASingers)
window.customElements.define(`aqua-albums`, AQUAAlbums)
window.customElements.define(`aqua-controller`, AQUAController)
window.customElements.define(`aqua-my-music`, AQUAMyMusic)
window.customElements.define(`aqua-settings`, AQUASettings)

function sel(selector) {
  return document.querySelector(selector)
}

storeStates.addCb(`sListLoaded`, (ready) => {
  if (ready) {

    const menuItems = new Router(`menuItems`)
    const aquaInfo = sel(`aqua-info`)
    const aquaSettings = sel(`aqua-settings`)
    menuItems.add(aquaInfo, aquaSettings)
    menuItems.show(aquaInfo)
  }

})
