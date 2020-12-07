import { El } from 'r/fundamental/creatEl'

export default (
  text: string,
  activated = false,
  onClick: (e: Event) => void
): El => {
  return {
    template: __filename,
    states: ['color', 'bgColor', 'hoverBgColor'],
    vars: {
      activated,
      text,
    },
    evtHandlers: {
      click: (_, e) => onClick(e),
    },
  }
}
