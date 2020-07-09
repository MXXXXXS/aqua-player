const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')
const { menuItemActived } = store

const baseItem = require('./baseItem')
const path = require('path')
const fs = require('fs')

class MenuItem extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    const baseItemEl = baseItem()
    const template = importTemplate(__filename)
    baseItemEl.appendChild(template.content)
    this.shadowRoot.appendChild(baseItemEl)
    // 属性定义
    this.props = new ReactiveObj({
      text: '',
      icon: '',
      hightText: ''
    })
    // 元素引用
    this.rootEl = this.shadowRoot.querySelector('#root')
    this.textEl = this.shadowRoot.querySelector('.text')
    this.iconEl = this.shadowRoot.querySelector('.icon')
    // UI事件触发store的行为
    this.addEventListener('click', function () {
      menuItemActived.tap('click', this.props._obj.text)
    })
    // 属性改变, 更新视图
    this.props.watch('hightText', (newVal) => {
      if (this.props._obj.text === newVal) {
        baseItemEl.props._obj.isHighlighted = true
      } else {
        baseItemEl.props._obj.isHighlighted = false
      }
    })
    this.props.watch('text', (newVal) => {
      this.textEl.innerText = newVal
    })
    this.props.watch('icon', (newVal) => {
      const iconPath = path.join(__dirname, '../assets/icons/' + newVal + '.svg')
      try {
        const iconSVG = fs.readFileSync(iconPath, {
          encoding: 'utf8'
        })
        this.iconEl.innerHTML = iconSVG
      } catch (error) {
        console.error(error)
      }
    })
  }
  connectedCallback() {
    super.connectedCallback()
    // 状态输入
    menuItemActived.hook(this.props._obj, 'hightText')
  }
}

module.exports = createEl(MenuItem)