import { addLock } from 'ru/Locker'
import Aqua from 'r/fundamental/aqua'
import { findIndex } from 'lodash'
import getMusicMeta, {
  MusicMetaList,
  MusicMetaWithCover,
} from 'r/core/getMusicMeta'
import song, { play, seek, pause, load } from 'r/core/player'

// 播放的三种状态
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

// 播放歌曲的信息
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

// 列表播放模式, 单次列表, 循环列表, 单曲循环
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

// 播放歌曲的时间轴偏移
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

// 当前的播放列表, 会在"正在播放"页面显示
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
    },
    previous: () => {
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
    },
  },
  // reacts: [({ newData, oldData }) => {}],
})

// 当前播放的歌曲
export const nowPlayingSong: Aqua<string> = new Aqua<string>({
  data: '',
  acts: {
    playSlip: (path: string) => {
      nowPlayingSong
        .tapAsync('playAnother', path)
        .catch((err) => console.error(err))
    },
    replay: addLock(async (unlock) => {
      await nowPlayingSong.tapAsync('playAnother', nowPlayingSong.data)
      unlock()
    }),
    seek: addLock(async (unlock, perMille: number) => {
      await seek(perMille)
      unlock()
      //console.log('seeked')
      return true
    }),
    pause: addLock(async (unlock) => {
      await pause()
      //console.log('暂停播放: ', getCurrentSong())
      isPlaying.tap('set', false)
      isPaused.tap('set', true)
      unlock()
    }),
    togglePlayState: addLock((unlock) => {
      if (isPlaying.data) {
        nowPlayingSong.tapAsync('pause').catch((err) => console.error(err))
      } else {
        nowPlayingSong.tapAsync('play').catch((err) => console.error(err))
      }
      unlock()
    }),
    play: addLock(async (unlock) => {
      await play()
      //console.log('开始播放: ', getCurrentSong())
      isPlaying.tap('set', true)
      isPaused.tap('set', false)
      isEnded.tap('set', false)
      unlock()
    }),
    loadAnother: addLock(async (unlock, songPath: string) => {
      await load(songPath)
      //console.log('已加载: ', songPath)
      nowPlayingSong.tap('set', songPath)
      unlock()
    }),
    playAnother: addLock(async (unlock, songPath: string) => {
      await nowPlayingSong.tapAsync('loadAnother', songPath)
      await nowPlayingSong.tapAsync('play')
      unlock()
    }),
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
