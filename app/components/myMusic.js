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

    store.add(`total`, root.querySelector(`#total`), `innerText`)

    const tagSongs = document.querySelector(`aqua-songs`)
    const tagSingers = document.querySelector(`aqua-singers`)
    const tagAlbums = document.querySelector(`aqua-albums`)

    root.querySelector(`.songs`).addEventListener(`click`, () => {
      states.myMusicTagMode = `songs`
    })
    root.querySelector(`.singers`).addEventListener(`click`, () => {
      states.myMusicTagMode = `singers`
    })
    root.querySelector(`.albums`).addEventListener(`click`, () => {
      states.myMusicTagMode = `albums`
    })

    store.addCb(`myMusicTagMode`, (mode) => {
      switch (mode) {
        case `songs`:
          tagSongs.style.display = `unset`
          tagSingers.style.display = `none`
          tagAlbums.style.display = `none`
          break
        case `singers`:
          tagSingers.style.display = `unset`
          tagSongs.style.display = `none`
          tagAlbums.style.display = `none`
          break
        case `albums`:
          tagAlbums.style.display = `flex`
          tagSongs.style.display = `none`
          tagSingers.style.display = `none`
          break
      }
    })

    async function run() {
    }
  }
}

module.exports = AQUAMyMusic