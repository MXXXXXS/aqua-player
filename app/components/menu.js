const { menu } = require(`../assets/components.js`)
const { storeStates, listNames } = require(`../states.js`)
const states = storeStates.states
const icons = require(`../assets/icons.js`)

const foldingStyle = `
/*
.mask {
  z-index: -1;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
  background-color: rgba(202, 202, 202, 0.199);
 }
*/
.highlight>div:last-child {
  display: none;
}

#main {
  width: 50px;
}

#line0, #line1 {
  display: none;
}

.albums,
#search input,
#search .cross {
  display: none;
}

#search .search:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: black;
}

#search .search {
  width: 50px;
  height: 50px;
  background-color: inherit;
}

#playList {
  flex-direction: column;
}

.myMusic .text {
  display: none;
}
`
class AQUAMenu extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    const root = this.shadowRoot
    shadow.innerHTML = menu

    //元素引用
    const main = root.querySelector(`#main`)
    const addPlayList = root.querySelector(`#playList .add`)
    const music = root.querySelector(`.music`)
    const switcher = root.querySelector(`#switch`)
    const myMusic = root.querySelector(`.myMusic`)
    const settings = root.querySelector(`.settings`)
    const playing = root.querySelector(`.playing`)
    const albums = root.querySelector(`.albums`)

    //自有状态
    let closed = false

    //主题色绑定
    root.querySelector(`#main`).style.setProperty(`--themeColor`, states.themeColor)
    storeStates.watch(`themeColor`, themeColor => {
      root.querySelector(`#main`).style.setProperty(`--themeColor`, themeColor)
    })

    //图标渲染
    root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })

    music.classList.add(`actived`)

    const style = document.createElement(`style`)
    shadow.appendChild(style)

    switcher.addEventListener(`click`, () => {
      if (closed) {
        style.innerText = ``
        closed = false
      } else {
        style.innerText = foldingStyle
        closed = true
      }
    })

    main.addEventListener(`click`, e => {
      if (e.target.classList.contains(`highlight`)) {
        main.querySelector(`.actived`).classList.remove(`actived`)
        e.target.classList.add(`actived`)
      }
    })

    myMusic.addEventListener(`click`, () => {
      states.RMenuItems = `aqua-list`
    })

    settings.addEventListener(`click`, () => {
      states.RMenuItems = `aqua-settings`
    })

    playing.addEventListener(`click`, e => {
      states.RMainCurrentPlaying = `aqua-current-playing`
    })

    addPlayList.addEventListener(`click`, () => {
      states.showAddPlayList = true
    })

    listNames.cast(`.albums`, renderString, root)

    function renderString(key, i, val) {
      return `
      <div class="item highlight" data-msg="album" data-key="${key}">
      <div class="icon album">${icons.album}</div>
      <div class="text">${val}</div>
      </div>
      `
    }

    albums.addEventListener(`click`, (e) => {
      const isAlbumBtn = e.target.dataset.msg
      if (isAlbumBtn) {
        const list = listNames.valueOfKey(e.target.dataset.key)
        if (list) {
          states.playList = list
          states.RMenuItems = `aqua-play-list`
        }
      }
    })
  }
}

module.exports = AQUAMenu