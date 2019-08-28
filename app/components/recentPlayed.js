const { recentPlayed } = require(`../assets/components.js`)
const { shared, storeStates } = require(`../states.js`)
const states = storeStates.states
const { ipcRenderer } = require(`electron`)
const path = require(`path`)
const ebus = require(`../utils/eBus.js`)
const { modifyStars, refreshSongs } = require(`../loadSongs.js`)
const icons = require(`../assets/icons.js`)

class AQUARecentPlayed extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = recentPlayed
    const root = this.shadowRoot

    this.coverBuffers = []

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
      if (item === `aqua-recent-played`) {
        this.run()
      }
    })
  }

  run() {
    //元素引用
    const root = this.shadowRoot
    const items = root.querySelector(`.items`)

    //渲染元素
    items.innerHTML = ``

    //清空图片缓存
    this.coverBuffers = []

    function unescape(s) {
      const lookup = {
        '&amp;': `&`,
        '&quot;': `"`,
        '&lt;': `<`,
        '&gt;': `>`
      }
      return s.replace(/(&amp;)|(&quot;)|(&lt;)|(&gt;)/g, (c) => lookup[c])
    }

    shared.recentPlayed.forEach((item, i) => {
      switch (item.type) {
        case `playList`: {
          this.coverBuffers.push({})
          items.innerHTML += `
<div class="item">
  <div class="coverbg">
    <div class="coverContainer">
      <div class="decorationSquare0"></div>
      <div class="decorationSquare1"></div>
      <div class="cover" data-key="playList_${item.name}"></div>
    </div>
    <div class="icon play">${icons.play}</div>
    <div class="icon add">${icons.add}</div>
  </div>
  <div class="info">
    <div class="name">${item.name}</div>
    <div class="artist">播放列表</div>
  </div>
</div>
          `
          shared.drawCover(this.coverBuffers[i], item.cover, icons, `[data-key="playList_${unescape(item.name)}"]`, root)
        }
          break
        case `singer`: {
          this.coverBuffers.push({})
          items.innerHTML += `
<div class="item">
  <div class="cover">
    <div class="coverContainer"></div>
    <div class="icon play">${icons.play}</div>
    <div class="icon add">${icons.add}</div>
  </div>
  <div class="info">
    <div class="name">${item.name}</div>
    <div class="artist">歌手</div>
  </div>
</div>
          `
        }
          break
        case `album`: {
          this.coverBuffers.push({})
          items.innerHTML += `
<div class="item">
  <div class="cover">
    <div class="coverContainer" data-key="album_${item.name}"></div>
    <div class="icon play">${icons.play}</div>
    <div class="icon add">${icons.add}</div>
  </div>
  <div class="info">
    <div class="name">${item.name}</div>
    <div class="artist">${item.artist} 的专辑</div>
  </div>
</div>
          `
          shared.drawCover(this.coverBuffers[i], item.cover, icons, `[data-key="album_${unescape(item.name)}"]`, root)
        }
          break
      }
    })
  }

  connectedCallback() {
    console.log(`connected recentPlayed`)
    this.cb = () => {
      this.run()
    }
    ebus.on(`Sorting ready`, this.cb)
    if (states.sortReady) {
      this.run()
    }
  }

  disconnectedCallback() {
    console.log(`disconnected recentPlayed`)
    ebus.removeListener(`Sorting ready`, this.cb)
  }
}

module.exports = AQUARecentPlayed