const { currentPlaying } = require(`../assets/components.js`)
const {
  changeSongAndPlay,
  playBack,
  stopAudioSrc
} = require(`../player.js`)
const second2time = require(`../utils/second2time.js`)
const { storeStates, shared, playList, listSList } = require(`../states.js`)
const icons = require(`../assets/icons.js`)
const states = storeStates.states

class AQUACurrentPlaying extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = currentPlaying
    this.root = this.shadowRoot

    //引用dom元素
    const root = this.root
    const timeLine = root.querySelector(`#timeLine`)
    timeLine.value = 0
    // const loudness = root.querySelector(`#loudness`)
    // loudness.value = states.gainVal
    const timePassed = root.querySelector(`.time-passed`)
    const totalTime = root.querySelector(`.totalTime`)
    const nextSong = root.querySelector(`.next`)
    const lastSong = root.querySelector(`.previous`)
    const title = root.querySelector(`.title`)
    const singerAndAlbum = root.querySelector(`.singerAndAlbum`)
    const play = root.querySelector(`.play`)
    const coverContainers = Array.from(root.querySelectorAll(`.cover`))
    const randomize = root.querySelector(`.random`)
    const controller = root.querySelector(`#controller`)
    const arrow = root.querySelector(`.arrow`)
    const list = root.querySelector(`.list`)

    //一些自有状态
    let hidden = false
    
    //专辑封面显示
    storeStates.addCb(`coverSrc`, src => {
      coverContainers.forEach(el => {
        el.innerHTML = ``
        if (src !== `svg`) {
          const img = document.createElement(`img`)
          img.src = src
          img.onload = () => {
            el.appendChild(img)
          }
        } else {
          el.innerHTML = icons[`cover`]
          el.style.display = `flex`
          el.querySelector(`svg`).style.margin = `auto`
        }
      })
    })

    //歌曲信息绑定
    storeStates.add(`name`, title, `innerText`)
    storeStates.add(`artist`, singerAndAlbum, `innerText`)

    //已消逝时长文字绑定
    storeStates.addCb(`timePassedText`, text => {
      timePassed.innerText = text
    })

    //时间线值绑定
    storeStates.addCb(`offset`, offset => {
      timeLine.value = (offset / states.duration) * 1000
    })

    //总时长文字绑定
    storeStates.addCb(`formatedDuration`, text => {
      totalTime.innerText = text
    })

    //按钮动作绑定
    arrow.addEventListener(`click`, () => {
      if (hidden) {
        hidden = false
        arrow.style.transform = `rotate(0deg)`
        list.style.transition = `transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1)`
        list.style.transform = `translateY(0)`
        controller.style.transition = `transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1)`
        controller.style.transform = `translateY(0)`
      } else {
        hidden = true
        arrow.style.transform = `rotate(-180deg)`
        list.style.transition = `transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1)`
        list.style.transform = `translateY(200vh)`
        controller.style.transition = `transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1)`
        controller.style.transform = `translateY(calc(100vh - 300px))`
      }
    })

    controller.addEventListener(`transitionend`, e => {
      controller.style.transition = `unset`
    })

    list.addEventListener(`transitionend`, e => {
      controller.style.transition = `unset`
    })

    randomize.addEventListener(`click`, () => {
      if (states.shuffled) {
        states.shuffled = false
        playList.changeSource(shared.playListBuf)
      } else {
        states.shuffled = true
        const keys = playList.list.map(item => item[0])
        playList.changeSource(keys.shuffle())
      }
      
      //更新图标
      this.root.querySelectorAll(`.icon`).forEach(el => {
        el.innerHTML = icons[el.classList[1]]
      })
    })

    lastSong.addEventListener(`click`, (e) => {
      if (states.keyOfSrcBuf - 1 >= 0) {
        states.keyOfSrcBuf -= 1
        changeSongAndPlay()
      }
    })

    play.addEventListener(`click`, () => {
      if (states.playing) {
        stopAudioSrc()
      } else {
        playBack()
      }
    })

    nextSong.addEventListener(`click`, async (e) => {
      if (states.keyOfSrcBuf + 1 < playList.list.length) {
        states.keyOfSrcBuf += 1
        changeSongAndPlay()
      }
    })

    timeLine.addEventListener(`mousedown`, (e) => {
      clearInterval(shared.timer)
    })

    timeLine.addEventListener(`input`, (e) => {
      //1000意思是range的最大值, range最小值是0
      timePassed.innerText = second2time(states.duration * (parseFloat(e.target.value) / 1000), states.fillFlag)
    })

    timeLine.addEventListener(`change`, (e) => {
      if (states.playing) {
        states.offset = states.duration * (parseFloat(e.target.value) / 1000)
        playBack()
      } else {
        states.offset = states.duration * (parseFloat(e.target.value) / 1000)
      }
    })

    // loudness.addEventListener(`input`, (e) => {
    //   states.gainVal = e.target.value
    // })

    //列表渲染
    function renderString(key, i, songKey) {
      const index = shared.keyItemBuf[songKey]
      const song = listSList.list[index][0]
      return `
      <div class="item" data-key="${songKey}">
        <div class="checkBox"></div>
        <div class="name">
      <div class="text">
        ${song.title}
      </div>
      <div class="icon play" data-key="${songKey}"></div>
      <div class="icon add"></div>
    </div>
    <div class="attribute">
      <div class="artist">${song.artist}</div>
      <div class="album">${song.album}</div>
      <div class="date">${song.year}</div>
      <div class="style">${song.genre}</div>
    </div>
    <div class="duration">${second2time(Math.round(song.duration))}</div>
  </div>
      `
    }

    this.run = function () {
      playList.cast(`.list`, renderString, this.root)

      //更新图标
      this.root.querySelectorAll(`.icon`).forEach(el => {
        el.innerHTML = icons[el.classList[1]]
      })

      this.root.querySelector(`.list`).addEventListener(`click`, e => {
        const isPlayBtn = e.target.classList.contains(`play`)
        if (isPlayBtn) {
          const key = e.target.dataset.key
          states.keyOfSrcBuf = playList.list.map(item => item[0]).indexOf(key)
          ebus.emit(`play this`, states.keyOfSrcBuf)
        }
      })
    }

    //图标渲染
    root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })

    //主题色同步
    this.root.querySelector(`#main`).style.setProperty(`--themeColor`, states.themeColor)
    storeStates.addCb(`themeColor`, themeColor => {
      this.root.querySelector(`#main`).style.setProperty(`--themeColor`, themeColor)
    })

    //退出"正在播放"
    root.querySelector(`.back`).addEventListener(`click`, e => {
      states.RMainCurrentPlaying = `#main`
    })
  }

  connectedCallback() {
    this.cb = this.run.bind(this)
    console.log(`connected songs`)
    ebus.on(`Updated listSList and listSPath`, this.cb)
    if (storeStates.states.sListLoaded) {
      this.run()
    }
  }

  disconnectedCallback() {
    console.log(`disconnected songs`)
    listSList.removeCasted(`.list`, this.root)
    ebus.removeListener(`Updated listSList and listSPath`, this.cb)
  }
}
module.exports = AQUACurrentPlaying