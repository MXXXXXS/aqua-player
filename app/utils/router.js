class Router {
  constructor(routerName, scope) {
    this.name = routerName
    this.increaseNum = 0
    this.elsDisplay = []
    this.scope = scope || document
  }
  add(...elsToAdd) {
    elsToAdd.forEach(el => {
      el = this.scope.querySelector(el)
      this.elsDisplay.push(el.style.display)
      el.setAttribute(`data-${this.name}`, this.elsDisplay.length - 1)
    })
  }
  show(...displayEls) {
    const displayElsNums = displayEls.map(el => {
      el = this.scope.querySelector(el)
      return parseInt(el.getAttribute(`data-${this.name}`))
    })

    for (let i = 0; i < this.elsDisplay.length; i++) {
      if (this.elsDisplay[i] !== undefined)
        this.scope.querySelector(`[data-${this.name}="${i}"]`).style.display = `none`
    }

    displayElsNums.forEach(elNum => {
      this.scope.querySelector(`[data-${this.name}="${elNum}"]`).style.display = this.elsDisplay[elNum]
    })
  }
  remove(...elsToRm) {
    elsToRm.forEach(el => {
      el = this.scope.querySelector(el)
      const elNum = parseInt(el.getAttribute(`data-${this.name}`))
      el.style.display = this.elsDisplay[elNum]
      this.elsDisplay[elNum] = undefined
    })
  }
}

class RouterEL {
  constructor(routerName, scope, ...customEls) {
    this.routerName = routerName
    this.scope = scope
    if (!this.scope.querySelector(`#router-${this.routerName}`)) {
      this.hasRouter = false
      console.error(`Can't find router element: #router-${this.routerName}`)
    } else {
      this.hasRouter = true
      this.customEls = customEls.map(customEl => customEl.name.toLowerCase())
      this.root = scope.createElement(`div`)
      this.root.setAttribute(`id`, `router-${routerName}`)
      customEls.forEach(customEl => {
        customElements.define(`${this.routerName.toLowerCase()}-${customEl.name.toLowerCase()}`, customEl)
      })
    }
  }

  to(customEl) {
    const elName = customEl.toLowerCase()
    const routerName = this.routerName.toLowerCase()
    if (this.hasRouter && this.customEls.includes(elName))
      this.scope.querySelector(`#router-${this.routerName}`).innerHTML = `<${routerName}-${elName}></${routerName}-${elName}>`
  }
}

module.exports = {RouterEL, Router}