const icons = require(`../assets/icons.js`)
const { singers } = require(`../assets/components.js`)
const { storeStates, shared } = require(`../states.js`)
const ebus = require(`../utils/eBus.js`)

class AQUASingers extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = singers
    this.root = this.shadowRoot

  }

  run() {
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

    const groupTemplate = (inital, items) =>
      `<div>
      <div class="letter">${inital}</div>
      <div class="group">
      ${items.map(item => {
    const id = item[0]
    const artist = item[1]
    return itemTemplate(id, artist)
  }).join(``)}
    </div>
    </div>`

    const main = this.root.querySelector(`#main`)
    main.innerHTML = ``
    shared.sortBuf.sortedInitialSingers = shared.sortBuf.sortedInitialSingers ?
      shared.sortBuf.sortedInitialSingers :
      storeStates.states.sortFn.sortedInitialSingers()
    const { en: uen, zh: uzh } = shared.sortBuf.sortedInitialSingers
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
  }

  connectedCallback() {
    this.cb = () => {
      console.log(`singer sort`)
      shared.sortBuf = {}
      this.run()
    }
    ebus.on(`Sorting ready`, this.cb)
    console.log(`singers connected`)

    if (storeStates.states.sortReady) {
      this.run()
    }
  }

  disconnectedCallback() {
    console.log(`singers disconnected`)
    ebus.removeListener(`Sorting ready`, this.cb)
  }
}

module.exports = AQUASingers