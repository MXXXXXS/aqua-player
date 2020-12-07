export async function getObjectStore(
  objectStoreName: string,
  keyPath: string
): Promise<IDBObjectStore> {
  const openDb: Promise<IDBOpenDBRequest> = new Promise((res, rej) => {
    const openRequest = indexedDB.open('aqua-player', 1)

    openRequest.onsuccess = (evt) => {
      res(openRequest)
    }
    openRequest.onerror = (evt) => {
      rej(evt)
    }
    openRequest.onupgradeneeded = () => {
      const db = openRequest.result
      if (!db.objectStoreNames.contains(objectStoreName)) {
        db.createObjectStore(objectStoreName, { keyPath })
      }
    }
  })
  const openRequest = await openDb

  const db = openRequest.result
  const objectStore = db
    .transaction(objectStoreName, 'readwrite')
    .objectStore(objectStoreName)

  return objectStore
}

type CU = 'add' | 'put'

type RD = 'delete' | 'get'
type RDKey = Parameters<IDBObjectStore[RD]>[0]

type CRUD = CU | RD

export function curd(
  objectStore: IDBObjectStore,
  method: CU,
  value: unknown
): Promise<Event>

export function curd(
  objectStore: IDBObjectStore,
  method: RD,
  keyOrKeyRange: RDKey
): Promise<Event>

export function curd(
  objectStore: IDBObjectStore,
  method: CRUD,
  arg: unknown | RDKey
): Promise<Event> {
  return new Promise((res, rej) => {
    let request
    switch (method) {
      case 'add': {
        request = objectStore.add(arg)
        break
      }
      case 'delete': {
        request = objectStore.delete(arg as RDKey)
        break
      }
      case 'put': {
        request = objectStore.put(arg)
        break
      }
      case 'get': {
        request = objectStore.get(arg as RDKey)
        break
      }
    }
    request.onsuccess = (evt) => {
      res(evt)
    }
    request.onerror = (evt) => {
      rej(evt)
    }
  })
}

export type Query = Parameters<IDBObjectStore['getAll']>[0]
export type Count = Parameters<IDBObjectStore['getAll']>[1]

export function getAll<T>(
  objectStore: IDBObjectStore,
  query?: Query,
  count?: Count
): Promise<T[]> {
  return new Promise((res, rej) => {
    const request = objectStore.getAll(query, count)
    request.onsuccess = (evt) => {
      res(request.result as T[])
    }
    request.onerror = (evt) => {
      rej(evt)
    }
  })
}
