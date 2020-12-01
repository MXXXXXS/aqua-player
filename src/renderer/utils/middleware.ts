import { noop } from 'lodash'

export default (initial: unknown, acts: Array<Middleware>): void => {
  const totalLen = acts.length
  if (totalLen === 0) return
  function exec(data: unknown, acts: Array<Middleware>): Middleware {
    if (acts.length > 0) {
      const act = acts.shift() as Middleware
      act(data, (data) => exec(data, [...acts]))
      return act
    }
    return noop
  }

  exec(initial, [...acts])
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Middleware = (arg: any, next?: Middleware) => void
