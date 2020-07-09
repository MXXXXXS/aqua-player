const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')
const { router } = store

const { difference } = require('lodash')

class SlotSwitcher extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)
    // 属性定义
    this.props = new ReactiveObj({
      components: [],
      route: ['', ''],
      router: ''
    })
    // 元素引用
    this.rootEl = this.shadowRoot.querySelector('#root')
    // this.slotEl = this.shadowRoot.querySelector('slot')
    // UI事件触发store的行为
    // this.addEventListener('', function(e) {

    // })
    // 属性改变, 更新视图
    this.props.watch('components', (components) => {
      components.forEach(component => {
        // el可以不设置, 以不渲染组件
        if (component.el) {
          component.el.slot = component.slot
          this.appendChild(component.el)
        }
      })
    })
    // 预留的单独触发接口, 一般只用于初始化. 之后统一由router触发, 见下方
    this.props.watch('route', (newVal) => {
      router.tap('add', newVal[0], ...(newVal.slice(1)))
    })
    this.props.watch('router', (router) => {
      const routes = router.routes
      const name = this.props._obj.route[0]
      const newSlot = routes[name] || []
      const oldSlot = this.props._obj.route.slice(1)
      const isSame = (difference(newSlot, oldSlot).length === 0) &&
        (difference(oldSlot, newSlot).length === 0)

      const isInitial = !this.shadowRoot.querySelector('slot')
      if (!isSame || isInitial) {
        this.props._obj.route.splice(1, this.props._obj.route.length - 1, ...newSlot)
        /*
        // 改变slot的name实现组件切换, 有较长的延迟, 原因未知
        // this.slotEl.name = routes[name]
        */
        // 删除当前slot再添加新的slot
        // TODO 按需删除, 避免多余的组件卸载挂载
        this.shadowRoot.querySelectorAll('slot').forEach(el => {
          el.remove()
        })
        newSlot.forEach((slotName, index) => {
          const newSlotEl = document.createElement('slot')
          newSlotEl.name = slotName
          newSlotEl.style.zIndex = index

          this.rootEl.appendChild(newSlotEl)
        })
      }
    })
  }
  connectedCallback() {
    super.connectedCallback()
    // 状态输入
    router.hook(this.props._obj, 'router')
  }
}

module.exports = createEl(SlotSwitcher)