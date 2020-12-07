import { El } from 'r/fundamental/creatEl'
import { EvtHandler } from '../fundamental/AquaEl'

export default <T = string>({
  staticText = '',
  textSrc = '',
  textGetter = (state) => (state as unknown) as string,
  onClick,
}: {
  staticText?: string
  textSrc?: string
  textGetter?: (state: T) => string
  onClick: EvtHandler
}): El => {
  return {
    template: __filename,
    states: ['color', textSrc],
    watchStates: {
      [textSrc]: ({ props }, newState: T) => {
        props.text = textGetter(newState)
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
