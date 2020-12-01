import { readdir, statSync } from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import { ListKD } from 'c/list'
import getMusicMeta, { MusicMeta, MusicMetaList } from 'r/core/getMusicMeta'
import { compact } from 'lodash'

const readdirp = promisify(readdir)

const musicType = ['flac', 'mp3', 'wav', 'mp4', 'ogg', 'aac']

export default async (dir: string, deep = false): Promise<MusicMetaList> => {
  const songMetaPromises: ListKD<Promise<MusicMeta>> = []
  await scanSong(dir, deep)

  const metaList = await Promise.all(
    songMetaPromises.map(async ({ key, data }) => {
      const meta = await data.catch((err) => {
        console.error(`扫描歌曲失败: \n${key}\n`, err)
      })
      if (meta && meta.duration > 0) {
        return meta
      }
    })
  )

  return compact(metaList) || []

  async function scanSong(dir: string, deep = false): Promise<void> {
    const files = await readdirp(dir)
    files.forEach((basename) => {
      const file = join(dir, basename)
      const isDir = statSync(file).isDirectory()
      if (isDir && deep) {
        scanSong(file, deep).catch((err) => console.error(err))
      } else if (!isDir) {
        //筛选格式符合的音乐文件
        const matched = /[^.]*$/.exec(basename)
        if (matched) {
          const fileType = matched[0].toLowerCase()
          if (musicType.includes(fileType)) {
            const songMeta = {
              key: file,
              data: getMusicMeta(file),
            }
            songMetaPromises.push(songMeta)
          }
        }
      }
    })
  }
}
