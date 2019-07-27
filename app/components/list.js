const icons = require(`../assets/icons.js`)
const { list } = require(`../assets/components.js`)
const second2time = require(`../utils/second2time.js`)
const statesPromise = require(`../states.js`)

class AQUAList extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    const root = this.shadowRoot
    shadow.innerHTML = list
    run()

    async function run() {
      const songs = await statesPromise
      songs.forEach(song => {
        root.querySelector(`.list`).innerHTML += 
        `
        <div data-key="${song.title}">
          <div class="checkBox"></div>
          <div class="name">
        <div class="text">
          ${song.title}
        </div>
        <div class="icon play"></div>
        <div class="icon add"></div>
      </div>
      <div class="attribute">
        <div class="artist">${song.artist}</div>
        <div class="album">${song.album}</div>
        <div class="date">${song.year}</div>
        <div class="style">${song.genre ? song.genre: `未知流派`}</div>
      </div>
      <div class="duration">${second2time(Math.round(song.duration))}</div>
    </div>
        `
      })
      root.querySelectorAll(`.icon`).forEach(el => {
        el.innerHTML += icons[el.classList[1]]
      })
    }
  }
}

module.exports = AQUAList