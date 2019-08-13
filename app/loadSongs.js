const path = require(`path`)
const ebus = require(`./utils/eBus.js`)
const { listSList, storeStates, listSPath, shared } = require(`./states.js`)
const { getMetadata } = require(`./audio.js`)
const searchFolder = require(`./utils/searchFolder.js`)

async function collectSongs(songPath) {
  const meta = await getMetadata(songPath)
  return {
    filePath: songPath,
    picture: meta.common.picture ? meta.common.picture[0] : undefined,
    title: meta.common.title ? meta.common.title : path.basename(songPath),
    artist: meta.common.artist ? meta.common.artist : `未知艺术家`,
    album: meta.common.album ? meta.common.album : `未知专辑`,
    year: meta.common.year ? meta.common.year : `未知年份`,
    genre: meta.common.genre ? meta.common.genre[0].toUpperCase() : `未知流派`,
    duration: meta.format.duration,
    type: meta.format.codec
  }
}

function inspectSongs(db, songsPaths) {
  const buf = []
  for (let i = 0; i < songsPaths.length; i++) {
    if (Array.from(db.objectStoreNames).includes(songsPaths[i])) {
      buf.push(new Promise((res, rej) => {
        const songsPath = songsPaths[i]

        const request = db.transaction([songsPath], `readonly`)
          .objectStore(songsPath)
          .get(`list`)

        request.onerror = e => { rej(e) }

        request.onblocked = e => { request }

        request.onsuccess = async e => {
          let inDB = request.result || []
          const initialLength = inDB.length
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

          console.log(`当前仓库: ${songsPath}\n库内已有: ${initialLength} 项\n移除: ${songsToDrop.length} 项, 新增: ${songsToAdd.length} 项`)
          res(inDB)
        }
      }).catch(e => { console.error(e) }))
    }
  }
  return buf
}

async function loadSongs(songsPaths, version) {
  //有songsPaths传入, 触发更新, 以同步数据库
  if (Array.isArray(songsPaths)) {
    version = storeStates.states.currentDBVer + 1
  }

  let DBOpenRequest

  if (!version) {
    DBOpenRequest = window.indexedDB.open(`aqua-player`)
  } else {
    DBOpenRequest = window.indexedDB.open(`aqua-player`, version)
  }
  DBOpenRequest.onblocked = e => {
    console.log(`Waiting for old version db closing`)
  }
  DBOpenRequest.onsuccess = async e => {
    console.log(`success`)
    const db = DBOpenRequest.result
    storeStates.states.currentDBVer = db.version
    const pathsInDb = Array.from(db.objectStoreNames)

    const newList = (await Promise.all(await inspectSongs(db, pathsInDb))).flat()

    listSPath.changeSource(pathsInDb)
    listSList.changeSource(newList)
    //已更新, 但没触发变化信号, 用于初始化
    shared.playList = []
    
    listSList.list.forEach((item, i) => {
      shared.keyItemBuf[item[1]] = i
      shared.playList.push(i)
    })
    
    const legal = storeStates.states.keyOfSrcBuf <= shared.playList.length &&
    shared.playList.length !== 0

    if (!legal) {
      storeStates.states.keyOfSrcBuf = shared.playList.length - 1
    }
    //触发变化信号
    storeStates.states.sListLoaded = true
    ebus.emit(`Updated listSList and listSPath`)
  }
  DBOpenRequest.onerror = e => {
    console.error(e.srcElement.error.message)
  }
  DBOpenRequest.onupgradeneeded = async e => {
    console.log(`upgradeneeded`)
    storeStates.states.sListLoaded = false
    shared.keyItemBuf = {}
    const db = DBOpenRequest.result
    let pathsInDb = Array.from(db.objectStoreNames)
    if (songsPaths) { //第一次启动数据库时, songsPaths不存在, 但又会触发upgradeneeded
      const newPaths = songsPaths.diff(pathsInDb)
      const dropPaths = pathsInDb.diff(songsPaths)
      newPaths.forEach(pathToAdd => {
        console.log(`pathToAdd: `, pathToAdd)
        db.createObjectStore(pathToAdd, { autoIncrement: true })
      })
      dropPaths.forEach(pathToDrop => {
        console.log(`pathToDrop: `, pathToDrop)
        db.deleteObjectStore(pathToDrop)
      })
      db.onversionchange = () => {
        DBOpenRequest.result.close()
        console.log(`Version change, closing current db`)
      }
    }
  }
}

module.exports = { loadSongs }