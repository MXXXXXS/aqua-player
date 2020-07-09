const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')
const { color, bgColor, hoverBgColor, hoverFontColor, fontColor } = store

class BaseItem extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)
    // 属性定义
    this.props = new ReactiveObj({
      color: '',
      fontColor: '',
      hoverFontColor: '',
      hoverBgColor: '',
      bgColor: '',
      isHighlighted: false
    })
    // 元素引用
    this.rootEl = this.shadowRoot.querySelector('#root')
    // UI事件触发store的行为
    this.addEventListener('mousedown', function(e) {
      const scalePX = 8
      this.rootEl.style.setProperty('--scaleRatio', 1 - scalePX / this.rootEl.offsetWidth)
      console.log(this.tagName, '被按下')
    })
    this.addEventListener('mouseup', function(e) {
      console.log(this.tagName, '被释放')
    })
    // 属性改变, 更新视图
    this.props.watch('color', (newVal) => {
      this.rootEl.style.setProperty('--color', newVal)
    })
    this.props.watch('fontColor', (newVal) => {
      this.rootEl.style.setProperty('--fontColor', newVal)
    })
    this.props.watch('hoverBgColor', (newVal) => {
      this.rootEl.style.setProperty('--hoverBgColor', newVal)
    })
    this.props.watch('bgColor', (newVal) => {
      this.rootEl.style.setProperty('--bgColor', newVal)
    })
    this.props.watch('isHighlighted', (newVal) => {
      if (newVal === true) {
        this.rootEl.classList.add('highlight')
      } else {
        this.rootEl.classList.remove('highlight')
      }
    })
  }
  connectedCallback() {
    super.connectedCallback()
    // 状态输入
    fontColor.hook(this.props._obj, 'fontColor')
    hoverFontColor.hook(this.props._obj, 'hoverFontColor')
    color.hook(this.props._obj, 'color')
    hoverBgColor.hook(this.props._obj, 'hoverBgColor')
    bgColor.hook(this.props._obj, 'bgColor')
  }
}

module.exports = createEl(BaseItem)