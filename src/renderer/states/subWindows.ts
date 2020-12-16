import { ipcRenderer } from 'electron'
import { router } from './router'
import { color } from './themeStyle'
import { sortedSongs } from './musicLists'
import Aqua from 'r/fundamental/aqua'

export interface ViewTypes {
  list: string[]
  cursor: number
}
export interface SortTypePanelData extends ViewTypes {
  color: string
}

export const musicSortBy = subWindowState('musicSortBy', [
  '添加日期',
  'A到Z',
  '歌手',
  '专辑',
])
export const filterGenres = subWindowState('filterGenres', ['所有流派'])

export const albumsSortBy = subWindowState('albumsSortBy', [
  '添加日期',
  'A到Z',
  '发行年份',
  '歌手',
])

export const albumsFilterGenres = subWindowState('albumsFilterGenres', [
  '所有流派',
])

function subWindowState(stateName: string, data: string[]): Aqua<ViewTypes> {
  const state = new Aqua<ViewTypes>({
    data: {
      list: data,
      cursor: 0,
    },
    acts: {
      setList: (list: string[], close: false) => {
        return {
          list: [...list],
          cursor: 0,
        }
      },
      change: ({ x, y }) => {
        const { cursor } = state.data
        // 30 是一项条目的高度, 5 是偏移居中修正
        const heightOffset = cursor * 30 + 5
        ipcRenderer.send('create sub window', {
          stateName,
          data: { ...state.data, color: color.data },
          file: `app/renderer/subWindows/pages/changeView/index.html`,
          width: 130,
          height: state.data.list.length * 30,
          xy: [x, y - heightOffset],
        })
      },
      activate: (text: string): ViewTypes | undefined => {
        const { list } = state.data
        const newCursor = list.indexOf(text)
        if (newCursor > -1) {
          return {
            list,
            cursor: newCursor,
          }
        }
      },
    },
    reacts: [
      ({ newData }: { newData: ViewTypes }) => {
        const { list, cursor } = newData
        const tag = list[cursor]

        console.log(tag)
        let routerTag = '添加日期'
        let genreFilter = ''
        switch (tag) {
          case '添加日期': {
            router.tap('add', ['s-music-sort-by', '添加日期'])
            routerTag = tag
            break
          }
          case 'A到Z': {
            sortedSongs.tap('sort', 'a-z')
            routerTag = tag
            break
          }
          case '歌手': {
            sortedSongs.tap('sort', 'artist')
            routerTag = tag
            break
          }
          case '专辑': {
            sortedSongs.tap('sort', 'album')
            routerTag = tag
            break
          }
          default: {
            genreFilter = tag
            break
          }
        }
        router.tap('add', ['s-music-sort-by', routerTag])
        // TODO: 过滤显示内容
      },
    ],
  })
  return state
}
