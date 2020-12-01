import { ipcRenderer } from 'electron'

import { lock, unlock } from 'ru/Locker'
import r from 'r/states/router'
import Aqua from 'r/fundamental/aqua'
import { ListKD, ListKDItem } from 'c/list'
import { findIndex, noop, uniq } from 'lodash'
import getMusicMeta, {
  MusicMetaList,
  MusicMeta,
  MusicMetaWithCover,
} from 'r/core/getMusicMeta'
import song, { play, seek, pause, load } from 'r/core/player'
import scanSongs from 'ru/scanSongs'
import { diffArray } from 'ru/diff'
import relativeToWorkspace from '~/utils/relativeToWorkspace'
import { TagType } from 'c/main/content/myMusic/panelSwitcher'

export const router = r
export interface States {
  [stateName: string]: Aqua<unknown>
}

export const myMusicPanel = new Aqua<TagType>({
  data: 'music',
  reacts: [
    ({ newData: newTag }) => {
      router.tap('add', ['s-music', newTag])
    },
  ],
})

export const ipc = new Aqua<string>({
  data: '',
  acts: {
    openFileExplorer: () => {
      ipcRenderer.send('open file explorer')
    },
  },
})

export const isEnded = new Aqua<boolean>({
  data: true,
  reacts: [
    ({ newData }: { newData: boolean }) => {
      if (newData) {
        const { cursor, list } = playMode.data
        const mode = list[cursor]
        switch (mode) {
          case 'loopSingle': {
            nowPlayingSong.tapAsync('replay').catch((err) => console.error(err))
            break
          }
          case 'onePassList': {
            const { cursor, list } = nowPlayingList.data
            if (cursor + 1 < list.length) {
              nowPlayingSong
                .tapAsync('playAnother', list[cursor + 1].path)
                .catch((err) => console.error(err))
            }
            break
          }
          case 'loopList': {
            const { cursor, list } = nowPlayingList.data
            let nextCursorPosition = 0
            if (cursor + 1 < list.length) {
              nextCursorPosition = cursor + 1
            }
            nowPlayingSong
              .tapAsync('playAnother', list[nextCursorPosition].path)
              .catch((err) => console.error(err))
            break
          }
        }
      }
    },
  ],
})

export const isPaused = new Aqua<boolean>({
  data: false,
})

export const isPlaying = new Aqua<boolean>({
  data: false,
})

export interface SongMeta {
  meta: MusicMetaWithCover
  coverUrl: string
}

export const songMeta = new Aqua<SongMeta>({
  data: {
    meta: {} as MusicMetaWithCover,
    coverUrl: '',
  },
  acts: {
    setMeta: (meta: MusicMetaWithCover) => {
      URL.revokeObjectURL(songMeta.data.coverUrl)
      const coverUrl = URL.createObjectURL(new Blob([meta.cover[0]?.data]))
      return {
        meta,
        coverUrl,
      }
    },
  },
})

export interface PlayMode {
  cursor: number
  list: ['onePassList', 'loopList', 'loopSingle']
}

export const playMode: Aqua<PlayMode> = new Aqua<PlayMode>({
  data: {
    cursor: 0,
    list: ['onePassList', 'loopList', 'loopSingle'],
  },
  acts: {
    next: () => {
      const { cursor, list } = playMode.data
      const nextCursor = (cursor + 1) % list.length
      return {
        cursor: nextCursor,
        list,
      }
    },
  },
})

export interface NowPlayingSongOffset {
  offset: number
  seconds: number
  duration: number
  type: 'input' | 'change' | 'timer'
}

function getSeconds() {
  //console.log('timer')
  const seconds = (song.howl.seek?.() as number) || 0
  const duration = song.howl.duration?.() || 0
  nowPlayingSongOffset.tap('timer', seconds, duration)
}
function getSecondsTimer() {
  return setInterval(getSeconds, 1000)
}

let timer = getSecondsTimer()

