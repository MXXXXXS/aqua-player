const {menu} = require(`../assets/components.js`)

const foldingStyle = `
div[tabindex="-1"]>div:last-child {
  display: none;
}

.sideBar {
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
.sideBar {
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
    shadow.innerHTML = menu
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
  }
}

module.exports = AQUAMenu