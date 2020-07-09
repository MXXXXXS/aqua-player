const fn = require('../localLangSort')
const {shuffle} = require('lodash')

const testWords0 = ['nobody', 'know', 'china', 'better', 'than', 'me']
const testWords1 = ['没有人', '比我', '更懂', '中国']
const testWords2 = ['私より', '中国を', 'よく', '知っている人は', 'いません']
const testWords3 = ['6', '3', '7', '5', '9']

const mixed = shuffle([].concat(testWords0, testWords1, testWords2, testWords3))

console.log(mixed)

const result = fn(mixed)

Object.entries(result).forEach(([lang, words]) => {
  console.log(lang, words)
})