const {settings} = require(`../assets/components.js`)
const {ipcRenderer} = require(`electron`)
const path = require(`path`)

class AQUASettings extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({mode: `open`})
    shadow.innerHTML = settings
    const root = this.shadowRoot

    const add = root.querySelector(`.add`)
    const pannel = root.querySelector(`.addPannel`)
    const okBtn = root.querySelector(`.ok`)
    const addFolder = root.querySelector(`.addTile`)
    const tilesContainer = root.querySelector(`.tilesContainer`)

    function tile(fullPath) {
      return `
      <div class="tile">
      <div class="icon">+</div>
      <div class="basename">${path.basename(fullPath)}</div>
      <div class="path">${fullPath}</div>
    </div>`
    }

    add.addEventListener(`click`, () => {
      pannel.style.display = `unset`
    })

    okBtn.addEventListener(`click`, () => {
      pannel.style.display = `none`
    })

    ipcRenderer.on(`add these`, (e, paths) => {
      console.log(paths)
      paths.forEach(path => {
        tilesContainer.innerHTML += tile(path)
      })
    })
    
    addFolder.addEventListener(`click`, () => {
      ipcRenderer.send(`add folder`)
    })

  }
}

module.exports = AQUASettings