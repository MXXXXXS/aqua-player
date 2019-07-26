module.exports = bind
function bind(obj0, key0, obj1, key1) {
  return new Proxy(obj0, {
    set(trapTarget, key, value, receiver) {
      if (key === key0 && obj1[key1] !== value) {
        obj1[key1] = value
      }
      return Reflect.set(...arguments)
    },
    get(trapTarget, p, receiver) {
      console.log(`yes`)
      return Reflect.get(...arguments)
    }
  })
}

function sync(src, dest, k) {
  return new Proxy(src, {
    get(trapTarget, key, receiver) {
      receiver[key] = trapTarget[key]
      return Reflect.get(trapTarget, key, receiver)
    }
  })
}

function test() {
  const aqua = {
    name: `aqua`,
    bindedVal: `suger`
  }

  const coffee = {
    name: `coffee`,
    bindedVal: `milk`
  }

  test

  const plus = bind(aqua, `bindedVal`, coffee, `bindedVal`)

  aqua.bindedVal = `suger+`
  // console.log(aqua.bindedVal, coffee.bindedVal, plus.bindedVal)
}
// test()