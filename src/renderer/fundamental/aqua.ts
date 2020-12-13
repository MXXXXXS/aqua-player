import { remove, forIn } from 'lodash'
import runPipeline, { Pipe } from '~/renderer/utils/pipeline'
import isAsync from '../utils/isAsync'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Act<T> = (...args: any[]) => T | Promise<any> | void
interface Acts<T> {
  [actName: string]: Act<T>
}

type Hooked = [hookedObj: Record<string, unknown>, key: string]

interface AquaConfig<T> {
  data: T
  acts?: Acts<T>
  reacts?: Array<Pipe>
}

export default class Aqua<T> {
  data: T
  private acts: Acts<T>
  private reacts: Array<Pipe>
  private hooks: Array<Hooked>
  constructor(config: AquaConfig<T>) {
    this.data = config.data
    this.acts = { set: (newVal: T) => newVal }
    this.reacts = config.reacts || []
    forIn(config.acts || {}, (act, actName) => {
      this.acts[actName] = act.bind(this)
    })
    this.hooks = []
  }

  private setter(newData: T, oldData: T): void {
    this.hooks.forEach(([hookedObj, hookedObjKey]) => {
      hookedObj[hookedObjKey] = newData
    })
    this.data = newData
    runPipeline({ newData: newData, oldData: oldData }, this.reacts)
  }

  tap(actName: string, ...args: unknown[]): void {
    const act = this.acts[actName]
    if (isAsync(act)) {
      console.error('Use "tapAsync" to tap async function.')
      return
    }
    const newData = act(...args)
    const oldData = this.data

    const notUndefined = newData !== undefined
    const notSame = newData !== oldData
    if (notUndefined && notSame) {
      this.setter(newData as T, oldData)
    }
  }

  tapAsync(actName: string, ...args: unknown[]): Promise<any> {
    const act = this.acts[actName]
    const newData = act(...args)

    return newData as Promise<unknown>
  }

  hook(obj: Record<string, unknown>, key: string): void {
    obj[key] = this.data
    this.hooks.push([obj, key])
  }
  unhook(obj: Record<string, unknown>, key: string): void {
    if (key === undefined) {
      remove(this.hooks, function (item) {
        return item[0] === obj
      })
    } else {
      remove(this.hooks, function (item) {
        return item[0] === obj && item[1] === key
      })
    }
  }
  view(): T {
    return this.data
  }
}
