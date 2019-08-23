const {List} = require(`../store.js`)
const list = new List([1, 2, 3, 4])
// list.addCb((p, newVal, oldVal) => {
//   console.log(`change`, p, newVal, oldVal)
// })

// list.splice(1, 1, 1.5, 2, 2.5)
// console.log(list.list, list.indexOfKeyBuf)
// list.push(5)
// console.log(list.list, list.indexOfKeyBuf)
// list.set(0, 1)
// console.log(list.list, list.indexOfKeyBuf)
// list.changeSource([1, 2, 3, 4])
// console.log(list.list, list.indexOfKeyBuf)