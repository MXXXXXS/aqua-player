import { basename } from 'path'
import { El } from 'r/fundamental/creatEl'
import { folders } from '~/renderer/states'

export default (folder: string): El => ({
  template: __filename,
  vars: {
    basename: basename(folder),
    path: folder,
  },
  evtHandlers: {
    delete: () => {
      folders.tap('del', folder)
    },
  },
})
