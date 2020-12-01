import importTemplate, {
  createEl,
} from '~/renderer/fundamental/templateImporter'
import StateProps from '~/renderer/fundamental/StateProps'

import { color, searchText } from 'r/states'
import { El } from '~/renderer/fundamental/creatEl'
import { searchBoxIcon } from '~/renderer/components/svg'

const cancelBtn = searchBoxIcon('cross')

const searchBtn = searchBoxIcon('search')

export default {
  template: __filename,
  states: ['color'],
  props: {
    searchText: '',
    isForcusing: false,
  },
  watchProps: {
    searchText: (_, newText) => {
      searchText.tap('set', newText)
    },
  },
  created: (cxt) => {},
} as El

class MenuSearch extends BaseCustomElement {
  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    shadowRoot.appendChild(template.content)
    // 属性定义
    this.props = new ReactiveObj({
      searchText: '',
      isForcusing: false,
      color: '',
    })
    // 元素引用
    this.rootEl = this.shadowRoot.querySelector('#root')

    this.inputEl = this.shadowRoot.querySelector('input')

    this.cancelEl = this.rootEl.querySelector('.cross')
    this.canel = svgIcon({
      icon: 'cross',
      pressScale: 1,
      width: 35,
      height: 35,
      scale: 0.35,
      pressedDownColor: 'white',
      pressedDownBgColor: color.data,
      hoverColor: color.data,
      hoverBgColor: 'white',
      bgColor: 'white',
    })
    this.cancelEl.appendChild(this.canel)

    this.searchEl = this.rootEl.querySelector('.search')
    this.search = svgIcon({
      icon: 'search',
      pressScale: 1,
      width: 35,
      height: 35,
      scale: 0.35,
      pressedDownColor: 'white',
      pressedDownBgColor: color.data,
      hoverColor: color.data,
      hoverBgColor: 'white',
      bgColor: 'white',
    })
    this.searchEl.appendChild(this.search)
    // UI事件触发store的行为
    this.inputEl.addEventListener('input', function (e) {
      searchText.tap('input', this.value)
    })
    this.inputEl.addEventListener('forcus', (e) => {
      this.props.isForcusing = true
    })
    this.inputEl.addEventListener('blur', (e) => {
      this.props.isForcusing = false
    })

    // 属性改变, 更新视图
    this.props.watch('isForcusing', (isForcusing) => {})
    this.props.watch('color', (color) => {
      this.canel.props.pressedDownBgColor = color
      this.search.props.pressedDownBgColor = color
      this.search.props.hoverColor = color
    })
  }
  connectedCallback() {
    super.connectedCallback()
    // 状态输入
    searchText.hook(this.props, 'searchText')
    color.hook(this.props, 'color')
  }
}
