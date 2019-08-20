const fs = require(`fs`)
const path = require(`path`)

const musicType = [`flac`, `mp3`, `wav`, `mp4`, `ogg`, `aac`]

let collectFiles = (dir, deep = false) => {
  let filesCollection = []
  recursion(dir, deep)

  function recursion(dir, deep) {
    let files = fs.readdirSync(dir)
    files.forEach(item => {
      let isDir = fs.statSync(path.resolve(dir, item)).isDirectory()
      if (isDir && deep) {
        recursion(path.resolve(dir, item))
      } else if (!isDir) {
        //筛选格式符合的音乐文件
        if (musicType.includes(item.match(/[^.]*$/)[0].toLowerCase()))
          filesCollection.push(path.resolve(dir, item))
      }
    })
  }
  return filesCollection
}

module.exports = collectFiles