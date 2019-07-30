const { albums } = require(`../assets/components.js`)
const { sortUniqueIdWords } = require(`../utils/sortWords.js`)
const store = require(`../states.js`)
const states = store.states
class AQUAAlbums extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    const root = this.shadowRoot
    shadow.innerHTML = albums

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
        return itemTemplate(id, { album: album, artist: states.sList[id].artist })
      }).join(``)

    }

    setTimeout(() => {
      const { en: uen, zh: uzh } = sortUniqueIdWords(states.sList.map((song, i) => [i, song.album]))
      function addGroups(sorted) {
        sorted.forEach(group => {
          const inital = group[0]
          const items = group.slice(1, group.length)
          groupTemplate(inital, items)
          root.innerHTML += groupTemplate(inital, items)
        })
      }
      console.log(uen)
      console.log(uzh)

      addGroups(uen)
      addGroups(uzh)

      root.querySelectorAll(`.icon`).forEach(el => {
        el.innerHTML += icons[el.classList[1]]
      })
    }, 1000)

    run()

    async function run() {
    }
  }
}

module.exports = AQUAAlbums