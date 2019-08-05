const icons = require(`../assets/icons.js`)
const { singers } = require(`../assets/components.js`)
const {listSList} = require(`../states.js`)
const {sortUniqueIdWords} = require(`../utils/sortWords.js`)
const ebus = require(`../utils/eBus.js`)

class AQUASingers extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = singers
    const root = this.shadowRoot
    const main = root.querySelector(`#main`)

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

    if (storeStates.states.sListLoaded) {
      run()
    } else {
      storeStates.addCb(`sListLoaded`, (ready) => {
        if (ready) run()
      })
    }

    ebus.on(`Updated listSList and listSPath`, run)

    async function run() {
      main.innerHTML = ``
      const { en: uen, zh: uzh} = sortUniqueIdWords(listSList.list.map((song, i) => [i, song.artist]))
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

      root.querySelectorAll(`.icon`).forEach(el => {
        el.innerHTML = icons[el.classList[1]]
      })

    }
  }
}

module.exports = AQUASingers