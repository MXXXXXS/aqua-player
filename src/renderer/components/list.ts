import createEl, { El } from 'r/fundamental/creatEl'
import { modify } from 'ru/minDistance'
import { findIndex, identity } from 'lodash'
import AquaEl from '../fundamental/AquaEl'

interface ListItemK {
  key: string
}
interface ListItemD<ListItemType> {
  data: ListItemType
}
interface ListItemE {
  el: HTMLElement | AquaEl
}

export interface ListKDItem<ListItemType>
  extends ListItemK,
    ListItemD<ListItemType> {}

interface ListItemKDE<ListItemType>
  extends ListItemK,
    ListItemD<ListItemType>,
    ListItemE {}

export type ListKD<ListItemType> = Array<ListKDItem<ListItemType>>
export type ListKDE<ListItemType> = Array<ListItemKDE<ListItemType>>

type ElGen<ListItemType, StateDataType> = (
  item: ElGenItem<ListItemType, StateDataType>
) => El
interface ElGenItem<ListItemType, StateDataType> {
  key: string
  stateData: StateDataType
  item: ListItemType
  index: number
  length: number
}

type ListGetter<ListItemType, StateDataType> = (
  data: StateDataType
) => Array<ListItemType>

type KeyGetter<ListItemType> = (item: ListItemType) => string

export default <ListItemType, StateDataType = Array<ListItemType>>({
  stateName,
  listGetter = identity,
  keyGen,
  elGen,
}: {
  stateName: string
  listGetter?: ListGetter<ListItemType, StateDataType>
  keyGen: KeyGetter<ListItemType>
  elGen: ElGen<ListItemType, StateDataType>
}): El => {
  return {
    template: __filename,
    states: [stateName],
    watchStates: {
      [stateName]: ({ root }, newData: StateDataType) => {
        const oldNodes = Array.from(root.querySelectorAll('[key]'))
        const oldList: ListKD<ListItemType | null> = oldNodes.map((el) => ({
          key: el.getAttribute('key') as string,
          data: null,
        }))

        const newList: ListKD<ListItemType> = listGetter(newData).map(
          (item) => ({
            key: keyGen(item),
            data: item,
          })
        )

        modify<ListKDItem<ListItemType | null>>(
          oldList,
          newList,
          ({ key }) => key,
          {
            sub: (op) => {
              const newElDataIndex = findIndex(
                newList,
                ({ key }) => key === op.content
              )
              const newElData = newList[newElDataIndex]
              if (newElData) {
                const { data } = newElData
                const newEl = createEl(
                  elGen({
                    key: op.content,
                    stateData: newData,
                    item: data,
                    index: newElDataIndex,
                    length: newList.length,
                  })
                )
                newEl.setAttribute('key', op.content)
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
                const newEl = createEl(
                  elGen({
                    key: op.content,
                    stateData: newData,
                    item: data,
                    index: newElDataIndex,
                    length: newList.length,
                  })
                )
                newEl.setAttribute('key', op.content)
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
                const newEl = createEl(
                  elGen({
                    key: op.content,
                    stateData: newData,
                    item: data,
                    index: newElDataIndex,
                    length: newList.length,
                  })
                )
                newEl.setAttribute('key', op.content)
                root.insertAdjacentElement('afterbegin', newEl)
              }
            },
          }
        )
      },
    },
  }
}
