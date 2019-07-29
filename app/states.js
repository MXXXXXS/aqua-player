const Store = require(`./utils/store.js`)
const states = new Store({
  playing: false,
  playingSongNum: 0,
  name: ``,
  artist: ``,
  total: 0,
  sPath: [],
  sList: [],
  myMusicTagMode: `songs` //songs, singers, albums
})

module.exports = states