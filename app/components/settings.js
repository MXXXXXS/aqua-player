const {settings} = require(`../assets/components.js`)

class AQUASettings extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({mode: `open`})
    shadow.innerHTML = settings
    const root = this.shadowRoot

  }
}

module.exports = AQUASettings