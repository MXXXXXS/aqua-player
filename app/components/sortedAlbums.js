//有待修改

const { shared, storeStates, listSList } = require(`../states.js`)
const globalStates = storeStates.states
const AQUA = require(`../utils/aqua.js`)
const AQUASortedSongsTemplate = require(`./sortedSongsTemplate.js`)

class AQUASortedSongs extends AQUA {
  constructor(options = {
    inStates: {
      tag: ``  //`A到Z`, `歌手`, `专辑`
    }
  }) {
    super({
      template: ``,
      inStates: options.inStates
    })

    const sortedSongsTemplate = new AQUASortedSongsTemplate()

    this.root.appendChild(sortedSongsTemplate)

    sortedSongsTemplate.inList.changeSource(listSList.getValues())

    this.onModifiedCB = () => {
      sortedSongsTemplate.inList.changeSource(listSList.getValues())
    }

    listSList.onModified(this.onModifiedCB)

    const tagSwitcher = (tag) => {
      switch (tag) {
        case `A到Z`: {
          if (!shared.sortBuf.sortedInitialAlbums)
            shared.sortBuf.sortedInitialAlbums = globalStates.sortFn.sortedInitialAlbums()
          sortedSongsTemplate.inStore.states.sortedData = shared.sortBuf.sortedInitialAlbums
        }
          break
        case `发行年份`: {
          if (!shared.sortBuf.sortedYears)
            shared.sortBuf.sortedYears = globalStates.sortFn.sortedYears()
          sortedSongsTemplate.inStore.states.sortedData = shared.sortBuf.sortedYears
        }
          break
        case `歌手`: {
          if (!shared.sortBuf.sortedAlbumsBySinger)
            shared.sortBuf.sortedAlbumsBySinger = globalStates.sortFn.sortedAlbumsBySinger()
          sortedSongsTemplate.inStore.states.sortedData = shared.sortBuf.sortedAlbumsBySinger
        }
          break
      }
    }

    tagSwitcher(this.inStore.states.tag)
    this.inStore.watch(`tag`, tag => {
      tagSwitcher(tag)
    })
  }

  disconnectedCallback() {
    listSList.removeOnModified(this.onModifiedCB)
  }
}

customElements.define(`aqua-sorted-songs`, AQUASortedSongs)

module.exports = AQUASortedSongs