export const nowPlayingSongOffset: Aqua<NowPlayingSongOffset> = new Aqua<NowPlayingSongOffset>(
  {
    data: {
      offset: 0,
      seconds: 0,
      duration: 0,
      type: 'input',
    },
    acts: {
      input: (offset: number) => {
        const { duration } = nowPlayingSongOffset.data
        return {
          duration,
          seconds: (offset / 1000) * duration,
          offset,
          type: 'input',
        }
      },
      change: (offset: number) => {
        return {
          ...nowPlayingSongOffset.data,
          offset,
          type: 'change',
        }
      },
      timer: (seconds: number, duration: number) => {
        return {
          type: 'timer',
          duration: duration || 0,
          offset: (seconds / (duration || 1)) * 1000,
          seconds,
        }
      },
    },
    reacts: [
      ({ newData }: { newData: NowPlayingSongOffset }) => {
        const { offset, type } = newData
        if (type === 'change') {
          nowPlayingSong
            .tapAsync('seek', offset)
            .then((seeked) => {
              if (seeked) {
                //console.log('change', offset)
                // 设置时间后马上渲染一次当前时间
                getSeconds()
                clearInterval(timer)
                timer = getSecondsTimer()
              }
            })
            .catch((err) => console.error(err))
        } else if (type === 'input') {
          //console.log('input', offset)
          clearInterval(timer)
        }
      },
    ],
  }
)

interface NowPlayingList {
  cursor: number
  list: MusicMetaList
}

export const nowPlayingList: Aqua<NowPlayingList> = new Aqua<NowPlayingList>({
  data: {
    cursor: 0,
    list: [],
  },
  acts: {
    next: () => {
      if (lock('next')) {
        const { cursor, list } = nowPlayingList.data
        let nextCursorPosition = 0
        if (cursor + 1 < list.length) {
          nextCursorPosition = cursor + 1
        }
        const newSongPath = list[nextCursorPosition].path
        if (isPlaying.data) {
          nowPlayingSong
            .tapAsync('playAnother', newSongPath)
            .catch((err) => console.error(err))
        } else {
          nowPlayingSong
            .tapAsync('loadAnother', newSongPath)
            .catch((err) => console.error(err))
        }
        unlock('next')
      }
    },
    previous: () => {
      if (lock('previous')) {
        const { cursor, list } = nowPlayingList.data
        let nextCursorPosition = list.length - 1
        if (cursor - 1 > -1) {
          nextCursorPosition = cursor - 1
        }
        const newSongPath = list[nextCursorPosition].path
        if (isPlaying.data) {
          nowPlayingSong
            .tapAsync('playAnother', newSongPath)
            .catch((err) => console.error(err))
        } else {
          nowPlayingSong
            .tapAsync('loadAnother', newSongPath)
            .catch((err) => console.error(err))
        }
        unlock('previous')
      }
    },
  },
  // reacts: [({ newData, oldData }) => {}],
})

export const nowPlayingSongCover = new Aqua<string>({
  data: '',
})

const getCurrentSong = () => nowPlayingSong.data

