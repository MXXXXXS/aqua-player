const { settings } = require(`../assets/components.js`)
const { listSPath, storeStates, listSList } = require(`../states.js`)
const states = storeStates.states
const { ipcRenderer } = require(`electron`)
const path = require(`path`)
const ebus = require(`../utils/eBus.js`)
const { modifyStars, refreshSongs } = require(`../loadSongs.js`)

class AQUASettings extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = settings
    const root = this.shadowRoot

    //元素引用
    const add = root.querySelector(`.add`)
    const pannel = root.querySelector(`.addPannel`)
    const okBtn = root.querySelector(`.ok`)
    const addFolder = root.querySelector(`.addTile`)
    const tilesContainer = root.querySelector(`.tilesContainer`)

    //自有状态
    let oldList

    //主题色绑定
    root.querySelector(`#main`).style.setProperty(`--themeColor`, states.themeColor)
    storeStates.addCb(`themeColor`, themeColor => {
      root.querySelector(`#main`).style.setProperty(`--themeColor`, themeColor)
    })

    //点击"选择查找音乐位置"
    add.addEventListener(`click`, () => {
      oldList = listSPath.list.map(item => item[0])
      pannel.style.display = `unset`
    })

    //点击"完成"
    okBtn.addEventListener(`click`, async () => {
      pannel.style.display = `none`
      const newList = listSPath.list.map(item => item[0])
      const foldersToRemove = oldList.elsNotIn(newList)
      const foldersToAdd = newList.elsNotIn(oldList)
      Promise.all([
        modifyStars(`add`, foldersToAdd),
        modifyStars(`remove`, foldersToRemove)
      ]).then(() => {
        console.log(`promise all`)
        refreshSongs()
      })
    })

    //添加tile
    ipcRenderer.on(`add these`, (e, paths) => {
      paths = paths.elsNotIn(listSPath.list.map(item => item[0]))
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

    listSPath.cast(`.tilesContainer`, renderString, root)

    function renderString(key, i, val) {
      return `
      <div class="tile" data-key="${key}">
      <div class="icon">+</div>
      <div class="basename">${path.basename(val)}</div>
      <div class="path">${val}</div>
    </div>`
    }

    modifyStars(`getFolders`)
      .then(folders => listSPath.changeSource(folders))
  }
}

module.exports = AQUASettings