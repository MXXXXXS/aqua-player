const {menu} = require(`../assets/components.js`)
const {storeStates} = require(`../states.js`)
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
    const shadow = this.attachShadow({mode: `open`})
    const root = this.shadowRoot
    shadow.innerHTML = menu

    //主题色绑定
    root.querySelector(`#main`).style.setProperty(`--themeColor`, states.themeColor)
    storeStates.addCb(`themeColor`, themeColor => {
      root.querySelector(`#main`).style.setProperty(`--themeColor`, themeColor)
    })

    const main = root.querySelector(`#main`)

    main.querySelector(`.music`).id = `actived`

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

    main.addEventListener(`click`, e => {
      if (e.target.classList.contains(`highlight`)) {
        main.querySelector(`#actived`).removeAttribute(`id`)
        e.target.setAttribute(`id`, `actived`)
      }
    })

    root.querySelector(`.myMusic`).addEventListener(`click`, () => {
      storeStates.states.RMenuItems = `aqua-list`
    })

    root.querySelector(`.settings`).addEventListener(`click`, () => {
      storeStates.states.RMenuItems = `aqua-settings`
    })
    
    root.querySelector(`.playing`).addEventListener(`click`, e => {
      storeStates.states.RMainCurrentPlaying = `aqua-current-playing`
    })

    root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })
  }
}

module.exports = AQUAMenu