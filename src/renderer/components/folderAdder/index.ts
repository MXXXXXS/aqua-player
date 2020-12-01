import list from 'c/list'
import { El } from 'r/fundamental/creatEl'
import { ipc, layers } from '~/renderer/states'
import folderItem from 'c/folderAdder/folderItem'

const folderItems = list<string>({
  stateName: 'folders',
  keyGen: (folder) => folder,
  elGen: ({ item }) => folderItem(item),
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
