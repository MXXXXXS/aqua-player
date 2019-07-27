const {getMetadata} = require(`./audio.js`)
const searchFolder = require(`./utils/searchFolder.js`)
const songs = searchFolder(`E:/SteamLibrary/steamapps/common/Hollow Knight/Hollow Knight - Official Soundtrack/MP3`)

async function list(songs) {
  songList = (await Promise.all(songs.map(async function (songPath) {
    return await getMetadata(songPath)
  }))).map(meta => ({
    picture: meta.common.picture ? meta.common.picture[0] : undefined,
    title: meta.common.title,
    artist: meta.common.artist,
    album: meta.common.album,
    year: meta.common.year,
    genre: meta.common.genre ? meta.common.genre[0] : undefined,
    duration: meta.format.duration
  }))
  console.log(songList)
  return songList
}

module.exports = list(songs)