export const nowPlayingSong: Aqua<string> = new Aqua<string>({
  data: '',
  acts: {
    replay: async () => {
      if (lock('replay')) {
        await nowPlayingSong.tapAsync('playAnother', nowPlayingSong.data)
        unlock('replay')
      }
    },
    seek: async (perMille: number) => {
      if (lock('seek')) {
        await seek(perMille)
        unlock('seek')
        //console.log('seeked')
        return true
      }
    },
    pause: async () => {
      if (lock('pause')) {
        await pause()
        //console.log('暂停播放: ', getCurrentSong())
        isPlaying.tap('set', false)
        isPaused.tap('set', true)
        unlock('pause')
      }
    },
    togglePlayState: () => {
      if (lock('togglePlayState')) {
        if (isPlaying.data) {
          nowPlayingSong.tapAsync('pause').catch((err) => console.error(err))
        } else {
          nowPlayingSong.tapAsync('play').catch((err) => console.error(err))
        }
        unlock('togglePlayState')
      }
    },
    play: async () => {
      if (lock('play')) {
        await play()
        //console.log('开始播放: ', getCurrentSong())
        isPlaying.tap('set', true)
        isPaused.tap('set', false)
        isEnded.tap('set', false)
        unlock('play')
      }
    },
    loadAnother: async (songPath: string) => {
      if (lock('loadAnother')) {
        await load(songPath)
        //console.log('已加载: ', songPath)
        nowPlayingSong.tap('set', songPath)
        unlock('loadAnother')
      }
    },
    playAnother: async (songPath: string) => {
      if (lock('playAnother')) {
        await nowPlayingSong.tapAsync('loadAnother', songPath)
        await nowPlayingSong.tapAsync('play')
        unlock('playAnother')
      }
    },
  },
  reacts: [
    async ({ newData: newPath }: { newData: string }) => {
      // 更新nowPlayingList的cursor
      const list = nowPlayingList.data.list
      const cursor = findIndex(list, ({ path }) => path === newPath)
      if (cursor > -1) {
        nowPlayingList.tap('set', {
          cursor,
          list,
        })
      }

      // 加载新曲子meta
      const meta = await getMusicMeta(newPath, true).catch((err) =>
        console.error(err)
      )
      if (meta) {
        songMeta.tap('setMeta', meta)
      }
    },
  ],
})

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
    ({ newData: newSongs }: { newData: ListKD<MusicMetaList> }) => {
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

export const folders: Aqua<Array<string>> = new Aqua<Array<string>>({
  data: [],
  acts: {
    push: (newFolders: Array<string>) => {
      const oldFolders = folders.data

      return uniq([...oldFolders, ...newFolders])
    },
    del: (by: string | number) => {
      const oldFolders = folders.data
      let deletedElIndex

      if (typeof by === 'number') {
        deletedElIndex = by
      } else if (typeof by === 'string') {
        deletedElIndex = findIndex(oldFolders, (key) => key === by)
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
        newData: Array<string>
        oldData: Array<string>
      },
      next = noop
    ) => {
      const diff = diffArray<string>(oldFolders, newFolders, (key) => key)
      for (let index = 0; index < diff.add.length; index++) {
        const folderToAdd = diff.add[index]
        const newSongs = await scanSongs(folderToAdd).catch((err) =>
          console.error(err)
        )
        next({
          key: folderToAdd,
          data: newSongs,
        })
      }
      diff.del.forEach((folder) => {
        songs.tap('del', folder)
      })
    },
    (newSongs: ListKDItem<MusicMetaList>) => {
      //console.log(`已扫描目录: ${newSongs.key}`)
      songs.tap('add', newSongs)
    },
  ],
})

export const layers = new Aqua<string>({
  data: '',
  acts: {
    showFolderAdder: () => {
      router.tap('add', ['l-root', 'main,folderAdder'])
    },
    closeFolderAdder: () => {
      router.tap('add', ['l-root', 'main'])
    },
  },
})

export const highlightedMenuItemText = new Aqua<string>({
  data: '',
  reacts: [
    ({ newData: curTab }, next = noop) => {
      //console.log('现在激活的menuItemActivated为: ', curTab)
      next(curTab)
    },
    (curTab) => {
      switch (curTab) {
        case '我的音乐': {
          router.tap('add', ['s-content', 'myMusic'])
          break
        }
        case '设置': {
          router.tap('add', ['s-content', 'settings'])
          break
        }
      }
    },
  ],
})

// const hoverFontColor = new Aqua({
//   data: 'gray',
//   acts: {
//     log: [
//       function (data) {
//         //console.log('现在hoverFontColor为: ', data)
//       }
//     ]
//   }
// })

// const fontColor = new Aqua({
//   data: 'black',
//   acts: {
//     log: [
//       function (data) {
//         //console.log('现在fontColor为: ', data)
//       }
//     ]
//   }
// })

export const color = new Aqua({
  data: 'rgb(113, 204, 192)',
  reacts: [
    function ({ newData: data }) {
      //console.log('现在主题色color为: ', data)
    },
  ],
})

export const bgColor = new Aqua({
  data: '#f2f2f2',
  reacts: [
    ({ newData }) => {
      console.log('现在hoverBgColor为: ', newData)
    },
  ],
})

export const hoverBgColor = new Aqua({
  data: '#dfdfdf',
  reacts: [
    ({ newData }) => {
      console.log('现在hoverBgColor为: ', newData)
    },
  ],
})

export const searchText = new Aqua<string>({
  data: '',
  acts: {
    input(text: string) {
      return text
    },
    // search() {}
  },
})

// const time = new Aqua({
//   data: 0,
// })

// const totalTime = new Aqua({
//   data: 0,
// })

// const playFrom = new Aqua({
//   data: 0,
// })

// const isPlaying = new Aqua({
//   data: false,
//   acts: {
//     play() {
//       return true
//     },
//     pause() {
//       return false
//     },
//   },
// })

// const currentTag = new Aqua({
//   data: '歌曲',
// })

// interface nowPlayingSong {
//   name: string
//   artist: string
//   album: string
//   date: string
//   genre: string
//   duration: string
// }

export interface SortTypes {
  list: ['添加日期', 'A到Z', '歌手', '专辑']
  cursor: number
}

export const sortBy = new Aqua<SortTypes>({
  data: {
    list: ['添加日期', 'A到Z', '歌手', '专辑'],
    cursor: 0,
  },
  acts: {
    change: ({ x, y }) => {
      ipcRenderer.send('create sub window', {
        file: 'app/renderer/subWindows/sortBy/index.html',
        xy: [x, y],
      })
    },
  },
})

const sortByGenre = new Aqua<string>({
  data: '所有流派',
})
