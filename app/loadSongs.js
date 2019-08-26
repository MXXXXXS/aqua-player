const path = require(`path`)
const fs = require(`fs`)
const ebus = require(`./utils/eBus.js`)
const { listSList, storeStates, shared, playList } = require(`./states.js`)
const states = storeStates.states
const { getMetadata } = require(`./audio.js`)
const searchFolder = require(`./utils/searchFolder.js`)

async function getSongMeta(songPath) {
  songPath = path.normalize(songPath)
  const meta = await getMetadata(songPath)
  function escape(s) {
    let lookup = {
      '&': `&amp;`,
      '"': `&quot;`,
      '<': `&lt;`,
      '>': `&gt;`
    }
    return s.replace(/[&"<>]/g, (c) => lookup[c])
  }
  return {
    folder: path.dirname(songPath),
    path: songPath,
    picture: meta.common.picture ? meta.common.picture[0] : undefined,
    title: meta.common.title ? escape(meta.common.title) : escape(path.basename(songPath)),
    artist: meta.common.artist ? escape(meta.common.artist) : `未知艺术家`,
    album: meta.common.album ? escape(meta.common.album) : `未知专辑`,
    year: meta.common.year ? meta.common.year : `未知年份`,
    genre: meta.common.genre ? escape(meta.common.genre[0].toUpperCase()) : `未知流派`,
    duration: meta.format.duration,
    type: meta.format.codec
  }
}

function modifyStars(method, arg) {
  return new Promise((resolve, reject) => {
    const dbOpenReq = window.indexedDB.open(`myMusic`)

    dbOpenReq.onsuccess = e => {
      const db = dbOpenReq.result
      const tx = db.transaction(`stars`, `readwrite`)
      const stars = tx.objectStore(`stars`)

      tx.oncomplete = () => {
        // console.log(`stars modified`)
      }

      switch (method) {
        case `add`: {
          if (arg.length !== 0) {
            const folder_idx = stars.index(`folder_idx`)
            arg.forEach(folder => {
              const req = folder_idx.openKeyCursor(folder)
              req.onsuccess = async () => {
                if (!req.result) {
                  const paths = searchFolder(folder)
                  const songs = await Promise.all(paths.map(p => getSongMeta(p)))
                  const tx = db.transaction(`stars`, `readwrite`)
                  const stars = tx.objectStore(`stars`)
                  Promise.all(songs.map(song => new Promise((res, rej) => {
                    const req = stars.add(song)
                    req.onsuccess = () => {
                      res()
                    }
                    req.onerror = e => {
                      rej(e)
                    }
                  })
                  )).then(() => { resolve() })
                    .catch(e => reject(e))
                }
              }
              req.onerror = (e) => {
                console.error(`Error in "modifyStars" at "folder_idx.openKeyCursor" with method "add"\n${e}`)
              }
            })
          } else {
            resolve()
          }
        }
          break
        case `remove`: {
          if (arg.length !== 0) {
            const folder_idx = stars.index(`folder_idx`)
            arg.forEach(folder => {
              const req = folder_idx.openCursor(folder)
              req.onsuccess = async () => {
                const cursor = req.result
                if (cursor) {
                  cursor.delete()
                  cursor.continue()
                } else {
                  resolve()
                }
              }
              req.onerror = (e) => {
                reject()
                console.error(`Error in "modifyStars" at "folder_idx.openCursor" with method "remove"\n${e}`)
              }
            })
          } else {
            resolve()
          }
        }
          break
        case `getFolders`: {
          const folder_idx = stars.index(`folder_idx`)
          const req = folder_idx.openKeyCursor()
          let keys = []
          req.onsuccess = () => {
            const cursor = req.result
            if (cursor) {
              keys.push(cursor.key)
              cursor.continue()
            } else {
              resolve(Array.from(new Set(keys)))
            }
          }
          req.onerror = (e) => {
            console.error(`Error in "modifyStars" at "folder_idx.openKeyCursor" with method "getAll"\n${e}`)
          }
        }
          break
        case `refreshFolders`: {
          const folder_idx = stars.index(`folder_idx`)
          const req = folder_idx.openCursor()
          let keys = []
          const pathsInDB = []
          req.onsuccess = () => {
            const cursor = req.result
            if (cursor) {
              //先删除失效歌曲
              keys.push(cursor.key)
              const result = fs.existsSync(cursor.value.path)
              if (result) {
                pathsInDB.push(cursor.value.path)
              } else {
                cursor.delete()
              }
              cursor.continue()
            } else {
              //再添加新增歌曲
              const paths = []
              const folders = Array.from(new Set(keys))
              folders.forEach(folder => {
                paths.push(...searchFolder(folder))
              })
              Promise.all(paths.elsNotIn(pathsInDB).map(p => getSongMeta(p)))
                .then(songs => {
                  //这里拿到所有要添加的歌曲的信息, 加入数据库
                  Promise.all(songs.map(song => new Promise((res, rej) => {
                    const tx = db.transaction(`stars`, `readwrite`)
                    const stars = tx.objectStore(`stars`)
                    const req = stars.add(song)
                    req.onsuccess = () => {
                      res()
                    }
                    req.onerror = e => {
                      rej(e)
                    }
                  })))
                    .then(() => { resolve() }) //全部添加完毕
                    .catch(e => reject(e))
                })
                .catch(e => reject(e))
            }
          }
          req.onerror = (e) => {
            console.error(`Error in "modifyStars" at "folder_idx.openKeyCursor" with method "getAll"\n${e}`)
          }
        }
          break
        case `getSongs`: {
          const req = stars.getAll()
          req.onsuccess = () => {
            resolve(req.result)
          }
          req.onerror = (e) => {
            console.error(`Error in "modifyStars" at "stars.getAll" with method "getSongs"\n${e}`)
          }
        }
          break
      }
    }

    dbOpenReq.onerror = e => {
      console.error(`Error in "modifyStars"\n${e}`)
    }

    dbOpenReq.onupgradeneeded = e => {
      const db = dbOpenReq.result

      db.onversionchange = () => {
        db.close()
      }

      if (e.oldVersion < 1) {
        const stars = db.createObjectStore(`stars`, { keyPath: `path` })
        stars.createIndex(`folder_idx`, `folder`, { unique: false })

        db.createObjectStore(`playLists`, { keyPath: `name` })
      }
    }

    dbOpenReq.onblocked = e => {

    }
  })
}

async function refreshSongs() {
  await modifyStars(`refreshFolders`)
  modifyStars(`getSongs`)
    .then(songs => {
      listSList.changeSource(songs)

      /***********************初始化***********************/
      shared.pathItemBuf = {}
      if (listSList.list.length !== 0) {
        listSList.list.forEach((item, i) => {
          shared.pathItemBuf[item[0].path] = i
        })
        playList.changeSource(listSList.getIndexes())
        //检查当前的歌曲指针是否越界
        if (states.playListPointer >= playList.list.length) {
          states.playListPointer = playList.list.length - 1
        } else if (states.playListPointer < 0) {
          states.playListPointer = 0
        }
      } else {
        playList.changeSource([])
        states.playListPointer = -1
      }
      /***********************初始化***********************/

      //初始化完成信号
      states.sListLoaded = true
      ebus.emit(`Updated listSList and listSPath`)
      console.log(`refreshed`)
    })
}

function modifyPlayLists(method, ...args) {
  return new Promise((resolve, reject) => {
    const dbOpenReq = window.indexedDB.open(`myMusic`)

    dbOpenReq.onsuccess = e => {
      const db = dbOpenReq.result
      const tx = db.transaction(`playLists`, `readwrite`)
      const playLists = tx.objectStore(`playLists`)

      switch (method) {
        case `addToList`: {
          const paths = args[0]
          const playList = args[1]
          const override = args[2]

          const req = playLists.get(playList)
          req.onsuccess = () => {
            const tx = db.transaction(`playLists`, `readwrite`)
            const playLists = tx.objectStore(`playLists`)
            const result = req.result
            if (result) {
              if (override) {
                result.paths = paths
              } else {
                result.paths.push(...paths)
                result.paths = Array.from(new Set(result.paths))
              }
              const req = playLists.put(result)
              req.onsuccess = () => {
                resolve()
              }
              req.onerror = e => {
                reject(e)
              }
            } else {
              const req = playLists.add({
                name: playList,
                paths: paths
              })
              req.onsuccess = () => {
                resolve()
              }
              req.onerror = e => {
                reject(e)
              }
            }
          }
        }
          break
        case `removeFromList`: {
          const paths = args[0]
          const playList = args[1]

          const req = playLists.get(playList)
          req.onsuccess = () => {
            const result = req.result
            if (result) {
              paths.forEach(p => {
                const i = result.paths.indexOf(p)
                if (i > 0) {
                  result.paths.splice(i, 1)
                }
              })
              const req = playLists.put(result)
              req.onsuccess = () => {
                resolve()
              }
              req.onerror = e => {
                reject(e)
              }
            }
          }
          req.onerror = e => {
            reject(e)
          }
        }
          break
        case `removeList`: {
          const listsToRemove = args[0]

          const req = playLists.openCursor()
          req.onsuccess = () => {
            const cursor = req.result
            if (cursor) {
              if (listsToRemove === cursor.key) {
                cursor.delete()
                resolve()
              } else {
                cursor.continue()
              }
            } else {
              resolve()
            }
          }
          req.onerror = e => {
            reject(e)
          }
        }
          break
        case `getPlayList`: {
          const playList = args[0]

          const req = playLists.get(playList)
          req.onsuccess = () => {
            const result = req.result
            resolve(result)
          }
          req.onerror = e => {
            reject(e)
          }
        }
          break
        case `getNames`: {
          const req = playLists.getAllKeys()
          req.onsuccess = () => {
            const result = req.result
            resolve(result)
          }
          req.onerror = e => {
            reject(e)
          }
        }
          break
      }
    }
  })
}

module.exports = { modifyStars, modifyPlayLists, refreshSongs }