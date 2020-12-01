import loadSvg from 'r/utils/loadSvg'
import { DomHandler } from 'r/fundamental/AquaEl'

import { El } from 'r/fundamental/creatEl'
import { noop, isArray } from 'lodash'

interface SvgIconCommonConfigs {
  icon: string
  width?: string
  height?: string
  borderWidth?: string
  hoverBorderWidth?: string
  scale?: number
  isCycle?: boolean
  changeHoverColor?: boolean
  iconQueue?: Array<string>
}

interface SvgIconElConfigs {
  created: DomHandler
  toggleBgColorWhenActivated?: boolean
}

interface SvgIconConfigs extends SvgIconCommonConfigs, SvgIconElConfigs {}
interface SvgIconProps extends SvgIconCommonConfigs {
  canPress: boolean
  isActive: boolean
  iconSvgs: Record<string, string>
  isPressedDown: boolean
}

const commonIcon = ({
  icon,
  width = '48px',
  height = '48px',
  borderWidth = '',
  hoverBorderWidth = '',
  scale = 1,
  isCycle = false,
  changeHoverColor = false,
  iconQueue = [],
  created = noop,
  toggleBgColorWhenActivated: toggleBgColorWhenActivated = false,
}: SvgIconConfigs): El => ({
  template: __filename,
  states: [
    'color',
    'bgColor',
    'borderColor',
    'hoverColor',
    'hoverBgColor',
    'hoverBorderColor',
    'pressScale',
    'pressedDownColor',
    'pressedDownBgColor',
  ],
  props: {
    icon,
    scale,
    isCycle,
    changeHoverColor,
    iconQueue,
    canPress: false,
    isActive: false,
    iconSvgs: {},
    isPressedDown: false,
  },
  vars: {
    width,
    height,
    borderWidth,
    hoverBorderWidth,
  },
  watchProps: {
    isCycle: ({ root }, isCycle: boolean) => {
      root.style.setProperty('border-radius', isCycle ? '100%' : '0')
    },
    scale: ({ root, props }, newVal) => {
      root.style.setProperty(
        '--svgWidth',
        `${newVal * parseInt(props.width)}px`
      )
      root.style.setProperty(
        '--svgHeight',
        `${newVal * parseInt(props.height)}px`
      )
    },
    isActive: ({ root }, isActive) => {
      if (toggleBgColorWhenActivated) {
        if (isActive) {
          root.classList.add('pressedDown')
        } else {
          root.classList.remove('pressedDown')
        }
      }
    },
  },
  evtHandlers: {
    mouseover: (cxt) => {
      const { root } = cxt
      const props = cxt.props as SvgIconProps
      props.canPress = true
      if (props.changeHoverColor) {
        root.style.setProperty('--hoverColor', 'var(--color)')
      }
    },
    mouseout: ({ root, props }) => {
      props.canPress = false
      root.classList.add('pressedDown')
      root.classList.remove('pressedDown')
      props.isPressedDown = false
    },
    mousedown: ({ root, props }) => {
      // 不使用toggle
      // 原因是防止用户mousedown后没有mouseup就将鼠标移出窗口
      if (props.canPress === true) {
        root.classList.remove('pressedDown')
        root.classList.add('pressedDown')
        props.isPressedDown = true
      }
    },
    mouseup: ({ root, props }) => {
      root.classList.add('pressedDown')
      root.classList.remove('pressedDown')
      props.isPressedDown = false
    },
    click: ({ props }) => {
      // 使用click事件而不是放在mouseup里, 理由参考上面"不使用toggle"
      // 切换图标和isPressedDown
      const { iconQueue, icon } = props as SvgIconProps
      const iconQueueLen = iconQueue?.length || 0
      if (isArray(iconQueue) && iconQueueLen > 1) {
        const iconIndex = iconQueue.indexOf(icon)
        if (iconIndex > -1) {
          // 虽然表示下一个位置, 但取余后不需要加一, 因为index从0开始数
          const nextPosition = (iconIndex + 1) % iconQueueLen
          props.icon = iconQueue[nextPosition]
          if (nextPosition === 0) {
            props.isActive = false
          } else {
            props.isActive = true
          }
        }
      } else {
        props.isActive = !props.isActive
      }
    },
  },
  created: (cxt) => {
    const { root } = cxt
    const props = cxt.props as SvgIconProps
    const { iconSvgs, iconQueue = [] } = props
    // 单个图标可以不设置iconQueue, 首次需要从文件读取图标
    if (iconQueue.length <= 1 && !iconSvgs[icon]) {
      const iconSVG = loadSvg(icon)
      if (iconSVG) {
        iconSvgs[icon] = iconSVG
        root.innerHTML += iconSvgs[icon]
      }
    }
    created(cxt)
  },
})

export default commonIcon

export const backBarIcon = (icon: string, created: DomHandler = noop): El => {
  return commonIcon({
    icon,
    width: '25px',
    height: '25px',
    scale: 1,
    created,
  })
}

export const itemIcon = (icon: string, created: DomHandler = noop): El => {
  return commonIcon({
    icon,
    width: '48px',
    height: '48px',
    scale: 0.5,
    created,
  })
}

export const searchBoxIcon = (icon: string, created: DomHandler = noop): El => {
  return commonIcon({
    icon,
    width: '36px',
    height: '36px',
    scale: 0.75,
    changeHoverColor: true,
    created,
  })
}

export const playBarIcon = ({
  icon,
  iconQueue,
  created = noop,
  width,
  borderWidth = '0',
  toggleBgColorWhenActivated: toggleBgColorWhenActived,
}: Pick<
  SvgIconConfigs,
  | 'icon'
  | 'iconQueue'
  | 'created'
  | 'width'
  | 'borderWidth'
  | 'toggleBgColorWhenActived'
>): El => {
  return commonIcon({
    icon,
    iconQueue,
    width,
    height: width,
    borderWidth,
    created,
    toggleBgColorWhenActivated: toggleBgColorWhenActived,
  })
}
