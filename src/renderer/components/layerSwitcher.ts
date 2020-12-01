import { RouterData } from 'r/states/router'

import { router } from 'r/states'
import createEl, { El } from '../fundamental/creatEl'
import { getOps, Modification, Operation } from 'ru/minDistance'

import { compact, find } from 'lodash'

export interface LayerMap {
  layer: string
  el: El
}

export interface LayerSwitcherConfig extends Record<string, unknown> {
  layers: Layers
  route: Route
}

export type Layers = Array<LayerMap>

type Route = [routeName: string, layersName: string]

function modifySlots(
  root: HTMLElement,
  oldSlotNameList: string[],
  opts: Modification[]
) {
  opts.forEach((op) => {
    const slotsList = root.querySelectorAll<HTMLSlotElement>('slot')
    const oldSlotEl = slotsList[op.position]
    if (oldSlotEl) {
      switch (op.operation) {
        case Operation.sub: {
          const newEl = document.createElement('slot')
          newEl.name = op.content
          root.insertBefore(newEl, oldSlotEl)
          root.removeChild(oldSlotEl)
          break
        }
        case Operation.add: {
          const newEl = document.createElement('slot')
          newEl.name = op.content
          root.insertBefore(newEl, oldSlotEl.nextElementSibling)
          break
        }
        case Operation.del: {
          root.removeChild(oldSlotEl)
          break
        }
      }
    } else if (op.position === -1) {
      const newSlotEl = document.createElement('slot')
      newSlotEl.name = op.content
      root.insertAdjacentElement('afterbegin', newSlotEl)
    }
  })
}

function modifyEls(
  host: HTMLElement,
  root: HTMLElement,
  layers: Layers,
  oldSlotNameList: string[],
  opts: Modification[]
): void {
  opts.forEach((op) => {
    const oldSlotEl = root.querySelector<HTMLSlotElement>(
      `slot[name=${oldSlotNameList[op.position]}]`
    )
    if (oldSlotEl) {
      switch (op.operation) {
        case Operation.sub: {
          const newLayerMap = find(layers, ({ layer }) => layer === op.content)
          if (newLayerMap) {
            // 变更host内元素
            const newEl = createEl(newLayerMap.el)
            newEl.slot = op.content
            newEl.style.gridArea = '1/1'
            host.appendChild(newEl)
            const oldEl = host.querySelector(`[slot=${oldSlotEl.name}]`)
            if (oldEl) {
              host.removeChild(oldEl)
            }
            // 变更slot排序
            const newSlotEl = document.createElement('slot')
            newSlotEl.name = op.content
            root.insertBefore(newSlotEl, oldSlotEl)
            root.removeChild(oldSlotEl)
          }
          break
        }
        case Operation.add: {
          const newLayerMap = find(layers, ({ layer }) => layer === op.content)
          if (newLayerMap) {
            const newEl = createEl(newLayerMap.el)
            newEl.slot = op.content
            newEl.style.gridArea = '1/1'
            host.appendChild(newEl)
            const newSlotEl = document.createElement('slot')
            newSlotEl.name = op.content
            root.insertBefore(newSlotEl, oldSlotEl.nextElementSibling)
          }
          break
        }
        case Operation.del: {
          const oldEl = host.querySelector(`[slot=${oldSlotEl.name}]`)
          if (oldEl) {
            host.removeChild(oldEl)
          }
          root.removeChild(oldSlotEl)
          break
        }
      }
    } else if (op.position === -1) {
      const newLayerMap = find(layers, ({ layer }) => layer === op.content)
      if (newLayerMap) {
        const newEl = createEl(newLayerMap.el)
        newEl.slot = op.content
        newEl.style.gridArea = '1/1'
        host.appendChild(newEl)
      }
    }
  })
}

export default (config: LayerSwitcherConfig): El => ({
  template: __filename,
  states: ['router'],
  props: config,
  watchProps: {
    layers: ({ host, root }, layers: Layers) => {
      const nodeList = root.querySelectorAll('slot')
      const oldLayerKeys = compact(
        Array.from(nodeList).map((slot) => slot.name)
      )
      const newLayerKeys = layers.map(({ layer }) => layer)

      const operations = getOps(oldLayerKeys, newLayerKeys)
      modifyEls(host, root, layers, oldLayerKeys, operations)
    },
    // 只在初始化时触发一次, 往 router 添加记录
    route: (_, [routeName, layersName]: Route) => {
      router.tap('add', [routeName, layersName])
    },
  },
  watchStates: {
    router: ({ host, root, props }, router: RouterData) => {
      const isInitial = !root.querySelector('slot')

      const [routeName, currentLayers] = props.route as Route
      const { routes } = router
      const newLayers = routes[routeName]
      const isDifferent = currentLayers !== newLayers

      if (newLayers !== undefined) {
        if (isInitial) {
          const slotEl = document.createElement('slot')
          slotEl.name = (props.route as Route)[1]
          root.appendChild(slotEl)
        } else if (isDifferent) {
          ;(props.route as Route)[1] = newLayers

          const currentLayersArray = currentLayers.split(',')
          const newLayersArray = newLayers.split(',')
          const ops = getOps(currentLayersArray, newLayersArray)
          modifySlots(root, newLayersArray, ops)
          // 将设置顶部元素的z-index使得下方元素不可点击
          const previousTopEl = host.querySelector<HTMLElement>('.top')
          if (previousTopEl) {
            previousTopEl.classList.remove('top')
            previousTopEl.style.zIndex = ''
          }
          const newTopEl = host.querySelector<HTMLElement>(
            `[slot="${newLayersArray[newLayersArray.length - 1]}"]`
          )
          if (newTopEl) {
            newTopEl.classList.add('top')
            newTopEl.style.zIndex = '1'
          }
        }
      }
    },
  },
})
