const AQUA = require('./aqua')
const { difference, cloneDeep } = require('lodash')

const router = new AQUA({
  data: {
    routes: {},
    history: [],
    position: -1
  },
  acts: {
    add(name, ...newSlots) {
      const data = router.data
      const oldSlots = data.routes[name]
      const isSame = (difference(newSlots, oldSlots).length === 0) &&
        (difference(oldSlots, newSlots).length === 0)
      if (!isSame) {
        const newRoutes = Object.assign({}, data.routes, {
          [name]: newSlots
        })
        // splice丢弃之后的记录, 以此为新开始位置
        data.history.splice(data.position + 1)
        data.history.push(cloneDeep(newRoutes))
        data.position += 1
        data.routes = data.history[data.position]
        return cloneDeep(data)
      }
    },
    multAdd(routes = []) {
      const data = router.data
      let isSame = true
      // 比较新旧路由是否有不同
      for (let index = 0; index < routes.length && isSame; index++) {
        const route = routes[index]
        const [name, ...newSlots] = route
        const oldSlots = data.routes[name]
        
        isSame = (difference(oldSlots, newSlots).length === 0) &&
          (difference(newSlots, oldSlots).length === 0)
      }

      if (!isSame) {
        const newRoutes = Object.assign(
          {},
          data.routes,
          routes.reduce((acc, [name, ...slot]) => {
            acc[name] = slot
            return acc
          }, {})
        )
        // splice丢弃之后的记录, 以此为新开始位置
        data.history.splice(data.position + 1)
        data.history.push(cloneDeep(newRoutes))
        data.position += 1
        data.routes = data.history[data.position]
        return cloneDeep(data)
      }
    },
    next() {
      const data = cloneDeep(router.data)
      const historyLen = data.history.length
      const position = data.position
      if (position < historyLen - 1 && position >= 0) {
        data.position += 1
        data.routes = data.history[data.position]
      }
      return cloneDeep(data)
    },
    previous() {
      const data = router.data
      const historyLen = data.history.length
      const position = data.position
      if (position <= historyLen - 1 && position > 0) {
        data.position -= 1
        data.routes = data.history[data.position]
      }
      return cloneDeep(data)
    },
    maxLenCheck: [function (data) {
      if (data.history.length > 30) {
        data.history.shift()
      }
    }]
  }
})

module.exports = router