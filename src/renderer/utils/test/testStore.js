const { List } = require('../states.js.js')
const list = new List([1, 2, 3, 4])
// list.addCb((p, newVal, oldVal) => {
//   console.log(`change`, p, newVal, oldVal)
// })

list.splice(1, 1)
console.table(list.list)
// list.push(5)
// console.log(list.list, list.indexOfKeyBuf)
// list.set(0, 1)
// console.log(list.list, list.indexOfKeyBuf)
// list.changeSource([1, 2, 3, 4])
// console.log(list.list, list.indexOfKeyBuf)
