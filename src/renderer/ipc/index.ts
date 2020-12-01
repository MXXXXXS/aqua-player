import { ipcRenderer } from 'electron'
import { folders } from 'r/states'

ipcRenderer.on(
  'add these folders',
  (evt, args: Electron.OpenDialogReturnValue) => {
    console.log(evt, args)
    const { filePaths } = args

    if (filePaths.length > 0) {
      const folderPaths = filePaths.map((folderPath) =>
        folderPath.replace(/\\/g, '/')
      )
      folders.tap('push', folderPaths)
    }
  }
)
