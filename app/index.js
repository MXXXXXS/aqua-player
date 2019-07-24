const path = require(`path`)
const fs = require(`fs`)

const audioCtx = new AudioContext()

const getSong = async function (songPath) {
  const sound = await  new Promise((res, rej) => {
    fs.readFile(songPath, `binary`, (err, data) => {
      if (err) rej(err)
      const buf = Buffer.from(data, `binary`)
      // console.log(typeof data)
      const arrData = buf.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
      res(new Blob(arrData, { type: `audio/mpeg` }))
    })
  }).catch(e => { console.log(e) })
  audioCtx.decodeAudioData(sound, playSound)
  function playSound(buf) {
    const src = audioCtx.createBufferSource()
    src.buffer = buf
    src.connect(audioCtx.destination)
    src.start(0)
  }
}

getSong(`D:/coding/aqua-player/assets/たまゆらのかぜ.mp3`)