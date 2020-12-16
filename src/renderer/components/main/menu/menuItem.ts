import { highlightedMenuItemText } from 'r/states'
import svgIcon from 'c/svgIcon'
import { El } from 'r/fundamental/creatEl'

export default (icon: string, text: string): El => {
  const iconEl = svgIcon({ icon, width: '32px' })

  return {
    template: __filename,
    vars: {
      text,
    },
    states: ['highlightedMenuItemText', 'color'],
    props: {
      classNames: { highlight: false },
    },
    watchStates: {
      highlightedMenuItemText: ({ props }, highlightedMenuItemText: string) => {
        props.classNames = { highlight: highlightedMenuItemText === text }
      },
    },
    evtHandlers: {
      click: () => {
        highlightedMenuItemText.tap('set', text)
      },
    },
    children: { '.icon': iconEl },
  }
}
