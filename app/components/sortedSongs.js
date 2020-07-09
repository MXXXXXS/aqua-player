const { shared, listSList, storeStates } = require(`../states.js`)
const AQUA = require(`../utils/aqua.js`)
const AQUASortedSongsTemplate = require(`./sortedSongsTemplate.js`)

class AQUASortedSongs extends AQUA {
  constructor(options = {
    inStates: {
      sortBy: ``,
      sortType: ``
    }
  }) {
    super({
      template: ``,
      inStates: options.inStates
    })

    const sortedSongsTemplate = new AQUASortedSongsTemplate()

    sortedSongsTemplate.inList.changeSource(listSList.getValues())
    this.onModifiedCB = () => {
      sortedSongsTemplate.inList.changeSource(listSList.getValues())
    }
    listSList.onModified(this.onModifiedCB)

    const tagSwitcher = (tag) => {
      switch (tag) {
        case `A到Z`: {
          sortedSongsTemplate.inStore.states.sortedData = shared.sortedData.songsByAZ
        }
          break
        case `歌手`: {
          sortedSongsTemplate.inStore.states.sortedData = shared.sortedData.songsBySingers
        }
          break
        case `专辑`: {
          sortedSongsTemplate.inStore.states.sortedData = shared.sortedData.songsByAlbums
        }
          break
      }
      sortedSongsTemplate.inStore.states.sortBy = this.inStore.states.sortBy
      sortedSongsTemplate.inStore.states.sortType = this.inStore.states.sortType
      sortedSongsTemplate.inStore.states.themeColor = storeStates.states.themeColor
    }

    tagSwitcher(this.inStore.states.tag)
    
    this.root.appendChild(sortedSongsTemplate)
  }

  ondisconnected() {
    listSList.removeOnModified(this.onModifiedCB)
  }
}

customElements.define(`aqua-sorted-songs`, AQUASortedSongs)

module.exports = AQUASortedSongs