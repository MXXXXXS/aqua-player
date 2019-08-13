const ebus = require(`../utils/eBus.js`)
const { controller } = require(`../assets/components.js`)
const {
  initialSrcBuf,
  createAudioSrc,
  triggerAudioSrc,
  stopAudioSrc,
  clearSrcBufAndAudioSrc
} = require(`../player.js`)
const second2time = require(`../utils/second2time.js`)
const { storeStates, listSList, shared } = require(`../states.js`)
const icons = require(`../assets/icons.js`)
const states = storeStates.states

class Debounce {
  constructor() {
    this.time = new Date().getTime()
  }
  debounce(fn, ms) {
    window.clearTimeout(this.tId)
    this.tId = window.setTimeout(() => {
      fn()
      window.clearTimeout(this.tId)
    }, ms)
  }
}

const debounceFn = new Debounce()

class AQUAController extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = controller
    this.root = this.shadowRoot

    //获取各个组件以及初始值设置, 值绑定
    const root = this.root
    const timeLine = root.querySelector(`#timeLine`)
    timeLine.value = 0
    const loudness = root.querySelector(`#loudness`)
    const nextSong = root.querySelector(`.next`)
    const lastSong = root.querySelector(`.previous`)
    loudness.value = states.gainVal
    const name = root.querySelector(`.name`)
    const artist = root.querySelector(`.artist`)
    storeStates.add(`name`, name, `innerText`)
    storeStates.add(`artist`, artist, `innerText`)
    const play = root.querySelector(`.play`)

    //组件的一些状态以及数据
    let fillFlag
    let currentSongFinished = true
    const coverBuffer = {}
    const debounceLatency = 200

    //初始化加载
    if (storeStates.states.sListLoaded && listSList.list.length !== 0) {
      changeSong()
    } else {
      storeStates.addCb(`sListLoaded`, (ready) => {
        if (ready && currentSongFinished)
          changeSong()
      })
    }

    //点歌
    ebus.on(`play this`, () => {
      changeSongAndPlay()
    })

    play.addEventListener(`click`, () => {
      if (states.playing) {
        stopAudioSrc()
      } else {
        playBack()
      }
    })

    timeLine.addEventListener(`mousedown`, (e) => {
      clearInterval(shared.timer)
    })

    timeLine.addEventListener(`input`, (e) => {
      //1000意思是range的最大值, range最小值是0
      root.querySelector(`.time-passed`).innerText = second2time(states.duration * (parseFloat(e.target.value) / 1000), fillFlag)
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

    nextSong.addEventListener(`click`, async (e) => {
      if (states.keyOfSrcBuf + 1 < states.total) {
        states.keyOfSrcBuf += 1
        changeSongAndPlay()
      }
    })

    lastSong.addEventListener(`click`, (e) => {
      if (states.keyOfSrcBuf - 1 >= 0) {
        states.keyOfSrcBuf -= 1
        changeSongAndPlay()
      }
    })

    async function changeSong() {
      switch (shared.audioState) {
        case 0:
          await loadSong()
          createAudioSrc()
          break
        case 1:
          clearSrcBufAndAudioSrc()
          await loadSong()
          createAudioSrc()
          break
        case 2:
          clearSrcBufAndAudioSrc()
          await loadSong()
          createAudioSrc()
          break
        case 3:
          stopAudioSrc()
          clearSrcBufAndAudioSrc()
          await loadSong()
          createAudioSrc()
          break
        case 4:
          clearSrcBufAndAudioSrc()
          await loadSong()
          createAudioSrc()
          break
      }
    }

    async function changeSongAndPlay() {
      await changeSong()
      triggerAudioSrc()
    }

    async function playBack() {
      switch (shared.audioState) {
        case 0:
          await initialSrcBuf()
          createAudioSrc()
          triggerAudioSrc()
          break
        case 1:
          createAudioSrc()
          triggerAudioSrc()
          break
        case 2:
          triggerAudioSrc()
          break
        case 3:
          stopAudioSrc()
          createAudioSrc()
          triggerAudioSrc()
          break
        case 4:
          createAudioSrc()
          triggerAudioSrc()
          break
      }
      currentSongFinished = false
    }

    async function loadSong() {
      //当listSList.list为空时, states.playingSongNum为 -1
      if (states.keyOfSrcBuf >= 0) {
        //从当前播放列表索引歌曲
        let song = listSList.list[shared.playList[states.keyOfSrcBuf]][0]
        //加载图片
        shared.drawCover(coverBuffer, song.picture, icons, `.cover`, root)
        //渲染名称, 歌手, 时长
        states.name = song.title
        states.artist = song.artist
        //归零进度条
        timeLine.value = 0
        //渲染总时长, 统一起始事件格式
        let duration = song.duration
        const formatedDuration = second2time(duration)
        if (formatedDuration.length === 5) { fillFlag = `m+` }
        else if (formatedDuration.length === 7) { fillFlag = `h` }
        else if (formatedDuration.length === 8) { fillFlag = `h+` }
        root.querySelector(`.time-passed`).innerText = formatedDuration.replace(/[^:]/g, `0`)
        root.querySelector(`.duration`).innerText = formatedDuration
        //初始化srcBuf
        await initialSrcBuf(() => {
          console.log(`source buffer loaded`)
        })
      }
    }

    //进度条同步与播放完自动切歌
    storeStates.addCb(`offset`, offset => {
      if (offset > states.duration) {
        currentSongFinished = true
        stopAudioSrc()
        timeLine.value = (offset / states.duration) * 1000
        root.querySelector(`.time-passed`).innerText = second2time(states.duration, fillFlag)
        if (states.keyOfSrcBuf + 1 < states.total) {
          states.keyOfSrcBuf += 1
          changeSongAndPlay()
        }
      } else {
        timeLine.value = (offset / states.duration) * 1000
        root.querySelector(`.time-passed`).innerText = second2time(offset, fillFlag)
      }
    })

    //图标渲染
    root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })

    //主题色同步
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