const icons = require(`../assets/icons.js`)
const { singers } = require(`../assets/components.js`)
const { storeStates, shared } = require(`../states.js`)
const states = storeStates.states
const ebus = require(`../utils/eBus.js`)

class AQUASingers extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = singers
    this.root = this.shadowRoot

  }

  run() {
    const itemTemplate = (key, artist) =>
      `
    <div class="item" data-key="${key}">
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
    const key = item[0][0]
    const artist = item[1]
    return itemTemplate(key, artist)
  }).join(``)}
    </div>
    </div>`

    const main = this.root.querySelector(`#main`)
    main.innerHTML = ``
    shared.sortBuf.sortedInitialSingers = shared.sortBuf.sortedInitialSingers ?
      shared.sortBuf.sortedInitialSingers :
      states.sortFn.sortedInitialSingers()
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
    
    states.total = this.root.querySelectorAll(`.item`).length

    //主题色同步
    this.root.querySelector(`#main`).style.setProperty(`--themeColor`, states.themeColor)
    storeStates.watch(`themeColor`, themeColor => {
      this.root.querySelector(`#main`).style.setProperty(`--themeColor`, themeColor)
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

    if (states.sortReady) {
      this.run()
    }
  }

  disconnectedCallback() {
    console.log(`singers disconnected`)
    ebus.removeListener(`Sorting ready`, this.cb)
  }
}

module.exports = AQUASingers