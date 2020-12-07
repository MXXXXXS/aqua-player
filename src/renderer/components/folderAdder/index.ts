import list from 'c/list'
import { El } from 'r/fundamental/creatEl'
import { Folder, ipc, layers } from '~/renderer/states'
import folderItem from 'c/folderAdder/folderItem'

const folderItems = list<Folder, Folder[]>({
  stateName: 'folders',
  keyGen: ({ path }) => path,
  elGen: ({ item }) => folderItem(item.path),
})

const config: El = {
  template: __filename,
  evtHandlers: {
    ok: () => {
      layers.tap('closeFolderAdder')
    },
    add: () => {
      ipc.tap('openFileExplorer')
    },
  },
  children: { '.tilesContainer': folderItems },
}

export default config
