import { El } from 'r/fundamental/creatEl'
import slotSwitcher from '~/renderer/components/slotSwitcher'
import sortedByScannedDate from './sortedByScannedDate'
import sortedBySortType from './sortedBySortType'

const panels = slotSwitcher({
  slots: [
    {
      slot: '添加日期',
      el: sortedByScannedDate,
    },
    {
      slot: 'A到Z',
      el: sortedBySortType,
    },
    {
      slot: '歌手',
      el: sortedBySortType,
    },
    {
      slot: '专辑',
      el: sortedBySortType,
    },
  ],
  route: ['s-music-sort-by', '添加日期'],
})

const config: El = {
  children: {
    '#root': panels,
  },
}

export default config
