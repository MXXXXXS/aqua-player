import { El } from 'r/fundamental/creatEl'
import listItem from 'r/subWindows/components/listItem'
import { SortTypePanelData } from '~/renderer/states'

import createEl from 'r/fundamental/creatEl'
import 'r/ipc'
import { ipcRenderer } from 'electron'

ipcRenderer.on(
  'data',
  (e, stateName: string, { list, cursor, color }: SortTypePanelData) => {
    console.log(list, cursor)
    const config: El = {
      template: __filename,
      children: {
        '#root': list.map((text, index) => {
          return listItem({
            text,
            color,
            activated: cursor === index,
            onClick: () => {
              ipcRenderer.send('activate view', stateName, text)
            },
          })
        }),
      },
    }

    const rootEl = createEl(config)
    const mountEl = document.querySelector('#root')
    if (rootEl && mountEl) {
      mountEl.appendChild(rootEl)
    }
  }
)
