const { add } = require(`../assets/components.js`)
const { modifyPlayLists } = require(`../loadSongs.js`)
const { storeStates, shared, listNames } = require(`../states.js`)
const ebus = require(`../utils/eBus.js`)
const states = storeStates.states
const icons = require(`../assets/icons.js`)

class AQUAAdd extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    const root = this.shadowRoot
    shadow.innerHTML = add

    //元素引用
    const main = root.querySelector(`#main`)
    const mask = root.querySelector(`.mask`)
    const menu = root.querySelector(`.menu`)

    //图标渲染
    root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })

    //列表渲染
    listNames.cast(`.list`, renderString, root)

    function renderString(key, i, val) {
      return `
      <div class="item" data-msg="album" data-key="${key}">
      <div class="icon album">${icons.album}</div>
      <div class="text">${val}</div>
      </div>
      `
    }

    //显示隐藏切换
    main.style.display = `none`
    storeStates.addCb(`showAdd`, async visible => {
      if (visible) {
        const names = await modifyPlayLists(`getNames`)
        listNames.changeSource(names)
        main.style.display = `block`
      } else {
        main.style.display = `none`
      }
    })

    //按钮功能绑定
    mask.addEventListener(`click`, () => {
      states.showAdd = false
    })

    menu.addEventListener(`click`, async e => {
      const isItemBtn = e.target.classList.contains(`item`)
      if (isItemBtn) {
        states.showAdd = false
        if (e.target.dataset.key) {
          for (let i = 0; i < listNames.list.length; i++) {
            if (listNames.list[i][1] === parseInt(e.target.dataset.key)) {
              await modifyPlayLists(`addToList`, shared.songsToAdd, listNames.list[i][0])
              ebus.emit(`refresh playList`)
              break
            }
          }
        }
        shared.songsToAdd = []
      }
    })

    //状态绑定
    storeStates.add(`menuX`, menu.style, `left`)
    storeStates.add(`menuY`, menu.style, `top`)
  }

  connectedCallback() {
    modifyPlayLists(`getNames`)
      .then(names => {
        listNames.changeSource(names)
      })
  }
}

module.exports = AQUAAdd