const { controller } = require(`./assets/components.js`)
const second2time = require(`./utils/second2time.js`)

class AQUAController extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = controller
    const root = this.shadowRoot
    const progressBar = root.querySelector(`input[type="range"]`)
    progressBar.value = 0
    run()
    async function run() {
      const metadata = await getMetadata(`D:/coding/aqua-player/assets/たまゆらのかぜ.mp3`)
      const duration = metadata.format.duration
      const formatedDuration = second2time(duration)
      let fillFlag
      if (formatedDuration.length === 5) { fillFlag = `m+` }
      else if (formatedDuration.length === 7) { fillFlag = `h` }
      else if (formatedDuration.length === 8) { fillFlag = `h+` }
      root.querySelector(`.time-passed`).innerText = formatedDuration.replace(/[^:]/g, `0`)
      const srcBuf = await getSongBuf(`D:/coding/aqua-player/assets/たまゆらのかぜ.mp3`)
      let playing = false
      let srcAddedTime
      let songPlayingOffset = 0
      let timer
      let audioSrc
      root.querySelector(`.duration`).innerText = formatedDuration
      root.querySelector(`.play`).addEventListener(`click`, () => {
        if (!playing) {
          playing = true
          audioSrc = getSongSrc(srcBuf)
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
      progressBar.addEventListener(`mousedown`, (e) => {
        clearInterval(timer)
      })
      progressBar.addEventListener(`input`, (e) => {
        root.querySelector(`.time-passed`).innerText = second2time(duration * (parseFloat(e.target.value) / 1000), fillFlag)
      })
      progressBar.addEventListener(`change`, (e) => {
        songPlayingOffset = duration * (parseFloat(e.target.value) / 1000)
        if (playing) {
          audioSrc.stop()
          audioSrc = getSongSrc(srcBuf)
          srcAddedTime = audioCtx.currentTime
          audioSrc.start(0, songPlayingOffset)
          timer = setInterval(syncProgressBar, 500)
        }
      })
      function syncProgressBar() {
        const time = parseInt(audioCtx.currentTime - srcAddedTime + songPlayingOffset)
        progressBar.value = (time / duration) * 1000
        root.querySelector(`.time-passed`).innerText = second2time(time, fillFlag)
      }
    }
  }
}

window.customElements.define(`aqua-controller`, AQUAController)

