const { myMusic } = require(`../assets/components.js`)
const icons = require(`../assets/icons.js`)
const { storeStates } = require(`../states.js`)
const states = storeStates.states
class AQUAMyMusic extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    const root = this.shadowRoot
    shadow.innerHTML = myMusic

    storeStates.add(`total`, root.querySelector(`#total`), `innerText`)

    root.querySelector(`.songs`).addEventListener(`click`, () => {
      storeStates.states.RSongsItems = `AQUASongs`
    })
    root.querySelector(`.singers`).addEventListener(`click`, () => {
      storeStates.states.RSongsItems = `AQUASingers`
    })
    root.querySelector(`.albums`).addEventListener(`click`, () => {
      storeStates.states.RSongsItems = `AQUAAlbums`
    })

    root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })

  }

  run() {
    
  }

  connectedCallback() {
    this.cb = () => {
      shared.sortBuf = {}
      this.run()
    }

    ebus.on(`Updated listSList and listSPath`, this.cb)

    if (storeStates.states.sListLoaded) {
      this.run()
    }
  }

  disconnectedCallback() {
    ebus.removeListener(`Updated listSList and listSPath`, this.cb)
  }
}

module.exports = AQUAMyMusic