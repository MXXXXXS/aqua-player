import { El } from 'r/fundamental/creatEl'
import { EvtHandler } from '../fundamental/AquaEl'

export default ({
  staticText,
  textSrc = '',
  onClick,
}: {
  staticText: string
  textSrc?: string
  onClick: EvtHandler
}): El => {
  return {
    template: __filename,
    states: ['color', textSrc],
    watchStates: {
      [textSrc]: ({ props }, newText: string) => {
        props.text = newText
      },
    },
    props: {
      text: '',
    },
    vars: {
      text: staticText,
    },
    evtHandlers: {
      click: onClick,
    },
  }
}
