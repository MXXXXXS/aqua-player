import { ipcRenderer } from 'electron'
import * as states from 'r/states'
import { folders, Folder } from 'r/states'

ipcRenderer.on(
  'add these folders',
  (evt, args: Electron.OpenDialogReturnValue) => {
    console.log(evt, args)
    const { filePaths } = args

    if (filePaths.length > 0) {
      const folderPaths: Array<Folder> = filePaths.map((folderPath) => ({
        path: folderPath.replace(/\\/g, '/'),
        scanNeeded: true,
      }))
      folders.tap('push', folderPaths)
    }
  }
)

ipcRenderer.on(
  'activate view',
  (e, name: keyof typeof states, text: string) => {
    states[name].tap('activate', text)
  }
)
