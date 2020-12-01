import { find, isArray, sortBy } from 'lodash'
import * as pinyin from 'pinyin'

function isEnWord(word: string) {
  return /\w/.test(word[0])
}

interface SortedItems<T> {
  [initial: string]: [key: string, items: T[]][]
}

export default function (
  words: string[]
): {
  zh: SortedItems<string>
  en: SortedItems<string>
} {
  const enWords: string[] = []
  const zhWords: string[] = []
  words.forEach((word) => {
    isEnWord(word) ? enWords.push(word) : zhWords.push(word)
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
        const [, items] = result
        items.push(item)
      } else {
        sorted[initial].push([word, [item]])
      }
    })
    return sorted
  }
  const sortedEnWords = sortItems<string>(enWords, (word) => word)
  const sortedZhWords = sortItems<string>(zhWords, (word) => word)

  // groupsZh = groupsZh.map((group) => {
  //   ;/\w/.test(group[0])
  //     ? (group[0] = `拼音` + group[0])
  //     : (group[0] = `# ` + group[0])
  //   return group
  // })

  return { en: sortedEnWords, zh: sortedZhWords }
}
