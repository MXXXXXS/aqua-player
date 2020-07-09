const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')
const { folders } = store

const controledList = require('./controledList')
const folderItem = require('./folderItem')

class AddFolder extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)
    /* 属性定义 */
    this.props = new ReactiveObj({
      folders: []
    })
    //---------//
    /* 元素引用 */
    this.rootEl = this.shadowRoot.querySelector('#root')
    this.listEl = this.rootEl.querySelector('.tilesContainer')
    this.statementEl = this.rootEl.querySelector('.statement')
    this.list = controledList({
      list: [],
      el: folderItem,
      style: `
      #root > div {
        margin: 10px 0;
        background: gainsboro;
      }
    `
    })
    this.listEl.appendChild(this.list)
    //---------//
    /* 视图 => 逻辑 */
    // this.addEventListener('', function(e) {
      
    // })
    //-------------//
    /* 属性 => 视图 */
    this.props.watch('folders', (newList) => {
      this.list.props._obj.list = newList
      if (newList.length === 0) {
        this.statementEl.style.display = 'none'
      } else {
        this.statementEl.style.display = 'block'

      }
    })
    //-------------//
  }
  connectedCallback() {
    super.connectedCallback()
    
    this.style.display = 'flex'
    this.style.height = '100vh'
    this.style.justifyContent = 'center'
    this.style.alignItems = 'center'
    /* 数据 => 属性 */
    folders.hook(this.props._obj, 'folders')
    //-------------//
  }
}

module.exports = createEl(AddFolder)