const { playList: playListComp } = require(`../assets/components.js`)
const { List } = require(`../utils/store.js`)
const icons = require(`../assets/icons.js`)
const { listSList, storeStates, shared, playList } = require(`../states.js`)
const states = storeStates.states
const { ipcRenderer } = require(`electron`)
const path = require(`path`)
const ebus = require(`../utils/eBus.js`)
const { modifyStars, modifyPlayLists } = require(`../loadSongs.js`)
const second2time = require(`../utils/second2time.js`)

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
    storeStates.addCb(`themeColor`, themeColor => {
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

    storeStates.addCb(`playList`, refresh)

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
      <div class="icon add" data-key="${key}">${icons.add}</div>
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

    playAll.addEventListener(`click`, e => {
      const keys = renderList.list.map(item => shared.pathItemBuf[item[0].path])
      playList.changeSource(keys)
    })

  }
}

module.exports = AQUAPlayList