import loadSvg from 'r/utils/loadSvg'
import { El } from 'r/fundamental/creatEl'

export default ({
  icon,
  useTheme = false,
  color = '',
  width = '',
  filling = '',
}: {
  icon: string
  useTheme?: boolean
  color?: string
  width?: string
  filling?: string
}): El => ({
  template: __filename,
  states: useTheme ? ['color'] : undefined,
  vars: {
    color: useTheme ? undefined : color,
    filling,
    width,
  },
  children: {
    '#root': loadSvg(icon) || null,
  },
})
