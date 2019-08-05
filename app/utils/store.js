class Store {
  constructor(states) {
    const _this = this
    if (states) {
      this.binded = {}
      for (const key in states) {
        if (states.hasOwnProperty(key)) {
          this.binded[key] = {
            subscribers: [],
            callbacks: []
          }
        }
      }
      this.states = new Proxy(states, {
        set(target, p, value, receiver) {
          if (receiver[p] !== value) {
            const subscribers = _this.binded[p].subscribers
            subscribers.forEach(item => {
              const obj = item[0]
              const bindedKeys = item[1]
              bindedKeys.forEach(bindedKey => {
                obj[bindedKey] = value
              })
            })
            const callbacks = _this.binded[p].callbacks
            callbacks.forEach(cb => {
              cb(value, receiver[p])
            })
          }
          return Reflect.set(target, p, value, receiver)
        }
      })
    }
  }

  add(state, obj, ...keysToBind) {
    const subscribers = this.binded[state].subscribers
    if (subscribers.length === 0) {
      subscribers.push([obj, [...keysToBind]])
    } else {
      for (let i = 0; i < subscribers.length; i++) {
        const item = subscribers[i]
        if (item[0] === obj) {
          item[1].push(...keysToBind)
          break
        }
      }
    }
  }

  addCb(state, cb) {
    this.binded[state].callbacks.push(cb)
  }

  remove(state, obj, ...keysToRemove) {
    const subscribers = this.binded[state].subscribers
    for (let i = 0; i < subscribers.length; i++) {
      const item = subscribers[i]
      if (item[0] === obj) {
        if (keysToRemove.length === 0) {
          //remove obj
          subscribers.splice(i, 1)
        } else {
          keysToRemove.forEach(key => {
            const keyIndex = item[1].indexOf(key)
            if (keyIndex !== -1)
              item[1].splice(keyIndex, 1)
          })
        }
        break
      }
    }
  }
}

class List {
  constructor(arr) {
    if (Array.isArray(arr)) {
      const _this = this
      this.key = 0
      this.callbacks = []
      arr = arr.map(val => [val, _this.key++])
      this.list = new Proxy(arr, {
        set(target, p, value, receiver) {
          if (receiver[p] !== value) {
            _this.callbacks.forEach(cb => {
              cb(p, value[0], receiver[p][0])
            })
          }
          return Reflect.set(target, p, value, receiver)
        }
      })

      this.set = function (index, value) {
        const val = [value, _this.key++]
        this.updateCasted(`set`, index, val)
        this.list[index] = val
      }

      this.splice = function (start, deleteCount, ...items) {
        items = items.map(item => [item, _this.key++])
        this.updateCasted(`splice`, start, deleteCount, ...items)
        Array.prototype.splice.call(this.list, start, deleteCount, ...items)
      }

      this.push = function (...items) {
        items = items.map(item => [item, _this.key++])
        this.updateCasted(`push`, ...items)
        Array.prototype.push.call(this.list, ...items)
      }

      this.casted = []
    }
  }
  addCb(cb) {
    this.callbacks.push(cb)
  }
  changeSource(newArr) {
    const _this = this
    this.key = 0
    newArr = newArr.map(val => [val, this.key++])
    this.list = new Proxy(newArr, {
      set(target, p, value, receiver) {
        if (receiver[p] !== value) {
          _this.callbacks.forEach(cb => {
            cb(p, value[0], receiver[p][0])
          })
        }
        return Reflect.set(target, p, value, receiver)
      }
    })
    newArr.forEach((value, i) => {
      this.callbacks.forEach(cb => {
        cb(i, value[0])
      })
    })

    for (const sel in this.casted) {
      if (this.casted.hasOwnProperty(sel)) {
        const member = this.casted[sel]

      }
    }
  }
  cast(elSelector, cb, scope = document) {
    this.casted.push([elSelector, cb, scope])
    const el = scope.querySelector(elSelector)
    el.innerHTML = ``
    this.list.forEach((item, i) => {
      el.innerHTML += cb(item[1], i, item[0])
    })
  }
  updateCasted(...args) {
    const changeType = args[0]
    switch (changeType) {
      case `set`:
        this.casted.forEach(item => {
          const elSelector = item[0]
          const cb = item[1]
          const scope = item[2]
          const el = scope.querySelector(elSelector)

          const key = this.list[p][1]
          const index = args[1]
          const newVal = args[2]

          const beforeStartEl = el.querySelector(`[data-key="${key}"]`).previousElementSibling
          el.removeChild(el.querySelector(`[data-key="${key}"]`))
          beforeStartEl.insertAdjacentHTML(`afterend`, cb(key, index, newVal))
        })
        break
      case `push`:
        this.casted.forEach(item => {
          const elSelector = item[0]
          const cb = item[1]
          const scope = item[2]
          const el = scope.querySelector(elSelector)

          const start = this.list.length
          const items = args.slice(1, args.length)

          items.forEach((item, i) => {
            el.innerHTML += cb(item[1], start + i, item[0])
          })
        })
        break
      case `splice`:
        this.casted.forEach(item => {
          const elSelector = item[0]
          const cb = item[1]
          const scope = item[2]
          const el = scope.querySelector(elSelector)

          const start = args[1]
          const deleteCount = args[2]
          const items = args.slice(3, args.length)
  
          const elKey = this.list[start][1]
  
          //先删除对应元素
          const startEl = el.querySelector(`[data-key="${elKey}"]`)
  
          for (let i = 0; i < deleteCount - 1; i++) {
            el.removeChild(startEl.nextElementSibling)
          }
          el.removeChild(startEl)
          //再添加对应元素

          items.forEach((item, i) => {
            beforeStartEl.insertAdjacentHTML(`afterend`, cb(item[1], start + i, item[0]))
          })
        })
        break
    }
  }
}

module.exports = { Store, List }