const AQUASongs = require(`./components/songs.js`)
const AQUASingers = require(`./components/singers.js`)
const AQUAAlbums = require(`./components/albums.js`)
const AQUASongsSortedByAZ = require(`./components/songsSortedByAZ.js`)
const AQUASongsSortedBySingers = require(`./components/songsSortedBySingers.js`)
const AQUASongsSortedByAlbums = require(`./components/songsSortedByAlbums.js`)
const AQUAAlbumsSortedByYears = require(`./components/albumsSortedByYears.js`)
const AQUAAlbumsSortedBySingers = require(`./components/albumsSortedBySingers.js`)
const AQUAAlbumsSortedByAZ = require(`./components/albumsSortedByAZ.js`)

const ebus = require(`./utils/eBus.js`)
const { RouterEL, Router } = require(`./utils/router.js`)
const { storeStates } = require(`./states.js`)
const states = storeStates.states

//条件显示
const currentPlayingSwitcher = new Router(`currentPlayingSwitcher`)
currentPlayingSwitcher.add(`#main`, `aqua-current-playing`)
storeStates.watch(`RMainCurrentPlaying`, item => {
  currentPlayingSwitcher.show(item)
})

currentPlayingSwitcher.show(`#main`)

const menuItems = new Router(`menuItems`)
menuItems.add(`aqua-list`, `aqua-settings`, `aqua-play-list`)
storeStates.watch(`RMenuItems`, item => {
  menuItems.show(item)
})

menuItems.show(`aqua-list`)

//条件渲染
const songsItems = new RouterEL(`songsItems`, document, AQUAAlbumsSortedBySingers, AQUAAlbumsSortedByAZ, AQUAAlbumsSortedByYears, AQUASongs, AQUASongsSortedByAZ, AQUASongsSortedBySingers, AQUASongsSortedByAlbums, AQUASingers, AQUAAlbums)

//初始打开时默认显示
// songsItems.to(`AQUASongs`)

ebus.on(`component switch`, switcher)

function switcher(RSongsItems, filterSortBy, filterType) {
  console.log(...arguments)
  switch (RSongsItems) {
    case `AQUASongs`:
      if (filterSortBy === `A到Z`) {
        songsItems.to(`AQUASongsSortedByAZ`)
      } else if (filterSortBy === `无`) {
        songsItems.to(`AQUASongs`)
      } else if (filterSortBy === `歌手`) {
        songsItems.to(`AQUASongsSortedBySingers`)
      } else if (filterSortBy === `专辑`) {
        songsItems.to(`AQUASongsSortedByAlbums`)
      } else {
        songsItems.to(`AQUASongs`)
      }
      break
    case `AQUASingers`:
      songsItems.to(`AQUASingers`)
      break
    case `AQUAAlbums`:
      if (filterSortBy === `发行年份`) {
        songsItems.to(`AQUAAlbumsSortedByYears`)
      } else if (filterSortBy === `无`) {
        songsItems.to(`AQUAAlbums`)
      } else if (filterSortBy === `A到Z`) {
        songsItems.to(`AQUAAlbumsSortedByAZ`)
      } else if (filterSortBy === `歌手`) {
        songsItems.to(`AQUAAlbumsSortedBySingers`)
      } else {
        songsItems.to(`AQUAAlbums`)
      }
      break
  }
}

if (states.sortReady) {
  run()
} else {
  storeStates.watch(`sortReady`, (ready) => {
    if (ready)
      run()
  })
}

function run() {
  
}