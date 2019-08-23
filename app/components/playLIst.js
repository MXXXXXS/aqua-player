const { playList: playListComp } = require(`../assets/components.js`)
const { List } = require(`../utils/store.js`)
const icons = require(`../assets/icons.js`)
const { listSList, storeStates, shared, playList } = require(`../states.js`)
const states = storeStates.states
const ebus = require(`../utils/eBus.js`)
const { modifyStars, modifyPlayLists } = require(`../loadSongs.js`)
const second2time = require(`../utils/second2time.js`)
const {changeSongAndPlay} = require(`../player.js`)

class AQUAPlayList extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = playListComp
    const root = this.shadowRoot

    //元素引用
    const list = root.querySelector(`.list`)
    const playAll = root.querySelector(`.playAll`)
    const addTo = root.querySelector(`.addTo`)
    const rename = root.querySelector(`.rename`)
    const remove = root.querySelector(`.remove`)

    //自有状态
    const renderList = new List([])
    let oldList

    //主题色绑定
    root.querySelector(`#main`).style.setProperty(`--themeColor`, states.themeColor)
    storeStates.watch(`themeColor`, themeColor => {
      root.querySelector(`#main`).style.setProperty(`--themeColor`, themeColor)
    })

    //图标渲染
    root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })

    //状态监听
    async function refresh(currentList) {
      const list = await modifyPlayLists(`getPlayList`, currentList).catch(e => console.error(e))
      if (list) {
        const orderedPaths = list.paths
        const songs = orderedPaths.map(p => {
          const index = shared.pathItemBuf[p]
          return listSList.list[index][0]
        })
        renderList.changeSource(songs)
      }
    }

    storeStates.watch(`playList`, refresh)

    ebus.on(`refresh playList`, () => {
      refresh(states.playList)
    })

    //列表渲染
    renderList.cast(`.list`, renderString, root)

    function renderString(key, i, song) {
      if (states.filterType === song.genre || states.filterType === `所有流派`) {
        return `
      <div class="item" data-key="${key}">
        <div class="checkBox"></div>
        <div class="name">
      <div class="text">
        ${song.title}
      </div>
      <div class="icon play" data-key="${key}">${icons.play}</div>
      <div class="icon remove" data-key="${key}">${icons.remove}</div>
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

    //按键功能绑定
    list.addEventListener(`click`, e => {
      const isPlayBtn = e.target.classList.contains(`play`)
      const isRemoveBtn = e.target.classList.contains(`remove`)
      if (isPlayBtn) {
        const key = parseInt(e.target.dataset.key)
        states.playListPointer = playList.getKeys().indexOf(key)
        ebus.emit(`play this`, states.playListPointer)
      }
      if (isRemoveBtn) {

      }
    })

    playAll.addEventListener(`click`, e => {
      const indexes = renderList.list.map(item => shared.pathItemBuf[item[0].path])
      states.playListPointer = 0
      playList.changeSource(indexes)
      changeSongAndPlay()
    })

  }
}

module.exports = AQUAPlayList