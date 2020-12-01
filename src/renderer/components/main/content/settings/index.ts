import { layers } from 'r/states'
import { El } from 'r/fundamental/creatEl'
import textButton from '~/renderer/components/textButton'

const openFolderBtn = textButton({
  staticText: '选择查找音乐的位置',
  onClick: () => {
    layers.tap('showFolderAdder')
  },
})

const config: El = {
  template: __filename,
  children: { '.add': openFolderBtn },
}

export default config
