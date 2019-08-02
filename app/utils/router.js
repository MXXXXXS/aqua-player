class Router {
  constructor(routerName) {
    this.name = routerName
    this.increaseNum = 0
    this.elsDisplay = []
  }
  add(...elsToAdd) {
    elsToAdd.forEach(el => {
      this.elsDisplay.push(el.style.display)
      el.setAttribute(`data-${this.name}`, this.elsDisplay.length - 1)
    })
  }
  show(...displayEls) {
    const displayElsNums = displayEls.map(el => parseInt(el.getAttribute(`data-${this.name}`)))

    for (let i = 0; i < this.elsDisplay.length; i++) {
      if (this.elsDisplay[i] !== undefined)
        document.querySelector(`[data-${this.name}="${i}"]`).style.display = `none`
    }
    displayElsNums.forEach(elNum => {
      document.querySelector(`[data-${this.name}="${elNum}"]`).style.display = this.elsDisplay[elNum]
    })
  }
  remove(...elsToRm) {
    displayElsNums.forEach(elNum => {
      document.querySelector(`[data-${this.name}="${elNum}"]`).style.display = this.elsDisplay[elNum]
    })
    elsToRm.forEach(elNum => {
      this.elsDisplay[elNum] = undefined
    })
  }
}

module.exports = Router