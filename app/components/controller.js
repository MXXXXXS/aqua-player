const fs = require(`fs`)
const path = require(`path`)
const ebus = require(`../utils/eBus.js`)
const { controller } = require(`../assets/components.js`)
const { audioCtx, getMetadata, getSongBuf, getSongSrc } = require(`../audio.js`)
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

    const root = this.root
    const timeLine = root.querySelector(`#timeLine`)
    timeLine.value = 0
    const loudness = root.querySelector(`#loudness`)
    const nextSong = root.querySelector(`.next`)
    const lastSong = root.querySelector(`.previous`)
    const initalLoudness = 0.5
    loudness.value = initalLoudness
    const gainNode = audioCtx.createGain()
    gainNode.gain.value = initalLoudness
    let srcAddedTime
    let songPlayingOffset = 0
    let timer
    let audioSrc
    let fillFlag
    let srcBuf
    let duration
    let songLoading = false
    let currentSongFinished = true
    const coverBuffer = {}
    const debounceLatency = 200
    const name = root.querySelector(`.name`)
    const artist = root.querySelector(`.artist`)
    storeStates.add(`name`, name, `innerText`)
    storeStates.add(`artist`, artist, `innerText`)

    states.playingSongNum = parseInt(localStorage.getItem(`playingSongNum`)) || 0

    storeStates.addCb(`playingSongNum`, (val) => {
      localStorage.setItem(`playingSongNum`, val)
    })

    async function playNewOne() {
      if (!songLoading) {
        songLoading = true
        console.log(`play`)
        if (states.playing)
          stop()
        await loadSong()
        start()
      }
    }

    if (storeStates.states.sListLoaded && listSList.list.length !== 0) {
      loadSong()
    } else {
      storeStates.addCb(`sListLoaded`, (ready) => {
        if (ready && currentSongFinished)
          loadSong()
      })
    }

    ebus.on(`play this`, () => {
      debounceFn.debounce(playNewOne, debounceLatency)
    })

    root.querySelector(`.play`).addEventListener(`click`, () => {
      debounceFn.debounce(() => {
        if (states.playing) {
          stop()
        } else {
          start()
        }
      }, debounceLatency)
    })
    timeLine.addEventListener(`mousedown`, (e) => {
      clearInterval(timer)
    })
    timeLine.addEventListener(`input`, (e) => {
      //1000意思是range的最大值, range最小值是0
      root.querySelector(`.time-passed`).innerText = second2time(duration * (parseFloat(e.target.value) / 1000), fillFlag)
    })
    timeLine.addEventListener(`change`, (e) => {
      if (states.playing) {
        stop()
        songPlayingOffset = duration * (parseFloat(e.target.value) / 1000)
        start()
      } else {
        songPlayingOffset = duration * (parseFloat(e.target.value) / 1000)
      }
    })
    loudness.addEventListener(`input`, (e) => {
      gainNode.gain.value = e.target.value
    })

    nextSong.addEventListener(`click`, async (e) => {
      if (states.playingSongNum + 1 < states.total) {
        states.playingSongNum += 1
        debounceFn.debounce(playNewOne, debounceLatency)
      }
    })

    lastSong.addEventListener(`click`, async (e) => {
      if (states.playingSongNum - 1 >= 0) {
        states.playingSongNum -= 1
        debounceFn.debounce(playNewOne, debounceLatency)
      }
    })

    async function loadSong() {
      //当listSList.list为空时, states.playingSongNum为 -1
      if (states.playingSongNum >= 0) {
        //从当前播放列表索引歌曲
        let song = listSList.list[shared.playList[states.playingSongNum]][0]
        //加载图片
        shared.drawCover(coverBuffer, song.picture, icons, `.cover`, root)
        //加载音乐
        audioSrc = audioCtx.createBufferSource()
        states.name = song.title
        states.artist = song.artist
        duration = song.duration
        srcBuf = await getSongBuf(song.filePath)
        songPlayingOffset = 0
        timeLine.value = 0
        const formatedDuration = second2time(duration)
        if (formatedDuration.length === 5) { fillFlag = `m+` }
        else if (formatedDuration.length === 7) { fillFlag = `h` }
        else if (formatedDuration.length === 8) { fillFlag = `h+` }
        root.querySelector(`.time-passed`).innerText = formatedDuration.replace(/[^:]/g, `0`)
        root.querySelector(`.duration`).innerText = formatedDuration
      }
    }

    function start() {
      if (srcBuf) {
        states.playing = true
        audioSrc = audioCtx.createBufferSource()
        audioSrc.buffer = srcBuf
        audioSrc.connect(gainNode)
        gainNode.connect(audioCtx.destination)
        srcAddedTime = audioCtx.currentTime
        audioSrc.start(0, songPlayingOffset)
        timer = setInterval(syncProgressBar, 100)
        songLoading = false
        currentSongFinished = false
      }
    }
    function stop() {
      states.playing = false
      //audioCtx.currentTime - srcAddedTime 为上一次播放开始后, 已经播放的时间
      //更新此次播放产生的偏移
      songPlayingOffset = audioCtx.currentTime - srcAddedTime + songPlayingOffset
      clearInterval(timer)
      audioSrc.stop()
    }

    async function syncProgressBar() {
      const time = parseInt(audioCtx.currentTime - srcAddedTime + songPlayingOffset)
      timeLine.value = (time / duration) * 1000
      if (timeLine.value >= 1000) {
        root.querySelector(`.time-passed`).innerText = root.querySelector(`.duration`).innerText
        if (states.playingSongNum + 1 < states.total) {
          if (states.playing) {
            stop()
            currentSongFinished = true
            states.playingSongNum += 1
            await loadSong()
            start()
          }
        }
      } else {
        root.querySelector(`.time-passed`).innerText = second2time(time, fillFlag)
      }
    }

    root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })

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