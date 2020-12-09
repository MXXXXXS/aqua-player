import Aqua from 'r/fundamental/aqua'
import { ListKD, ListKDItem } from 'c/list'
import { nowPlayingList } from './playingControl'
import { findIndex, noop, sortBy, uniqBy } from 'lodash'
import { MusicMeta, MusicMetaList } from 'r/core/getMusicMeta'
import scanSongs from 'ru/scanSongs'
import { diffArray } from 'ru/diff'
import sortWords, { Group } from '../utils/sortWords'
import { saveToDB } from '../db'

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

export interface SortedSongs {
  sortType: 'a-z' | 'artists' | 'albums'
  list: [string, Array<[key: string, items: MusicMetaList]>][]
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
      switch (sortType) {
        case 'a-z': {
          keyGetter = (meta: MusicMeta) => meta.title || ''
          break
        }
        case 'artists': {
          keyGetter = (meta: MusicMeta) => meta.artist || ''
          break
        }
        case 'albums': {
          keyGetter = (meta: MusicMeta) => meta.album || ''
          break
        }
      }
      const { en, zh } = sortWords(list, keyGetter)
      return {
        sortType: sortType,
        list: [
          ...sortBy(Object.entries(en), ([initial]) => initial),
          ...sortBy(Object.entries(zh), ([initial]) => initial).map(
            ([initial, items]) =>
              ['拼音' + initial, items] as [string, Group<MusicMeta>[]]
          ),
        ],
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
