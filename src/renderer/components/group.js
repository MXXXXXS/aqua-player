const { group: groupEl } = require('../assets/components.js')
const Aqua = require('../utils/aqua.js')

class AQUAGroup extends Aqua {
  constructor(
    options = {
      inStates: {
        groupName: '',
        groupNameColor: '',
        direction: 'column',
      },
      inList: [],
    }
  ) {
    super({
      template: groupEl,
      inStates: options.inStates,
      inList: options.inList,
      outStates: {
        length: options.inList.length,
        paths: [],
      },
    })

    //元素引用
    const main = this.root.querySelector('#main')
    const groupNameEl = this.root.querySelector('.groupName')
    const group = this.root.querySelector('.group')

    this.inList.render(group)

    this.outStore.states.length = this.inList.list.length
    this.outStore.states.paths = this.inList
      .getValues()
      .map((el) => el.exposed.path)
    this.inList.onModified(() => {
      this.outStore.states.length = this.inList.list.length
      this.outStore.states.paths = this.inList
        .getValues()
        .map((el) => el.exposed.path)
    })

    this.inStore.sync('groupName', groupNameEl, 'innerText')

    this.inStore.watch('groupNameColor', (color) => {
      main.style.setProperty('--groupNameColor', color)
    })

    this.inStore.watch('direction', (direction) => {
      switch (direction) {
        case 'row':
          {
            group.style.display = 'flex'
          }
          break
        case 'column':
          {
            group.style.display = 'block'
          }
          break
      }
    })
  }
}

customElements.define('aqua-group', AQUAGroup)

module.exports = AQUAGroup
