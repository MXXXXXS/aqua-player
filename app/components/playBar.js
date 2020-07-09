const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')
const { color, time } = store

const progressBarWithTimeStamp = require('./progressBarWithTimeStamp')
const playBarCenterBtns = require('./playBarCenterBtns')
const coverInfo = require('./coverInfo')

const {second2time} = require('../utils/second2time')

class PlayBar extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)
    // 属性定义
    this.props = new ReactiveObj({
      bgColor: '' 
    })
    /* 元素引用 */
    this.rootEl = this.shadowRoot.querySelector('#root')

    // 封面和信息
    this.coverEl = this.rootEl.querySelector('.cover')
    this.cover = coverInfo({
      name: 'dasgjakl;shjgoienwgkjdmc.xlijiop',
      artist: 'sklskajdla;kjgal;ksdjfgklasdjfaklsdg',
      hoverBgColor: 'rgba(0, 0, 0, 0.3)'
    })
    this.coverEl.appendChild(this.cover)
    
    // 进度条
    this.progressBarEl = this.rootEl.querySelector('.progressBar')
    this.progressBarWithTimeStamp = progressBarWithTimeStamp()
    this.progressBarEl.appendChild(this.progressBarWithTimeStamp)
    
    // 中部按钮组
    this.controlEl = this.rootEl.querySelector('.control')
    this.playBarCenterBtns = playBarCenterBtns()
    this.controlEl.appendChild(this.playBarCenterBtns)

    // 右侧按钮组

    // UI事件触发store的行为
    this.addEventListener('', function(e) {

    })
    // 属性改变, 更新视图
    this.props.watch('bgColor', (color) => {
      this.rootEl.style.setProperty('--bgColor', color)
    })
  }
  connectedCallback() {
    super.connectedCallback()
    // 状态输入
    color.hook(this.props._obj, 'bgColor')
  }
}

module.exports = createEl(PlayBar)