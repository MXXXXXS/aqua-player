import getMeta from '../getMusicMeta'
import { join } from 'path'
import { inspect } from 'util'

const songPath = join(__dirname, 'たまゆらのかぜ.mp3')

async function test(songPath: string) {
  const meta = await getMeta(songPath)
  console.log(
    inspect(meta, {
      showHidden: false,
      depth: null,
    })
  )
}

test(songPath).catch((err) => console.error(err))
