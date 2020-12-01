import AquaEl, { AquaElConfig } from 'r/fundamental/AquaEl'

export interface El extends AquaElConfig {
  children?: Record<string, El | HTMLElement | null>
}

const createEl = (elConfig: El): AquaEl => {
  const { children, ...config } = elConfig
  const el = new AquaEl(config)
  const { shadowRoot } = el
  if (shadowRoot && children) {
    Object.entries(children).forEach(([selector, el]) => {
      const mountedEl = shadowRoot.querySelector(selector)
      if (mountedEl && el) {
        if (el instanceof HTMLElement) {
          mountedEl.appendChild(el)
        } else {
          const elToMount = createEl(el)
          if (elToMount) {
            mountedEl.appendChild(elToMount)
          }
        }
      }
    })
  }
  return el
}

export default createEl
