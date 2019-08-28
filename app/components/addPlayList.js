const {addPlayList} = require(`../assets/components.js`)
const {storeStates, listNames} = require(`../states.js`)
const {modifyPlayLists} = require(`../loadSongs.js`)
const states = storeStates.states
const icons = require(`../assets/icons.js`)

class AQUAAddPlayList extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({mode: `open`})
    const root = this.shadowRoot
    shadow.innerHTML = addPlayList
    
    //元素引用
    const main = root.querySelector(`#main`)
    const create = root.querySelector(`.create`)
    const cancel = root.querySelector(`.cancel`)
    const input = root.querySelector(`#setName input`)

    //主题色绑定
    root.querySelector(`#main`).style.setProperty(`--themeColor`, states.themeColor)
    storeStates.watch(`themeColor`, themeColor => {
      root.querySelector(`#main`).style.setProperty(`--themeColor`, themeColor)
    })

    //图标渲染
    root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })

    //显示隐藏切换
    main.style.display = `none`
    storeStates.watch(`showAddPlayList`, visible => {
      if (visible) {
        main.style.display = `flex`
      } else {
        main.style.display = `none`
      }
    })

    //按钮功能绑定
    create.addEventListener(`click`, async () => {
      states.showAddPlayList = false
      const playListName = input.value.slice(0, 15)
      await modifyPlayLists(`addToList`, [], playListName)
      listNames.push(playListName)
      states.playList = playListName
      states.RMenuItems = `aqua-play-list`
    })

    cancel.addEventListener(`click`, () => {
      states.showAddPlayList = false
    })

  }
}

module.exports = AQUAAddPlayList