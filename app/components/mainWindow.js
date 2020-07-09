const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')
const { color } = store

const menuBar = require('./menuBar')
const playBar = require('./playBar')
const slotSwitcher = require('./slotSwitcher')
const myMusic = require('./myMusic')
const settingsPanel = require('./settings')

class MainWindow extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)
    // 属性定义
    // this.props = new ReactiveObj({
    //   : 
    // })
    // 元素引用
    this.rootEl = this.shadowRoot.querySelector('#root')
    // 菜单
    this.menuBarEl = this.rootEl.querySelector('#menu')
    this.menuBar = menuBar()
    this.menuBarEl.appendChild(this.menuBar)
    // 播放栏
    this.playBarEl = this.rootEl.querySelector('#play-bar')
    this.playBar = playBar({
      bgColor: color.data
    })
    this.playBarEl.appendChild(this.playBar)
    // 内容插槽
    this.myMusic = myMusic()
    this.settingsPanel = settingsPanel()

    this.contentEl = this.rootEl.querySelector('#content')
    this.content = slotSwitcher({
      components: [
        {
          slot: 'myMusic',
          el: this.myMusic
        },
        {
          slot: 'settings',
          el: this.settingsPanel
        }
      ],
      route: ['r-content', 'myMusic'],
      router: ''
    })
    this.contentEl.appendChild(this.content)

    // UI事件触发store的行为
    // this.addEventListener('', function(e) {

    // })
    // 属性改变, 更新视图
    // this.props.watch('', (newVal) => {

    // })
  }
  connectedCallback() {
    super.connectedCallback()
    // 状态输入
    // .hook(this.props._obj, '')
  }
}

module.exports = createEl(MainWindow)