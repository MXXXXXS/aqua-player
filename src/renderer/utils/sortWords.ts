import { find, isArray, sortBy } from 'lodash'
import * as pinyin from 'pinyin'

function isEnWord(word: string) {
  return /\w/.test(word[0])
}

export type Group<T> = [key: string, ...items: T[]]

interface SortedItems<T> {
  [initial: string]: Group<T>[]
}

export default function <T>(
  items: T[],
  wordGetter: (item: T) => string
): {
  zh: SortedItems<T>
  en: SortedItems<T>
} {
  const enItems: T[] = []
  const zhItems: T[] = []
  items.forEach((item) => {
    const word = wordGetter(item)
    isEnWord(word) ? enItems.push(item) : zhItems.push(item)
  })

  type ItemKeyGetter<T> = (item: T, by: (key: T) => string) => string

  function getItemKeyInitial<T>(...args: Parameters<ItemKeyGetter<T>>) {
    return getItemKeyLatin<T>(...args)[0]
  }

  function getItemKeyLatin<T>(...args: Parameters<ItemKeyGetter<T>>) {
    const [item, by] = args
    const word = by(item)
    let initial
    if (isEnWord(word)) {
      initial = word.toLowerCase()
    } else {
      // 中文词的第一个字的拼音的首字母
      initial = pinyin(word, { style: pinyin.STYLE_NORMAL })[0][0]
    }
    return initial
  }

  function sortItems<T>(items: T[], by: (key: T) => string): SortedItems<T> {
    const sorted: SortedItems<T> = {}
    sortBy(items, (item) => {
      return getItemKeyInitial(item, by)
    }).forEach((item) => {
      const word = by(item)
      const initial = getItemKeyInitial(item, by)
      if (!isArray(sorted[initial])) {
        sorted[initial] = []
      }
      const result = find(sorted[initial], ([key]) => {
        return key === word
      })
      if (result) {
        result.push(item)
      } else {
        sorted[initial].push([word, item])
      }
    })
    return sorted
  }
  const sortedEnItems = sortItems<T>(enItems, (word) => wordGetter(word))
  const sortedZhItems = sortItems<T>(zhItems, (word) => wordGetter(word))

  return { en: sortedEnItems, zh: sortedZhItems }
}
