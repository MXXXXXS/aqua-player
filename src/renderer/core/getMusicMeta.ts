import { isArray, result } from 'lodash'
import * as mm from 'music-metadata'

export type MusicMetaList = Array<MusicMeta>
export interface MusicMeta {
  path: string
  scannedDate: number
  title?: string
  artist?: string
  album?: string
  genre?: string
  year?: string
  duration: number
}

export interface MusicMetaWithCover extends MusicMeta {
  cover: mm.IPicture[]
}
async function getMusicMeta(songPath: string): Promise<MusicMeta>
async function getMusicMeta(
  songPath: string,
  withCover: boolean
): Promise<MusicMetaWithCover | MusicMeta>
async function getMusicMeta(songPath: string, withCover = false) {
  const meta = await mm.parseFile(songPath, {
    skipCovers: !withCover,
  })

  const { title, artist, album, genre, year, picture } = meta.common
  const { duration = 0 } = meta.format

  const result = {
    path: songPath,
    scannedDate: Date.now(),
    title,
    artist,
    album,
    year: year ? String(year) : undefined,
    genre: isArray(genre) && genre[0] ? genre[0] : undefined,
    duration,
  }
  return withCover
    ? {
        ...result,
        cover: picture || [],
      }
    : result
}

export default getMusicMeta
