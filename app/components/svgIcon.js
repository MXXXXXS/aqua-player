const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')

const path = require('path')
const fs = require('fs')

class SVGIcon extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)
    // 属性定义
    this.props = new ReactiveObj({
      icon: '',
      scale: '',
      width: '',
      height: '',
      color: '',
      hoverColor: '',
      bgColor: '',
      hoverBgColor: '',
      pressedDownColor: '',
      pressedDownBgColor: '',
      borderwidth: 0,
      borderColor: '',
      hoverBorderColor: '',
      hoverBorderWidth: '',
      isCycle: false,
      isPressedDown: false,
      isActive: false,
      iconQueue: [],
      pressScale: 0.9
    })

    this.iconsBuffer = {}
    // 元素引用
    this.rootEl = this.shadowRoot.querySelector('#root')
    // UI事件触发store的行为
    this.canPress = false
    this.addEventListener('mouseover', () => {
      this.canPress = true
    })
    this.addEventListener('mouseout', () => {
      this.canPress = false
      this.rootEl.classList.add('pressedDown')
      this.rootEl.classList.remove('pressedDown')
      this.props._obj.isPressedDown = false
    })
    this.addEventListener('mousedown', () => {
      // 不使用toggle
      // 原因是防止用户mousedown后没有mouseup就将鼠标移出窗口
      if (this.canPress === true) {
        this.rootEl.classList.remove('pressedDown')
        this.rootEl.classList.add('pressedDown')
        this.props._obj.isPressedDown = true
      }
    })
    this.addEventListener('mouseup', () => {
      this.rootEl.classList.add('pressedDown')
      this.rootEl.classList.remove('pressedDown')
      this.props._obj.isPressedDown = false
    })
    this.addEventListener('click', () => {
      // 使用click事件而不是放在mouseup里, 理由参考上面"不使用toggle"
      // 切换图标和isPressedDown
      const iconQueueLen = this.props._obj.iconQueue.length
      if (iconQueueLen > 1) {
        const iconIndex = this.props._obj.iconQueue.indexOf(this.props._obj.icon)
        if (iconIndex > -1) {
          // 虽然表示下一个位置, 但取余后不需要加一, 因为index从0开始数
          const nextPosition = (iconIndex + 1) % iconQueueLen
          this.props._obj.icon = this.props._obj.iconQueue[nextPosition]
          if (nextPosition === 0) {
            this.props._obj.isActive = false
          } else {
            this.props._obj.isActive = true
          }
        }
      } else {
        this.props._obj.isActive = !this.props._obj.isActive
      }
    })
    // 属性改变, 更新视图
    this.props.watch('iconQueue', (newIconQueue) => {
      this.iconsBuffer = {}
      newIconQueue.forEach((newVal) => {
        const iconPath = path.join(__dirname, '../assets/icons/' + newVal + '.svg')
        try {
          const iconSVG = fs.readFileSync(iconPath, {
            encoding: 'utf8'
          })
          this.iconsBuffer[newVal] = iconSVG
        } catch (error) {
          console.error(error)
        }
      })
    })
    this.props.watch('icon', (newVal) => {
      // 单个图标可以不设置iconQueue, 首次需要从文件读取图标
      if (this.props._obj.iconQueue.length <= 1 && !this.iconsBuffer[newVal]) {
        const iconPath = path.join(__dirname, '../assets/icons/' + newVal + '.svg')
        try {
          const iconSVG = fs.readFileSync(iconPath, {
            encoding: 'utf8'
          })
          this.iconsBuffer[newVal] = iconSVG
        } catch (error) {
          console.error(error)
        }
      }
      this.rootEl.innerHTML = this.iconsBuffer[newVal]
    })
    this.props.watch('scale', (newVal) => {
      this.rootEl.style.setProperty('--svgwidth', newVal * this.props._obj.width + 'px')
      this.rootEl.style.setProperty('--svgheight', newVal * this.props._obj.height + 'px')
    })
    this.props.watch('width', (newVal) => {
      this.rootEl.style.setProperty('--width', newVal + 'px')
    })
    this.props.watch('height', (newVal) => {
      this.rootEl.style.setProperty('--height', newVal + 'px')
    })
    this.props.watch('color', (newVal) => {
      this.rootEl.style.setProperty('--color', newVal)
    })
    this.props.watch('hoverColor', (newVal) => {
      this.rootEl.style.setProperty('--hoverColor', newVal)
    })
    this.props.watch('bgColor', (newVal) => {
      this.rootEl.style.setProperty('--bgColor', newVal)
    })
    this.props.watch('hoverBgColor', (newVal) => {
      this.rootEl.style.setProperty('--hoverBgColor', newVal)
    })
    this.props.watch('pressedDownColor', (newVal) => {
      this.rootEl.style.setProperty('--pressedDownColor', newVal)
    })
    this.props.watch('pressedDownBgColor', (newVal) => {
      this.rootEl.style.setProperty('--pressedDownBgColor', newVal)
    })
    this.props.watch('borderColor', (newVal) => {
      this.rootEl.style.setProperty('--borderColor', newVal)
    })
    this.props.watch('hoverBorderColor', (newVal) => {
      this.rootEl.style.setProperty('--hoverBorderColor', newVal)
    })
    this.props.watch('pressScale', (newVal) => {
      this.rootEl.style.setProperty('--pressScale', newVal)
    })
    this.props.watch('borderwidth', (width) => {
      this.rootEl.style.setProperty('--borderwidth', width + 'px')
    })
    this.props.watch('hoverBorderWidth', (width) => {
      this.rootEl.style.setProperty('--hoverBorderWidth', width + 'px')
    })
    this.props.watch('isCycle', (isCycle) => {
      if (isCycle) {
        this.rootEl.style.setProperty('border-radius', this.props._obj.width + 'px')
      } else {
        this.rootEl.style.setProperty('border-radius', '0px')
      }
    })
  }
  connectedCallback() {
    super.connectedCallback()
  }
}

module.exports = createEl(SVGIcon)