import { El } from 'r/fundamental/creatEl'

export default ({
  text,
  color = '',
  activated = false,
  onClick,
}: {
  text: string
  color: string
  activated: boolean
  onClick: (e: Event) => void
}): El => {
  return {
    template: __filename,
    vars: {
      color,
      classNames: { activated },
      text,
    },
    evtHandlers: {
      click: (_, e) => onClick(e),
    },
  }
}
