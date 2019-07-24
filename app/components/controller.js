const {controller} = require(`./assets/components.js`)

class AQUAController extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({mode: `open`})
    shadow.innerHTML = controller
    this.shadowRoot.querySelector(`.play`).addEventListener(`click`, () => {
      console.log(`clicked`)
      getSong(`D:/coding/aqua-player/assets/たまゆらのかぜ.mp3`)
    })
  }

}

window.customElements.define(`aqua-controller`, AQUAController)

