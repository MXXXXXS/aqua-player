const { myMusic } = require(`../assets/components.js`)
const {storeStates} = require(`../states.js`)
const states = storeStates.states
class AQUAMyMusic extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    const root = this.shadowRoot
    shadow.innerHTML = myMusic
    run()

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
    async function run() {
    }
  }
}

module.exports = AQUAMyMusic