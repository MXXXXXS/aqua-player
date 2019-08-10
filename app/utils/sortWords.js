const pinyin = require(`pinyin`)

module.exports = { sortWords, sortIdWords, sortUniqueIdWords, flatSortUniqueIdWords }

/*
  输入 [ keyWord, keyWord, ]
  输出 {
    en: [ //数字, 英文字母作为一组
      [inital, keyWord, keyWord, ] ┌ ⇨ 按 keyWord 排序
      [inital, keyWord, keyWord, ] ⇩ 按 inital 排序
    ],
    zh: [ //汉字或假名作为一组
      [inital, keyWord, keyWord, ] ┌ ⇨ 按 keyWord 排序
      [inital, keyWord, keyWord, ] ⇩ 按 inital 排序
    ]
  }
*/

function sortWords(arr) {
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
      group[0] = `# ` + group[0]
    return group
  })
  
  return { en: groupsEn, zh: groupsZh }
}

/*
  输入 [
    [id, keyWord],
    [id, keyWord],
  ]
  返回
  {
    [ //数字, 英文字母作为一组
      [inital, [id, keyWords], [id, keyWords],], ┌ ⇨ 按 keyWord 排序
      [inital, [id, keyWords], [id, keyWords],], ⇩ 按 inital 排序
    ],
    [ //汉字或假名作为一组
      [inital, [id, keyWords], [id, keyWords],], ┌ ⇨ 按 keyWord 排序
      [inital, [id, keyWords], [id, keyWords],], ⇩ 按 inital 排序
    ]
  }
*/

function sortIdWords(id_keyWords) {
  const { en, zh } = sortWords(id_keyWords.map(id_keyWord => id_keyWord[1] + `_` + id_keyWord[0]))
  function sortGroups(groups) {
    return groups.map(group => {
      const inital = group[0]
      const items = group.slice(1, group.length).map(keyWord_id => {
        const result = keyWord_id.match(/(.*)_(\d+)$/)
        return [result[2], result[1]]
      })
      return [inital, ...items]
    })
  }
  return { en: sortGroups(en), zh: sortGroups(zh) }
}

/*
  输入 [
    [id, keyWord],
    [id, keyWord],
  ]
  返回
  {
    [ //数字, 英文字母作为一组
      [inital, [[id, id,], keyWords], [[id, id,], keyWords],], ┌ ⇨ 按 keyWord 排序 , keyWord 不重复
      [inital, [[id, id,], keyWords], [[id, id,], keyWords],], ⇩ 按 inital 排序 
    ],
    [ //汉字或假名作为一组
      [inital, [[id, id,], keyWords], [[id, id,], keyWords],], ┌ ⇨ 按 keyWord 排序 , keyWord 不重复
      [inital, [[id, id,], keyWords], [[id, id,], keyWords],], ⇩ 按 inital 排序
    ]
  }
*/
function sortUniqueIdWords(id_keyWords) {
  const { en, zh } = sortIdWords(id_keyWords)
  function distinctGroup(groups) {
    return groups.map(group => {
      const inital = group[0]
      const items = group.slice(1, group.length)
      const buf = []
      buf.push(items.reduce((acc, cur) => {
        if (acc[1] === cur[1]) {
          acc[0].push(cur[0])
          return acc
        } else {
          buf.push(acc)
          return [[cur[0]], cur[1]]
        }
      }, [[], ``]))
      buf.shift()
      return [inital, ...buf]
    })
  }
  return {en: distinctGroup(en), zh: distinctGroup(zh)}
}

/*
  输入 [
    [id, keyWord],
    [id, keyWord],
  ]
  返回
  {
    [ //数字, 英文字母作为一组
      [[id, id,], keyWords], [[id, id,], keyWords], ⇨ 按 keyWord 排序 , keyWord 不重复
    ],
    [ //汉字或假名作为一组
      [[id, id,], keyWords], [[id, id,], keyWords], ⇨ 按 keyWord 排序 , keyWord 不重复
    ]
  }
*/
function flatSortUniqueIdWords(id_keyWords) {
  const { en, zh } = sortUniqueIdWords(id_keyWords)
  return {
    en: en.map(group => group.slice(1, group.length)).flat(),
    zh: zh.map(group => group.slice(1, group.length)).flat()
  }
}