const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')
const { color } = store

const myMusicPanel = require('./myMusicPanel')
const slotSwitcher = require('./slotSwitcher')
const myMusicSongs = require('./myMusicSongs')
const sortTypePanel = require('./sortTypePanel')

class MyMusic extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)
    /* 属性定义 */
    // this.props = new ReactiveObj({
    //   : 
    // })
    //---------//
    /* 元素引用 */
    this.rootEl = this.shadowRoot.querySelector('#root')
    // "我的音乐"面板
    this.myMusicPanelEl = this.rootEl.querySelector('.myMusicPanel')
    this.myMusicPanel = myMusicPanel({
      currentTag: '歌曲'
    })
    this.myMusicPanelEl.appendChild(this.myMusicPanel)
    // 排序面板
    this.sortTypePanelEl = this.rootEl.querySelector('.sortTypePanel')
    this.sortTypePanel = slotSwitcher({
      components: [{
        slot: 'songs',
        el: sortTypePanel()
      }],
      route: ['r-sortTypePanel', 'songs'],
      router: ''
    })
    this.sortTypePanelEl.appendChild(this.sortTypePanel)
    // 歌曲列表
    this.myMusicSongs = myMusicSongs()
        
    this.contentSwitcherEl = this.rootEl.querySelector('.contentSwitcher')
    this.contentSwitcher = slotSwitcher({
      components: [
        {
          slot: 'songs',
          el: this.myMusicSongs
        }
      ],
      route: ['r-myMusic', 'songs'],
      router: ''
    })
    this.contentSwitcherEl.appendChild(this.contentSwitcher)
    //---------//
    /* 视图 => 逻辑 */
    // this.addEventListener('', function (e) {

    // })
    //-------------//
    /* 属性 => 视图 */
    // this.props.watch('', (newVal) => {

    // })
    //-------------//
  }
  connectedCallback() {
    super.connectedCallback()
    /* 数据 => 属性 */
    // .hook(this.props._obj, '')
    //-------------//
  }
}

module.exports = createEl(MyMusic)