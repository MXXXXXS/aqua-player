const Store = require(`./utils/store.js`)
const songsPromise = require(`./loadSongs.js`)

// run()

async function run() {
  const songs = await songsPromise
  console.log(songs)
  return songs
}

module.exports = run()