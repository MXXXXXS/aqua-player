const { singleSongList } = require(`../assets/components.js`)
const { playList, storeStates } = require(`../states.js`)
const icons = require(`../assets/icons.js`)
const states = storeStates.states
const { Store } = require(`../utils/store.js`)
const path = require(`path`)
const ebus = require(`../utils/eBus.js`)
const { modifyStars, refreshSongs } = require(`../loadSongs.js`)

class AQUASingleSongList extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = singleSongList
    const root = this.shadowRoot

    //图标渲染
    root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })

    //元素引用
    const main = root.querySelector(`#main`)
    const play = root.querySelector(`.play`)
    const add = root.querySelector(`.add`)
    const wave = root.querySelector(`.wave`)
    const name = root.querySelector(`.text>span`)
    const artist = root.querySelector(`.artist`)
    const album = root.querySelector(`.album`)
    const date = root.querySelector(`.date`)
    const genre = root.querySelector(`.genre`)
    const duration = root.querySelector(`.duration`)

    //自有响应式状态
    const store = new Store({
      key: ``,
      name: ``,
      artist: ``,
      album: ``,
      date: ``,
      genre: ``,
      duration: ``,
      hoverColor: ``,
      hoverBGColor: ``,
      hoverIconColor: ``,
      nameColor: ``,
      attributesColor: ``
    })

    const selfStore = new Store({
      playing: false
    })

    this._states = store.states

    store.sync(`name`, name, `innerText`)
    store.sync(`artist`, artist, `innerText`)
    store.sync(`album`, album, `innerText`)
    store.sync(`date`, date, `innerText`)
    store.sync(`genre`, genre, `innerText`)
    store.sync(`duration`, duration, `innerText`)

    selfStore.watch(`playing`, isPlaying => {
      if (isPlaying) {
        main.style.setProperty(`--nameColor`, states.themeColor)
        main.style.setProperty(`--attributesColor`, states.themeColor)
        main.style.setProperty(`--hoverColor`, states.themeColor)
        wave.style.display = `inline`
      } else {
        wave.style.display = `none`
        main.style.setProperty(`--nameColor`, this.states.nameColor)
        main.style.setProperty(`--attributesColor`, this.states.attributesColor)
        main.style.setProperty(`--hoverColor`, this.states.hoverColor)
      }
    })

    store.watch(`hoverColor`, color => {
      if (color)
        main.style.setProperty(`--hoverColor`, color)
    })
    store.watch(`hoverBGColor`, color => {
      if (color)
        main.style.setProperty(`--hoverBGColor`, color)
    })
    store.watch(`hoverIconColor`, color => {
      if (color)
        main.style.setProperty(`--hoverIconColor`, color)
    })
    store.watch(`nameColor`, color => {
      if (color)
        main.style.setProperty(`--nameColor`, color)
    })
    store.watch(`attributesColor`, color => {
      if (color)
        main.style.setProperty(`--attributesColor`, color)
    })

    //全局状态响应
    storeStates.watch(`currentPlayingSongKey`, (key) => {
      if (parseInt(key) === parseInt(store.states.key)) {
        selfStore.states.playing = true
      } else {
        selfStore.states.playing = false
      }
    })

    //按钮功能
    play.addEventListener(`click`, () => {
      this.dispatchEvent(new CustomEvent(`play`, {
        bubbles: true,
        composed: true,
        detail: this.states.key
      }))
    })

    add.addEventListener(`click`, (e) => {
      this.dispatchEvent(new CustomEvent(`add`, {
        bubbles: true,
        composed: true,
        detail: {
          key: this.states.key,
          coordinate: [e.clientX, e.clientY]
        }
      }))
    })
  }

  set states(obj) {
    for (const key in this._states) {
      if (this._states.hasOwnProperty(key)) {
        this._states[key] = obj[key]
      }
    }
  }

  get states() {
    return this._states
  }

  connectedCallback() {
  }
}

module.exports = AQUASingleSongList