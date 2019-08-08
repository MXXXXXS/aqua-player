const {menu} = require(`../assets/components.js`)
const {storeStates} = require(`../states.js`)
const icons = require(`../assets/icons.js`)

const foldingStyle = `
div[tabindex="-1"]>div:last-child {
  display: none;
}

#main {
  width: 50px;
}

#line0 {
  display: none;
}

#line1 {
  outline: none;
  flex: 1;
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
`

//(max-width: 768px) open menu

const menuOpen = 
`
#main {
  min-height: 300px;
}

#line0 {
  display: none;
}

#line1 {
  outline: none;
  flex: 1;
}

.albums,
#playList .add,
#wave,
#search {
  display: none;
}
`
class AQUAMenu extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({mode: `open`})
    const root = this.shadowRoot
    shadow.innerHTML = menu

    //主题色绑定
    storeStates.addCb(`themeColor`, themeColor => {
      root.querySelector(`#main`).style.setProperty(`--themeColor`, themeColor)
    })

    const style = document.createElement(`style`)
    shadow.appendChild(style)
    let closed = false
    shadow.querySelector(`#switch`).addEventListener(`click`, () => {
      console.log(`clicked`)
      if (closed) {
        style.innerText = ``
        closed = false
      } else {
        style.innerText = foldingStyle
        closed = true
      }
    })

    root.querySelector(`#music`).addEventListener(`click`, () => {
      storeStates.states.RMenuItems = `aqua-list`
    })
    root.querySelector(`#settings`).addEventListener(`click`, () => {
      storeStates.states.RMenuItems = `aqua-settings`
    })

    root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })
  }
}

module.exports = AQUAMenu