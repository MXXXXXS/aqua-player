import { MusicMeta } from 'r/core/getMusicMeta'

import list from 'c/list'
import slip from './slip'

export default list<MusicMeta>({
  stateName: 'songsSortByScannedDate',
  keyGen: (meta) => meta.path,
  elGen: ({ item }) => slip({ ...item, listType: 'songsSortByScannedDate' }),
})
