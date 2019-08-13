const fs = require(`fs`)

const ebus = require(`./utils/eBus.js`)
const mm = require(`music-metadata`)

const { storeStates, listSList, shared } = require(`./states.js`)
const states = storeStates.states

const audioCtx = new AudioContext()
const gainNode = audioCtx.createGain()
const interval = 100

//全局状态初始化
states.keyOfSrcBuf = parseInt(localStorage.getItem(`keyOfSrcBuf`)) || 0

//状态绑定
storeStates.add(`gainVal`, gainNode.gain, `value`)
storeStates.addCb(`keyOfSrcBuf`, (val) => {
  localStorage.setItem(`keyOfSrcBuf`, val)
})

let srcBuf
let audioSrc
let lastStartTime = 0//audioCtx.currentTime when started
let lastOffset = 0

async function initialSrcBuf(successCb = () => {}, errorCb = () => {}) {
  let song
  try {
    song = listSList.list[shared.keyItemBuf[states.keyOfSrcBuf]][0]
    if (shared.audioState === 0) {
      shared.audioState = 0.5
      states.duration = song.duration
      const sound = await new Promise((res, rej) => {
        fs.readFile(song.filePath, (err, data) => {
          if (err)
            rej(err)
          res(data)
        })
      }).catch(e => { console.err(`fs.readFile ${song.filePath} error: \n`, e) })
      states.offset = 0
      srcBuf = await audioCtx.decodeAudioData(sound.buffer, () => {
        successCb()
      }, e => {
        console.error(`decodeAudioData failed\n`, e)
        errorCb()
      })
      shared.audioState = 1
    } else {
      console.error(`Can't run "initialSrcBuf", now state: `, shared.audioState)
    }
  } catch (error) {
    console.error(`Can't get song path\n`, error)
  }
}

function createAudioSrc() {
  if (shared.audioState === 1 || shared.audioState === 4) {
    shared.audioState = 1.5
    audioSrc = audioCtx.createBufferSource()
    audioSrc.buffer = srcBuf
    audioSrc.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    audioSrc.onended = e => {
      console.log(`audioSrc ended`)
    }
    shared.audioState = 2
  } else {
    console.error(`Can't run "createAudioSrc", now state: `, shared.audioState)
  }
}

function triggerAudioSrc() {
  if (shared.audioState === 2) {
    shared.audioState = 2.5
    lastOffset = states.offset
    audioSrc.start(0, lastOffset)
    lastStartTime = audioCtx.currentTime
    shared.timer = setInterval(() => states.offset = audioCtx.currentTime - lastStartTime + lastOffset, interval)
    states.playing = true
    shared.audioState = 3
  } else {
    console.error(`Can't run "triggerAudioSrc", now state: `, shared.audioState)
  }
}

function stopAudioSrc() {
  if (shared.audioState === 3) {
    shared.audioState = 3.5
    states.playing = false
    clearInterval(shared.timer)
    audioSrc.stop()
    shared.audioState = 4
  } else {
    console.error(`Can't run "stopAudioSrc", now state: `, shared.audioState)
  }
}

function clearSrcBufAndAudioSrc() {
  const state = shared.audioState
  if (state === 1 || state === 4 || state === 2) {
    state.audioState = 4.5
    srcBuf = undefined
    audioSrc = undefined
    states.offset = 0
    shared.audioState = 0
  } else {
    console.error(`Can't run "clearSrcBuf", now state: `, state)
  }
}

module.exports = {
  initialSrcBuf,
  createAudioSrc,
  triggerAudioSrc,
  stopAudioSrc,
  clearSrcBufAndAudioSrc
}