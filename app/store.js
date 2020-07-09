const AQUA = require('./utils/aqua')
const router = require('./utils/router')
const Mock = require('mockjs')
const { ipcRenderer } = require('electron')

const menuItemActived = new AQUA({
  data: '',
  acts: {
    log: [function (data) {
      console.log('现在激活的menuItemActived为: ', data)
    }],
    switchPanel: [function (curTab) {
      switch (curTab) {
        case '我的音乐': {
          router.tap('add', 'r-content', 'myMusic')
          break
        }
        case '设置': {
          router.tap('add', 'r-content', 'settings')
          break
        }
      }
    }],
    click(name) {
      return name
    }
  }
})

const hoverFontColor = new AQUA({
  data: 'gray',
  acts: {
    log: [function (data) {
      console.log('现在hoverFontColor为: ', data)
    }],
    set(rgb) {
      return rgb
    }
  }
})

const fontColor = new AQUA({
  data: 'black',
  acts: {
    log: [function (data) {
      console.log('现在fontColor为: ', data)
    }],
    set(rgb) {
      return rgb
    }
  }
})

const color = new AQUA({
  data: 'rgb(113, 204, 192)',
  acts: {
    log: [function (data) {
      console.log('现在主题色color为: ', data)
    }],
    set(rgb) {
      return rgb
    }
  }
})

const bgColor = new AQUA({
  data: 'rgb(242, 242, 242)',
  acts: {
    log: [function (data) {
      console.log('现在bgcolor为: ', data)
    }],
    set(rgb) {
      return rgb
    }
  }
})

const hoverBgColor = new AQUA({
  data: 'rgba(0, 0, 0, 0.1)',
  acts: {
    log: [function (data) {
      console.log('现在hoverBgColor为: ', data)
    }],
    set(rgb) {
      return rgb
    }
  }
})

const mockList = Mock.mock({
  'list|14': [{
    'key|4': /[a-z][A-Z][0-9]/,
    props: {
      'text|6-10': /[a-z][A-Z][0-9]/,
      icon: 'album'
    }
  }]
})

const userPlaylists = new AQUA({
  data: mockList.list,
  acts: {

  }
})

const searchText = new AQUA({
  data: '',
  acts: {
    input(text) {
      return text
    },
    search() {

    }
  }
})

const time = new AQUA({
  data: 0,
  acts: {
    set(newVal) {
      return newVal
    }
  }
})

const totalTime = new AQUA({
  data: 0,
  acts: {
    set(newVal) {
      return newVal
    }
  }
})

const playFrom = new AQUA({
  data: 0,
  acts: {
    set(newVal) {
      return newVal
    }
  }
})

const isPlaying = new AQUA({
  data: false,
  acts: {
    play() {
      return true
    },
    pause() {
      return false
    }
  }
})

const currentTag = new AQUA({
  data: '歌曲',
  acts: {
    set(tag) {
      return tag
    }
  }
})

const mockScannedSongs = Mock.mock({
  'list|42': [{
    'key|4': /[0-9]/,
    props: {
      'name|14': /[a-z][A-Z][0-9]/,
      'artist|8': /[a-z][A-Z][0-9]/,
      'album|10': /[a-z][A-Z][0-9]/,
      'date|4': /[0-9]/,
      'genre|8': /[a-z][A-Z][0-9]/,
      'duration': /[0-9]{2}:[0-9]{2}/
    }
  }]
})

const scannedSongs = new AQUA({
  data: mockScannedSongs.list,
  acts: {
    set(newList) {
      return newList
    }
  }
})

const sortBy = new AQUA({
  data: 'default',
  acts: {
    set(newType) {
      return newType
    }
  }
})

const sortByGenre = new AQUA({
  data: '所有流派',
  acts: {
    set(newType) {
      return newType
    }
  }
})

const mockFolders = Mock.mock({
  'list|4': [{
    'key|4': /[0-9]/,
    props: {
      'path|14': /((\/[a-zA-Z]){3, 6}){3, 4}/
    }
  }]
})

const folders = new AQUA({
  data: mockFolders.list,
  acts: {
    set(newList) {
      return newList
    }
  }
})

const showAddTo = new AQUA({
  data: false,
  acts: {
    set(isShown) {
      return isShown
    },
    show: [function (isShown) {
      if (isShown) {
        ipcRenderer.send('show addTo')
      } else {
        ipcRenderer.send('close addTo')
      }
    }]
  }
})

module.exports = {
  menuItemActived,
  color,
  hoverBgColor,
  bgColor,
  hoverFontColor,
  fontColor,
  userPlaylists,
  router,
  searchText,
  time,
  totalTime,
  playFrom,
  isPlaying,
  currentTag,
  scannedSongs,
  sortBy,
  sortByGenre,
  folders,
  showAddTo
}