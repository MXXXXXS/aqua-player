const ebus = require(`../utils/eBus.js`)
const icons = require(`../assets/icons.js`)
const { songsSortedByAZ } = require(`../assets/components.js`)
const { listSList, storeStates, shared } = require(`../states.js`)
const second2time = require(`../utils/second2time.js`)
const states = storeStates.states

class AQUASongsSortedBySingers extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    this.root = this.shadowRoot
    shadow.innerHTML = songsSortedByAZ

  }

  run() {
    states.total = listSList.list.length
    const itemTemplate = (key, song) =>
      `
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

    const groupTemplate = (group) =>
      `<div>
      <div class="letter">${group[1]}</div>
      <div class="group">
      ${group[0].map(k => {
    let strBuf = ``
    const song = listSList.list[shared.keyItemBuf[k]][0]
    strBuf += itemTemplate(k, song)
    return strBuf
  }).join(``)}
    </div>
    </div>`
    const main = this.root.querySelector(`#main`)
    main.innerHTML = ``
    shared.sortBuf.sortedSingers = shared.sortBuf.sortedSingers ?
      shared.sortBuf.sortedSingers :
      storeStates.states.sortFn.sortedSingers()
    const { en: uen, zh: uzh } = shared.sortBuf.sortedSingers

    function addGroups(sorted) {
      sorted.forEach(group => {
        groupTemplate(group)
        main.innerHTML += groupTemplate(group)
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
  }

  connectedCallback() {
    this.cb = () => {
      console.log(`singer sort`)
      this.run()
    }
    ebus.on(`Sorting ready`, this.cb)
    console.log(`AQUASongsSortedBySingers connected`)

    if (storeStates.states.sortReady) {
      this.run()
    }
  }

  disconnectedCallback() {
    console.log(`AQUASongsSortedBySingers disconnected`)
    ebus.removeListener(`Sorting ready`, this.cb)
  }
}

module.exports = AQUASongsSortedBySingers