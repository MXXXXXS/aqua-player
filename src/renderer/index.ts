// 方便调试, 暴露一下states
import * as states from 'r/states'
import { router } from 'r/states'

window.states = states
window.router = router

import root from './components/root'
import createEl from './fundamental/creatEl'
import 'r/ipc'

const rootEl = createEl(root)
const mountEl = document.querySelector('#root')
if (rootEl && mountEl) {
  mountEl.appendChild(rootEl)
}
