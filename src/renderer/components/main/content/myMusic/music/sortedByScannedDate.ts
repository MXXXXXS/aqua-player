import { El } from 'r/fundamental/creatEl'
import { MusicMeta, MusicMetaList } from 'r/core/getMusicMeta'

import List from 'r/fundamental/List'
import slip from './slip'
import virtualList from 'c/virtualList'

const vList = virtualList({
  list: new List<MusicMeta>({
    keyGen: (item) => item.path,
    elGen: ({ data: item }) => [
      slip({ ...item, listType: 'songsSortedByDate' }),
      undefined,
    ],
  }),
  paddingCount: 30,
  itemHeight: 48,
})
const vListProps = vList.props!.proxied

const config: El = {
  // template: __filename,
  states: ['songsSortByDateFilteredByGenre', 'contentSwitcherHeight'],
  watchStates: {
    songsSortByDateFilteredByGenre: (_, musicMetaList: MusicMetaList) => {
      vListProps.listData = musicMetaList
    },
    contentSwitcherHeight: (_, contentSwitcherHeight: number) => {
      vListProps.viewerHeight = String(contentSwitcherHeight) + 'px'
    },
  },
  children: {
    '#root': vList,
  },
}

export default config
