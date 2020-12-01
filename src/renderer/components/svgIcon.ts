import loadSvg from 'r/utils/loadSvg'
import { El } from 'r/fundamental/creatEl'

export default (icon: string, width = ''): El => ({
  template: __filename,
  vars: {
    width,
  },
  created: ({ root }) => {
    const svg = loadSvg(icon)
    if (svg) {
      root.innerHTML = svg
    }
  },
})
