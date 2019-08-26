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
              const bindedKeys = item.slice(1, item.length)
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

  sync(state, obj, ...keysToBind) {
    const subscribers = this.binded[state].subscribers
    if (subscribers.length === 0) {
      subscribers.push([obj, [...keysToBind]])
    } else {
      let added = false
      for (let i = 0; i < subscribers.length; i++) {
        const item = subscribers[i]
        if (item[0] === obj) {
          item[1].push(...keysToBind)
          added = true
          break
        }
      }
      if (!added) {
        subscribers.push([obj, ...keysToBind])
      }
    }
  }

  desync(state, obj, ...keysToRemove) {
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

  watch(state, cb) {
    this.binded[state].callbacks.push(cb)
  }

  unwatch(state, cb) {
    const index = this.binded[state].callbacks.indexOf(cb)
    if (index >= 0) {
      this.binded[state].splice(index, 1)
    }
  }
}

class List {
  constructor(arr) {
    if (Array.isArray(arr)) {
      const _this = this
      this.key = 0
      this.indexOfKeyBuf = {}
      this.values = arr.map(val => val)
      arr = arr.map((val, i) => {
        const key = this.key++
        this.indexOfKeyBuf[i] = key
        return [val, key]
      })
      this.callbacks = []
      this.onModifiedCbs = []
      this.onModifiedCbs.push(() => {
        this.values = this.list.map(item => item[0])
      })
      this.casted = []
      this.list = new Proxy(arr, {
        set(target, p, value, receiver) {
          const condition = !Array.isArray(receiver[p]) || receiver[p][0] !== value[0]
          if (condition) {
            const result = Reflect.set(target, p, value, receiver)
            if (result) {
              _this.callbacks.forEach(cb => {
                cb(p, value[0], receiver[p] ? receiver[p][0] : undefined)
              })
            }
            _this.indexOfKeyBuf[value[1]] = p
            return result
          }
          return true
        }
      })

    }
  }

  indexOfKey(key) {
    const result = this.indexOfKeyBuf[parseInt(key)]
    if (result !== undefined) {
      return result
    } else {
      return -1
    }
  }

  valueOfKey(key) {
    const i = this.indexOfKey(key)
    if (i >= 0) {
      return this.list[i][0]
    }
  }

  getIndexes() {
    return this.list.map((item, i) => i)
  }

  getValues() {
    return this.list.map(item => item[0])
  }

  getKeys() {
    return this.list.map(item => item[1])
  }

  set(index, value) {
    const val = [value, this.key++]
    updateCasted.call(this, `set`, index, val)
    this.list[index] = val

    this.onModifiedCbs.forEach(cb => cb())
  }

  splice(start, deleteCount, ...items) {
    items = items.map(item => [item, this.key++])
    updateCasted.call(this, `splice`, start, deleteCount, ...items)
    this.list.splice(start, deleteCount, ...items)

    this.onModifiedCbs.forEach(cb => cb())
  }

  push(...items) {
    items = items.map(item => [item, this.key++])
    updateCasted.call(this, `push`, ...items)
    this.list.push(...items)

    this.onModifiedCbs.forEach(cb => cb())
  }

  kGet(key) {
    const index = this.list.map(item => item[1]).indexOf(parseInt(key))
    if (index >= 0) {
      return this.list[index]
    }
  }

  kSet(key, value) {
    const index = this.list.map(item => item[1]).indexOf(parseInt(key))
    if (index >= 0) {
      this.set(index, value)
    }
  }

  kSplice(key, deleteCount, ...items) {
    const index = this.list.map(item => item[1]).indexOf(parseInt(key))
    if (index >= 0) {
      this.splice(index, deleteCount, ...items)
    }
  }

  onChange(cb) {
    this.callbacks.push(cb)
  }

  removeOnChange(cb) {
    for (let i = 0; i < this.callbacks.length; i++) {
      const el = this.callbacks[i]
      if (el === cb) {
        this.callbacks.splice(i, 1)
        break
      }
    }
  }

  onModified(cb) {
    this.onModifiedCbs.push(cb)
  }

  removeOnModified(cb) {
    for (let i = 0; i < this.onModifiedCbs.length; i++) {
      const el = this.onModifiedCbs[i]
      if (el === cb) {
        this.onModifiedCbs.splice(i, 1)
        break
      }
    }
  }

  changeSource(newArr) {
    const _this = this
    let isDifferent = false
    // let isDifferent = true
    if (newArr.length === 0) {
      isDifferent = true
    } else {
      for (let i = 0; i < newArr.length; i++) {
        const el = newArr[i]
        if (!Array.isArray(this.list[i]) || el !== this.list[i][0]) {
          isDifferent = true
          break
        }
      }
    }
    if (isDifferent) {
      this.key = 0
      this.indexOfKeyBuf = {}
      this.values = newArr.map(val => val)
      newArr = newArr.map((val, i) => {
        const key = this.key++
        this.indexOfKeyBuf[i] = key
        return [val, key]
      })
      this.list = new Proxy(newArr, {
        set(target, p, value, receiver) {
          const condition = !Array.isArray(receiver[p]) || receiver[p][0] !== value[0]
          if (condition) {
            const result = Reflect.set(target, p, value, receiver)
            if (result) {
              _this.callbacks.forEach(cb => {
                cb(p, value[0], receiver[p] ? receiver[p][0] : undefined)
              })
            }
            _this.indexOfKeyBuf[value[1]] = p
            return result
          }
          return true
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
          const el = member[2].querySelector(member[0])
          const cb = member[1]
          el.innerHTML = ``
          this.list.forEach((item, i) => {
            el.innerHTML += cb(item[1], i, item[0])
          })
        }
      }
    }

    this.onModifiedCbs.forEach(cb => cb())
  }

  cast(elSelector, renderString, scope = document) {
    this.casted.push([elSelector, renderString, scope])
    const el = scope.querySelector(elSelector)
    el.innerHTML = ``
    this.list.forEach((item, i) => {
      el.innerHTML += renderString(item[1], i, item[0])
    })
  }

  removeCasted(elSelector, scope) {
    for (let i = 0; i < this.casted.length; i++) {
      const el = this.casted[i]
      if (el[0] === elSelector && el[2] === scope) {
        this.casted.splice(i, 1)
      }
    }
  }

}

function updateCasted(...args) {
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

module.exports = { Store, List }