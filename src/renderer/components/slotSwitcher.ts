import { RouterData } from 'r/states/router'

import { router } from 'r/states'
import createEl, { El } from '../fundamental/creatEl'

export interface SlotMap {
  slot: string
  el: El
}

export interface SlotSwitcherConfig extends Record<string, unknown> {
  slots: Slots
  route: Route
}

export type Slots = Array<SlotMap>

type Route = [routeName: string, slotName: string]

export default (config: SlotSwitcherConfig): El => ({
  template: __filename,
  states: ['router'],
  props: config,
  watchProps: {
    slots: ({ host }, slots: Slots) => {
      slots.forEach((component) => {
        // el可以不设置, 以不渲染组件
        const el = createEl(component.el)
        if (el) {
          el.slot = component.slot
          host.appendChild(el)
        }
      })
    },
    // 只在初始化时触发一次, 往 router 添加记录
    route: (_, [routeName, slotName]: Route) => {
      router.tap('add', [routeName, slotName])
    },
  },
  watchStates: {
    router: ({ root, props }, router: RouterData) => {
      const isInitial = !root.querySelector('slot')

      const [routeName, currentSlot] = props.route as Route
      const { routes } = router
      const newSlot = routes[routeName]
      const isDifferent = currentSlot !== newSlot

      if (newSlot !== undefined) {
        if (isInitial) {
          const slotEl = document.createElement('slot')
          slotEl.name = (props.route as Route)[1]
          root.appendChild(slotEl)
        } else if (isDifferent) {
          ;(props.route as Route)[1] = newSlot
          // 改变slot的name实现组件切换
          const slotEl = root.querySelector('slot')
          if (slotEl) {
            slotEl.name = newSlot
          }
        }
      }
    },
  },
})
