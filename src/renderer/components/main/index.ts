import { El } from 'r/fundamental/creatEl'
import backEl from 'c/main/backBar'
import menuEl from 'c/main/menu'
import settings from 'c/main/content/settings'
import slotSwitcher from '../slotSwitcher'
import myMusic from 'c/main/content/myMusic'
import playBar from './playBar'

const playBarEl = playBar

const contentSwitcher = slotSwitcher({
  slots: [
    {
      slot: 'settings',
      el: settings,
    },
    {
      slot: 'myMusic',
      el: myMusic,
    },
  ],
  route: ['s-content', 'myMusic'],
})

const elConfig: El = {
  template: __filename,
  children: {
    '#back': backEl,
    '#menu': menuEl,
    '#content': contentSwitcher,
    '#play-bar': playBarEl,
  },
}

export default elConfig
