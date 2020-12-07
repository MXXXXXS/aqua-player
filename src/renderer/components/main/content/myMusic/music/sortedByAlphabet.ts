import { El } from 'r/fundamental/creatEl'
import { SortedSongs } from 'r/states'
import List from 'r/fundamental/List'
import group from './group'
import { MusicMetaList } from '~/renderer/core/getMusicMeta'

const config: El = {
  states: ['sortedSongs'],
  watchStates: {
    sortedSongs: ({ vars }, state: SortedSongs) => {
      const sortedSongs = state.list
      const list = vars.list as List<SortedSongs['list'][0]>
      list?.update(sortedSongs)
    },
  },
  created: ({ root, vars }) => {
    const list = new List<SortedSongs['list'][0]>({
      elGen: ({ data: [initial, items] }) => {
        return group(
          initial,
          items.reduce((acc, [, musicMetaList]) => {
            acc.push(...musicMetaList)
            return acc
          }, [] as MusicMetaList)
        )
      },
      keyGen: ([initial]) => initial,
      subListGetter: ([, metaListGroups]) =>
        metaListGroups.reduce(
          (list, [, metaList]) => [...list, ...metaList],
          [] as MusicMetaList
        ),
    })
    list.mount(root)
    vars.list = list
  },
}

export default config
