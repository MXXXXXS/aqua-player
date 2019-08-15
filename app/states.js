const { Store, List } = require(`./utils/store.js`)

const shared = {
  timer: ``,
  audioState: 0,
  sortBuf: {},
  keyItemBuf: {},
  playList: [],
  drawCover: function (coverBuffer, picture, icons, elSelector, scope) {
    URL.revokeObjectURL(coverBuffer.imgUrl)
    const el = scope.querySelector(elSelector)
    el.innerHTML = ``
    if (picture) {
      coverBuffer.imgBlob = new Blob([picture.data], { type: picture.format })
      coverBuffer.imgUrl = window.URL.createObjectURL(coverBuffer.imgBlob)
      const img = document.createElement(`img`)
      img.src = coverBuffer.imgUrl
      img.onload = () => {
        el.appendChild(img)
      }
    } else {
      el.innerHTML = icons[`cover`]
      el.style.display = `flex`
      el.querySelector(`svg`).style.margin = `auto`
    }
  }
}

const storeStates = new Store({
  themeColor: `rgb(113, 204, 192)`,
  duration: ``,
  offset: 0,
  gainVal: 0.5,
  sortReady: false,
  sortFn: ``,
  currentDBVer: ``,
  sListLoaded: false,
  playing: false,
  currentSongFinished: true,
  fillFlag: ``,
  formatedDuration: ``,
  timePassedText: ``,
  coverSrc: ``,
  keyOfSrcBuf: 0,
  name: ``,
  artist: ``,
  total: 0,
  playMode: `unset`, //unset, singleCycle, listCycle, random
  RSongsItems: `AQUASongs`, //AQUASongs, AQUASingers, AQUAAlbums
  RMenuItems: `aqua-my-music`, //aqua-my-music, aqua-settings
  RMainCurrentPlaying: `#main`,
  filterSortBy: ``,
  filterType: ``
})

const listSList = new List([])

const listSPath = new List([])

const sortType = new List([])

const playList = new List([])

module.exports = { storeStates, listSList, listSPath, shared, sortType, playList }