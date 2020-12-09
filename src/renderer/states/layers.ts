import { router } from './router'
import Aqua from 'r/fundamental/aqua'

export const layers = new Aqua<string>({
  data: '',
  acts: {
    showFolderAdder: () => {
      router.tap('add', ['l-root', 'main,folderAdder'])
    },
    closeFolderAdder: () => {
      router.tap('add', ['l-root', 'main'])
    },
  },
})
