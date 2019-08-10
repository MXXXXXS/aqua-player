const icons = require(`../assets/icons.js`)
const { albumsSortedByYears } = require(`../assets/components.js`)
const { storeStates, shared } = require(`../states.js`)
const ebus = require(`../utils/eBus.js`)

class AQUAAlbumsSortedByYears extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = albumsSortedByYears
    this.root = this.shadowRoot

  }

  run() {
    const itemTemplate = (key, song) =>
      `
    <div class="item" data-key="${key}">
        <div class="cover">
          <div class="icon play"></div>
          <div class="icon add"></div>
        </div>
        <div class="info">
        <div class="name">${song.album}</div>
        <div class="artist">${song.artist}</div>
      </div>
      </div>
    `

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
      return `<div>
      <div class="letter">${group[1]}</div>
      <div class="group">
      ${keys.map(k => {
    let strBuf = ``
    const song = listSList.list[shared.keyItemBuf[k]][0]
    strBuf += itemTemplate(k, song)
    return strBuf
  }).join(``)}
    </div>
    </div>`
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
    ebus.removeListener(`Sorting ready`, this.cb)
  }
}

module.exports = AQUAAlbumsSortedByYears