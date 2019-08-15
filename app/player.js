const fs = require(`fs`)

const ebus = require(`./utils/eBus.js`)
const second2time = require(`./utils/second2time.js`)
const { storeStates, listSList, shared, playList } = require(`./states.js`)
const states = storeStates.states

const audioCtx = new AudioContext()
const gainNode = audioCtx.createGain()
const interval = 100
const coverBuffer = {}

//状态绑定
storeStates.add(`gainVal`, gainNode.gain, `value`)
storeStates.addCb(`keyOfSrcBuf`, (val) => {
  localStorage.setItem(`keyOfSrcBuf`, val)
})

//全局状态初始化
states.keyOfSrcBuf = parseInt(localStorage.getItem(`keyOfSrcBuf`)) || 0

//状态变量
let srcBuf
let audioSrc
let lastStartTime = 0 //audioCtx.currentTime when started
let lastOffset = 0

async function initialSrcBuf(successCb = () => { }, errorCb = () => { }) {
  try {
    const key = playList.list[states.keyOfSrcBuf][0]
    let song = listSList.list[shared.keyItemBuf[key]][0]
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
  states.currentSongFinished = false
}

function drawCover(picture) {
  URL.revokeObjectURL(coverBuffer.imgUrl)
  if (picture) {
    coverBuffer.imgBlob = new Blob([picture.data], { type: picture.format })
    coverBuffer.imgUrl = window.URL.createObjectURL(coverBuffer.imgBlob)
    states.coverSrc = coverBuffer.imgUrl
  } else {
    states.coverSrc = `svg`
  }
}

async function loadSong() {
  //当listSList.list为空时, states.keyOfSrcBuf为 -1
  if (states.keyOfSrcBuf >= 0) {
    //从当前播放列表索引歌曲
    const key = playList.list[states.keyOfSrcBuf][0]
    let song = listSList.list[shared.keyItemBuf[key]][0]
    //加载图片
    drawCover(song.picture)
    //同步名称, 歌手, 时长, 总时长
    states.name = song.title
    states.artist = song.artist
    states.duration = song.duration
    //格式化时间码
    const formatedDuration = second2time(states.duration)
    if (formatedDuration.length === 5) { states.fillFlag = `m+` }
    else if (formatedDuration.length === 7) { states.fillFlag = `h` }
    else if (formatedDuration.length === 8) { states.fillFlag = `h+` }
    states.timePassedText = formatedDuration.replace(/[^:]/g, `0`)
    states.formatedDuration = formatedDuration
    //归零进度条
    states.offset = 0
    //初始化srcBuf
    await initialSrcBuf(() => {
      console.log(`source buffer loaded`)
    })
  }
}

//初始化加载
if (storeStates.states.sListLoaded && listSList.list.length !== 0) {
  changeSong()
} else {
  storeStates.addCb(`sListLoaded`, (ready) => {
    if (ready && states.currentSongFinished)
      changeSong()
  })
}

//点歌
ebus.on(`play this`, () => {
  changeSongAndPlay()
})

//进度条同步与播放完自动切歌
storeStates.addCb(`offset`, offset => {
  if (offset > states.duration) {
    states.currentSongFinished = true
    stopAudioSrc()
    states.offset = states.duration
    states.timePassedText = second2time(states.duration, states.fillFlag)
    if (states.keyOfSrcBuf + 1 < states.total) {
      states.keyOfSrcBuf += 1
      changeSongAndPlay()
    }
  } else {
    states.timePassedText = second2time(offset, states.fillFlag)
  }
})

module.exports = {
  changeSongAndPlay,
  playBack,
  stopAudioSrc
}