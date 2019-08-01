const ebus = require(`../utils/eBus.js`)
const { controller } = require(`../assets/components.js`)
const { audioCtx, getMetadata, getSongBuf, getSongSrc } = require(`../audio.js`)
const second2time = require(`../utils/second2time.js`)
const { storeStates, listSList } = require(`../states.js`)
const states = storeStates.states

class AQUAController extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = controller
    const root = this.shadowRoot

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
    let audioSrc = audioCtx.createBufferSource()
    let fillFlag
    let srcBuf
    let duration
    const name = root.querySelector(`.name`)
    const artist = root.querySelector(`.artist`)
    storeStates.add(`name`, name, `innerText`)
    storeStates.add(`artist`, artist, `innerText`)

    // listSList.addCb(() => {
    //   // console.log(`added`)
    //   states.sListLoaded = true
    // })

    storeStates.addCb(`sListLoaded`, (ready) => {
      console.log(ready, `loadSong`)
      if (ready) process.nextTick(loadSong) //等待listSList加载第一首歌曲
    })

    ebus.on(`play this`, async (i) => {
      if (states.playing)
        stop()
      states.playingSongNum = i
      await loadSong()
      start()
    })
    root.querySelector(`.play`).addEventListener(`click`, () => {
      if (!states.playing) {
        start()
      } else {
        stop()
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

    nextSong.addEventListener(`click`, async (e) => {
      if (states.playingSongNum + 1 < states.total) {
        if (states.playing)
          stop()
        states.playingSongNum += 1
        await loadSong()
        start()
      }
    })

    lastSong.addEventListener(`click`, async (e) => {
      if (states.playingSongNum - 1 >= 0) {
        if (states.playing)
          stop()
        states.playingSongNum -= 1
        await loadSong()
        start()
      }
    })

    async function loadSong() {
      let song = listSList.list[states.playingSongNum]
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

    function start() {
      states.playing = true
      audioSrc = audioCtx.createBufferSource()
      audioSrc.buffer = srcBuf
      audioSrc.connect(gainNode)
      gainNode.connect(audioCtx.destination)
      srcAddedTime = audioCtx.currentTime
      audioSrc.start(0, songPlayingOffset)
      timer = setInterval(syncProgressBar, 100)
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
            states.playingSongNum += 1
            await loadSong()
            start()
          }
        }
      } else {
        root.querySelector(`.time-passed`).innerText = second2time(time, fillFlag)
      }
    }
  }
}
module.exports = AQUAController