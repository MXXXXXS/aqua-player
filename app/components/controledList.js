const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')

const { localLangSort, localLangSortedArray } = require('../utils/localLangSort')
const { shuffle, differenceBy } = require('lodash')

class ControledList extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)

    // 属性定义
    this.props = new ReactiveObj({
      list: [],
      el: '',
      view: '',
      style: ''
    })
    // 元素引用
    this.rootEl = this.shadowRoot.querySelector('#root')
    // UI事件触发store的行为
    // 属性改变, 更新视图
    const changeView = (list, viewType) => {
      let order
      const keys = list.map(item => item.key)
      switch (viewType) {
        case 'ordered': {
          order = localLangSortedArray(keys)
          break
        }
        case 'reversed': {
          order = localLangSortedArray(keys).reverse()
          break
        }
        case 'shuffle': {
          order = shuffle(keys)
          break
        }
        default: {
          order = keys
          break
        }
      }
      // TODO
      // order现在是一个多语言的字典, 各语言已经排序好, 需要转换格式
      order.forEach(key => {
        const el = this.shadowRoot.querySelector(`[key="${key}"]`)
        el.parentNode.appendChild(el)
      })
    }
    this.props.watch('list', (newList, oldList) => {
      // 比较不同
      const elsToRemove = differenceBy(oldList, newList, 'key')
      const elsToAdd = differenceBy(newList, oldList, 'key')
      // 移除/新增元素
      elsToRemove.forEach(elData => {
        const el = this.rootEl.querySelector(`[key="${elData.key}"]`)
        el.remove()
      })
      elsToAdd.forEach(elData => {
        const container = document.createElement('div')
        container.setAttribute('key', elData.key)
        container.appendChild(this.props._obj.el(elData.props))
        this.rootEl.appendChild(container)
      })
      // 排序更新
      changeView(newList, this.props._obj.view)

    })
    this.props.watch('view', (viewType) => {
      changeView(this.props._obj.list, viewType)
    })

  }
  connectedCallback() {
    super.connectedCallback()
    // 状态输入
  }
}

module.exports = createEl(ControledList)