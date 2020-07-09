const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')
const { userPlaylists, bgColor } = store

const menuItem = require('./menuItem')
const controledList = require('./controledList')
const menuSearch = require('./menuSearch')
const svgIcon = require('./svgIcon')

class MenuBar extends Base {
  constructor() {
    super()
    this.attachShadow({
      mode: 'open'
    })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)

    // 属性定义
    this.props = new ReactiveObj({
      bgColor: '',
      userPlaylists: []
    })

    // 元素引用
    this.rootEl = this.shadowRoot.querySelector('#root')
    // 菜单切换按钮
    this.switcher = svgIcon({ icon: 'menu', width: 48, height: 48 })
    this.switcherEl = this.rootEl.querySelector('#switcher')
    this.switcherEl.appendChild(this.switcher)
    // 搜索框
    this.searchEl = this.rootEl.querySelector('#search')
    this.search = menuSearch()
    this.searchEl.appendChild(this.search)
    // 几个标签页切换按钮
    this.tabsEl = this.shadowRoot.querySelector('#tabs')
    this.musicEl = menuItem({
      icon: 'music',
      text: '我的音乐'
    })
    this.tabsEl.appendChild(this.musicEl)
    this.lastPlayedEl = menuItem({
      icon: 'clock',
      text: '最近播放的内容'
    })
    this.tabsEl.appendChild(this.lastPlayedEl)
    this.playingEl = menuItem({
      icon: 'wave',
      text: '正在播放'
    })
    this.tabsEl.appendChild(this.playingEl)
    // 播放列表和添加按钮
    this.showPlaylistsEl = this.rootEl.querySelector('#showPlaylists')
    this.addBtn = svgIcon({ icon: 'add', width: 48, height: 48 })
    this.playingLists = menuItem({
      icon: 'playlist',
      text: '播放列表'
    })
    this.playingLists.style.flex = 1
    this.showPlaylistsEl.appendChild(this.playingLists)
    this.showPlaylistsEl.appendChild(this.addBtn)
    // 用户收藏列表
    this.userPlaylistsEl = this.rootEl.querySelector('#userPlaylists')
    this.controledList = controledList({
      el: menuItem
    })
    this.userPlaylistsEl.appendChild(this.controledList)
    // 设置
    this.settingsEl = this.rootEl.querySelector('#settings')
    this.settings = menuItem({
      icon: 'gear',
      text: '设置'
    })
    this.settingsEl.appendChild(this.settings)

    // UI事件触发store的行为
    // this.addEventListener('', function (e) {

    // })
    // 属性改变, 更新视图
    this.props.watch('userPlaylists', (newList) => {
      this.controledList.props._obj.list = newList
    })
  }
  connectedCallback() {
    super.connectedCallback()
    // 状态输入
    bgColor.hook(this.props._obj, 'bgColor')
    userPlaylists.hook(this.props._obj, 'userPlaylists')
  }
}

module.exports = createEl(MenuBar)