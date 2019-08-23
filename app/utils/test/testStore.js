const {List} = require(`../store.js`)
const list = new List([1, 2, 3, 4])
list.addCb((p, newVal, oldVal) => {
  console.log(`change`, p, newVal, oldVal)
})

list.splice(1, 1)
console.table(list.list)
list.push(5)
console.table(list.list)
list.set(0, 1)
console.table(list.list)
list.changeSource([1, 2, 3, 4])
console.table(list.list)