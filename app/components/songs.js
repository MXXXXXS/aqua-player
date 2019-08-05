const path = require(`path`)
const ebus = require(`../utils/eBus.js`)
const icons = require(`../assets/icons.js`)
const { songs } = require(`../assets/components.js`)
const second2time = require(`../utils/second2time.js`)

const { listSList, listSPath, storeStates } = require(`../states.js`)
const states = storeStates.states

class AQUASongs extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    const root = this.shadowRoot
    shadow.innerHTML = songs

    if (storeStates.states.sListLoaded) {
      run()
    } else {
      storeStates.addCb(`sListLoaded`, (ready) => {
        if (ready) run()
      })
    }

    ebus.on(`Updated listSList and listSPath`, run)

    function renderString(key, i, song) {
      return `
      <div data-key="${key}">
        <div class="checkBox"></div>
        <div class="name">
      <div class="text">
        ${song.title}
      </div>
      <div class="icon play" data-key="${key}"></div>
      <div class="icon add"></div>
    </div>
    <div class="attribute">
      <div class="artist">${song.artist}</div>
      <div class="album">${song.album}</div>
      <div class="date">${song.year}</div>
      <div class="style">${song.genre}</div>
    </div>
    <div class="duration">${second2time(Math.round(song.duration))}</div>
  </div>
      `
    }

    async function run() {
      states.total = listSList.list.length
      listSList.cast(`.list`, renderString, root)
      root.querySelectorAll(`.icon`).forEach(el => {
        el.innerHTML = icons[el.classList[1]]
      })
      root.querySelector(`.list`).addEventListener(`click`, e => {
        e.stopPropagation()
        const isPlayBtn = e.target.classList.contains(`play`)
        if (isPlayBtn) {
          for (let i = 0; i < listSList.list.length; i++) {
            const songKey = listSList.list[i][1]
            if (songKey === parseInt(e.target.dataset.key)) {
              states.playingSongNum = i
              ebus.emit(`play this`, i)
              break
            }
          }
        }
      })
    }
  }
}

module.exports = AQUASongs