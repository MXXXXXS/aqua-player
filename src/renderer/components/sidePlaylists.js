const {
  importTemplate,
  createEl,
  ReactiveObj,
} = require('../utils/customElHelper')
import states from 'r/states'
const { userPlaylists } = states

const menuItem = require('./menuItem')
const controledList = require('./controledList')

class SidePlaylists extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)

    // 属性定义
    // this.props = new ReactiveObj({
    //   list: []
    // })
    // 元素引用
    this.rootEl = this.shadowRoot.querySelector('#root')
    this.controlEl = this.shadowRoot.querySelector('.control')
    this.itemsEl = this.shadowRoot.querySelector('.items')
    // 添加子组件
    const playlistEl = menuItem({
      text: '播放列表',
      icon: 'playlist',
    })
    this.controlEl.appendChild(playlistEl)

    this.controledListEl = controledList({
      el: menuItem,
    })
    this.itemsEl.appendChild(this.controledListEl)
    // UI事件触发store的行为
    // 属性改变, 更新视图
  }
  connectedCallback() {
    // 状态输入
    userPlaylists.hook(this.controledListEl.props, 'list')
    console.log(this.tagName, '已挂载')
  }
}

export default createEl(SidePlaylists)
