const ebus = require(`../utils/eBus.js`)
const { songs } = require(`../assets/components.js`)
const second2time = require(`../utils/second2time.js`)
const AQUA = require(`../utils/aqua`)
const AQUASingleSong = require(`./singleSong`)

const { storeStates, playList, shared } = require(`../states.js`)
const states = storeStates.states

class AQUASongs extends AQUA {
  constructor(options = {
    inStates: {
      transparentBG: false,
      hoverColor: ``,
      hoverBGColor: ``,
      hoverIconColor: ``,
      nameColor: ``,
      attributesColor: ``,
      replaceAddWithRemove: false
    },
    inList: []
  }) {
    super({
      template: songs,
      inStates: options.inStates,
      inList: options.inList,
      outStates: {
        length: 0
      }
    })

    const listEl = (key, song) => {
      const singleSong = new AQUASingleSong({
        inStates: {
          path: song.path,
          name: song.title,
          artist: song.artist,
          album: song.album,
          date: song.year,
          genre: song.genre,
          duration: second2time(Math.round(song.duration)),
          hoverColor: this.inStore.states.hoverColor,
          hoverBGColor: this.inStore.states.hoverBGColor,
          hoverIconColor: this.inStore.states.hoverIconColor,
          nameColor: this.inStore.states.nameColor,
          attributesColor: this.inStore.states.attributesColor,
          replaceAddWithRemove: false
        }
      })
      singleSong.classList.add(`item`)
      return singleSong
    }

    this.inList.cast(this.root, listEl)

    this.outStore.states.length = this.inList.list.length
    this.inList.onModified(() => {
      this.outStore.states.length = this.inList.list.length
    })

    const switchBGStyle = (transparentBG) => {
      if (transparentBG) {
        this.style.setProperty(`--bgcolor`, `transparent`)
      } else {
        this.style.setProperty(`--bgcolor`, `#f2f2f2`)
      }
    }
    switchBGStyle(this.inStore.states.transparentBG)
    this.inStore.watch(`transparentBG`, switchBGStyle)

    this.addEventListener(`play`, e => {
      const els = Array.from(this.root.querySelectorAll(`.item`))
      const currentListPaths = els.map(el => el.inStore.states.path)
      const currentList = currentListPaths.map(p => shared.paths.indexOf(p))
      playList.changeSource(currentList)
      states.playListPointer = currentListPaths.indexOf(e.detail)
      ebus.emit(`play this`, states.playListPointer)
    })

    this.addEventListener(`add`, e => {
      const pathOfSong = e.detail.path
      shared.songsToAdd.push(pathOfSong)
      states.menuX = e.detail.coordinate[0] + 20 + `px`
      states.menuY = e.detail.coordinate[1] - 10 + `px`
      states.showAdd = true
    })
  }
}

customElements.define(`aqua-songs`, AQUASongs)

module.exports = AQUASongs