const { controller } = require(`../assets/components.js`)
const {
  changeSongAndPlay,
  playBack,
  stopAudioSrc
} = require(`../player.js`)
const second2time = require(`../utils/second2time.js`)
const { storeStates, shared, playList } = require(`../states.js`)
const icons = require(`../assets/icons.js`)
const states = storeStates.states

class AQUAController extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = controller
    this.root = this.shadowRoot

    //引用dom元素
    const root = this.root
    const timeLine = root.querySelector(`#timeLine`)
    timeLine.value = 0
    const loudness = root.querySelector(`#loudness`)
    loudness.value = states.gainVal
    const timePassed = root.querySelector(`.time-passed`)
    const duration = root.querySelector(`.duration`)
    const nextSong = root.querySelector(`.next`)
    const lastSong = root.querySelector(`.previous`)
    const name = root.querySelector(`.name`)
    const artist = root.querySelector(`.artist`)
    const play = root.querySelector(`.play`)
    const coverContainer = root.querySelector(`.cover`)
    const randomize = root.querySelector(`.random`)
    const more = root.querySelector(`.more`)
    const padMore = root.querySelector(`.padMore`)
    const mask = root.querySelector(`.mask`)

    //专辑封面显示
    storeStates.addCb(`coverSrc`, src => {
      const el = coverContainer
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

    //歌曲信息绑定
    storeStates.add(`name`, name, `innerText`)
    storeStates.add(`artist`, artist, `innerText`)

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
      duration.innerText = text
    })

    //按钮动作绑定
    more.addEventListener(`click`, () => {
      padMore.style.display = `block`
    })
    
    mask.addEventListener(`click`, () => {
      padMore.style.display = `none`
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

    loudness.addEventListener(`input`, (e) => {
      states.gainVal = e.target.value
    })

    //图标渲染
    root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })

    //主题色同步
    this.root.querySelector(`#main`).style.setProperty(`--themeColor`, states.themeColor)
    storeStates.addCb(`themeColor`, themeColor => {
      root.querySelector(`#main`).style.setProperty(`--themeColor`, themeColor)
    })
  }

  connectedCallback() {
    console.log(`Controller connected`)
  }

  disconnectedCallback() {
    console.log(`Controller disconnected`)
  }
}
module.exports = AQUAController