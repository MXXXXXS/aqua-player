import { El } from 'r/fundamental/creatEl'
import list from 'c/list'
import listItem from 'r/subWindows/components/listItem'
import { SortTypes } from '~/renderer/states'

const config: El = {
  template: __filename,
  children: {
    '#root': list<string, SortTypes>({
      stateName: 'sortBy',
      listGetter: (data) => data.list,
      keyGen: (item) => item,
      elGen: ({ stateData, item: text, index }) => {
        const { cursor } = stateData
        return listItem('', text, cursor === index)
      },
    }),
  },
}

// 方便调试, 暴露一下states
import * as states from 'r/states'
import { router } from 'r/states'

window.states = states
window.router = router

import createEl from 'r/fundamental/creatEl'
import 'r/ipc'

const rootEl = createEl(config)
const mountEl = document.querySelector('#root')
if (rootEl && mountEl) {
  mountEl.appendChild(rootEl)
}
