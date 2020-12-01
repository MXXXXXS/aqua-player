import { El } from '~/renderer/fundamental/creatEl'
import menuItem from 'c/main/menu/menuItem'
import baseItem from 'c/baseItem'
import svgButton from 'c/svgButton'

// const searchBoxEl =

const myMusicEl = baseItem(menuItem('musicNote', '我的音乐'))
const recentPlayedEl = baseItem(menuItem('clock', '最近播放的内容'))
const playingEl = baseItem(menuItem('playing', '正在播放'))
const playListEl = baseItem(menuItem('playList', '播放列表'))
const settingsEl = baseItem(menuItem('settings', '设置'))

const menuBtn = svgButton({ icons: ['menu'] })
// ({ root }) => {
//   root.addEventListener('click', () => {
//     // 关闭列表
//   })
// }
const addBtn = svgButton({ icons: ['plus'] })
// ({ root }) => {
//   root.addEventListener('click', () => {
//     // 显示添加播放列表面板
//   })
// }

// const userPlayList = list('userPlayList')

const config: El = {
  template: __filename,
  children: {
    '.menu': menuBtn,
    '.myMusic': myMusicEl,
    '.recentPlayed': recentPlayedEl,
    '.playing': playingEl,
    '.playList': playListEl,
    '.add': addBtn,
    // ['.userPlaylists': userPlayList,
    '.settings': settingsEl,
  },
}

export default config
