import { El } from 'r/fundamental/creatEl'
import svgButton from 'c/svgButton'
import { MusicMeta } from 'r/core/getMusicMeta'
import { nowPlayingSong } from 'r/states'

export default ({
  path,
  title = '',
  artist = '',
  album = '',
  scannedDate = 0,
  genre = '',
  // year = '',
  duration = 0,
}: MusicMeta): El => {
  const checkBtn = svgButton({ icons: ['square'] })
  const playBtn = svgButton({ icons: ['play'] })
  const addBtn = svgButton({ icons: ['plus'] })

  return {
    template: __filename,
    vars: {
      title,
      artist,
      album,
      scannedDate: String(scannedDate),
      genre,
      // year,
      duration: String(Math.round(duration)),
    },
    evtHandlers: {
      play: () => {
        nowPlayingSong
          .tapAsync('playAnother', path)
          .catch((err) => console.error(err))
      },
    },
    children: {
      '.checkBox': checkBtn,
      '.play': playBtn,
      '.addOrRemove': addBtn,
    },
  }
}
