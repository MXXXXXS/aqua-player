const { albums } = require(`../assets/components.js`)
const icons = require(`../assets/icons.js`)
const ebus = require(`../utils/eBus.js`)
const { sortUniqueIdWords } = require(`../utils/sortWords.js`)
const { storeStates, listSList, listSPath } = require(`../states.js`)
const states = storeStates.states
class AQUAAlbums extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    const root = this.shadowRoot
    this.root = root
    shadow.innerHTML = albums
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
      <div data-key="${key}">
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

  }

  connectedCallback() {
    this.cb = () => {
      console.log(`album sort`)
      this.run()
    }
    ebus.on(`Sorting ready`, this.cb)
    console.log(`albums connected`)

    if (storeStates.states.sortReady) {
      this.run()
    }
  }

  disconnectedCallback() {
    console.log(`albums disconnected`)
    ebus.removeListener(`Sorting ready`, this.cb)
  }
}

module.exports = AQUAAlbums