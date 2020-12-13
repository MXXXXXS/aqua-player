import { Howl } from 'howler'
import { isEmpty } from 'lodash'
import { isPlaying, isPaused, isEnded, nowPlayingSong } from 'r/states'

const getCurrentSong = () => nowPlayingSong.data

const song = {
  howl: {} as Howl,
  onEnd: () => {
    console.log('完成播放: ', getCurrentSong())
    isPlaying.tap('set', false)
    isPaused.tap('set', true)
    isEnded.tap('set', true)
  },
  onStop: () => {
    console.log('停止播放: ', getCurrentSong())
  },
}

export default song

export function play(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof song.howl.play === 'function') {
      song.howl.once('play', () => {
        resolve()
      })
      song.howl.play()
    } else {
      reject('song.howl.play is not a function')
    }
  })
}

export function pause(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof song.howl.pause === 'function') {
      song.howl.once('pause', () => {
        resolve()
      })
      song.howl.pause()
    } else {
      reject('song.howl.pause is not a function')
    }
  })
}

export function load(songPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const howl = song.howl
    if (!isEmpty(howl)) {
      howl.unload()
    }
    song.howl = new Howl({
      src: songPath,
      html5: true,
    })
    song.howl.on('end', song.onEnd)
    song.howl.on('stop', song.onStop)
    song.howl.once('loaderror', () => {
      reject(`加载${songPath}失败`)
    })
    song.howl.once('load', () => {
      resolve(songPath)
    })
  })
}

export const seek = (perMille: number): Promise<void> =>
  new Promise((resolve, reject) => {
    if (typeof song.howl.seek === 'function') {
      song.howl.once('seek', () => {
        resolve()
      })
      song.howl.seek((song.howl.duration?.() * perMille) / 1000)
    } else {
      console.error('song.howl.seek is not a function')
      resolve()
    }
  })

// export const stop = (): Promise<void> =>
//   new Promise((resolve, reject) => {
//     if (typeof song.howl.stop === 'function') {
//       song.howl.stop()
//       song.howl.once('stop', () => {
//         resolve()
//       })
//     } else {
//       reject('song.howl.stop is not a function')
//     }
//   })

export const volume = (volume: number): void => {
  song.howl.volume?.(volume / 100)
}
