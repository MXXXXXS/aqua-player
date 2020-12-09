import { ipcRenderer } from 'electron'
import Aqua from 'r/fundamental/aqua'

export const ipc = new Aqua<string>({
  data: '',
  acts: {
    openFileExplorer: () => {
      ipcRenderer.send('open file explorer')
    },
  },
})
