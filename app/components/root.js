const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')
const { router } = store

const slotSwitcher = require('./slotSwitcher')
const mainWindow = require('./mainWindow')
const addFolder = require('./addFolder')

class RootWindow extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)
    /* 属性定义 */
    this.props = new ReactiveObj({
      routerData: ''
    })
    //---------//
    /* 元素引用 */
    this.rootEl = this.shadowRoot.querySelector('#root')
    
    this.mainWindow = mainWindow()
    this.addFolder = addFolder()
    this.slotSwitcher = slotSwitcher({
      components: [
        {
          slot: 'mainWindow',
          el: this.mainWindow
        },
        {
          slot: 'addFolder',
          el: this.addFolder
        }
      ],
      route: ['r-root', 'mainWindow']
    })
    this.rootEl.appendChild(this.slotSwitcher)
    //---------//
    /* 视图 => 逻辑 */
    // this.addEventListener('', function(e) {
      
    // })
    //-------------//
    /* 属性 => 视图 */
    // this.props.watch('', (newVal) => {
      
    // })
    //-------------//
  }
  connectedCallback() {
    super.connectedCallback()
    /* 数据 => 属性 */
    router.hook(this.props._obj, 'routerData')
    //-------------//
  }
}

module.exports = createEl(RootWindow)