import { nowPlayingSongOffset, NowPlayingSongOffset } from 'r/states'
import { El } from 'r/fundamental/creatEl'

const config: El = {
  template: __filename,
  states: ['color', 'nowPlayingSongOffset'],
  computedStates: {
    nowPlayingSongOffset: (_, newVal: NowPlayingSongOffset) => {
      return newVal.offset
    },
  },
  evtHandlers: {
    input: (_, evt): void => {
      const value = parseInt((evt.target as HTMLInputElement).value)
      nowPlayingSongOffset.tap('input', value)
    },
    change: (_, evt): void => {
      const value = parseInt((evt.target as HTMLInputElement).value)
      nowPlayingSongOffset.tap('change', value)
    },
  },
}

export default config
