const path = require(`path`)
const { listSList, storeStates } = require(`./states.js`)
const { getMetadata } = require(`./audio.js`)
const searchFolder = require(`./utils/searchFolder.js`)
const songsPaths = [`D:/UW/CloudMusic`, `E:/Jdownload/ANIME CLASSIC`]

//https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
// [1,2,3,4,5,6].diff( [3,4,5] )
// => [1, 2, 6]
Array.prototype.diff = function (a) {
  return this.filter(function (i) { return a.indexOf(i) < 0 })
}

async function collectSongs(songPath) {
  const meta = await getMetadata(songPath)
  return {
    filePath: songPath,
    picture: meta.common.picture ? meta.common.picture[0] : undefined,
    title: meta.common.title ? meta.common.title : path.basename(filePath),
    artist: meta.common.artist ? meta.common.artist : `未知艺术家`,
    album: meta.common.album ? meta.common.album : `未知专辑`,
    year: meta.common.year ? meta.common.year : `未知年份`,
    genre: meta.common.genre ? meta.common.genre[0] : `未知流派`,
    duration: meta.format.duration,
    type: meta.format.codec
  }
}

function inspectSongs(db) {
  const buf = []
  for (let i = 0; i < songsPaths.length; i++) {
    buf.push(new Promise((res, rej) => {

      const buf = []
      const songsPath = songsPaths[i]

      const request = db.transaction([songsPath], `readonly`)
        .objectStore(songsPath)
        .get(`list`)

      request.onerror = e => { rej(e) }

      request.onsuccess = async e => {
        let inDB = request.result || []
        // if (inDB.length !== 0) {
        console.log(inDB)

        const inDBTitle = inDB.map(song => path.basename(song.filePath))
        const inFs = searchFolder(path.resolve(songsPath), false).map(p => path.basename(p))

        const songsToDrop = inDBTitle.diff(inFs)
        const songsToAdd = inFs.diff(inDBTitle)

        for (let i = 0; i < songsToAdd.length; i++) {
          const basename = songsToAdd[i]
          inDB.push(await collectSongs(path.join(songsPath, basename)))
        }

        songsToDrop.forEach(songToDrop => {
          for (let i = 0; i < inDB.length; i++) {
            const song = inDB[i]
            if (song.filePath === path.join(songsPath, songToDrop))
              inDB.splice(i, 1)
          }
        })

        db.transaction([songsPath], `readwrite`)
          .objectStore(songsPath)
          .put(inDB, `list`)

        console.log(songsToDrop, songsToAdd)
        res(inDB)
        // }
      }
    }).catch(e => { console.error(e) }))
  }
  return buf
}

async function loadSongs() {
  // const buf = await collectSongs()
  const DBOpenRequest = window.indexedDB.open(`aqua-player`, 1)
  DBOpenRequest.onsuccess = async e => {
    const db = DBOpenRequest.result
    // console.log(`db`)
    // for (const key in buf) {
    //   if (buf.hasOwnProperty(key)) {
    //     const element = buf[key]
    //     const trans = db.transaction([key], `readwrite`)
    //     trans.objectStore(key)
    //       .put(element, `list`)
    //   }
    // }
    listSList.list.push(...(await Promise.all(await inspectSongs(db))).flat())
    storeStates.states.sListLoaded = true
  }
  DBOpenRequest.onerror = e => {
    console.error(e)
  }
  DBOpenRequest.onupgradeneeded = e => {
    console.log(`upgradeneeded`)
    songsPaths.forEach(songsPath => {
      const db = DBOpenRequest.result
      if (!db.objectStoreNames.contains(songsPath)) {
        db.createObjectStore(songsPath, { autoIncrement: true })
      }
    })
  }
  DBOpenRequest.onversionchange = () => {
    console.log(`version change`)
  }
}

module.exports = loadSongs