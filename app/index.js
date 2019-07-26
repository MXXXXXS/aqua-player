const path = require(`path`)
const mm = require(`music-metadata`)

const fs = require(`fs`)
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
  const arrSound = sound.buffer.slice(sound.byteOffset, sound.byteOffset + sound.byteLength)
  return await audioCtx.decodeAudioData(arrSound)
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