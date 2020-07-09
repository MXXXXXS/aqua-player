const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')
const { color, router } = store

class SettingsPanel extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)
    /* 属性定义 */
    this.props = new ReactiveObj({
      color: ''
    })
    //---------//
    /* 元素引用 */
    this.rootEl = this.shadowRoot.querySelector('#root')
    this.addEl = this.rootEl.querySelector('.add')

    //---------//
    /* 视图 => 逻辑 */
    this.addEl.addEventListener('click', () => {
      router.tap('multAdd', [['r-root', 'mainWindow', 'addFolder']])
    })
    //-------------//
    /* 属性 => 视图 */
    this.props.watch('color', (color) => {
      this.rootEl.style.setProperty('--color', color)
    })

    //-------------//
  }
  connectedCallback() {
    super.connectedCallback()
    /* 数据 => 属性 */
    color.hook(this.props._obj, 'color')
    //-------------//
  }
}

module.exports = createEl(SettingsPanel)