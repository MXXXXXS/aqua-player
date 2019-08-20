const {addPlayList} = require(`../assets/components.js`)
const {storeStates} = require(`../states.js`)
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

    //主题色绑定
    root.querySelector(`#main`).style.setProperty(`--themeColor`, states.themeColor)
    storeStates.addCb(`themeColor`, themeColor => {
      root.querySelector(`#main`).style.setProperty(`--themeColor`, themeColor)
    })

    //图标渲染
    root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })

    //显示隐藏切换
    main.style.display = `none`
    storeStates.addCb(`showAddPlayList`, visible => {
      if (visible) {
        main.style.display = `flex`
      } else {
        main.style.display = `none`
      }
    })

    //按钮功能绑定
    create.addEventListener(`click`, () => {
      states.showAddPlayList = false
    })

    cancel.addEventListener(`click`, () => {
      states.showAddPlayList = false
    })

  }
}

module.exports = AQUAAddPlayList