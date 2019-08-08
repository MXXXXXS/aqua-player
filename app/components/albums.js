const { albums } = require(`../assets/components.js`)
const icons = require(`../assets/icons.js`)
const ebus = require(`../utils/eBus.js`)
const { sortUniqueIdWords } = require(`../utils/sortWords.js`)
const { storeStates, listSList, listSPath } = require(`../states.js`)
class AQUAAlbums extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    const root = this.shadowRoot
    this.root = root
    shadow.innerHTML = albums
  }

  run() {
    const groupTemplate = (inital, items) => {
      const itemTemplate = (id, item) =>
        `
      <div data-id="${id}">
        <div class="cover">
          <div class="icon play"></div>
          <div class="icon add"></div>
        </div>
        <div class="info">
          <div class="name">${item.album}</div>
          <div class="artist">${item.artist}</div>
        </div>
      </div>
      `
      return items.map(item => {
        const id = item[0][0]
        const album = item[1]
        return itemTemplate(id, { album: album, artist: listSList.list[id][0].artist })
      }).join(``)
    }
    const root = this.root
    const main = root.querySelector(`#main`)
    main.innerHTML = ``
    const { en: uen, zh: uzh } = sortUniqueIdWords(listSList.list.map((song, i) => [i, song[0].album]))
    function addGroups(sorted) {
      sorted.forEach(group => {
        const inital = group[0]
        const items = group.slice(1, group.length)
        main.innerHTML += groupTemplate(inital, items)
      })
    }

    addGroups(uen)
    addGroups(uzh)

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