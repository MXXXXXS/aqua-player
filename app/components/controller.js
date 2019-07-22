import components from '../assets/components.js'
const {controller} = components

class AQUAController extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({mode: `open`})
    shadow.innerHTML = controller
  }

}

window.customElements.define(`aqua-controller`, AQUAController)

