const path = require(`path`)
const ebus = require(`../utils/eBus.js`)
const icons = require(`../assets/icons.js`)
const { songs } = require(`../assets/components.js`)
const second2time = require(`../utils/second2time.js`)

const { listSList, storeStates, playList, shared } = require(`../states.js`)
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
      <div class="item" data-key="${key}">
        <div class="checkBox"></div>
        <div class="name">
      <div class="text">
        ${song.title}
      </div>
      <div class="icon play" data-key="${key}"></div>
      <div class="icon add" data-key="${key}"></div>
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
      //列表渲染
      listSList.cast(`.list`, renderString, this.root)

      //图标渲染
      this.root.querySelectorAll(`.icon`).forEach(el => {
        el.innerHTML = icons[el.classList[1]]
      })

      //元素引用
      const list = this.root.querySelector(`.list`)

      states.total = this.root.querySelectorAll(`.item`).length

      list.addEventListener(`click`, e => {
        const isPlayBtn = e.target.classList.contains(`play`)
        const isAddBtn = e.target.classList.contains(`add`)
        if (isPlayBtn) {
          const key = e.target.dataset.key
          states.keyOfSrcBuf = playList.list.map(item => item[0]).indexOf(key)
          ebus.emit(`play this`, states.keyOfSrcBuf)
        }
        if (isAddBtn) {
          const index = shared.keyItemBuf[e.target.dataset.key]
          const pathOfSong = listSList.list[index][0].path
          shared.songsToAdd.push(pathOfSong)
          shared.showAdd(states, e)
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