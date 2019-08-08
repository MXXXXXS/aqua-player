const {Store, List} = require(`./utils/store.js`)

const shared = {
  sortBuf: {},
  keyItemBuf: {},
  playList: []
}

const storeStates = new Store({
  themeColor: `rgb(113, 204, 192)`,
  sortReady: false,
  sortFn: ``,
  currentDBVer: ``,
  sListLoaded: false,
  playing: false,
  playingSongNum: 0,
  name: ``,
  artist: ``,
  total: 0,
  playMode: `unset`, //unset, singleCycle, listCycle, random
  RSongsItems: `AQUASongs`, //AQUASongs, AQUASingers, AQUAAlbums
  RMenuItems: `aqua-my-music`, //aqua-my-music, aqua-settings
  filterSortBy: ``,
  filterType: ``
})

const listSList = new List([])

const listSPath = new List([])

const sortType = new List([])

module.exports = {storeStates, listSList, listSPath, shared, sortType}