import { El } from 'r/fundamental/creatEl'
import svgButton from 'c/svgButton'
import { MusicMeta } from 'r/core/getMusicMeta'
import { color, nowPlayingSong } from 'r/states'
import { ListType, nowPlayingListType } from 'r/states/musicLists'
import { second2time } from '~/renderer/utils/second2time'
import svgIcon from '~/renderer/components/svgIcon'

interface Slip extends MusicMeta {
  listType: ListType
}

export default ({
  listType,
  path,
  title = '',
  artist = '',
  album = '',
  scannedDate = 0,
  genre = '',
  year = '',
  duration = 0,
}: Slip): El => {
  const playingMarker = svgIcon({
    icon: 'playing',
    useTheme: true,
    width: '14px',
    filling: '100%',
  })
  const checkBtn = svgButton({ icons: ['square'] })
  const playBtn = svgButton({ icons: ['play'] })
  const addBtn = svgButton({ icons: ['plus'] })

  return {
    template: __filename,
    states: ['nowPlayingSong', 'color'],
    vars: {
      listType,
      title,
      artist,
      album,
      scannedDate: String(scannedDate),
      genre,
      year,
      duration: String(second2time(Math.round(duration))),
    },
    props: {
      isPlaying: false,
      isPlayingMark: { showWave: false },
      color: '',
    },
    watchStates: {
      color: ({ props }, color) => {
        props.color = props.isPlaying ? color : ''
      },
      nowPlayingSong: ({ props }, nowPlayingSong) => {
        props.isPlaying = nowPlayingSong === path
        props.isPlayingMark = { showWave: nowPlayingSong === path }
      },
    },
    watchProps: {
      isPlaying: ({ props }, isPlaying) => {
        props.color = isPlaying ? color.data : ''
      },
    },
    evtHandlers: {
      play: ({ vars }) => {
        nowPlayingSong.tap('playSlip', path)
        nowPlayingListType.tap('play', vars.listType)
      },
    },
    children: {
      '.wave': playingMarker,
      '.checkBox': checkBtn,
      '.play': playBtn,
      '.addOrRemove': addBtn,
    },
  }
}
