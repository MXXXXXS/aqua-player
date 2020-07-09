module.exports = class ReactiveObj {
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
