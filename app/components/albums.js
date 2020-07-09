const { albums } = require(`../assets/components.js`)
const icons = require(`../assets/icons.js`)
const ebus = require(`../utils/eBus.js`)
const { storeStates, listSList, shared } = require(`../states.js`)
const states = storeStates.states
class AQUAAlbums extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    const root = this.shadowRoot
    this.root = root
    shadow.innerHTML = albums

    this.coverBuffers = []
  }

  run() {
    const albums = []
    const albumNames = []
    listSList.list.forEach(item => {
      const key = item[1]
      const song = item[0]

      if (!albumNames.includes(song.album)) {
        albums.push([key, song])
        albumNames.push(song.album)
      }
    })

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

    const root = this.root
    const main = root.querySelector(`#main`)
    main.innerHTML = ``
    albums.forEach(item => {
      main.innerHTML += itemTemplate(...item)
    })

    root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })
    
    const allItems = Array.from(this.root.querySelectorAll(`.item`))
    states.total = allItems.length

    allItems.forEach((item, i) => {
      const key = item.dataset.key
      const song = listSList.kGet(key)[0]
      this.coverBuffers.push({})
      shared.drawCover(this.coverBuffers[i], song.picture, icons, `.item[data-key="${key}"] .coverContainer`, root)
    })
    
  }

  connectedCallback() {
    this.cb = () => {
      console.log(`album sort`)
      this.run()
    }
    ebus.on(`Sorting ready`, this.cb)
    console.log(`albums connected`)

    if (states.sortReady) {
      this.run()
    }
  }

  disconnectedCallback() {
    console.log(`albums disconnected`)
    this.coverBuffers.forEach(coverBuffer => {
      URL.revokeObjectURL(coverBuffer.imgUrl)
    })
    ebus.removeListener(`Sorting ready`, this.cb)
  }
}

customElements.define(`aqua-albums`, AQUAAlbums)

module.exports = AQUAAlbums