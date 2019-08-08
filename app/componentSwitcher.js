const AQUAController = require(`./components/controller.js`)
const AQUASongs = require(`./components/songs.js`)
const AQUASingers = require(`./components/singers.js`)
const AQUAMenu = require(`./components/menu.js`)
const AQUAMyMusic = require(`./components/myMusic.js`)
const AQUAAlbums = require(`./components/albums.js`)
const AQUASettings = require(`./components/settings.js`)
const AQUASongsSortedByAZ = require(`./components/songsSortedByAZ.js`)
const AQUASongsSortedBySingers = require(`./components/songsSortedBySingers.js`)
const AQUASongsSortedByAlbums = require(`./components/songsSortedByAlbums.js`)

const ebus = require(`./utils/eBus.js`)
const { RouterEL, Router } = require(`./utils/router.js`)
const { storeStates } = require(`./states.js`)
const states = storeStates.states

const menuItems = new Router(`menuItems`)
menuItems.add(`aqua-list`, `aqua-settings`)
storeStates.addCb(`RMenuItems`, item => {
  menuItems.show(item)
})

menuItems.show(`aqua-list`)
const songsItems = new RouterEL(`songsItems`, document, AQUASongs, AQUASongsSortedByAZ, AQUASongsSortedBySingers, AQUASongsSortedByAlbums, AQUASingers, AQUAAlbums)
//初始打开时默认显示
songsItems.to(`AQUASongs`)

if (storeStates.states.sortReady) {
  run()
} else {
  storeStates.addCb(`sortReady`, (ready) => {
    if (ready)
      run()
  })
}

ebus.on(`component switch`, switcher)

function switcher(RSongsItems, filterSortBy, filterType) {
  switch (RSongsItems) {
    case `AQUASongs`:
      if (filterSortBy === `A到Z` && filterType === `所有流派`) {
        songsItems.to(`AQUASongsSortedByAZ`)
      } else if (filterSortBy === `无` && filterType === `所有流派`) {
        songsItems.to(`AQUASongs`)
      } else if (filterSortBy === `歌手` && filterType === `所有流派`) {
        songsItems.to(`AQUASongsSortedBySingers`)
      } else if (filterSortBy === `专辑` && filterType === `所有流派`) {
        songsItems.to(`AQUASongsSortedByAlbums`)
      }
      break
    case `AQUASingers`:
      songsItems.to(`AQUASingers`)
      break
    case `AQUAAlbums`:
      songsItems.to(`AQUAAlbums`)
            
      break
  }
}
  
function run() {
  
}