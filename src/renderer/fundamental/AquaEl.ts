/* eslint-disable @typescript-eslint/no-explicit-any */
import { camelCase } from 'change-case'
import { entries, filter, forIn, isArray, noop, uniqBy } from 'lodash'
import * as states from 'r/states'
import ReactiveObj from 'r/fundamental/ReactiveObj'
import StateProps from 'r/fundamental/StateProps'
import { WatchingConfig } from 'r/fundamental/ReactiveObj'
import importTemplate, {
  BoundEls,
} from '~/renderer/fundamental/templateImporter'

interface HandlerContext {
  host: HTMLElement
  root: HTMLElement
  props: Record<string, unknown>
  vars: Record<string, unknown>
}

export type WatcherHandler = (
  context: HandlerContext,
  newVal: any,
  oldVal: any
) => void
export interface Watcher {
  [watchedName: string]: WatcherHandler
}

type Computation = (
  context: HandlerContext,
  newVal: any,
  oldVal: any
) => unknown

export interface Computed {
  [computedName: string]: Computation
}
export type EvtHandler = (context: HandlerContext, evt: Event) => void
export interface EvtHandlers {
  [handlerName: string]: EvtHandler
}

export type DomHandler = (context: HandlerContext) => void

export interface AquaElConfig {
  template?: string
  states?: Array<string>
  props?: Record<string, unknown>
  vars?: Record<string, unknown>
  watchStates?: Watcher
  watchProps?: Watcher
  computedStates?: Computed
  computedProps?: Computed
  evtHandlers?: EvtHandlers
  created?: DomHandler
}

