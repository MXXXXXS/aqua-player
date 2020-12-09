import loadSvg from 'r/utils/loadSvg'
import { El } from 'r/fundamental/creatEl'
import { noop } from 'lodash'

export default ({
  icons,
  width = '48px',
  height = '48px',
  onClick = noop,
}: {
  icons: Array<string>
  width?: string
  height?: string
  onClick?: () => void
}): El => ({
  template: __filename,
  props: {
    displayedIconIndex: 0,
  },
  vars: {
    icons,
    width,
    height,
  },
  watchProps: {
    displayedIconIndex: ({ root, vars }, index: number) => {
      const icons = vars.icons as Array<string>
      if (index > -1 && index < icons.length) {
        const icon = icons[index]
        const svg = loadSvg(icon)
        if (svg) {
          root.firstElementChild?.remove()
          root.appendChild(svg)
        }
      }
    },
    // isActive: ({root}, isActive) => {

    // }
  },
  evtHandlers: {
    click: ({ props, vars }) => {
      // 每次点击切换图标
      // 使用click事件而不是放在mouseup里, 理由参考上面"不使用toggle"
      const iconIndex: number = props.displayedIconIndex as number
      const icons = vars.icons as Array<string>
      if (iconIndex < icons.length - 1) {
        ;(props.displayedIconIndex as number) += 1
      } else if (iconIndex === icons.length - 1) {
        ;(props.displayedIconIndex as number) = 0
      }
      onClick()
    },
  },
})
