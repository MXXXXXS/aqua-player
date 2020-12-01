import { cloneDeep, assign, isEmpty } from 'lodash'

import Aqua from 'r/fundamental/aqua'
import diff from 'ru/diff'

type Route = [routeName: string, slotName: string]

type Routes = Record<Route[0], Route[1]>

export interface RouterData {
  routes: Routes
  history: Array<Routes>
  position: number
}

const router: Aqua<RouterData> = new Aqua<RouterData>({
  data: {
    routes: {},
    history: [],
    position: -1,
  },
  acts: {
    add([name, slot]: Route) {
      const { routes: oldRoutes, position, history } = cloneDeep(router.data)
      const newRoutes = assign({}, oldRoutes, { [name]: slot })
      const diffResult = assign(
        {},
        diff(oldRoutes, newRoutes),
        diff(newRoutes, oldRoutes)
      )
      if (isEmpty(diffResult)) {
        return router.data
      } else {
        // splice丢弃之后的记录, 添加历史记录
        history.splice(position + 1, Infinity, newRoutes)
        // 修改路由信息
        return {
          routes: newRoutes,
          history,
          position: position + 1,
        }
      }
    },
    multAdd(newRoutesToAdd: Array<Route>) {
      newRoutesToAdd.forEach((newRouteToAdd) => {
        router.tap('add', newRouteToAdd)
      })
    },
    next() {
      const { history, position } = cloneDeep(router.data)
      const historyLen = history.length
      if (position < historyLen - 1 && position >= 0) {
        return {
          routes: history[position + 1],
          history: history,
          position: position + 1,
        }
      }
    },
    previous() {
      const { history, position } = cloneDeep(router.data)
      const historyLen = history.length
      if (position <= historyLen - 1 && position > 0) {
        return {
          routes: history[position - 1],
          history: history,
          position: position - 1,
        }
      }
    },
  },
  reacts: [
    function maxLenCheck({ newData }: { newData: RouterData }) {
      if (newData.history.length > 30) {
        newData.history.shift()
      }
    },
  ],
})

export default router
