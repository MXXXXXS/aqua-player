import { router } from './index'
import Aqua from 'r/fundamental/aqua'
import { noop } from 'lodash'

import { TagType } from 'c/main/content/myMusic/panelSwitcher'

export const myMusicPanel = new Aqua<TagType>({
  data: 'music',
  reacts: [
    ({ newData: newTag }) => {
      router.tap('multiAdd', ['s-music', newTag], ['s-sortTypePanel', newTag])
    },
  ],
})

export const highlightedMenuItemText = new Aqua<string>({
  data: '',
  reacts: [
    ({ newData: curTab }, next = noop) => {
      //console.log('现在激活的menuItemActivated为: ', curTab)
      next(curTab)
    },
    (curTab) => {
      switch (curTab) {
        case '我的音乐': {
          router.tap('add', ['s-content', 'myMusic'])
          break
        }
        case '设置': {
          router.tap('add', ['s-content', 'settings'])
          break
        }
      }
    },
  ],
})
