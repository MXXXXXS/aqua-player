import components from '../assets/components.js'
const {menu} = components

class AQUAMenu extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({mode: `open`})
    shadow.innerHTML = menu
  }

}

window.customElements.define(`aqua-menu`, AQUAMenu)

