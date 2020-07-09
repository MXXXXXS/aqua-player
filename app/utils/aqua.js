const { remove } = require('lodash')

module.exports = class AQUA {
  constructor(config) {
    this.data = config.data
    this.acts = config.acts
    this.hooks = []
  }

  setter(newData) {
    this.hooks.forEach(hook => {
      hook[0][hook[1]] = newData
    })
    Object.values(this.acts).forEach(act => {
      if (Array.isArray(act)) {
        act[0](newData)
      }
    })
    this.data = newData
  }

  tap(action, ...args) {
    const act = this.acts[action]
    let result
    if (Array.isArray(act)) {
      result = act[0](...args)
    } else {
      result = act(...args)
    }
    if (result !== undefined && result !== this.data) {
      this.setter(result)
    }
  }

  hook(obj, key) {
    obj[key] = this.data
    this.hooks.push([obj, key])
  }

  unhook(obj, key) {
    if (key === undefined) {
      remove(this.hooks, function (item) {
        return item[0] === obj
      })
    } else {
      remove(this.hooks, function (item) {
        return item[0] === obj && item[1] === key
      })
    }
  }

  view() {
    return this.data
  }
}