const { flatSortUniqueIdWords, sortUniqueIdWords } = require(`./utils/sortWords.js`)
const ebus = require(`./utils/eBus.js`)
const { listSList, storeStates } = require(`./states.js`)

let keySingers,
  keyYears,
  keyAlbums,
  keySongs,
  sortedSingers,
  sortedYears,
  sortedAlbums,
  sortedInitialSongs,
  sortedInitialSingers,
  sortedGenres

ebus.on(`Updated listSList and listSPath`, run)

function run() {
  storeStates.states.sortReady = false
  keySingers = []
  keyYears = []
  keyAlbums = []
  keySongs = []
  keyGenres = []

  listSList.list.forEach(item => {
    const key = item[1]
    const song = item[0]
    keySingers.push([key, song.artist])
    keyYears.push([key, song.year])
    keyAlbums.push([key, song.album])
    keySongs.push([key, song.title])
    keyGenres.push([key, song.genre])
  })

  sortedYears = () => flatSortUniqueIdWords(keyYears)
  sortedAlbums = () => flatSortUniqueIdWords(keyAlbums)
  sortedGenres = () => flatSortUniqueIdWords(keyGenres)
  sortedInitialSongs = () => sortUniqueIdWords(keySongs)
  sortedInitialSingers = () => sortUniqueIdWords(keySingers)
  sortedSingers = () => {
    const { en, zh } = sortedInitialSingers()
    return {
      en: en.map(group => group.slice(1, group.length)).flat(),
      zh: zh.map(group => group.slice(1, group.length)).flat()
    }
  }
  storeStates.states.sortFn = {
    sortedInitialSongs,
    sortedInitialSingers,
    sortedSingers,
    sortedAlbums,
    sortedYears,
    sortedGenres
  }
  storeStates.states.sortReady = true
  ebus.emit(`Sorting ready`)
}