function genWatchConfig(
  context: HandlerContext,
  watcher: Watcher
): WatchingConfig {
  return entries(watcher).reduce((acc, [watchedName, handler]) => {
    acc[watchedName] = (newVal, oldVal) => {
      handler(context, newVal, oldVal)
    }
    return acc
  }, {} as WatchingConfig)
}
type ElUpdater<T> = (name: string, newVal: T, propName: string, el: Node) => T
// class绑定
function bindEls<T>(
  _this: AquaEl,
  config: AquaElConfig,
  boundEls: BoundEls,
  updater: ElUpdater<T>,
  handleUpdated: (
    upDatedValues: (T | string)[],
    propName: string,
    node: Node
  ) => void = noop
) {
  // 处理值变化
  const update = () => {
    const result = boundEls.map(([boundMarks, propName, el]): [
      (T | string)[],
      string,
      Node
    ] => [
      boundMarks.map((part) => {
        if (isArray(part)) {
          const [insertType, name] = part
          switch (insertType) {
            case '': {
              return config.vars?.[name] !== undefined
                ? updater(name, config.vars?.[name] as T, propName, el)
                : ''
            }
            case '$': {
              return _this.props?.proxied?.[name] !== undefined
                ? updater(name, _this.props?.proxied?.[name] as T, propName, el)
                : ''
            }
            case '#': {
              return _this.stateProps?.proxied?.[name] !== undefined
                ? updater(
                    name,
                    _this.stateProps?.proxied?.[name] as T,
                    propName,
                    el
                  )
                : ''
            }
          }
        }
        return part
      }),
      propName,
      el,
    ])
    result.forEach(([updatedValues, propName, el]) => {
      handleUpdated(updatedValues, propName, el)
    })
  }
  // 监视值变化
  boundEls.forEach(([marks]) => {
    uniqBy(
      filter(marks, (mark) => isArray(mark)),
      (mark) => mark[1]
    ).forEach((mark) => {
      const [insertType, name] = mark
      switch (insertType) {
        case '$': {
          _this.props?.watch({
            [name]: () => {
              update()
            },
          })
          break
        }
        case '#': {
          _this.stateProps?.watch({
            [name]: () => {
              update()
            },
          })
          break
        }
      }
    })
  })
  // 添加绑定时执行一次
  update()
}
class AquaEl extends HTMLElement {
  stateProps?: StateProps | undefined
  props?: ReactiveObj | undefined
  constructor(config: AquaElConfig) {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const {
      template,
      renderTexts,
      attrs,
      handlers,
      cssVariables,
      classList,
      styleList,
    } = importTemplate(config.template)
    shadowRoot.appendChild(template.content)
    const rootEl = shadowRoot.querySelector('#root') as HTMLElement

    // props
    this.props = new ReactiveObj(config.props || {})

    const context: HandlerContext = {
      host: shadowRoot.host as HTMLElement,
      root: rootEl,
      props: this.props.proxied,
      vars: config.vars || {},
    }
    // watchStates
    if (config.states) {
      this.stateProps = new StateProps(
        config.states.reduce((states, stateName) => {
          states[stateName] = undefined
          return states
        }, {} as Record<string, unknown>)
      )
      if (this.stateProps) {
        // states
        this.stateProps.bindToStates(states)
      }
      if (config.watchStates) {
        this.stateProps.watch(genWatchConfig(context, config.watchStates))
      }
    }
    // watchProps
    if (config.watchProps) {
      this.props.watch(genWatchConfig(context, config.watchProps))
    }
    // 计算值
    forIn<Computed>(config.computedStates, (computation, name) => {
      this.stateProps?.compute({
        [name]: (newVal, oldVal) => computation(context, newVal, oldVal),
      })
    })
    forIn<Computed>(config.computedProps, (computation, name) => {
      this.props?.compute({
        [name]: (newVal, oldVal) => computation(context, newVal, oldVal),
      })
    })
    // 绑定文本插值
    bindEls(
      this,
      config,
      renderTexts,
      (_, newVal: string) => newVal,
      (texts, _, el) => {
        const oldNodeValue = el.nodeValue
        const newNodeValue = texts.join('')
        if (oldNodeValue !== newNodeValue) {
          el.nodeValue = newNodeValue
        }
      }
    )
    // 绑定class
    bindEls<Record<string, boolean>>(
      this,
      config,
      classList,
      (_, classList) => {
        return classList
      },
      (updatedValues, _, node) => {
        const el = node as HTMLElement
        const styles = updatedValues.filter((v) => typeof v !== 'string')
        const style = Object.assign({}, ...styles) as Record<string, string>
        forIn(style, (value, name) => {
          if (value) {
            el.classList.add(name)
          } else {
            el.classList.remove(name)
          }
        })
      }
    )
    // 绑定style
    bindEls<Record<string, string>>(
      this,
      config,
      styleList,
      (_, styleValue) => {
        return styleValue
      },
      (updatedValues, _, node) => {
        const el = node as HTMLElement
        const styles = updatedValues.filter(
          (v) => typeof v !== 'string'
        ) as Record<string, string>[]
        const style = Object.assign({}, ...styles) as Record<string, string>
        forIn(style, (value, name) => {
          el.style.setProperty(name, value)
        })
      }
    )
    // 绑定其他的attributes
    bindEls(
      this,
      config,
      attrs,
      (_, newVal) => newVal,
      (updatedValues, propName, el) => {
        ;(el as Record<string, any>)[camelCase(propName)] = updatedValues.join(
          ''
        )
      }
    )
    // 绑定事件处理函数
    forIn(handlers, (elsWithHandlerNames, evtName) => {
      elsWithHandlerNames.forEach(([handlerNames, el]) => {
        handlerNames.forEach((handlerName) => {
          const handler = config.evtHandlers?.[handlerName]
          if (handler) {
            el.addEventListener(evtName, function (evt: Event) {
              handler(context, evt)
            })
          }
        })
      })
    })
    // 绑定 css variables
    forIn(cssVariables, (varNamesWithInsertTypes, insertName) => {
      varNamesWithInsertTypes.forEach(([insertType, varName]) => {
        switch (insertType) {
          case '': {
            rootEl.style.setProperty(
              `--${varName}`,
              (config.vars?.[insertName] as string) || ''
            )
            break
          }
          case '$': {
            this.props?.watch({
              [insertName]: (newVal: string) => {
                const computed = this.props?.proxied[insertName] as string
                rootEl.style.setProperty(`--${varName}`, computed || newVal)
              },
            })
            break
          }
          case '#': {
            this.stateProps?.watch({
              [insertName]: (newVal: string) => {
                const computed = this.stateProps?.proxied[insertName] as string
                rootEl.style.setProperty(`--${varName}`, computed || newVal)
              },
            })
            break
          }
        }
      })
    })
    // created
    if (config.created) {
      config.created(context)
    }
  }

  connectedCallback(): void {
    console.log(this.tagName, '已挂载')
  }

  disconnectedCallback(): void {
    console.log(this.tagName, '已卸载')
  }
}

customElements.define('aqua-el', AquaEl)

export default AquaEl
