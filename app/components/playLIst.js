const Vibrant = require(`node-vibrant`)

const { playList: playListComp } = require(`../assets/components.js`)
const { List } = require(`../utils/store.js`)
const icons = require(`../assets/icons.js`)
const { listSList, storeStates, shared, playList, listNames } = require(`../states.js`)
const states = storeStates.states
const ebus = require(`../utils/eBus.js`)
const { modifyStars, modifyPlayLists } = require(`../loadSongs.js`)
const second2time = require(`../utils/second2time.js`)
const { changeSongAndPlay } = require(`../player.js`)
const Stortable = require(`sortablejs`)

class AQUAPlayList extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = playListComp
    const root = this.shadowRoot

    //元素引用
    const list = root.querySelector(`.list`)
    const playAll = root.querySelector(`.playAll`)
    const cover = root.querySelector(`.cover`)
    const main = root.querySelector(`#main`)
    const remove = root.querySelector(`.remove`)
    const dialogPad = root.querySelector(`.dialogPad`)
    const ok = root.querySelector(`.ok`)
    const cancel = root.querySelector(`.cancel`)
    const rename = root.querySelector(`.rename`)
    const listName = root.querySelector(`.listName`)
    const description = root.querySelector(`.description`)
    const addTo = root.querySelector(`.addTo`)

    //自有状态
    const renderList = new List([])
    let blob
    let coverURL
    let showRemovePlayListDialog
    
    //图标渲染
    root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })

    //状态同步
    storeStates.sync(`playList`, listName, `innerText`)

    //状态监听以从数据库更新列表
    storeStates.watch(`playList`, refresh)

    ebus.on(`refresh playList`, () => {  //来自 add.js
      refresh(states.playList)
    })

    async function refresh(currentList) {
      const list = await modifyPlayLists(`getPlayList`, currentList).catch(e => console.error(e))
      if (list) {
        const orderedPaths = list.paths
        if (orderedPaths.length !== 0) {
          let gotCover = false
          const songs = orderedPaths.map((p, i) => {
            const index = shared.pathItemBuf[p]
            const song = listSList.list[index][0]
            if (!gotCover && song.picture) {
              gotCover = true
              getThemeColor(song.picture)
              applyCover(song.picture, cover)
            } else if (!gotCover && i === orderedPaths.length - 1) {
              applyCover(`svg`, cover)
            }
            return song
          })
          renderList.changeSource(songs)
        } else {
          renderList.changeSource([])
        }
      }
    }

    //监视renderList变动以同步数据库
    renderList.onModified(() => {
      if (renderList.list.length === 0) {
        //为空时有一些特殊样式
        description.innerText = `0 首歌曲 • 0分钟`
        main.style.setProperty(`--themeColor`, `black`)
        applyCover(`svg`, cover)
      } else {
        const totalDuration = renderList.getValues().reduce((acc, cur) => {
          return acc += cur.duration
        }, 0)
        const hours = Math.floor(totalDuration / 3600)
        const minute = Math.round((totalDuration - hours * 3600) / 60)
        description.innerText = `${renderList.list.length} 首歌曲 • ${hours > 0 ? hours + ` 小时 ` : ``}${minute} 分钟`
        modifyPlayLists(`addToList`, renderList.getValues().map(item => item.path), states.playList, true)
      }
    })

    //专辑封面显示
    function applyCover(src, container) {
      const el = container
      el.innerHTML = ``
      if (src !== `svg`) {
        blob = new Blob([src.data], { type: src.format })
        coverURL = window.URL.createObjectURL(blob)
        const img = document.createElement(`img`)
        img.src = coverURL
        img.onload = () => {
          el.appendChild(img)
        }
      } else {
        el.innerHTML = icons[`cover`]
        el.style.display = `flex`
        el.querySelector(`svg`).style.margin = `auto`
      }
    }

    //提取并应用主题色
    async function getThemeColor(picture) {
      const result = await Vibrant.from(Buffer.from(picture.data), {
        colorCount: 3,
        quality: 10
      }).getPalette().catch(e => console.error(e))
      if (result) {
        const color = result.Muted.rgb
        main.style.setProperty(`--themeColor`, `rgb(${color[0]}, ${color[1]}, ${color[2]})`)
      }
    }

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
        e.stopPropagation()
        const songsPaths = Array.from(root.querySelectorAll(`.item`))
          .map(el => renderList.kGet(el.dataset.key)[0].path)
        playList.changeSource(songsPaths.map(p => shared.pathItemBuf[p]))
        const key = parseInt(e.target.dataset.key)
        states.playListPointer = playList.getKeys().indexOf(key)
        ebus.emit(`play this`, states.playListPointer)
      }
      if (isRemoveBtn) {
        e.stopPropagation()
        renderList.kSplice(e.target.dataset.key, 1)
      }
    })

    playAll.addEventListener(`click`, e => {
      const indexes = renderList.list.map(item => shared.pathItemBuf[item[0].path])
      states.playListPointer = 0
      playList.changeSource(indexes)
      changeSongAndPlay()
    })

    remove.addEventListener(`click`, e => {
      showRemovePlayListDialog = true
      dialogPad.style.visibility = `visible`
    })

    ok.addEventListener(`click`, () => {
      const index = listNames.list.map(item => item[0]).indexOf(states.playList)
      let updatedIndex
      if (index >= 0) {
        if (index > 0) {
          updatedIndex = index - 1
        } else if (listNames.list.length > 1) {
          updatedIndex = 0
        } else {
          updatedIndex = -1
        }
        modifyPlayLists(`removeList`, states.playList)
          .then(() => {
            listNames.splice(index, 1)
            showRemovePlayListDialog = false
            dialogPad.style.visibility = `hidden`
            if (updatedIndex >= 0) {
              states.playList = listNames.list[updatedIndex][0]
            } else {
              states.RMenuItems = `aqua-list`
              renderList.changeSource([])
            }
          })
      }
    })

    cancel.addEventListener(`click`, () => {
      showRemovePlayListDialog = false
      dialogPad.style.visibility = `hidden`
    })

    rename.addEventListener(`click`, () => {
      states.showAddPlayList = true
    })

    addTo.addEventListener(`click`, e => {
      shared.songsToAdd = renderList.getValues().map(song => song.path)
      shared.showAdd(states, e)
    })

    //拖拽排序功能
    const styleEl = document.createElement(`style`)
    styleEl.innerHTML = `
.list .icon {
  visibility: hidden;
}
`

    const sortable = new Stortable(list, {
      animation: 200,
      dragClass: `sortable-drag`,
      ghostClass: `sortable-ghost`,
      onUpdate: function () {
        const sortedSongs = Array.from(list.querySelectorAll(`.item`)).map(el => renderList.kGet(el.dataset.key)[0])
        renderList.changeSource(sortedSongs)
      },
      onStart: function () {
        console.log(`start`)

        root.appendChild(styleEl)
      },
      onEnd: function () {
        console.log(`end`)
        root.removeChild(styleEl)
      }
    })
  }
}

module.exports = AQUAPlayList