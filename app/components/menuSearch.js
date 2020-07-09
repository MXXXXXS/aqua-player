const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')
const { searchText, color } = store

const svgIcon = require('./svgIcon')

class MenuSearch extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)
    // 属性定义
    this.props = new ReactiveObj({
      searchText: '',
      isForcusing: false,
      color: ''
    })
    // 元素引用
    this.rootEl = this.shadowRoot.querySelector('#root')

    this.inputEl = this.shadowRoot.querySelector('input')

    this.cancelEl = this.rootEl.querySelector('.cross')
    this.canel = svgIcon({
      icon: 'cross',
      pressScale: 1,
      width: 35,
      height: 35,
      scale: 0.35,
      pressedDownColor: 'white',
      pressedDownBgColor: color.data,
      hoverColor: color.data,
      hoverBgColor: 'white',
      bgColor: 'white'
    })
    this.cancelEl.appendChild(this.canel)

    this.searchEl = this.rootEl.querySelector('.search')
    this.search = svgIcon({
      icon: 'search',
      pressScale: 1,
      width: 35,
      height: 35,
      scale: 0.35,
      pressedDownColor: 'white',
      pressedDownBgColor: color.data,
      hoverColor: color.data,
      hoverBgColor: 'white',
      bgColor: 'white'
    })
    this.searchEl.appendChild(this.search)
    // UI事件触发store的行为
    this.inputEl.addEventListener('input', function (e) {
      searchText.tap('input', this.value)
    })
    this.inputEl.addEventListener('forcus', (e) => {
      this.props._obj.isForcusing = true
    })
    this.inputEl.addEventListener('blur', (e) => {
      this.props._obj.isForcusing = false
    })

    // 属性改变, 更新视图
    this.props.watch('isForcusing', (isForcusing) => {

    })
    this.props.watch('color', (color) => {
      this.canel.props._obj.pressedDownBgColor = color
      this.search.props._obj.pressedDownBgColor = color
      this.search.props._obj.hoverColor = color
    })
  }
  connectedCallback() {
    super.connectedCallback()
    // 状态输入
    searchText.hook(this.props._obj, 'searchText')
    color.hook(this.props._obj, 'color')
  }
}

module.exports = createEl(MenuSearch)