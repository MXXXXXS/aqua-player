const ebus = require(`../utils/eBus.js`)
const { controller } = require(`../assets/components.js`)
const { audioCtx, getMetadata, getSongBuf, getSongSrc } = require(`../audio.js`)
const second2time = require(`../utils/second2time.js`)
const store = require(`../states.js`)
const states = store.states

class AQUAController extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = controller
    const root = this.shadowRoot

    const timeLine = root.querySelector(`#timeLine`)
    const loudness = root.querySelector(`#loudness`)
    const nextSong = root.querySelector(`.next`)
    const lastSong = root.querySelector(`.previous`)
    loudness.value = 1
    timeLine.value = 0
    const gainNode = audioCtx.createGain()
    let srcAddedTime
    let songPlayingOffset = 0
    let timer
    let audioSrc
    let fillFlag
    let srcBuf
    let duration

    const name = root.querySelector(`.name`)
    const artist = root.querySelector(`.artist`)
    store.add(`name`, name, `innerText`)
    store.add(`artist`, artist, `innerText`)
    store.addCb(`playing`, (nowPlaying, wasPlaying) => {
      console.log(`From playing cb`)
      console.log(nowPlaying, wasPlaying)
      if (nowPlaying === false && wasPlaying === true) {
        console.log(`Stop playing`)
        stop()
      }
      if (nowPlaying === true && wasPlaying === false) {
        console.log(`Start playing`)
        start()
      }
    })
    ebus.on(`play this`, run)
    async function run(song) {
      states.name = song.title
      states.artist = song.artist
      states.playing = false
      duration = song.duration
      console.log(`received`, song.filePath)
      srcBuf = await getSongBuf(song.filePath)
      songPlayingOffset = 0
      timeLine.value = 0
      const formatedDuration = second2time(duration)
      if (formatedDuration.length === 5) { fillFlag = `m+` }
      else if (formatedDuration.length === 7) { fillFlag = `h` }
      else if (formatedDuration.length === 8) { fillFlag = `h+` }
      root.querySelector(`.time-passed`).innerText = formatedDuration.replace(/[^:]/g, `0`)
      root.querySelector(`.duration`).innerText = formatedDuration
      states.playing = true
    }
    root.querySelector(`.play`).addEventListener(`click`, () => {
      if (!states.playing) {
        console.log(`click to start`)
        states.playing = true
      } else {
        console.log(`click to stop`)
        states.playing = false
      }
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

    nextSong.addEventListener(`click`, (e) => {
      states.playingSongNum += 1
    })

    lastSong.addEventListener(`click`, (e) => {
      states.playingSongNum -= 1
    })

    function stop() {
      console.log(`Called to stop`, timer, audioSrc)
      //audioCtx.currentTime - srcAddedTime 为上一次播放开始后, 已经播放的时间
      //更新此次播放产生的偏移
      songPlayingOffset = audioCtx.currentTime - srcAddedTime + songPlayingOffset
      clearInterval(timer)
      if (audioSrc && audioSrc.buffer) {
        audioSrc.stop()
        audioSrc = undefined
      }
    }

    function start() {
      audioSrc = getSongSrc(srcBuf, gainNode)
      srcAddedTime = audioCtx.currentTime
      audioSrc.start(0, songPlayingOffset)
      timer = setInterval(syncProgressBar, 100)
    }

    function syncProgressBar() {
      const time = parseInt(audioCtx.currentTime - srcAddedTime + songPlayingOffset)
      timeLine.value = (time / duration) * 1000
      root.querySelector(`.time-passed`).innerText = second2time(time, fillFlag)
      if (timeLine.value >= 1000) {
        stop()
      }
    }
  }
}
module.exports = AQUAController