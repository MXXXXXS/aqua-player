const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const AQUA = require('../utils/aqua')
const store = require('../store')
// const {  } = store

class ProgressBar extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)

    let locked = false
    // 属性定义
    this.props = new ReactiveObj({
      bgColor: '',
      value: '',
      setValue: '',
      outputValue: ''
    })
    // 元素引用
    this.rootEl = this.shadowRoot.querySelector('#root')
    this.inputEl = this.rootEl.querySelector('input')
    // UI事件触发store的行为
    // 只供外部读取
    this.inputEl.addEventListener('input', (e) => {
      this.props._obj.value = e.target.value
    })
    // 拖动时锁定setValue
    this.inputEl.addEventListener('mousedown', (e) => {
      locked = true
    })
    this.inputEl.addEventListener('mouseup', (e) => {
      locked = false
      this.props._obj.outputValue = e.target.value
    })
    // 属性改变, 更新视图
    this.props.watch('bgColor', (color) => {
      this.rootEl.style.setProperty('--bgColor', color)
    })
    // 自外部输入值更新, 受控
    this.props.watch('setValue', (value) => {
      if (!locked) {
        this.inputEl.value = value
      }
    })
  }
  connectedCallback() {
    super.connectedCallback()
    // 状态输入
    // .hook(this.props._obj, '')
  }
}

module.exports = createEl(ProgressBar)