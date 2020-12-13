import { isArray } from 'lodash'
import AquaEl, { AquaElConfig } from 'r/fundamental/AquaEl'

export interface El extends AquaElConfig {
  children?: Record<string, El | HTMLElement | Array<El | HTMLElement> | null>
}

const createEl = (elConfig: El): AquaEl => {
  const { children, ...config } = elConfig
  const el = new AquaEl(config)
  const { shadowRoot } = el
  if (shadowRoot && children) {
    Object.entries(children).forEach(([selector, el]) => {
      const mountedEl = shadowRoot.querySelector(selector)
      if (mountedEl && el) {
        const els: Array<El | HTMLElement> = []
        if (!isArray(el)) {
          els.push(el)
        } else {
          els.push(...el)
        }
        els.forEach((el) => {
          if (el instanceof Node) {
            mountedEl.appendChild(el)
          } else {
            const elToMount = createEl(el)
            if (elToMount) {
              mountedEl.appendChild(elToMount)
            }
          }
        })
      }
    })
  }
  return el
}

export default createEl
