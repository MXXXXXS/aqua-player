const {controller} = require(`./assets/components.js`)

class AQUAController extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({mode: `open`})
    shadow.innerHTML = controller
    let songSwitch = true
    let lastTime = 0
    let lastSrc
    const songBuf = getSongBuf(`D:/coding/aqua-player/assets/たまゆらのかぜ.mp3`)
    songBuf.then(srcBuf => {
      this.shadowRoot.querySelector(`.play`).addEventListener(`click`, async () => {
        console.log(`clicked`)
        if (songSwitch) {
          songSwitch = false
          lastSrc = getSongSrc(srcBuf)
          this.shadowRoot.querySelector(`.time-passed`).innerText = lastTime
          lastSrc.start(0, lastTime)
        } else {
          songSwitch = true
          lastSrc.stop()
          lastTime = audioCtx.currentTime
        }
        // getMetadata(`D:/coding/aqua-player/assets/たまゆらのかぜ.mp3`)
      })
    })
  }
}

window.customElements.define(`aqua-controller`, AQUAController)

