// 方便调试, 暴露一下store
const store = require('./store')

const root = require('./components/root')
const rootEl = root()

document.querySelector('#root').appendChild(rootEl)