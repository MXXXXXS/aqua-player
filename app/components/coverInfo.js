const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')
// const {  } = store

class CoverInfo extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)
    // 属性定义
    this.props = new ReactiveObj({
      coverEl: '',
      name: '',
      artist: '',
      hoverPadColor: '',
      hoverBgColor: '',
      reverseFontWeight: false,
      coverWidth: ''
    })
    // 元素引用
    this.rootEl = this.shadowRoot.querySelector('#root')
    this.coverEl = this.rootEl.querySelector('.cover')
    this.nameEl = this.rootEl.querySelector('.name')
    this.artistEl = this.rootEl.querySelector('.artist')
    this.hoverPad = this.rootEl.querySelector('.hoverPad')
    // UI事件触发store的行为
    this.hoverPad.addEventListener('click', function(e) {
      // 路由跳转
    })
    // 属性改变, 更新视图
    this.props.watch('coverEl', (newEl) => {
      this.coverEl.removeChild(this.coverEl.lastElementChild)
      this.coverEl.appendChild(newEl)
    })
    this.props.watch('name', (name) => {
      this.nameEl.innerText = name
    })
    this.props.watch('artist', (artist) => {
      this.artistEl.innerText = artist
    })
    this.props.watch('hoverBgColor', (color) => {
      this.rootEl.style.setProperty('--hoverBgColor', color)
    })
    this.props.watch('hoverPadColor', (color) => {
      this.rootEl.style.setProperty('--hoverPadColor', color)
    })
    this.props.watch('coverWidth', (width) => {
      this.rootEl.style.setProperty('--fontSize', 0.2 * width + 'px')
      this.rootEl.style.setProperty('--coverWidth', width + 'px')
    })
    this.props.watch('reverseFontWeight', (isTrue) => {
      this.nameEl.classList.remove('lighter', 'bold')
      this.artistEl.classList.remove('lighter', 'bold')
      if (isTrue) {
        this.nameEl.classList.add('bold')
        this.artistEl.classList.add('lighter')
      } else {
        this.artistEl.classList.add('bold')
        this.nameEl.classList.add('lighter')
      }
    })
  }
  connectedCallback() {
    super.connectedCallback()
    // 状态输入
    // .hook(this.props._obj, '')
  }
}

module.exports = createEl(CoverInfo)