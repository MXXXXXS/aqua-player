const { myMusic } = require(`../assets/components.js`)
class AQUAMyMusic extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    const root = this.shadowRoot
    shadow.innerHTML = myMusic
    run()

    async function run() {
    }
  }
}

module.exports = AQUAMyMusic