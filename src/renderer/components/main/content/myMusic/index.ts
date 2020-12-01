import { El } from 'r/fundamental/creatEl'
import slotSwitcher from '~/renderer/components/slotSwitcher'
import panelSwitcher from './panelSwitcher'
import sortTypePanel from './sortTypePanel'
import musicByDate from './music'

const musicSwitcher = slotSwitcher({
  slots: [
    {
      slot: 'byDate',
      el: musicByDate,
    },
  ],
  route: ['s-music-by', 'byDate'],
})

const contentSwitcher = slotSwitcher({
  slots: [
    {
      slot: 'music',
      el: musicSwitcher,
    },
  ],
  route: ['s-music', 'music'],
})

const config: El = {
  template: __filename,
  children: {
    '.myMusicPanel': panelSwitcher,
    '.contentSwitcher': contentSwitcher,
    '.sortTypePanel': sortTypePanel,
  },
  created: ({ host }) => {
    host.style.overflow = 'hidden'
  },
}

export default config
