import { lock, unlock } from 'ru/Locker'
import Aqua from 'r/fundamental/aqua'
import { findIndex } from 'lodash'
import getMusicMeta, {
  MusicMetaList,
  MusicMetaWithCover,
} from 'r/core/getMusicMeta'
import song, { play, seek, pause, load } from 'r/core/player'

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
