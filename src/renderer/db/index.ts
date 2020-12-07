import { getObjectStore, curd, getAll, Query, Count } from 'r/db/utils'
import { ListKD, ListKDItem } from '../components/list'
import { MusicMetaList } from '../core/getMusicMeta'
import { Folder, folders, songs } from '../states'

export async function saveToDB(newSongs: ListKD<MusicMetaList>): Promise<void> {
  if (newSongs.length > 0) {
    for (let index = 0; index < newSongs.length; index++) {
      const songsOfAFolder = newSongs[index]
      const objectStore = await getObjectStore('songs', 'key')
      await curd(objectStore, 'put', songsOfAFolder)
    }
  }
}

export async function getSongsFromDB(
  query?: Query,
  count?: Count
): Promise<ListKD<MusicMetaList>> {
  const objectStore = await getObjectStore('songs', 'key')
  return await getAll<ListKDItem<MusicMetaList>>(objectStore, query, count)
  // return await curd(objectStore, 'get', newSongs, 'key')
}

async function initial() {
  const songsFromDB = await getSongsFromDB()
  const foldersFromDB: Array<Folder> = songsFromDB.map(({ key }) => ({
    path: key,
    scanNeeded: false,
  }))
  folders.tap('push', foldersFromDB)
  songs.tap('set', songsFromDB)
}

initial().catch((err) => console.error(err))
