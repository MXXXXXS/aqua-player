const { listSList, storeStates } = require(`../states`)
const { list: listTemplate } = require(`../assets/components.js`)
const Aqua = require(`../utils/aqua`)
const AQUAMyMusic = require(`./myMusic`)
const AQUASongs = require(`./songs`)
const AQUASortedSongs = require(`./sortedSongs`)
const AQUASingers = require(`./singers`)
const AQUAAlbums = require(`./albums`)
const AQUASortedAlbumsTemplate = require(`./sortedAlbumsTemplate`)

class AQUAList extends Aqua {
  constructor() {
    super({
      template: listTemplate,
      outStates: {
        currentTag: `歌曲`,
        currentSort: `无,所有流派`,
      },
    })

    const myMusic = new AQUAMyMusic({
      inStates: {
        amount: 0,
        curTagColor: ``,
      },
    })

    const tagsBuffer = [`无,所有流派`, `,A到Z`, `无,所有流派`]

    storeStates.sync(`themeColor`, myMusic.inStore.states, `curTagColor`)

    myMusic.outStore.watch(`curTag`, (tag) => {
      //选项卡切换
      switch (tag) {
        case `歌曲`:
          {
            this.outStore.states.currentSort = tagsBuffer[0]
          }
          break
        case `歌手`:
          {
            this.outStore.states.currentSort = tagsBuffer[1]
          }
          break
        case `专辑`:
          {
            this.outStore.states.currentSort = tagsBuffer[2]
          }
          break
      }
    })

    myMusic.outStore.watch(`sortBy`, (sortBy) => {
      const arr = this.outStore.states.currentSort.split(`,`)
      this.outStore.states.currentSort = sortBy + `,` + arr[1]
    })

    myMusic.outStore.watch(`sortType`, (sortType) => {
      const arr = this.outStore.states.currentSort.split(`,`)
      this.outStore.states.currentSort = arr[0] + `,` + sortType
    })

    const myMusicEl = this.root.querySelector(`.myMusic`)
    const listEl = this.root.querySelector(`.list`)

    myMusicEl.appendChild(myMusic)

    const changePage = (currentTag, sortBy, sortType) => {
      while (listEl.firstChild) {
        listEl.firstChild.remove()
      }
      switch (currentTag) {
        case `歌曲`:
          {
            if (sortBy === `无`) {
              const songs = new AQUASongs({
                inStates: {
                  transparentBG: false,
                  hoverColor: ``,
                  hoverBGColor: ``,
                  hoverIconColor: ``,
                  nameColor: ``,
                  attributesColor: ``,
                  replaceAddWithRemove: false,
                },
                inList: listSList.getValues(),
              })
              listEl.appendChild(songs)
            } else {
              const sortedSongs = new AQUASortedSongs({
                inStates: {
                  sortBy,
                  sortType,
                },
              })
              listEl.appendChild(sortedSongs)
            }
          }
          break
        case `歌手`:
          {
            const singers = new AQUASingers()
            listEl.appendChild(singers)
          }
          break
        case `专辑`:
          {
            if (sortBy === `无`) {
              const songs = new AQUAAlbums()
              listEl.appendChild(songs)
            } else {
              const sortedAlbums = new AQUASortedAlbums({
                inStates: {
                  sortBy,
                  sortType,
                },
              })
              listEl.appendChild(sortedAlbums)
            }
          }
          break
      }
    }

    const refresh = (currentSort) => {
      const currentTag = this.outStore.states.currentTag
      const arr = currentSort.split(`,`)
      const sortBy = arr[0]
      const sortType = arr[1]
      changePage(currentTag, sortBy, sortType)
    }

    this.outStore.watch(`currentSort`, refresh)

    listSList.onModified(() => {
      refresh(this.outStore.states.currentSort)
    })
  }
}

customElements.define(`aqua-list`, AQUAList)

module.exports = AQUAList
