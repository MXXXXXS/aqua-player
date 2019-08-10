const fs = require(`fs`)

const ffmpegPath = require(`ffmpeg-static`).path
const child_process = require(`child_process`)
const mm = require(`music-metadata`)

const audioCtx = new AudioContext()

async function getSongBuf(songPath) {
  const sound = await new Promise((res, rej) => {
    fs.readFile(songPath, (err, data) => {
      if (err)
        rej(err)
      res(data)
    })
  })
    .catch(e => { console.log(e) })
  return await audioCtx.decodeAudioData(sound.buffer)
}

function getSongSrc(srcBuf, gainNode) {
  const src = audioCtx.createBufferSource()
  src.buffer = srcBuf
  src.connect(gainNode)
  gainNode.connect(audioCtx.destination)
  return src
}

async function getMetadata(songPath) {
  return await mm.parseFile(songPath, {
    duration: true,
    skipCovers: false
  }).catch(e => console.error(e))
}

module.exports = {
  audioCtx,
  getSongBuf,
  getSongSrc,
  getMetadata
}