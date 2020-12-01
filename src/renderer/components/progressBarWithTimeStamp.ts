import progressBar from './progressBar'
import { second2time } from 'ru/second2time'
import { El } from 'r/fundamental/creatEl'

const config: El = {
  template: __filename,
  states: ['nowPlayingSongOffset'],
  props: {
    seconds: 0,
    duration: 0,
  },
  watchStates: {
    nowPlayingSongOffset: ({ props }, { seconds, duration }) => {
      props.seconds = seconds
      props.duration = duration
    },
  },
  computedProps: {
    seconds: (_, newVal: number) => {
      return second2time(newVal)
    },
    duration: (_, newVal: number) => {
      return second2time(newVal)
    },
  },
  children: { '.progressBar': progressBar },
}

export default config
