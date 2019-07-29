const { myMusic } = require(`../assets/components.js`)
const store = require(`../states.js`)
class AQUAMyMusic extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    const root = this.shadowRoot
    shadow.innerHTML = myMusic
    run()

    const total = root.querySelector(`#total`)

    store.add(`total`, total, `innerText`)

    async function run() {
    }
  }
}

module.exports = AQUAMyMusic