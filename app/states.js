const {Store, List} = require(`./utils/store.js`)
const storeStates = new Store({
  playing: false,
  playingSongNum: 0,
  name: ``,
  artist: ``,
  total: 0,
  playMode: `unset`, //unset, singleCycle, listCycle, random
  myMusicTagMode: `songs` //songs, singers, albums
})

const listSList = new List([])

const listSPath = new List([])

module.exports = {storeStates, listSList, listSPath}