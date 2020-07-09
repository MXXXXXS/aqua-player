const franc = require('franc-min')
const pinyin = require('pinyin')
const {flatMap} = require('lodash')

function localLangSort(words) {
  const result = {
    cmn: [],
    eng: [],
    und: []
  }
  words.forEach(word => {
    const lang = franc(word, {
      only: ['cmn', 'eng'],
      minLength: 1
    })
    if (!Array.isArray(result[lang])) {
      result[lang] = []
    }
    result[lang].push(word)
  })

  Object.entries(result).forEach(([lang, words]) => {
    if (lang === 'cmn') {
      words.sort((a, b) => {
        function inital(word) {
          return flatMap(pinyin(word, { style: pinyin.STYLE_NORMAL })).reduce((acc, cur) => {
            return acc + cur[0]
          }, '')
        }
        const pinyinA = inital(a)
        const pinyinB = inital(b)
        return pinyinA.localeCompare(pinyinB, 'eng')
      })
    } else if (lang === 'eng') {
      words.sort((a, b) => a.localeCompare(b, lang, {
        numeric: true
      }))
    } else {
      words.sort()
    }
  })

  return result
}

function localLangSortedArray (words) {
  const {cmn, eng, und} = localLangSort(words)
  return [...eng, ...cmn, ...und]
}

module.exports = {localLangSort, localLangSortedArray}