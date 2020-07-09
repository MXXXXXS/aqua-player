const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')
const { color, time, totalTime, playFrom} = store

const progressBar = require('./progressBar')

const {second2time} = require('../utils/second2time')

class ProgressBarWithTimeStamp extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)
    // 属性定义
    this.props = new ReactiveObj({
      bgColor: '',
      time: '',
      totalTime: ''
    })
    // 元素引用
    this.rootEl = this.shadowRoot.querySelector('#root')

    this.currentEl = this.rootEl.querySelector('.current')
    this.totalEl = this.rootEl.querySelector('.total')

    this.progressBarEl = this.rootEl.querySelector('.progressBar')
    this.progressBar = progressBar()
    this.progressBarEl.appendChild(this.progressBar)
    // UI事件触发store的行为
    this.progressBar.props.watch('outputValue', (newVal) => {
      playFrom.tap('set', newVal)
    })
    this.progressBar.props.watch('value', (newVal) => {
      time.tap('set', newVal)
    })
    // 属性改变, 更新视图
    // 主题色, 两个时间戳显示, 进度条移动
    this.props.watch('bgColor', (color) => {
      this.progressBar.props._obj.bgColor = color
    })
    this.props.watch('totalTime', (newVal) => {
      const timeStamp = second2time(newVal)
      this.totalEl.innerText = timeStamp
    })
    this.props.watch('time', (newVal) => {
      const timeStamp = second2time(newVal)
      this.currentEl.innerText = timeStamp
      this.progressBar.props._obj.setValue = newVal
    })
  }
  connectedCallback() {
    super.connectedCallback()
    // 状态输入
    color.hook(this.props._obj, 'bgColor')
    totalTime.hook(this.props._obj, 'totalTime')
    time.hook(this.props._obj, 'time')
  }
}

module.exports = createEl(ProgressBarWithTimeStamp)