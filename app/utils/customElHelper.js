const fs = require('fs')
const { kebabCase } = require('lodash')
const store = require('../store')

class Base extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    if (this.props && this.props._obj.style !== undefined) {
      this.styleEl = this.shadowRoot.querySelector('#style')
      if (!this.styleEl) {
        const styleEl = document.createElement('style')
        styleEl.setAttribute('id', 'style')
        this.shadowRoot.appendChild(styleEl)
        this.styleEl = styleEl
      }
      this.props.watch('style', newStyle => {
        this.styleEl.innerHTML = newStyle
      })
      // 初始化时生效
      this.styleEl.innerHTML = this.props._obj.style
    }
    // this.style.display = 'grid'
    this.style.minWidth = '0'
    this.style.minHeight = '0'
    // console.log(this.tagName, '已挂载')
  }
  disconnectedCallback() {
    //状态输入解除
    Object.values(store).forEach(state => {
      state.unhook(this.props._obj)
    })
    // console.log(this.tagName, '已卸载')
  }
}

function importTemplate(name) {
  const tempHTML = fs.readFileSync(name.replace('.js', '.html'), {
    encoding: 'utf8'
  })
  const template = document.createElement('template')
  template.innerHTML = tempHTML
  return template
}

function createEl(elClass) {
  return (props = {}) => {
    const elName = kebabCase(elClass.name)
    if (!customElements.get(elName)) {
      customElements.define(elName, elClass)
    }
    const el = document.createElement(elName)
    Object.entries(props).forEach(entry => {
      el.props._obj[entry[0]] = entry[1]
    })
    return el
  }
}

class ReactiveObj {
  constructor(states = {}) {
    const _this = this
    this.watchers = {}
    for (const key in states) {
      if (states.hasOwnProperty(key)) {
        this.watchers[key] = []
      }
    }
    this._obj = new Proxy(states, {
      set(target, p, value, receiver) {
        if (receiver[p] !== value) {
          _this.watchers[p].forEach(cb => {
            cb(value, receiver[p])
          })
        }
        return Reflect.set(target, p, value, receiver)
      }
    })
  }

  watch(state, cb) {
    this.watchers[state].push(cb)
    return cb
  }

  unwatch(state, cb) {
    const index = this.watchers[state].indexOf(cb)
    if (index >= 0) {
      this.watchers[state].splice(index, 1)
    }
  }

  unwatchAll() {
    for (const key in this.watchers) {
      if (this.watchers.hasOwnProperty(key)) {
        this.watchers[key] = []
      }
    }
  }
}

module.exports = {
  Base,
  importTemplate,
  createEl,
  ReactiveObj
}
