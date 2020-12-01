import { El } from '../fundamental/creatEl'
import mainEl from 'c/main'
import folderAdder from 'c/folderAdder'
import layerSwitcher from 'c/layerSwitcher'

const layers = layerSwitcher({
  layers: [
    {
      layer: 'main',
      el: mainEl,
    },
    {
      layer: 'folderAdder',
      el: folderAdder,
    },
  ],
  route: ['l-root', 'main'],
})

const elConfig: El = {
  children: { '#root': layers },
}

export default elConfig
