const {controller} = require(`./assets/components.js`)

class AQUAController extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({mode: `open`})
    shadow.innerHTML = controller
  }

}

window.customElements.define(`aqua-controller`, AQUAController)

