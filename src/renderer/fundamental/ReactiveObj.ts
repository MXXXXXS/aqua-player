import { entries, isArray } from 'lodash'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ChangeHandler = (newVal: any, oldVal?: any) => void

export interface WatchingConfig {
  [watchedStateName: string]: ChangeHandler
}

export interface StateUnwatchingConfig {
  [unwatchedStateName: string]: ChangeHandler | false
}

interface Computation {
  [name: string]: (newVal: unknown, oldVal: unknown) => unknown
}

export default class ReactiveObj {
  private watchers: Record<string, ChangeHandler[]>
  private oldValBuffer: Record<string, unknown>
  private computation: Computation
  private computedVal: Record<string, unknown>
  proxied: Record<string, unknown>
  constructor(states: Record<string, unknown> = {}) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this
    this.watchers = {}
    this.oldValBuffer = {}
    this.computedVal = {}
    this.computation = {}
    this.proxied = new Proxy(states, {
      set(target, p: string, newVal, receiver: Record<string, unknown>) {
        const oldVal = Reflect.get(target, p) as unknown
        if (oldVal !== newVal) {
          const setResult = Reflect.set(target, p, newVal, receiver)
          const watchers = _this.watchers[p]
          if (isArray(watchers)) {
            watchers.forEach((cb) => {
              cb(newVal, oldVal)
            })
          }
          return setResult
        }
        return true
      },
      get(target, p: string) {
        const computation = _this.computation[p]
        if (!computation) {
          return Reflect.get(target, p) as unknown
        }
        const newVal = target[p]
        const oldVal = _this.oldValBuffer[p]
        const oldValBuffer = _this.oldValBuffer
        const computedVal = _this.computedVal
        if (newVal !== oldVal) {
          const computedResult = computation(newVal, oldVal)
          oldValBuffer[p] = newVal
          computedVal[p] = computedResult
          return computedResult
        }
        return computedVal[p]
      },
    })
  }

  watch(watchingConfig: WatchingConfig): void {
    entries(watchingConfig).forEach(([stateName, handler]) => {
      if (!this.watchers[stateName]) {
        this.watchers[stateName] = []
      }
      this.watchers[stateName].push(handler)
      // 绑定时触发一次
      if (this.proxied[stateName] !== undefined) {
        handler(this.proxied[stateName])
      }
    })
  }

  unwatch(watchingConfig: StateUnwatchingConfig): void {
    entries(watchingConfig).forEach(([stateName, handler]) => {
      if (!handler) {
        delete this.watchers[stateName]
      } else {
        const index = this.watchers[stateName].indexOf(handler)
        if (index >= 0) {
          this.watchers[stateName].splice(index, 1)
        }
      }
    })
  }

  cleanWatchers(): void {
    Object.entries(this.watchers).forEach(([stateName]) => {
      delete this.watchers[stateName]
    })
  }

  compute(config: Computation): void {
    Object.assign(this.computation, config)
  }
}
