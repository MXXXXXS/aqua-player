import { El } from 'r/fundamental/creatEl'
import slotSwitcher from '~/renderer/components/slotSwitcher'
import sortedByScannedDate from './sortedByScannedDate'
import sortedByAlphabet from './sortedByAlphabet'

const panels = slotSwitcher({
  slots: [
    {
      slot: '添加日期',
      el: sortedByScannedDate,
    },
    {
      slot: 'A到Z',
      el: sortedByAlphabet,
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
