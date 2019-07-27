const ebus = require(`../utils/eBus.js`)
const { controller } = require(`../assets/components.js`)
const { audioCtx, getMetadata, getSongBuf, getSongSrc } = require(`../audio.js`)
const second2time = require(`../utils/second2time.js`)
class AQUAController extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = controller
    const root = this.shadowRoot
    const timeLine = root.querySelector(`#timeLine`)
    const loudness = root.querySelector(`#loudness`)
    loudness.value = 1
    timeLine.value = 0
    const gainNode = audioCtx.createGain()
    ebus.on(`play this`, run)
    let playing = false
    let srcAddedTime
    let songPlayingOffset = 0
    let timer
    let audioSrc
    let fillFlag
    let srcBuf
    let duration
    async function run(song) {
      console.log(`clicked`)
      srcBuf = await getSongBuf(song.path)
      timeLine.value = 0
      songPlayingOffset = 0
      if (audioSrc) audioSrc.stop()
      clearInterval(timer)
      playing = true
      duration = song.duration
      const formatedDuration = second2time(duration)
      if (formatedDuration.length === 5) { fillFlag = `m+` }
      else if (formatedDuration.length === 7) { fillFlag = `h` }
      else if (formatedDuration.length === 8) { fillFlag = `h+` }
      root.querySelector(`.time-passed`).innerText = formatedDuration.replace(/[^:]/g, `0`)
      root.querySelector(`.duration`).innerText = formatedDuration
      audioSrc = getSongSrc(srcBuf, gainNode)
      srcAddedTime = audioCtx.currentTime
      audioSrc.start(0, songPlayingOffset)
      timer = setInterval(syncProgressBar, 500)
    }
    root.querySelector(`.play`).addEventListener(`click`, () => {
      if (!playing) {
        playing = true
        audioSrc = getSongSrc(srcBuf, gainNode)
        srcAddedTime = audioCtx.currentTime
        audioSrc.start(0, songPlayingOffset)
        timer = setInterval(syncProgressBar, 500)
      } else {
        clearInterval(timer)
        playing = false
        audioSrc.stop()
        //audioCtx.currentTime - srcAddedTime 为上一次播放开始后, 已经播放的时间
        //更新此次播放产生的偏移
        songPlayingOffset = audioCtx.currentTime - srcAddedTime + songPlayingOffset
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
      songPlayingOffset = duration * (parseFloat(e.target.value) / 1000)
      if (playing) {
        audioSrc.stop()
        audioSrc = getSongSrc(srcBuf, gainNode)
        srcAddedTime = audioCtx.currentTime
        audioSrc.start(0, songPlayingOffset)
        timer = setInterval(syncProgressBar, 500)
      }
    })
    loudness.addEventListener(`input`, (e) => {
      gainNode.gain.value = e.target.value
    })
    function syncProgressBar() {
      const time = parseInt(audioCtx.currentTime - srcAddedTime + songPlayingOffset)
      timeLine.value = (time / duration) * 1000
      root.querySelector(`.time-passed`).innerText = second2time(time, fillFlag)
    }
  }
}
module.exports = AQUAController