const { myMusic } = require(`../assets/components.js`)
const { List } = require(`../utils/store.js`)
const icons = require(`../assets/icons.js`)
const { storeStates, sortType } = require(`../states.js`)
class AQUAMyMusic extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    const root = this.shadowRoot
    this.root = root
    shadow.innerHTML = myMusic

    const padSortBy = root.querySelector(`.padSortBy`)
    const padType = root.querySelector(`.padType`)
    const menuSortBy = root.querySelector(`.menuSortBy`)
    const menuType = root.querySelector(`.menuType`)
    const sortBy = root.querySelector(`#sortBy`)
    const type = root.querySelector(`#type`)

    this.sortBy = new List([`无`, `A到Z`, `无`])
    this.type = new List([`所有流派`, ``, `所有流派`])

    //同步显示的项目数
    storeStates.add(`total`, root.querySelector(`#total`), `innerText`)

    //三个选项卡切换
    root.querySelector(`.songs`).addEventListener(`click`, () => {
      storeStates.states.RSongsItems = `AQUASongs`
    })
    root.querySelector(`.singers`).addEventListener(`click`, () => {
      storeStates.states.RSongsItems = `AQUASingers`
    })
    root.querySelector(`.albums`).addEventListener(`click`, () => {
      storeStates.states.RSongsItems = `AQUAAlbums`
    })

    //图标载入
    root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })
    //主题色绑定
    storeStates.addCb(`themeColor`, themeColor => {
      root.querySelector(`#main`).style.setProperty(`--themeColor`, themeColor)
    })
    //同步"排序依据", 同步"类型"
    this.sortBy.addCb((p, val, oldVal) => {
      sortBy.innerText = val
    })
    this.type.addCb((p, val, oldVal) => {
      type.innerText = val
    })

    //先隐藏两个面板
    padSortBy.style.display = `none`
    padType.style.display = `none`

    //打开面板
    sortBy.addEventListener(`click`, e => {
      padSortBy.style.display = `block`
    })
    type.addEventListener(`click`, e => {
      padType.style.display = `block`
    })

    //由sortType(风格类型)渲染"类型"菜单
    sortType.cast(`.menuType`, renderString, root)

    function renderString(key, index, val) {
      return `<div class="item" data-key="${key}" ${index === 0 ? `data-selected="selected"` : ``}>${val}</div>`
    }

    //由于"排序依据"不动态变化, 直接用静态数组渲染
    const sortByList = [[`无`, `A到Z`, `歌手`, `专辑`], [`A到Z`], [`无`, `A到Z`, `发行年份`, `歌手`]]

    function renderSortBy(arr) {
      menuSortBy.innerHTML = ``
      arr.forEach((str, index) => {
        menuSortBy.innerHTML += `<div class="item" data-key="${str}" ${index === 0 ? `data-selected="selected"` : ``}>${str}</div>`
      })
    }

    let curTag = {
      i: 0,
      set index(i) {
        renderSortBy(sortByList[i])
        this.i = i
      },
      get index() {
        return this.i
      }
    }

    //初始渲染
    curTag.index = 0

    function highLightSelected(menu, sortByOrType) {
      const items = Array.from(menu.querySelectorAll(`.item`))
      const itemsText = items.map(el => el.innerText)
      const selectedIndex = itemsText.indexOf(sortByOrType.innerText)
      const selectedEl = items[selectedIndex]
      const offset = selectedIndex * -28
      menu.querySelector(`[data-selected="selected"]`).removeAttribute(`data-selected`)
      selectedEl.setAttribute(`data-selected`, `selected`)
      menu.style.top = (-5 + offset).toString() + `px` //这个magic number "-5" 是在css里调整样式得到的
    }

    //监听当前选项卡, 切换"排序依据"的内容
    storeStates.addCb(`RSongsItems`, (RSongsItems) => {
      switch (RSongsItems) {
        case `AQUASongs`:
          curTag.index = 0
          sortBy.innerText = this.sortBy.list[curTag.index][0]
          type.innerText = this.type.list[curTag.index][0]
          highLightSelected(menuSortBy, sortBy)
          highLightSelected(menuType, type)
          root.querySelector(`.type`).style.display = `block`
          break
        case `AQUASingers`:
          curTag.index = 1
          sortBy.innerText = this.sortBy.list[curTag.index][0]
          highLightSelected(menuSortBy, sortBy)
          highLightSelected(menuType, type)
          root.querySelector(`.type`).style.display = `none`
          break
        case `AQUAAlbums`:
          curTag.index = 2
          sortBy.innerText = this.sortBy.list[curTag.index][0]
          type.innerText = this.type.list[curTag.index][0]
          highLightSelected(menuSortBy, sortBy)
          highLightSelected(menuType, type)
          root.querySelector(`.type`).style.display = `block`
          break
      }
    })

    //选择, 关闭面板
    menuSortBy.addEventListener(`click`, e => {
      if (e.target.className === `item`) {
        const selectedEl = e.target
        const text = e.target.innerText
        this.sortBy.set(curTag.index, text)
        menuSortBy.querySelector(`[data-selected="selected"]`).removeAttribute(`data-selected`)
        selectedEl.setAttribute(`data-selected`, `selected`)
        const offset = sortByList[curTag.index].indexOf(selectedEl.innerText) * -28
        menuSortBy.style.top = (-5 + offset).toString() + `px` //这个magic number "-5" 是在css里调整样式得到的
        padSortBy.style.display = `none`
      }
    })
    menuType.addEventListener(`click`, e => {
      if (e.target.className === `item`) {
        const selectedEl = e.target
        const text = e.target.innerText
        this.type.set(curTag.index, text)
        menuType.querySelector(`[data-selected="selected"]`).removeAttribute(`data-selected`)
        selectedEl.setAttribute(`data-selected`, `selected`)
        const offset = this.sortTypeRenderArr.indexOf(selectedEl.innerText) * -28
        menuType.style.top = (-5 + offset).toString() + `px`
        padType.style.display = `none`
      }
    })

    //点击选项框以外就隐藏
    Array.from(root.querySelectorAll(`.mask`)).forEach(el => {
      el.addEventListener(`click`, () => {
        padSortBy.style.display = `none`
        padType.style.display = `none`
      })
    })
  }

  run() {
    shared.sortBuf.sortedGenres = shared.sortBuf.sortedGenres ?
      shared.sortBuf.sortedGenres :
      storeStates.states.sortFn.sortedGenres()
    const { en: uen, zh: uzh } = shared.sortBuf.sortedGenres

    this.sortBy.changeSource([`无`, `A到Z`, `无`])
    this.type.changeSource([`所有流派`, ``, `所有流派`])
    sortType.changeSource([])
    this.sortTypeRenderArr = [`所有流派`, ...uen.map(item => item[1]), ...uzh.map(item => item[1])]
    sortType.push(...this.sortTypeRenderArr)

    this.root.querySelector(`[data-selected="selected"]`).removeAttribute(`data-selected`)
    this.root.querySelector(`.menuSortBy .item`).setAttribute(`data-selected`, `selected`)
    this.root.querySelector(`.menuType .item`).setAttribute(`data-selected`, `selected`)

    this.root.querySelector(`.menuSortBy`).style.top = `-5px`
    this.root.querySelector(`.menuType`).style.top = `-5px`
  }

  connectedCallback() {
    this.cb = () => {
      shared.sortBuf = {}
      this.run()
    }

    ebus.on(`Sorting ready`, this.cb)

    if (storeStates.states.sListLoaded) {
      this.run()
    }
  }

  disconnectedCallback() {
    ebus.removeListener(`Sorting ready`, this.cb)
  }
}

module.exports = AQUAMyMusic