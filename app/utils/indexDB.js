module.exports = class IDB {
  constructor(DBName, keyPath, objStoName = DBName, version = 1) {
    this.objStoName = objStoName
    let request = this.request
    request = window.indexedDB.open(DBName, version)
    request.onsuccess = e => {
      this.db = request.result
      console.log(`indexedDB opened`)
    }
    request.onerror = e => {
      console.error(`indexedDB opening flailed\n${e.message}`)
    }
    request.onupgradeneeded = e => {
      this.db = e.target.result
      if (!this.db.objectStoreNames.contains(objStoName)) {
        this.db.createObjectStore(objStoName, {
          keyPath: keyPath
        })
      }
    }
  }
  put(item) {
    return new Promise((res, rej) => {
      let request = this.db
        .transaction(this.objStoName, `readwrite`)
        .objectStore(this.objStoName)
        .put(item)

      request.onsuccess = e => {
        console.log(`PUT successed\n${e}`)
        res()
      }

      request.onerror = e => {
        console.error(`PUT failed\n${e}`)
        rej()
      }
    })
  }
  get(keyPath) {
    return new Promise((res, rej) => {
      let request = this.db
        .transaction(this.objStoName)
        .objectStore(this.objStoName)
        .get(keyPath)

      request.onsuccess = e => {
        console.log(`GET successed\n${e}`)
        if (request.result) {
          console.log(`Got ${keyPath}`)
          res(request.result)
        } else {
          console.warn(`There is no result indexed by ${keyPath}`)
          rej()
        }
      }

      request.onerror = e => {
        console.error(`GET failed\n${e}`)
        rej()
      }
    })
  }
  getAll() {
    return new Promise((res, rej) => {
      let counter = 0
      let list = []
      let request = this.db
        .transaction(this.objStoName)
        .objectStore(this.objStoName)
        .openCursor()

      request.onsuccess = e => {
        let cursor = e.target.result
        if (cursor) {
          counter++
          list.push(cursor.value)
          cursor.continue()
        } else {
          console.log(`Traversed ${counter} recordsre`)
          res(list)
        }
      }

      request.onerror = e => {
        rej(e)
      }
    })
  }
  delete(keyPath) {
    return new Promise((res, rej) => {
      let request = this.db
        .transaction(this.objStoName, `readwrite`)
        .objectStore(this.objStoName)
        .delete(keyPath)

      request.onsuccess = e => {
        res(keyPath)
      }

      request.onerror = e => {
        rej(false)
      }
    })
  }
}