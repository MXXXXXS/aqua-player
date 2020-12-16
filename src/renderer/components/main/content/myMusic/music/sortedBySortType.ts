import { El } from 'r/fundamental/creatEl'
import { SortedSongs } from 'r/states'
import List from 'r/fundamental/List'
import group from './group'

const config: El = {
  states: ['sortedSongsFilteredByGenre'],
  watchStates: {
    sortedSongsFilteredByGenre: ({ vars }, state: SortedSongs): void => {
      const sortedSongs = state.list
      const list = vars.list as List<SortedSongs['list'][number]>
      list?.update(sortedSongs)
    },
  },
  created: ({ root, vars }) => {
    const list = new List<SortedSongs['list'][number]>({
      elGen: ({ data: [key, ...metaListGroups] }) => {
        return group(key, metaListGroups)
      },
      keyGen: ([key]) => key,
      subListGetter: ([, ...metaListGroups]) => metaListGroups,
    })
    list.mount(root)
    vars.list = list
  },
}

export default config
