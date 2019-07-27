const {list} = require(`../assets/components.js`)

class AQUAList extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = list
    const root = this.shadowRoot

  }
}

module.exports = AQUAList