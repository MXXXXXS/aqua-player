/* eslint-disable */
// @ts-nocheck

import { forIn, isObject, isEmpty, find, entries, compact } from 'lodash'

export default (baseObj, comparedObj) => {
  function diff(baseObj, comparedObj, diffResult = {}) {
    forIn(baseObj, (value, key) => {
      if (isObject(value) && isObject(comparedObj[key])) {
        if (!diffResult[key]) {
          diffResult[key] = {}
        }
        const result = diff(value, comparedObj[key], diffResult[key])
        if (isEmpty(result)) {
          delete diffResult[key]
        }
      } else if (!(comparedObj && comparedObj[key] === value)) {
        diffResult[key] = {
          old: value,
          new: (comparedObj && comparedObj[key]) || null,
        }
      }
    })
    return diffResult
  }

  const result = diff(baseObj, comparedObj)

  if (isEmpty(result)) {
    return
  }

  return result
}

export const diffArray = <T>(
  arrA: Array<T>,
  arrB: Array<T>,
  getKey: (item: T) => string
) => {
  const diffDic = {}
  const addKey = (item, mark) => {
    const key = getKey(item)
    if (!diffDic[key]) {
      diffDic[key] = ''
    }
    diffDic[key] += mark
  }
  arrA.forEach((item) => addKey(item, 'a'))
  arrB.forEach((item) => addKey(item, 'b'))

  const diff: {
    add: Array<T>
    del: Array<T>
    keep: Array<[T, T]>
  } = {
    add: [],
    del: [],
    keep: []
  }

  function getItemByKey(arr: T[], key: string) {
    return find(arr, item => getKey(item) === key)
  }

  forIn(diffDic, (mark, key) => {
    const itemA = getItemByKey(arrA, key)
    const itemB = getItemByKey(arrB, key)
    if (mark === 'a') {
      diff.del.push(itemA)
    } else if (mark === 'b') {
      diff.add.push(itemB)
    } else {
      diff.add.push([itemA, itemB])
    }
  })

  entries(diff).forEach(([key, value]) => {
    diff[key] = compact(value)
  })

  return diff
}
