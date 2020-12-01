import { El } from 'r/fundamental/creatEl'
import { SongMeta } from 'r/states'

export default (toggleNameAndArtistPosition = false): El => ({
  template: __filename,
  states: ['songMeta'],
  props: {
    title: '',
    artist: '',
    cover: '',
  },
  vars: {
    nameOrArtist: !toggleNameAndArtistPosition ? 'name' : 'artist',
    artistOrName: toggleNameAndArtistPosition ? 'name' : 'artist',
  },
  watchStates: {
    songMeta: ({ props }, { meta, coverUrl }: SongMeta) => {
      if (toggleNameAndArtistPosition) {
        props.title = meta.artist || ''
        props.artist = meta.title || ''
      } else {
        props.title = meta.title || ''
        props.artist = meta.artist || ''
      }
      props.cover = coverUrl || ''
    },
  },
  evtHandlers: {
    clicked: () => {
      // 跳转正在播放的大屏模式
    },
  },
})
