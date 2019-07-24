const path = require(`path`)
const fs = require(`fs`)
const audioCtx = new AudioContext()

const getSong = async function (songPath) {
  const sound = await new Promise((res, rej) => {
    fs.readFile(songPath, (err, data) => {
      if (err) 
        rej(err)
      res(data)
    })
  })
    .catch(e => { console.log(e) })
  const arrSound = sound.buffer.slice(sound.byteOffset, sound.byteOffset + sound.byteLength)
  audioCtx.decodeAudioData(arrSound, playSound)
  function playSound(buf) {
    console.log(`play`)
    const src = audioCtx.createBufferSource()
    src.buffer = buf
    src.connect(audioCtx.destination)
    src.start(0)
  }
}
getSong(`D:/coding/aqua-player/assets/たまゆらのかぜ.mp3`)