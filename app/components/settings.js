const { settings } = require(`../assets/components.js`)
const { listSPath, storeStates, listSList } = require(`../states.js`)
const { ipcRenderer } = require(`electron`)
const path = require(`path`)
const ebus = require(`../utils/eBus.js`)
const { loadSongs, removeSongs } = require(`../loadSongs.js`)

loadSongs()

class AQUASettings extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = settings
    const root = this.shadowRoot

    const add = root.querySelector(`.add`)
    const pannel = root.querySelector(`.addPannel`)
    const okBtn = root.querySelector(`.ok`)
    const addFolder = root.querySelector(`.addTile`)
    const tilesContainer = root.querySelector(`.tilesContainer`)

    add.addEventListener(`click`, () => {
      pannel.style.display = `unset`
    })

    //点击"完成"
    okBtn.addEventListener(`click`, () => {
      loadSongs(listSPath.list.map(item => item[0]))
      pannel.style.display = `none`
    })

    //添加tile
    ipcRenderer.on(`add these`, (e, paths) => {
      listSPath.push(...paths)
    })

    addFolder.addEventListener(`click`, () => {
      ipcRenderer.send(`add folder`)
    })

    //删除tile
    tilesContainer.addEventListener(`click`, (e) => {
      if (e.target.className === `tile`) {
        const targetKey = e.target.dataset.key
        for (let i = 0; i < listSPath.list.length; i++) {
          const key = listSPath.list[i][1]
          if (parseInt(targetKey) === key) {
            listSPath.splice(i, 1)
          }
        }
      }
    })

    // ebus.on(`Updated listSList and listSPath`, run)

    if (storeStates.states.sListLoaded) {
      run()
    } else {
      storeStates.addCb(`sListLoaded`, (ready) => {
        if (ready) run()
      })
    }
    async function run() {
      listSPath.cast(`.tilesContainer`, renderString, root)
    }

    function renderString(key, i, val) {
      return `
      <div class="tile" data-key="${key}">
      <div class="icon">+</div>
      <div class="basename">${path.basename(val)}</div>
      <div class="path">${val}</div>
    </div>`
    }

    ebus.on(`Updated listSList and listSPath`, () => {
      console.log(`已添加`)
    })

    ebus.on(`Removed folders`, removedFolders => {
      console.log(`已删除`)
    })

  }
}

module.exports = AQUASettings