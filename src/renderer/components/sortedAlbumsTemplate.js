//有待修改

const ebus = require('../utils/eBus.js')
const { sortedAlbumsTemplate } = require('../assets/components.js')
const { storeStates, shared, playList } = require('../states.js')
const second2time = require('../utils/second2time.js')
const globalStates = storeStates.states
const Aqua = require('../utils/aqua.js')
const AQUAGroup = require('./group.js')

class AQUASortedAlbumsTemplate extends Aqua {
  constructor(
    options = {
      inStates: {
        sortedData: { en: '', zh: '' },
        filter: '',
        themeColor: '',
      },
      inList: [],
    }
  ) {
    super({
      template: sortedAlbumsTemplate,
      inStates: options.inStates,
      inList: options.inList,
      outStates: {
        length: '',
      },
    })

    const listEl = (key, song) => {
      if (
        this.inStore.states.filter === song.genre ||
        this.inStore.states.filter === ''
      ) {
        const singleSongList = document.createElement('aqua-single-song')
        singleSongList.classList.add('item')
        singleSongList.states = {
          path: song.path,
          name: song.title,
          artist: song.artist,
          album: song.album,
          date: song.year,
          genre: song.genre,
          duration: second2time(Math.round(song.duration)),
        }
        return singleSongList
      }
    }

    const groupTemplate = (initial, items) => {
      const elsBuf = []
      items.forEach((key) => {
        if (this.inList.list.length > 0) {
          const el = listEl(key, this.inList.kGet(key)[0])
          if (el instanceof HTMLElement) elsBuf.push(el)
        }
      })
      return new AQUAGroup({
        inStates: {
          groupName: initial,
          groupNameColor: '',
          direction: 'row',
        },
        inList: elsBuf,
      })
    }

    const renderGroups = (sorted) => {
      if (Array.isArray(sorted)) {
        sorted.forEach((group) => {
          const groupEL = groupTemplate(group[1], group[0])
          if (groupEL.outStore.states.length !== 0) main.appendChild(groupEL)
        })
      }
    }

    const main = this.root.querySelector('#main')

    renderGroups(this.inStore.states.sortedData.en)
    renderGroups(this.inStore.states.sortedData.zh)
    this.inStore.watch('sortedData', (sortedData) => {
      while (main.firstChild) {
        main.firstChild.remove()
      }
      renderGroups(sortedData.en)
      renderGroups(sortedData.zh)
    })

    this.addEventListener('play', (e) => {
      const groupEls = Array.from(this.root.querySelectorAll('aqua-group'))
      const currentListPaths = groupEls
        .map((groupEL) => groupEL.outStore.states.paths)
        .flat()
      const currentList = currentListPaths.map((p) => shared.pathItemBuf[p])
      playList.changeSource(currentList)
      globalStates.playListPointer = currentListPaths.indexOf(e.detail)
      ebus.emit('play this', globalStates.playListPointer)
    })

    this.addEventListener('add', (e) => {
      const pathOfSong = e.detail.path
      shared.songsToAdd.push(pathOfSong)
      globalStates.menuX = e.detail.coordinate[0] + 20 + 'px'
      globalStates.menuY = e.detail.coordinate[1] - 10 + 'px'
      globalStates.showAdd = true
    })

    //暴露列表长度
    this.outStore.states.length = this.inList.list.length
    this.inList.onModified(() => {
      this.outStore.states.length = this.inList.list.length
    })

    //主题色同步
    const groupEls = Array.from(this.root.querySelectorAll('aqua-group'))
    groupEls.forEach(
      (groupEl) =>
        (groupEl.states.groupNameColor = this.inStore.states.themeColor)
    )
    this.inStore.watch('themeColor', (themeColor) => {
      const groupEls = Array.from(this.root.querySelectorAll('aqua-group'))
      groupEls.forEach(
        (groupEl) => (groupEl.states.groupNameColor = themeColor)
      )
    })
  }
}

customElements.define('aqua-sorted-albums-template', AQUASortedAlbumsTemplate)

module.exports = AQUASortedAlbumsTemplate
