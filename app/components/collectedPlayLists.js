const { collectedPlayLists } = require(`../assets/components.js`)
const { shared, storeStates, listSList, playList } = require(`../states.js`)
const states = storeStates.states
const { flatSortUniqueIdWords } = require(`../utils/sortWords.js`)
const path = require(`path`)
const ebus = require(`../utils/eBus.js`)
const { modifyPlayLists, refreshSongs } = require(`../loadSongs.js`)
const icons = require(`../assets/icons.js`)

class AQUAPlayLists extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = collectedPlayLists
    const root = this.shadowRoot

    //元素引用
    const items = root.querySelector(`.items`)
    const sortBy = root.querySelector(`#sortBy`)
    const padSortBy = root.querySelector(`.padSortBy`)
    const mask = root.querySelector(`.mask`)
    const menuSortBy = root.querySelector(`.menuSortBy`)

    //自有状态
    let coverBuffers = []

    //主题色绑定
    root.querySelector(`#main`).style.setProperty(`--themeColor`, states.themeColor)
    storeStates.watch(`themeColor`, themeColor => {
      root.querySelector(`#main`).style.setProperty(`--themeColor`, themeColor)
    })

    //图标渲染
    root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })

    //刷新
    storeStates.watch(`RMenuItems`, item => {
      if (item === `aqua-play-lists`) {
        run(`unordered`)
      }
    })

    function renderString(name, amount) {
      return `
<div class="item">
  <div class="coverbg" data-name="${name}">
    <div class="coverContainer">
      <div class="decorationSquare0"></div>
      <div class="decorationSquare1"></div>
      <div class="cover" data-key="${name}"></div>
    </div>
    <div class="icon play" data-key="${name}">${icons.play}</div>
    <div class="icon add" data-key="${name}">${icons.add}</div>
  </div>
  <div class="info">
    <div class="name">${name}</div>
    <div class="artist">${amount} 首歌曲</div>
  </div>
</div>
      `
    }

    function renderItems(item, i) {
      coverBuffers.push({})
      const name = item.name
      //统计总数, 并检查失效歌曲
      const amount = item.paths.reduce((acc, p) => {
        if (shared.pathItemBuf[p]) {
          acc += 1
        }
        return acc
      }, 0)
      const songPath = amount > 0 ? item.paths[0] : undefined
      let picture
      if (songPath) {
        const index = shared.pathItemBuf[songPath]
        //失效歌曲检查
        if (index) {
          picture = listSList.list[index][0].picture
        }
      }
      items.innerHTML += renderString(name, amount)
      shared.drawCover(coverBuffers[i], picture, icons, `[data-key="${name}"]`, root)
    }

    async function run(order) {
      coverBuffers = []
      items.innerHTML = ``

      const playListsOfAll = await modifyPlayLists(`getAll`)

      if (order === `unordered`) {
        playListsOfAll.shuffle().forEach((item, i) => {
          renderItems(item, i)
        })
      } else if (order === `ordered`) {
        const { en, zh } = flatSortUniqueIdWords(playListsOfAll.map((item, i) => [i, item.name]))
        const indexes = en.concat(zh).map(item => item[0][0])
        indexes.forEach(i => {
          renderItems(playListsOfAll[i], i)
        })
      }
    }

    //按钮功能绑定
    sortBy.addEventListener(`click`, (e) => {
      let n
      switch (e.target.innerText) {
        case `无`: {
          n = 0
        }
          break
        case `A到Z`: {
          n = 1
        }
          break
      }
      menuSortBy.style.top = (-25 - n * 28) + `px`  //依据实际样式得到的, hard coded
      padSortBy.style.display = `block`
    })

    mask.addEventListener(`click`, () => {
      padSortBy.style.display = `none`
    })

    menuSortBy.addEventListener(`click`, (e) => {
      if (e.target.classList.contains(`item`)) {
        padSortBy.style.display = `none`
        switch (e.target.innerText) {
          case `无`: {
            menuSortBy.querySelector(`.selected`).classList.remove(`selected`)
            e.target.classList.add(`selected`)
            sortBy.innerText = `无`
            run(`unordered`)
          }
            break
          case `A到Z`: {
            menuSortBy.querySelector(`.selected`).classList.remove(`selected`)
            e.target.classList.add(`selected`)
            sortBy.innerText = `A到Z`
            run(`ordered`)
          }
            break
        }
      }
    })

    items.addEventListener(`click`, async e => {
      if (e.target.classList.contains(`play`)) {
        const playListName = e.target.dataset.key
        const result = await modifyPlayLists(`getPlayList`, playListName)
        const indexes = result.paths.map(p => shared.pathItemBuf[p])
        if (indexes.length !== 0) {
          playList.changeSource(indexes)
          states.playListPointer = 0
          ebus.emit(`play this`)
          const names = shared.recentPlayed.map(item => item.name)
          if (!names.includes(playListName)) {
            shared.recentPlayed.unshift({
              cover: listSList.list[indexes[0]][0].picture,
              name: playListName,
              type: `playList`
            })
          }
        }
      }
      if (e.target.classList.contains(`add`)) {
        const result = await modifyPlayLists(`getPlayList`, e.target.dataset.key)
        shared.songsToAdd = result.paths
        shared.showAdd(states, e)
      }
      if (e.target.classList.contains(`coverbg`)) {
        const playListName = e.target.dataset.name
        states.playList = playListName
        states.RMenuItems = `aqua-play-list`
      }
    })
  }
}

module.exports = AQUAPlayLists