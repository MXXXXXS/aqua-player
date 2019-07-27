class Store {
  constructor(states) {
    // this.binded = {
    //   state: {
    //     val: '',
    //     subscribers: [
    //       [obj0, [bindedKey0, bindedKey1,]],
    //     ]
    //   },
    // }
    const _this = this
    if (states) {
      this.binded = {}
      for (const key in states) {
        if (states.hasOwnProperty(key)) {
          this.binded[key] = {
            val: states[key],
            subscribers: []
          }
        }
      }
      this.states = new Proxy(states, {
        set(target, p, value, receiver) {
          const subscribers = _this.binded[p].subscribers
          subscribers.forEach(item => {
            const obj = item[0]
            const bindedKeys = item[1]
            bindedKeys.forEach(bindedKey => {
              obj[bindedKey] = value
            })
          })
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

// testDataChange()
// testDataAddAndRemove()
testNoArgs()
function testDataChange() {
  const store = new Store({
    name: `suger`,
    favor: `aqua`,
    alot: `we are different`
  })

  const states = store.states

  const obj0 = {
    bName: `life`
  }

  const obj1 = {
    bFavor: `coffee`
  }

  console.log(states, obj0, obj1)

  store.add(`name`, obj0, `bName`)
  store.add(`favor`, obj1, `bFavor`)

  states.name = `suger+`
  states.favor = `aqua+`

  console.log(states, obj0, obj1)

  const obj2 = {
    sync0: `goodMorning!`,
    sync1: `goodAfternoon!`,
    sync2: `goodNight!`
  }

  store.add(`alot`, obj2, `sync0`, `sync1`, `sync2`)

  states.alot = `we are same`

  console.log(states, obj2)

}

function testDataAddAndRemove() {
  const store = new Store({
    name: `suger`,
    favor: `aqua`,
    alot: `we are different`
  })

  const states = store.states

  const obj0 = {
    bName: `life`
  }

  const obj1 = {
    bFavor: `coffee`,
    balot: `a lot different`
  }

  store.add(`name`, obj0, `bName`)
  store.add(`favor`, obj1, `bFavor`, `balot`)

  console.log(store.binded)

  store.remove(`name`, obj0, `bName`)
  store.remove(`favor`, obj1)

  console.log(store.binded)
}

function testNoArgs() {
  console.log(new Store())
  
}

module.exports = Store