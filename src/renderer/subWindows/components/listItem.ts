import { El } from 'r/fundamental/creatEl'
import svgIcon from 'c/svgIcon'

export default (iconName = '', text: string, activated = false): El => {
  return {
    template: __filename,
    states: ['color', 'bgColor', 'hoverBgColor'],
    props: {
      activated: activated,
    },
    vars: {
      text,
    },
    children: { '.icon': iconName ? svgIcon(iconName, '32px') : null },
  }
}
