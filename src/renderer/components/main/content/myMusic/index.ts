import { El } from 'r/fundamental/creatEl'
import slotSwitcher from '~/renderer/components/slotSwitcher'
import panelSwitcher from './panelSwitcher'
import sortTypePanel from './sortTypePanel'
import musicSwitcher from './music'

const sortTypePanels = slotSwitcher({
  slots: [
    {
      slot: 'music',
      el: sortTypePanel('musicSortBy', 'filterGenres'),
    },
    // {
    //   slot: 'artists',
    //   el: sortTypePanel('musicSortBy', ''),
    // },
    {
      slot: 'albums',
      el: sortTypePanel('albumsSortBy', 'albumsFilterGenres'),
    },
  ],
  route: ['s-sortTypePanel', 'music'],
})

const contentSwitcher = slotSwitcher({
  slots: [
    {
      slot: 'music',
      el: musicSwitcher,
    },
    // {
    //   slot: 'artists',
    //   el: ,
    // },
    // {
    //   slot: 'albums',
    //   el: ,
    // },
  ],
  route: ['s-music', 'music'],
})

const config: El = {
  template: __filename,
  children: {
    '.myMusicPanel': panelSwitcher,
    '.sortTypePanel': sortTypePanels,
    '.contentSwitcher': contentSwitcher,
  },
  created: ({ host }) => {
    host.style.overflow = 'hidden'
  },
}

export default config
