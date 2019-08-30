const path = require(`path`)
const ebus = require(`../utils/eBus.js`)
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

    function listEl(key, i, song) {
      if (states.filterType === song.genre || states.filterType === `所有流派`) {
        const singleSongList = document.createElement(`aqua-single-song-list`)
        singleSongList.classList.add(`item`)
        singleSongList.states = {
          key: key,
          name: song.title,
          artist: song.artist,
          album: song.album,
          date: song.year,
          genre: song.genre,
          duration: second2time(Math.round(song.duration))
        }
        return singleSongList
      }
    }

    this.run = function () {
      //列表渲染
      listSList.cast(`#main`, listEl, this.root)

      //元素引用
      const main = this.root.querySelector(`#main`)

      states.total = this.root.querySelectorAll(`.item`).length

      main.addEventListener(`click`, e => {
        const isPlayBtn = e.target.classList.contains(`play`)
        const isAddBtn = e.target.classList.contains(`add`)
        if (isPlayBtn) {
          const currentList = Array.from(this.root.querySelectorAll(`.item`))
            .map(el => listSList.indexOfKey(el.dataset.key))
          playList.changeSource(currentList)
          const key = parseInt(e.target.dataset.key)
          states.playListPointer = playList.getValues().indexOf(key)
          ebus.emit(`play this`, states.playListPointer)
        }
        if (isAddBtn) {
          const pathOfSong = listSList.kGet(e.target.dataset.key)[0].path
          shared.songsToAdd.push(pathOfSong)
          shared.showAdd(states, e)
        }
      })

      this.addEventListener(`play`, e => {
        const currentList = Array.from(this.root.querySelectorAll(`.item`))
          .map(el => listSList.indexOfKey(el.states.key))
        playList.changeSource(currentList)
        const listIndex = listSList.indexOfKey(e.detail)
        states.playListPointer = playList.getValues().indexOf(listIndex)
        ebus.emit(`play this`, states.playListPointer)
      })
      
      this.addEventListener(`add`, e => {
        const pathOfSong = listSList.kGet(e.detail.key)[0].path
        shared.songsToAdd.push(pathOfSong)
        states.menuX = e.detail.coordinate[0] + 20 + `px`
        states.menuY = e.detail.coordinate[1] - 10 + `px`
        states.showAdd = true
      })

    }
  }

  connectedCallback() {
    this.cb = this.run.bind(this)
    console.log(`connected songs`)
    ebus.on(`Updated listSList and listSPath`, this.cb)
    if (states.sListLoaded) {
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