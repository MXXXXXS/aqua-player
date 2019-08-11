const icons = require(`../assets/icons.js`)
const { albumsSortedByYears } = require(`../assets/components.js`)
const { storeStates, shared } = require(`../states.js`)
const states = storeStates.states
const ebus = require(`../utils/eBus.js`)

class AQUAAlbumsSortedByYears extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = albumsSortedByYears
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

    const groupTemplate = function (group) {
      const keys = []
      const albums = []
      group[0].forEach(key => {
        const album = listSList.list[shared.keyItemBuf[key]][0].album
        if (!albums.includes(album)) {
          albums.push(album)
          keys.push(key)
        }
      })

      const itemsString = keys.map(k => {
        let strBuf = ``
        const song = listSList.list[shared.keyItemBuf[k]][0]
        strBuf += itemTemplate(k, song)
        return strBuf
      }).join(``)

      if (itemsString !== ``) {
        return `<div>
    <div class="letter">${group[1]}</div>
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
    shared.sortBuf.sortedYears = shared.sortBuf.sortedYears ?
      shared.sortBuf.sortedYears :
      storeStates.states.sortFn.sortedYears()
    const { en: uen, zh: uzh } = shared.sortBuf.sortedYears
    function addGroups(sorted) {
      sorted.forEach(group => {
        groupTemplate(group)
        main.innerHTML += groupTemplate(group)
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
    console.log(`AQUAAlbumsSortedByYears connected`)

    if (storeStates.states.sortReady) {
      this.run()
    }
  }

  disconnectedCallback() {
    console.log(`AQUAAlbumsSortedByYears disconnected`)
    this.coverBuffers.forEach(coverBuffer => {
      URL.revokeObjectURL(coverBuffer.imgUrl)
    })
    ebus.removeListener(`Sorting ready`, this.cb)
  }
}

module.exports = AQUAAlbumsSortedByYears