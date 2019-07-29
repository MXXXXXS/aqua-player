const pinyin = require(`pinyin`)

module.exports = (arr) => {
  let en = []
  let zh = []
  arr.forEach(letter => {
    /\w/.test(letter[0]) ?
      en.push(letter) :
      zh.push(letter)
  })
  en = en.sort(pinyin.compare)
    .map(letter => [letter.toLowerCase()[0], letter.toLowerCase()])
  zh = zh.sort(pinyin.compare)
    .map(letter => [pinyin(letter, { style: pinyin.STYLE_NORMAL })[0][0][0], letter])
  const groupsEn = []
  let groupsZh = []
  function collect(lang, langGroup) {
    return lang.reduce((acc, cur) => {
      if (acc[0] === cur[0]) {
        langGroup[langGroup.length - 1].push(cur[1])
      } else {
        langGroup.push([cur[0]])
        langGroup[langGroup.length - 1].push(cur[1])
      }
      return cur
    }, [``, ``])
  }
  collect(en, groupsEn)
  collect(zh, groupsZh)
  groupsZh = groupsZh.map(group => {
    /\w/.test(group[0]) ?
      group[0] = `拼音` + group[0] :
      group[0] = `假名` + group[0]
    return group
  })
  return {en: groupsEn, zh: groupsZh}
}
