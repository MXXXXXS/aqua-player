const icons = require(`../assets/icons.js`)
const { albumsSortedByAZ } = require(`../assets/components.js`)
const { storeStates, shared, listSList } = require(`../states.js`)
const states = storeStates.states
const ebus = require(`../utils/eBus.js`)

class AQUAAlbumsSortedByAZ extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = albumsSortedByAZ
    this.root = this.shadowRoot

    this.coverBuffers = []
  }

  run() {
    const itemTemplate = function (key, song) {
      if (states.filterType === song.genre || states.filterType === `所有流派`) {
        return `
      <div class="item" data-key="${key}">
          <div class="cover">
          <div class="coverContainer"></div>
            <div class="icon play"></div>
            <div class="icon add"></div>
          </div>
          <div class="info">
          <div class="name">${song.album}</div>
          <div class="artist">${song.artist}</div>
        </div>
        </div>
      `
      } else {
        return ``
      }
    }

    const groupTemplate = function (inital, items) {
      const keys = items.map(item => item[0][0])

      const itemsString = keys.map(k => {
        const song = listSList.list[shared.keyItemBuf[k]][0]
        return itemTemplate(k, song)
      }).join(``)

      if (itemsString !== ``) {
        return `<div>
        <div class="letter">${inital}</div>
        <div class="group">
        ${itemsString}
      </div>
      </div>`
      } else {
        return ``
      }
    }

    const main = this.root.querySelector(`#main`)
    main.innerHTML = ``
    shared.sortBuf.sortedInitialAlbums = shared.sortBuf.sortedInitialAlbums ?
      shared.sortBuf.sortedInitialAlbums :
      storeStates.states.sortFn.sortedInitialAlbums()
    const { en: uen, zh: uzh } = shared.sortBuf.sortedInitialAlbums
    function addGroups(sorted) {
      sorted.forEach(group => {
        const inital = group[0]
        const items = group.slice(1, group.length)
        groupTemplate(inital, items)
        main.innerHTML += groupTemplate(inital, items)
      })
    }

    addGroups(uen)
    addGroups(uzh)

    this.root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })
    
    const allItems = Array.from(this.root.querySelectorAll(`.item`))
    states.total = allItems.length

    allItems.forEach((item, i) => {
      const key = item.dataset.key
      const song = listSList.list[shared.keyItemBuf[key]][0]
      this.coverBuffers.push({})
      shared.drawCover(this.coverBuffers[i], song.picture, icons, `.item[data-key="${key}"] .coverContainer`, this.root)
    })
  }

  connectedCallback() {
    this.cb = () => {
      console.log(`albums sort by year`)
      shared.sortBuf = {}
      this.run()
    }
    ebus.on(`Sorting ready`, this.cb)
    console.log(`AQUAAlbumsSortedByAZ connected`)

    if (storeStates.states.sortReady) {
      this.run()
    }
  }

  disconnectedCallback() {
    console.log(`AQUAAlbumsSortedByAZ disconnected`)
    this.coverBuffers.forEach(coverBuffer => {
      URL.revokeObjectURL(coverBuffer.imgUrl)
    })
    ebus.removeListener(`Sorting ready`, this.cb)
  }
}

module.exports = AQUAAlbumsSortedByAZ