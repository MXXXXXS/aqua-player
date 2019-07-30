const { myMusic } = require(`../assets/components.js`)
const store = require(`../states.js`)
const states = store.states
class AQUAMyMusic extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    const root = this.shadowRoot
    shadow.innerHTML = myMusic
    run()

    const tagSongs = document.querySelector(`aqua-songs`)
    const tagSingers = document.querySelector(`aqua-singers`)
    // const tagSongs = document.querySelector(`aqua-songs`)

    root.querySelector(`.songs`).addEventListener(`click`, ()=> {
      states.myMusicTagMode = `songs`
    })
    root.querySelector(`.singers`).addEventListener(`click`, ()=> {
      states.myMusicTagMode = `singers`
    })

    store.addCb(`myMusicTagMode`, (mode) => {
      switch (mode) {
        case `songs`:
          tagSongs.style.display = `unset`
          tagSingers.style.display = `none`
          break
        case `singers`:
          tagSongs.style.display = `none`
          tagSingers.style.display = `unset`
          break
        case `albums`:
          break
      }
    })

    async function run() {
    }
  }
}

module.exports = AQUAMyMusic