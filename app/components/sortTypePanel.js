const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')
const { sortBy, sortByGenre, color } = store

class SortTypePanel extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)
    /* 属性定义 */
    this.props = new ReactiveObj({
      sortBy: '',
      sortByGenre: '',
      color: ''
    })
    //---------//
    /* 元素引用 */
    this.rootEl = this.shadowRoot.querySelector('#root')
    this.sortByEl = this.rootEl.querySelector('#sortBy')
    this.sortByGenreEl = this.rootEl.querySelector('#type')
    //---------//
    /* 视图 => 逻辑 */
    // this.addEventListener('', function(e) {
      
    // })
    //-------------//
    /* 属性 => 视图 */
    this.props.watch('sortBy', (newVal) => {
      this.sortByEl.innerText = newVal
    })
    this.props.watch('sortByGenre', (newVal) => {
      this.sortByGenreEl.innerText = newVal
    })
    this.props.watch('color', (color) => {
      this.rootEl.style.setProperty('--color', color)
    })
    //-------------//
  }
  connectedCallback() {
    super.connectedCallback()
    /* 数据 => 属性 */
    sortBy.hook(this.props._obj, 'sortBy')
    sortByGenre.hook(this.props._obj, 'sortByGenre')
    color.hook(this.props._obj, 'color')
    //-------------//
  }
}

module.exports = createEl(SortTypePanel)