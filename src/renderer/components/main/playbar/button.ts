import loadSvg from 'r/utils/loadSvg'
import { El } from 'r/fundamental/creatEl'
import { EvtHandler, Watcher } from '~/renderer/fundamental/AquaEl'
import { noop } from 'lodash'

export default ({
  icons,
  onclick = noop,
  watchStates = {},
  watchProps = {},
  width = '',
}: {
  icons: Array<string>
  onclick?: EvtHandler
  watchStates?: Watcher
  watchProps?: Watcher
  width?: string
}): El => ({
  template: __filename,
  states: [...Object.keys(watchStates)],
  props: {
    iconIndex: 0,
    isActive: false,
    isPressedDown: false,
  },
  vars: {
    canPress: false,
    svgBuffer: {},
    icons,
    width,
  },
  watchStates,
  watchProps: {
    ...watchProps,
    iconIndex: ({ root, vars }, index: number) => {
      const icons = vars.icons as Array<string>
      const svgBuffer = vars.svgBuffer as Record<string, string>
      let icon
      if (index > -1 && index < icons.length) {
        icon = icons[index]
      } else {
        icon = icons[0]
      }
      if (svgBuffer[icon]) {
        root.innerHTML = svgBuffer[icon]
      } else {
        const svg = loadSvg(icon)
        if (svg) {
          svgBuffer[icon] = svg
          root.innerHTML = svgBuffer[icon]
        }
      }
    },
    // isActive: ({root}, isActive) => {

    // }
  },
  evtHandlers: {
    mouseover: ({ vars }) => {
      vars.canPress = true
    },
    mouseout: ({ vars, props }) => {
      vars.canPress = false
      props.isPressedDown = false
    },
    mousedown: ({ props }) => {
      // 不使用toggle
      // 原因是防止用户mousedown后没有mouseup就将鼠标移出窗口
      if (props.canPress === true) {
        props.isPressedDown = true
      }
    },
    mouseup: ({ props }) => {
      props.isPressedDown = false
    },
    click: onclick,
  },
})
