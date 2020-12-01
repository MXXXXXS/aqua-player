import {
  importTemplate,
  createEl,
  BaseCustomElement,
} from '~/renderer/fundamental/templateImporter'
import StateProps from '~/renderer/fundamental/StateProps'

import states from 'r/states'
const { sortBy, router, scannedSongs } = states

const slotSwitcher = require('./slotSwitcher')
const controledList = require('./controledList')
const singleSong = require('./singleSong')

class MyMusicSongs extends BaseCustomElement {
  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    shadowRoot.appendChild(template.content)
    /* 属性定义 */
    this.props = new ReactiveObj({
      sortBy: '',
      router: '',
      listByDefault: '',
    })
    //---------//
    /* 元素引用 */
    this.rootEl = this.shadowRoot.querySelector('#root')

    // 待切换的几个面板
    this.listByDefault = controledList({
      // list: [],
      el: singleSong,
    })

    // 切换槽
    this.slotSwitcher = slotSwitcher({
      components: [
        {
          slot: 'default',
          el: this.listByDefault,
        },
      ],
      route: ['r-myMusicSongs', 'default'],
      router: router.data,
    })
    this.rootEl.appendChild(this.slotSwitcher)
    //---------//
    /* 视图 => 逻辑 */
    // this.addEventListener('', function(e) {

    // })
    //-------------//
    /* 属性 => 视图 */
    this.props.watch('sortBy', (newVal) => {})
    this.props.watch('router', (newRouter) => {
      this.slotSwitcher.props.router = newRouter
    })
    this.props.watch('listByDefault', (newList) => {
      this.listByDefault.props.list = newList
    })
    //-------------//
  }
  connectedCallback() {
    super.connectedCallback()
    /* 数据 => 属性 */
    sortBy.hook(this.props, 'sortBy')
    router.hook(this.props, 'router')
    scannedSongs.hook(this.props, 'listByDefault')
    //-------------//
  }
}

export default createEl(MyMusicSongs)
