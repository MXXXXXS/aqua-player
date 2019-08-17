const ebus = require(`../utils/eBus.js`)
const icons = require(`../assets/icons.js`)
const { songsSortedByAZ } = require(`../assets/components.js`)
const { listSList, storeStates, shared } = require(`../states.js`)
const second2time = require(`../utils/second2time.js`)
const states = storeStates.states

class AQUASongsSortedByAlbums extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    this.root = this.shadowRoot
    shadow.innerHTML = songsSortedByAZ

  }

  run() {
    const itemTemplate = function (key, song) {
      if (states.filterType === song.genre || states.filterType === `所有流派`) {
        return `
      <div class="item" data-key="${key}">
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

    const groupTemplate = function (group) {
      const itemsString = group[0].map(k => {
        let strBuf = ``
        const song = listSList.list[shared.keyItemBuf[k]][0]
        strBuf += itemTemplate(k, song)
        return strBuf
      }).join(``)
      if (itemsString !== ``) {
        return `<div>
      <div class="letter">${group[1]}</div>
      <div class="group">
      ${itemsString}
    </div>
    </div>`
      } else {
        return ``
      }
    }

    const main = this.root.querySelector(`#main`)
    main.innerHTML = ``
    shared.sortBuf.sortedAlbums = shared.sortBuf.sortedAlbums ?
      shared.sortBuf.sortedAlbums :
      storeStates.states.sortFn.sortedAlbums()
    const { en: uen, zh: uzh } = shared.sortBuf.sortedAlbums

    function addGroups(sorted) {
      sorted.forEach(group => {
        groupTemplate(group)
        main.innerHTML += groupTemplate(group)
      })
    }

    addGroups(uen)
    addGroups(uzh)

    this.root.querySelector(`#main`).addEventListener(`click`, e => {
      const isPlayBtn = e.target.classList.contains(`play`)
      if (isPlayBtn) {
        const key = e.target.dataset.key
        states.keyOfSrcBuf = playList.list.map(item => item[0]).indexOf(key)
        ebus.emit(`play this`, states.keyOfSrcBuf)
      }
    })

    this.root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })
    
    states.total = this.root.querySelectorAll(`.item`).length

    //主题色同步
    this.root.querySelector(`#main`).style.setProperty(`--themeColor`, states.themeColor)
    storeStates.addCb(`themeColor`, themeColor => {
      this.root.querySelector(`#main`).style.setProperty(`--themeColor`, themeColor)
    })
  }

  connectedCallback() {
    this.cb = () => {
      console.log(`singer sort`)
      this.run()
    }
    ebus.on(`Sorting ready`, this.cb)
    console.log(`AQUASongsSortedByAlbums connected`)

    if (storeStates.states.sortReady) {
      this.run()
    }
  }

  disconnectedCallback() {
    console.log(`AQUASongsSortedByAlbums disconnected`)
    ebus.removeListener(`Sorting ready`, this.cb)
  }
}

module.exports = AQUASongsSortedByAlbums