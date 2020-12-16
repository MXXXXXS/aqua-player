import { modify } from 'ru/minDistance'
import createEl, { El } from './creatEl'

import { findIndex } from 'lodash'

type KeyGen<T> = (item: T) => string
type ElGen<T> = (_: {
  key: string
  data: T
  index: number
  length: number
  array: Array<T>
}) => [El, List<any> | undefined]

export interface ListKDItem<ListItemType> {
  key: string
  data: ListItemType
}

export type ListKD<ListItemType> = Array<ListKDItem<ListItemType>>

interface ListConfig<T> {
  keyGen: KeyGen<T>
  elGen: ElGen<T>
  subListGetter?: (_: T) => Array<unknown>
}

export default class List<T> {
  root: HTMLElement | undefined
  subLists: Record<string, List<unknown> | undefined>
  subListGetter: (_: T) => Array<unknown>
  keyGen: KeyGen<T>
  elGen: ElGen<T>

  constructor(listConfig: ListConfig<T>) {
    const { keyGen, elGen, subListGetter = () => [] } = listConfig

    this.keyGen = keyGen
    this.elGen = elGen
    this.subListGetter = subListGetter
    this.subLists = {}
  }

  mount(el: HTMLElement): void {
    this.root = el
  }

  update(newData: Array<T>): void {
    const { keyGen, elGen, root, subLists, subListGetter } = this
    if (!root) {
      return
    }
    const oldNodes = Array.from(root.querySelectorAll('[key]'))
    const oldList: ListKD<T | null> = oldNodes.map((el) => ({
      key: el.getAttribute('key') as string,
      data: null,
    }))

    const newList: ListKD<T> = newData.map((data) => ({
      key: keyGen(data),
      data,
    }))

    modify<ListKDItem<T | null>>(oldList, newList, ({ key }) => key, {
      sub: (op) => {
        const newElDataIndex = findIndex(
          newList,
          ({ key }) => key === op.content
        )
        const newElData = newList[newElDataIndex]
        if (newElData) {
          const { data } = newElData

          const [newElConfig, newElList] = elGen({
            key: op.content,
            data,
            index: newElDataIndex,
            length: newList.length,
            array: newData,
          })

          const newEl = createEl(newElConfig)
          newEl.setAttribute('key', op.content)
          subLists[op.content] = newElList

          const oldEl = oldNodes[op.position]
          root.insertBefore(newEl, oldEl.nextElementSibling)
          root.removeChild(oldEl)
        }
      },
      add: (op) => {
        const newElDataIndex = findIndex(
          newList,
          ({ key }) => key === op.content
        )
        const newElData = newList[newElDataIndex]
        if (newElData) {
          const { data } = newElData
          const [newElConfig, newElList] = elGen({
            key: op.content,
            data,
            index: newElDataIndex,
            length: newList.length,
            array: newData,
          })

          const newEl = createEl(newElConfig)
          newEl.setAttribute('key', op.content)
          subLists[op.content] = newElList

          const oldEl = oldNodes[op.position]
          root.insertBefore(newEl, oldEl.nextElementSibling)
        }
      },
      del: (op) => {
        const oldEl = oldNodes[op.position]
        root.removeChild(oldEl)
      },
      init: (op) => {
        const newElDataIndex = findIndex(
          newList,
          ({ key }) => key === op.content
        )
        const newElData = newList[newElDataIndex]
        if (newElData) {
          const { data } = newElData
          const [newElConfig, newElList] = elGen({
            key: op.content,
            data,
            index: newElDataIndex,
            length: newList.length,
            array: newData,
          })

          const newEl = createEl(newElConfig)
          subLists[op.content] = newElList

          newEl.setAttribute('key', op.content)
          root.insertAdjacentElement('afterbegin', newEl)
        }
      },
    })

    newData.forEach((item) => {
      const key = keyGen(item)
      const subList = subLists[key]
      if (subList) {
        subList.update(subListGetter(item))
      }
    })
  }
}
