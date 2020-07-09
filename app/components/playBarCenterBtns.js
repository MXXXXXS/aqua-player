const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')
const { isPlaying } = store

const svgIcon = require('./svgIcon')

class PlayBarCenterBtns extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)
    // 属性定义
    this.props = new ReactiveObj({
      isPlaying: ''
    })
    // 元素引用
    this.rootEl = this.shadowRoot.querySelector('#root')
    this.randomEl = this.rootEl.querySelector('.random')
    this.previousEl = this.rootEl.querySelector('.previous')
    this.playEl = this.rootEl.querySelector('.play')
    this.nextEl = this.rootEl.querySelector('.next')
    this.modeEl = this.rootEl.querySelector('.mode')
    this.randomBtn = svgIcon({
      width: 32,
      height: 32,
      icon: 'random',
      isCycle: true,
      hoverBgColor: 'rgba(0, 0, 0, 0.1)',
      hoverBorderColor: 'rgba(0, 0, 0, 0.3)',
      hoverBorderWidth: 1,
      color: 'white',
      hoverColor: 'white',
      scale: 0.375

    })
    this.previousBtn = svgIcon({
      width: 32,
      height: 32,
      icon: 'previous',
      isCycle: true,
      hoverBgColor: 'rgba(0, 0, 0, 0.1)',
      hoverBorderColor: 'rgba(0, 0, 0, 0.3)',
      hoverBorderWidth: 1,
      color: 'white',
      hoverColor: 'white',
      scale: 0.375

    })
    this.playBtn = svgIcon({
      width: 46,
      height: 46,
      icon: 'play',
      isCycle: true,
      hoverBgColor: 'rgba(0, 0, 0, 0.1)',
      hoverBorderColor: 'rgba(0, 0, 0, 0.3)',
      hoverBorderWidth: 1,
      color: 'white',
      borderColor: 'white',
      borderwidth: 1,
      hoverColor: 'white',
      scale: 0.375,
      iconQueue: ['play', 'next', 'previous']

    })
    this.nextBtn = svgIcon({
      width: 32,
      height: 32,
      icon: 'next',
      isCycle: true,
      hoverBgColor: 'rgba(0, 0, 0, 0.1)',
      hoverBorderColor: 'rgba(0, 0, 0, 0.3)',
      hoverBorderWidth: 1,
      color: 'white',
      hoverColor: 'white',
      scale: 0.375

    })
    this.modeBtn = svgIcon({
      width: 32,
      height: 32,
      icon: 'refresh',
      isCycle: true,
      hoverBgColor: 'rgba(0, 0, 0, 0.1)',
      hoverBorderColor: 'rgba(0, 0, 0, 0.3)',
      hoverBorderWidth: 1,
      color: 'white',
      hoverColor: 'white',
      scale: 0.375

    })

    this.randomEl.appendChild(this.randomBtn)
    this.previousEl.appendChild(this.previousBtn)
    this.playEl.appendChild(this.playBtn)
    this.nextEl.appendChild(this.nextBtn)
    this.modeEl.appendChild(this.modeBtn)
    // UI事件触发store的行为
    // this.addEventListener('', function (e) {

    // })
    // 属性改变, 更新视图
    this.props.watch('isPlaying', (newVal) => {

    })
  }
  connectedCallback() {
    super.connectedCallback()
    // 状态输入
    isPlaying.hook(this.props._obj, 'isPlaying')
  }
}

module.exports = createEl(PlayBarCenterBtns)