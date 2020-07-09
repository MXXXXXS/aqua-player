const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')
const { sortBy, router, scannedSongs } = store

const slotSwitcher = require('./slotSwitcher')
const controledList = require('./controledList')
const singleSong =  require('./singleSong')

class MyMusicSongs extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)
    /* 属性定义 */
    this.props = new ReactiveObj({
      sortBy: '',
      router: '',
      listByDefault: ''
    })
    //---------//
    /* 元素引用 */
    this.rootEl = this.shadowRoot.querySelector('#root')

    // 待切换的几个面板
    this.listByDefault = controledList({
      // list: [],
      el: singleSong
    })

    // 切换槽
    this.slotSwitcher = slotSwitcher({
      components: [
        {
          slot: 'default',
          el: this.listByDefault
        }
      ],
      route: ['r-myMusicSongs', 'default'],
      router: router.data
    })
    this.rootEl.appendChild(this.slotSwitcher)
    //---------//
    /* 视图 => 逻辑 */
    // this.addEventListener('', function(e) {
      
    // })
    //-------------//
    /* 属性 => 视图 */
    this.props.watch('sortBy', (newVal) => {
      
    })
    this.props.watch('router', (newRouter) => {
      this.slotSwitcher.props._obj.router = newRouter
    })
    this.props.watch('listByDefault', (newList) => {
      this.listByDefault.props._obj.list = newList
    })
    //-------------//
  }
  connectedCallback() {
    super.connectedCallback()
    /* 数据 => 属性 */
    sortBy.hook(this.props._obj, 'sortBy')
    router.hook(this.props._obj, 'router')
    scannedSongs.hook(this.props._obj, 'listByDefault')
    //-------------//
  }
}

module.exports = createEl(MyMusicSongs)