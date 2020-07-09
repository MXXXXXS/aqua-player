module.exports = class List {
  constructor(arr = []) {
    if (!Array.isArray(arr)) {
      arr = []
    }
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
    this.rendered = []

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
    updateCasted.call(this, `set`, this.list[index][1], val)
    updateRendered.call(this, `set`, this.list[index][1], val)
    this.list[index] = val

    this.onModifiedCbs.forEach(cb => cb())
  }

  splice(start, deleteCount, ...items) {
    items = items.map(item => [item, this.key++])
    updateCasted.call(this, `splice`, start, deleteCount, ...items)
    updateRendered.call(this, `splice`, start, deleteCount, ...items)
    this.list.splice(start, deleteCount, ...items)

    this.onModifiedCbs.forEach(cb => cb())
  }

  push(...items) {
    items = items.map(item => [item, this.key++])
    updateCasted.call(this, `push`, ...items)
    updateRendered.call(this, `push`, ...items)
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

  onChanged(cb) {
    this.callbacks.push(cb)
  }

  removeOnChanged(cb) {
    for (let i = 0; i < this.callbacks.length; i++) {
      const el = this.callbacks[i]
      if (el === cb) {
        this.callbacks.splice(i, 1)
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
      }
    }
  }

  cast(listRoot, elToAppend) {
    this.casted.push([listRoot, elToAppend])
    listRoot.innerHTML = ``
    this.list.forEach(item => {
      const child = elToAppend(item[1], item[0])
      if (child instanceof HTMLElement) {
        child.dataset.key = item[1]
        listRoot.appendChild(child)
      }
    })
  }

  removeCasted(listRoot) {
    for (let i = 0; i < this.casted.length; i++) {
      const el = this.casted[i]
      if (el[0] === listRoot) {
        this.casted.splice(i, 1)
      }
    }
  }

  render(listRoot) {
    this.rendered.push(listRoot)
    listRoot.innerHTML = ``
    this.list.forEach(item => {
      const val = item[0]
      if (val instanceof HTMLElement) {
        val.dataset.key = item[1]
        listRoot.appendChild(val)
      }
    })
  }

  removeRendered(listRoot) {
    for (let i = 0; i < this.rendered.length; i++) {
      const el = this.rendered[i]
      if (el === listRoot) {
        this.rendered.splice(i, 1)
      }
    }
  }

  clearALl() {
    this.callbacks = []
    this.onModifiedCbs = []
    this.casted = []
    this.rendered = []
  }

  changeSource(newArr) {
    const _this = this
    let isSame = false

    if (newArr.length === this.list.length) {
      for (let i = 0; i < newArr.length; i++) {
        const el = newArr[i]
        if (Array.isArray(this.list[i]) && el === this.list[i][0]) {
          isSame = true
          break
        }
      }
    }

    if (!isSame) {
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

      this.casted.forEach(item => {
        const listRoot = item[0]
        const elToAppend = item[1]
        listRoot.innerHTML = ``
        this.list.forEach(item => {
          const child = elToAppend(item[1], item[0])
          if (child instanceof HTMLElement) {
            child.dataset.key = item[1]
            listRoot.appendChild(child)
          }
        })
      })

      this.rendered.forEach(listRoot => {
        listRoot.innerHTML = ``
        this.list.forEach(item => {
          const val = item[0]
          if (val instanceof HTMLElement) {
            val.dataset.key = item[1]
            listRoot.appendChild(val)
          }
        })
      })

    }

    this.onModifiedCbs.forEach(cb => cb())
  }
}

function updateCasted(...args) {
  const method = args[0]
  switch (method) {
    case `set`: {
      this.casted.forEach(item => {
        const key = args[1]
        const newVal = args[2][0]
        const newKey = args[2][1]

        const child = elToAppend(newKey, newVal)
        if (child instanceof HTMLElement) {
          child.dataset.key = newKey
          const elToChange = listRoot.querySelector(`[data-key="${key}"]`)
          elToChange.insertAdjacentElement(`afterend`, child)
          listRoot.removeChild(elToChange)
        }
      })
    }
      break
    case `push`: {
      this.casted.forEach(item => {
        const listRoot = item[0]
        const elToAppend = item[1]

        const newVals = args.slice(1, args.length)

        newVals.forEach(newVal => {
          const val = newVal[0]
          const key = newVal[1]

          const child = elToAppend(key, val)
          if (child instanceof HTMLElement) {
            child.dataset.key = key
            listRoot.appendChild(child)
          }
        })
      })
    }
      break
    case `splice`: {
      this.casted.forEach(item => {
        const listRoot = item[0]
        const elToAppend = item[1]

        const start = args[1]
        const startKey = this.list[start][1]
        const deleteCount = args[2]
        const newVals = args.slice(3, args.length)

        const firstRemovedEl = listRoot.querySelector(`[data-key="${startKey}"]`)
        const removedElKeys = this.list.slice(start, start + deleteCount).map(item => item[1])

        newVals.forEach(newVal => {
          const val = newVal[0]
          const key = newVal[1]

          const child = elToAppend(key, val)
          if (child instanceof HTMLElement) {
            child.dataset.key = key
            firstRemovedEl.insertAdjacentElement(`beforebegin`, child)
          }
        })

        removedElKeys.forEach(keyOfElToRemove => {
          const el = listRoot.querySelector(`[data-key="${keyOfElToRemove}"]`)
          el.removeChild(el)
        })
      })
    }
      break
  }
}

function updateRendered(...args) {
  const method = args[0]
  switch (method) {
    case `set`: {
      this.rendered.forEach(listRoot => {
        const key = args[1]
        const newVal = args[2][0]
        const newKey = args[2][1]

        if (newVal instanceof HTMLElement) {
          newVal.dataset.key = newKey
          const elToChange = listRoot.querySelector(`[data-key="${key}"]`)
          elToChange.insertAdjacentElement(`afterend`, newVal)
          listRoot.removeChild(elToChange)
        }
      })
    }
      break
    case `push`: {
      this.rendered.forEach(listRoot => {
        const newVals = args.slice(1, args.length)

        newVals.forEach(newVal => {
          const val = newVal[0]
          const key = newVal[1]

          if (val instanceof HTMLElement) {
            val.dataset.key = key
            listRoot.appendChild(val)
          }
        })
      })
    }
      break
    case `splice`: {
      this.rendered.forEach(listRoot => {
        const start = args[1]
        const startKey = this.list[start][1]
        const deleteCount = args[2]
        const newVals = args.slice(3, args.length)

        const firstRemovedEl = listRoot.querySelector(`[data-key="${startKey}"]`)
        const removedElKeys = this.list.slice(start, start + deleteCount).map(item => item[1])

        newVals.forEach(newVal => {
          const val = newVal[0]
          const key = newVal[1]

          if (val instanceof HTMLElement) {
            val.dataset.key = key
            firstRemovedEl.insertAdjacentElement(`beforebegin`, val)
          }
        })

        removedElKeys.forEach(keyOfElToRemove => {
          const el = listRoot.querySelector(`[data-key="${keyOfElToRemove}"]`)
          el.removeChild(el)
        })
      })
    }
      break
  }
}