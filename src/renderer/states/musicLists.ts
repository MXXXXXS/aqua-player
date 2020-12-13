import Aqua from 'r/fundamental/aqua'
import { ListKD, ListKDItem } from 'c/list'
import { nowPlayingList } from './playingControl'
import { findIndex, noop, sortBy, uniqBy } from 'lodash'
import { MusicMeta, MusicMetaList } from 'r/core/getMusicMeta'
import scanSongs from 'ru/scanSongs'
import { diffArray } from 'ru/diff'
import sortWords, { Group } from '../utils/sortWords'
import { saveToDB } from '../db'

export type ListType = 'songsSortByScannedDate' | 'sortedSongs' | 'collection'

export const nowPlayingListType = new Aqua<ListType>({
  data: 'songsSortByScannedDate',
  reacts: [
    ({ newData: listType }: { newData: ListType }) => {
      switch (listType) {
        case 'songsSortByScannedDate': {
          const list = songsSortByScannedDate.data
          nowPlayingList.tap('set', { cursor: 0, list })
          break
        }
        case 'sortedSongs': {
          const { list } = sortedSongs.data
          const flattenedList = list.reduce((acc, [_key, ...musicMetaList]) => {
            acc.push(...musicMetaList)
            return acc
          }, [] as MusicMetaList)
          nowPlayingList.tap('set', { cursor: 0, list: flattenedList })
          break
        }
      }
    },
  ],
})

// 按时间排序展平的songs, 用于显示在"我的音乐"页面的"歌曲"默认的"添加日期"视图
export const songsSortByScannedDate = new Aqua<MusicMetaList>({
  data: [],
  acts: {},
  reacts: [
    ({ newData }: { newData: MusicMetaList }) => {
      nowPlayingList.tap('set', {
        cursor: 0,
        list: newData,
      })
    },
  ],
})

// 排序songsSortByScannedDate, 用于显示在"我的音乐"页面的"歌曲"的三种排序视图
export interface SortedSongs {
  sortType: 'a-z' | 'artist' | 'album'
  list: Group<MusicMeta>[]
}

export const sortedSongs = new Aqua<SortedSongs>({
  data: {
    sortType: 'a-z',
    list: [],
  },
  acts: {
    sort(sortType: SortedSongs['sortType']): SortedSongs {
      const list = songsSortByScannedDate.data
      let keyGetter
      let listGen
      switch (sortType) {
        case 'a-z': {
          keyGetter = (meta: MusicMeta) => meta.title || ''
          listGen = (sortedList: [string, Group<MusicMeta>[]][]) => {
            const list = []
            for (let i = 0; i < sortedList.length; i++) {
              const subList = []
              const [initial, groups] = sortedList[i]
              subList.push(initial)
              groups.forEach(([_key, ...musicMetaList]) => {
                subList.push(...musicMetaList)
              })
              list.push(subList as Group<MusicMeta>)
            }
            return list
          }
          break
        }
        case 'artist':
        case 'album': {
          keyGetter = (meta: MusicMeta) => meta[sortType] || ''
          listGen = (sortedList: [string, Group<MusicMeta>[]][]) => {
            const list = []
            for (let i = 0; i < sortedList.length; i++) {
              const [_initial, groups] = sortedList[i]
              list.push(...groups)
            }
            return list
          }
          break
        }
      }
      const { en, zh } = sortWords(list, keyGetter)

      const sortedList = [
        ...sortBy(Object.entries(en), ([initial]) => initial),
        ...sortBy(Object.entries(zh), ([initial]) => initial).map(
          ([initial, items]) =>
            ['拼音' + initial, items] as [string, Group<MusicMeta>[]]
        ),
      ]

      return {
        sortType: sortType,
        list: listGen(sortedList),
      }
    },
  },
  reacts: [
    // ({ newData }: { newData: MusicMetaList }) => {
    //   nowPlayingList.tap('set', {
    //     cursor: 0,
    //     list: newData,
    //   })
    // },
  ],
})

// 扫描文件夹后获得的歌曲
// key是文件夹路径, data是对应路径下的歌曲
// 不全部汇合成一个MusicMetaList是为了方便在删除文件夹时删除对应的歌曲, 免除了查找
export const songs = new Aqua<ListKD<MusicMetaList>>({
  data: [],
  acts: {
    add: (newSongs: ListKDItem<MusicMetaList>): ListKD<MusicMetaList> => {
      const oldFolders = songs.data
      oldFolders.push(newSongs)
      return [...oldFolders]
    },
    del: (folder: string): ListKD<MusicMetaList> => {
      const oldFolders = songs.data
      const deletedIndex = findIndex(oldFolders, ({ key }) => key === folder)
      if (deletedIndex > -1) {
        oldFolders.splice(deletedIndex, 1)
      }
      return [...oldFolders]
    },
  },
  reacts: [
    async (
      { newData: newSongs }: { newData: ListKD<MusicMetaList> },
      next = noop
    ) => {
      await saveToDB(newSongs)
      next(newSongs)
    },
    (newSongs: ListKD<MusicMetaList>) => {
      const sorted: MusicMetaList = []
      newSongs.reduce((sorted, { data: musicMetaList }) => {
        sorted.push(...musicMetaList)
        return sorted
      }, sorted)
      sorted.sort((a, b) => a.scannedDate - b.scannedDate)
      songsSortByScannedDate.tap('set', sorted)
    },
  ],
})

// 添加的包含歌曲的文件夹, 来自"设置"页面的"选择查找音乐的位置"
export interface Folder {
  path: string
  scanNeeded: boolean
}

export const folders: Aqua<Array<Folder>> = new Aqua<Array<Folder>>({
  data: [],
  acts: {
    push: (newFolders: Array<Folder>) => {
      const oldFolders = folders.data
      return uniqBy([...oldFolders, ...newFolders], (folder) => folder.path)
    },
    del: (by: string | number) => {
      const oldFolders = folders.data
      let deletedElIndex

      if (typeof by === 'number') {
        deletedElIndex = by
      } else if (typeof by === 'string') {
        deletedElIndex = findIndex(oldFolders, ({ path }) => path === by)
      }

      if (typeof deletedElIndex === 'number') {
        const [deletedFolder] = oldFolders.splice(deletedElIndex, 1)
        songs.tap('del', deletedFolder)
        return [...oldFolders]
      }
    },
  },
  reacts: [
    async (
      {
        newData: newFolders,
        oldData: oldFolders,
      }: {
        newData: Array<Folder>
        oldData: Array<Folder>
      },
      next = noop
    ) => {
      const diff = diffArray<Folder>(oldFolders, newFolders, ({ path }) => path)
      for (let index = 0; index < diff.add.length; index++) {
        const { path, scanNeeded } = diff.add[index]
        if (scanNeeded) {
          const newSongs = await scanSongs(path).catch((err) =>
            console.error(err)
          )
          next({
            key: path,
            data: newSongs,
          })
        }
      }
      diff.del.forEach((folder) => {
        songs.tap('del', folder.path)
      })
    },
    (newSongs: ListKDItem<MusicMetaList>) => {
      //console.log(`已扫描目录: ${newSongs.key}`)
      songs.tap('add', newSongs)
    },
  ],
})
