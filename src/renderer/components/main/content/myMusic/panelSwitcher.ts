import { myMusicPanel } from 'r/states'

import { El } from 'r/fundamental/creatEl'

const panels = ['歌曲', '歌手', '专辑']
const MyMusicPanel = ['music', 'artists', 'albums']

export type TagType = 'music' | 'artists' | 'albums'

const config: El = {
  template: __filename,
  states: ['color'],
  evtHandlers: {
    click: ({ root }, e) => {
      const target = e.target as HTMLElement
      const tag = target.innerText
      const index = panels.indexOf(tag)
      if (index > -1) {
        myMusicPanel.tap('set', MyMusicPanel[index])
        root.querySelector('.selected')?.classList.remove('selected')
        target.classList.add('selected')
      }
    },
  },
}

export default config
