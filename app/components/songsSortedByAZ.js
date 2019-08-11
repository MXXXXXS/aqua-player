const ebus = require(`../utils/eBus.js`)
const icons = require(`../assets/icons.js`)
const { songsSortedByAZ } = require(`../assets/components.js`)
const { listSList, storeStates, shared } = require(`../states.js`)
const second2time = require(`../utils/second2time.js`)
const states = storeStates.states

class AQUASongsSortedByAZ extends HTMLElement {
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

    const groupTemplate = function (inital, items) {
      const itemsString = items.map(item => {
        let strBuf = ``
        const key = item[0]
        key.forEach(k => {
          const song = listSList.list[shared.keyItemBuf[k]][0]
          strBuf += itemTemplate(k, song)
        })
        return strBuf
      }).join(``)

      if (itemsString !== ``) {
        return `<div>
    <div class="letter">${inital}</div>
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
    shared.sortBuf.sortedInitialSongs = shared.sortBuf.sortedInitialSongs ?
      shared.sortBuf.sortedInitialSongs :
      storeStates.states.sortFn.sortedInitialSongs()
    const { en: uen, zh: uzh } = shared.sortBuf.sortedInitialSongs

    function addGroups(sorted) {
      sorted.forEach(group => {
        const inital = group[0]
        const items = group.slice(1, group.length)
        // groupTemplate(inital, items)
        main.innerHTML += groupTemplate(inital, items)
      })
    }

    addGroups(uen)
    addGroups(uzh)

    this.root.querySelector(`#main`).addEventListener(`click`, e => {
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

    this.root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })
    
    states.total = this.root.querySelectorAll(`.item`).length
  }

  connectedCallback() {
    this.cb = () => {
      console.log(`singer sort`)
      this.run()
    }
    ebus.on(`Sorting ready`, this.cb)
    console.log(`AQUASongsSortedByAZ connected`)

    if (storeStates.states.sortReady) {
      this.run()
    }
  }

  disconnectedCallback() {
    console.log(`AQUASongsSortedByAZ disconnected`)
    ebus.removeListener(`Sorting ready`, this.cb)
  }
}

module.exports = AQUASongsSortedByAZ