const Store = require(`./utils/store.js`)
const states = new Store({
  playing: false,
  playingSongNum: 0,
  name: ``,
  artist: ``
})

module.exports = states