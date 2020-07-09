const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')

const path = require('path')

class FolderItem extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)
    /* 属性定义 */
    this.props = new ReactiveObj({
      path: ''
    })
    //---------//
    /* 元素引用 */
    this.rootEl = this.shadowRoot.querySelector('#root')
    this.basenameEl = this.rootEl.querySelector('.basename')
    this.pathEl = this.rootEl.querySelector('.path')
    //---------//
    /* 视图 => 逻辑 */
    // this.addEventListener('', function(e) {
      
    // })
    //-------------//
    /* 属性 => 视图 */
    this.props.watch('path', (folderPath) => {
      const basename = path.basename(folderPath)
      const dirname = path.dirname(folderPath)
      this.basenameEl.innerText = basename
      this.pathEl.innerText = dirname
    })
    //-------------//
  }
  connectedCallback() {
    super.connectedCallback()
    /* 数据 => 属性 */
    //-------------//
  }
}

module.exports = createEl(FolderItem)