/* eslint-disable */
// @ts-nocheck

import { forIn, isObject, isEmpty } from 'lodash'

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
    add: Array<string>
    del: Array<string>
  } = {
    add: [],
    del: [],
  }
  forIn(diffDic, (mark, key) => {
    if (mark === 'a') {
      diff.del.push(key)
    } else if (mark === 'b') {
      diff.add.push(key)
    }
  })
  return diff
}
