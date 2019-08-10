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
    this.root = this.shadowRoot
    shadow.innerHTML = songs

    function renderString(key, i, song) {
      if (states.filterType === song.genre || states.filterType === `所有流派`) {
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
      } else {
        return ``
      }
    }

    this.run = function () {
      states.total = listSList.list.length
      listSList.cast(`.list`, renderString, this.root)
      this.root.querySelectorAll(`.icon`).forEach(el => {
        el.innerHTML = icons[el.classList[1]]
      })
      this.root.querySelector(`.list`).addEventListener(`click`, e => {
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

  connectedCallback() {
    this.cb = this.run.bind(this)
    console.log(`connected songs`)
    ebus.on(`Updated listSList and listSPath`, this.cb)
    if (storeStates.states.sListLoaded) {
      this.run()
    }
  }
  
  disconnectedCallback() {
    console.log(`disconnected songs`)
    listSList.removeCasted(`.list`, this.root)
    ebus.removeListener(`Updated listSList and listSPath`, this.cb)

  }
}

module.exports = AQUASongs