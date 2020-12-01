const { singleAlbum } = require(`../assets/components.js`)
const icons = require(`../assets/icons.js`)
const Aqua = require(`../utils/aqua.js`)

class AQUASingleAlbum extends Aqua {
  constructor(
    options = {
      inStates: {
        picture: {},
        name: ``,
        description: ``,
      },
    }
  ) {
    super({
      template: singleAlbum,
      inStates: options.inStates,
    })

    const root = this.root

    //图标渲染
    root.querySelectorAll(`.icon`).forEach((el) => {
      el.innerHTML = icons[el.classList[1]]
    })

    //元素引用
    const play = root.querySelector(`.play`)
    const add = root.querySelector(`.add`)
    const coverContainer = root.querySelector(`.coverContainer`)
    const name = root.querySelector(`.name`)
    const description = root.querySelector(`.description`)

    this.inStore.sync(`name`, name, `innerText`)
    this.inStore.sync(`description`, description, `innerText`)

    let imgUrl
    let imgBlob
    let img

    const addCover = (picture) => {
      URL.revokeObjectURL(imgUrl)
      while (coverContainer.firstChild) {
        coverContainer.firstChild.remove()
      }
      if (picture) {
        imgBlob = new Blob([picture.data], { type: picture.format })
        imgUrl = window.URL.createObjectURL(imgBlob)
        img = document.createElement(`img`)
        img.src = coverBuffer.imgUrl
        coverContainer.appendChild(img)
      } else {
        coverContainer.innerHTML = icons[`cover`]
      }
    }

    addCover(this.inStore.states.picture)
    this.inStore.watch(`picture`, addCover)

    play.addEventListener(`click`, () => {
      this.dispatchEvent(
        new CustomEvent(`play`, {
          bubbles: true,
          composed: true,
          detail: this.inStore.states.name,
        })
      )
    })

    add.addEventListener(`click`, (e) => {
      this.dispatchEvent(
        new CustomEvent(`add`, {
          bubbles: true,
          composed: true,
          detail: {
            name: this.inStore.states.name,
            coordinate: [e.clientX, e.clientY],
          },
        })
      )
    })
  }
}

customElements.define(`aqua-single-album`, AQUASingleAlbum)

module.exports = AQUASingleAlbum
