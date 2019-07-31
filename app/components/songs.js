const path = require(`path`)
const ebus = require(`../utils/eBus.js`)
const icons = require(`../assets/icons.js`)
const { songs } = require(`../assets/components.js`)
const second2time = require(`../utils/second2time.js`)
const { songslist, songsPath } = require(`../loadSongs.js`)
const {listSList, listSPath, storeStates} = require(`../states.js`)
const states = storeStates.states

class AQUAList extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    const root = this.shadowRoot
    shadow.innerHTML = songs
    run()

    listSList.addCb((id, song)=> {
      // console.log(`add ${song.title}`)
    })

    async function run() {
      const list = await songslist
      listSList.list.push(...list)
      listSPath.list.push(songsPath)
      states.total = listSList.list.length
      listSList.list.forEach((song, i) => {
        song.id = i
        root.querySelector(`.list`).innerHTML +=
          `
        <div data-key="${song.title}">
          <div class="checkBox"></div>
          <div class="name">
        <div class="text">
          ${song.title}
        </div>
        <div class="icon play" data-title="${song.title}"></div>
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
      })
      storeStates.addCb(`playingSongNum`, (i) => {
        ebus.emit(`play this`, listSList.list[i])
      })
      root.querySelectorAll(`.icon`).forEach(el => {
        el.innerHTML += icons[el.classList[1]]
      })
      root.querySelector(`.list`).addEventListener(`click`, e => {
        const isPlayBtn = e.target.classList.contains(`play`)
        if (isPlayBtn) {
          for (let i = 0; i < listSList.list.length; i++) {
            const song = listSList.list[i]
            if (song.title === e.target.getAttribute(`data-title`)) {
              ebus.emit(`play this`, song)
              states.playingSongNum = i
              break
            }
          }
        }
      })
    }
  }
}

module.exports = AQUAList