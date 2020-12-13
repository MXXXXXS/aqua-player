import { El } from 'r/fundamental/creatEl'
import { MusicMeta, MusicMetaList } from '~/renderer/core/getMusicMeta'
import List from 'r/fundamental/List'
import slip from './slip'

export default (name: string, songs: MusicMetaList): [El, List<MusicMeta>] => {
  const list = new List<MusicMeta>({
    elGen: ({ data: song }) => [
      slip({ ...song, listType: 'sortedSongs' }),
      undefined,
    ],
    keyGen: (song) => song.path,
  })

  return [
    {
      template: __filename,
      vars: {
        name,
      },
      created: ({ root }) => {
        const groupEl = root.querySelector<HTMLElement>('.group')
        if (groupEl) {
          list.mount(groupEl)
          list.update(songs)
        }
      },
    },
    list,
  ]
}
