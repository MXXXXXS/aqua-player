const Store = require(`./utils/store.js`)
const {songslist, songsPath} = require(`./loadSongs.js`)

// run()

async function run() {
  const sList = await songslist
  const sPath = songsPath
  console.log(sPath, sList)
  return {sPath, sList}
}

module.exports = run()