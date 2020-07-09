const { myMusicMenu } = require(`../assets/components.js`)
const AQUA = require(`../utils/aqua`)

class AQUAMyMusicMenu extends AQUA {
  constructor(options = {
    inStates: {
      name: ``,
      selectedColor: ``,
      show: false
    },
    inList: []
  }) {
    super({
      template: myMusicMenu,
      inStates: options.inStates,
      inList: options.inList
    })

    const main = this.root.querySelector(`#main`)
    const menu = this.root.querySelector(`.menu`)
    const mask = this.root.querySelector(`.mask`)

    let offset

    this.inStore.watch(`show`, needShow => {
      if (needShow) {
        this.style.display = `block`
      } else {
        this.style.display = `none`
      }
    })
    
    this.inStore.watch(`selectedColor`, color => {
      this.style.setProperty(`--selected`, color)
    })
    
    const el = (key, val) => {
      const item = document.createElement(`div`)
      item.classList.add(`item`)
      item.innerText = val
      return item
    }
    
    this.inList.cast(menu, el)
    
    this.inList.onModified(() => {
      const itemEl = this.root.querySelector(`.item`)
      if (itemEl) {
        itemEl.classList.add(`selected`)
      }
    })

    if (this.inList.list.length !== 0)
      this.root.querySelector(`.item`).classList.add(`selected`)
    
    menu.addEventListener(`click`, e => {
      if (e.target.classList.contains(`item`)) {
        const selectedEl = this.root.querySelector(`.selected`)
        if (selectedEl)
          selectedEl.classList.remove(`selected`)
        this.inStore.states.show = false
        e.target.classList.add(`selected`)
        offset = (parseInt(e.target.dataset.key) * -28) + `px`
        menu.style.top = offset

        this.dispatchEvent(new CustomEvent(`itemSelected`, {
          bubbles: true,
          composed: true,
          detail: {
            name: this.inStore.states.name,
            msg: e.target.innerText
          }
        }))
      }
    })

    mask.addEventListener(`click`, () => {
      this.inStore.states.show = false
    })
  }
}

customElements.define(`aqua-my-music-menu`, AQUAMyMusicMenu)

module.exports = AQUAMyMusicMenu