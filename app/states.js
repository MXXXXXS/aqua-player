const {Store, List} = require(`./utils/store.js`)
const storeStates = new Store({
  currentDBVer: ``,
  sListLoaded: false,
  playing: false,
  playingSongNum: 0,
  name: ``,
  artist: ``,
  total: 0,
  playMode: `unset`, //unset, singleCycle, listCycle, random
  RSongsItems: `AQUASongs`, //AQUASongs, AQUASingers, AQUAAlbums
  RMenuItems: `aqua-my-music` //aqua-my-music, aqua-settings
})

const listSList = new List([])

const listSPath = new List([])

module.exports = {storeStates, listSList, listSPath}