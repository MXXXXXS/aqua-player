const { getMetadata } = require(`./audio.js`)
const searchFolder = require(`./utils/searchFolder.js`)
const songPath = `E:/SteamLibrary/steamapps/common/Hollow Knight/Hollow Knight - Official Soundtrack/MP3`
const songs = searchFolder(songPath)

async function list(songs) {
  const result = songs.map(function (songPath) {
    return { meta: getMetadata(songPath), songPath: songPath }
  }).map(async m => {
    const path = m.songPath
    const meta = await m.meta
    const picture = meta.common.picture ? meta.common.picture[0] : undefined
    const title = meta.common.title
    const artist = meta.common.artist
    const album = meta.common.album
    const year = meta.common.year
    const genre = meta.common.genre ? meta.common.genre[0] : undefined
    const duration = meta.format.duration
    const type = meta.format.codec
    return {
      path,
      picture,
      title,
      artist,
      album,
      year,
      genre,
      duration,
      type
    }
  })
  const songList = Promise.all(result)
  console.log(`Songs list get √`)
  return songList
}

module.exports = { songslist: list(songs), songsPath: songPath }