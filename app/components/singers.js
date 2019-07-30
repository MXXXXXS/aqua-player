const icons = require(`../assets/icons.js`)
const { singers } = require(`../assets/components.js`)
const store = require(`../states.js`)
const {sortUniqueIdWords} = require(`../utils/sortWords.js`)
const states = store.states

class AQUASingers extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    const root = this.shadowRoot
    shadow.innerHTML = singers

    const groupTemplate = (inital, items) => {
      const itemTemplate = (id, artist) =>
        `
      <div class="item" data-id="${id}">
          <div class="cover">
            <div class="icon play"></div>
            <div class="icon add"></div>
          </div>
          <div class="artist">${artist}</div>
        </div>
      `
      return `<div>
      <div class="letter">${inital}</div>
      <div class="group">
      ${items.map(item => {
    const id = item[0]
    const artist = item[1]
    return itemTemplate(id, artist)
  }).join(``)}
    </div>
    </div>`
    }

    setTimeout(() => {
      const { en: uen, zh: uzh} = sortUniqueIdWords(states.sList.map((song, i) => [i, song.artist]))
      function addGroups(sorted) {
        sorted.forEach(group => {
          const inital = group[0]
          const items = group.slice(1, group.length)
          groupTemplate(inital, items)
          root.innerHTML += groupTemplate(inital, items)
        })
      }
      
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

module.exports = AQUASingers