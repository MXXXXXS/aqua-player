import { debounce } from 'lodash'
import createEl, { El } from 'r/fundamental/creatEl'
import AquaEl from '../fundamental/AquaEl'
import List from '../fundamental/List'

export default ({
  list,
  paddingCount,
  itemHeight,
}: {
  list: List<any>
  paddingCount: number
  itemHeight: number
  // | ((item: unknown) => number)
}): AquaEl => {
  const scrollHandler = debounce(
    (props: Record<string, unknown>, target: HTMLElement) => {
      const offset = target.scrollTop
      const viewH = parseInt(props.viewerHeight as string)

      let paddingTopCount = 0

      const itemH = itemHeight

      const listData = props.listData as []

      const containerOffset = offset - (offset % itemH)
      const renderOffset = containerOffset - paddingCount * itemH

      const start = Math.floor(offset / itemH)
      const count = Math.ceil(viewH / itemH)
      const end = start + count
      const renderStart = start - paddingCount
      const renderEnd = end + paddingCount

      const itemsList = listData.slice(
        renderStart > -1 ? renderStart : ((paddingTopCount = -renderStart), 0),
        renderEnd
      )
      list.update(itemsList)

      props.paddingTop = String(paddingTopCount * itemH) + 'px'
      props.offset = String(renderOffset) + 'px'
    },
    100
  )
  const config: El = {
    template: __filename,
    props: {
      offset: '0px',
      listHeight: '0px',
      viewerHeight: '0px',
      paddingTop: '0px',
      listData: [],
    },
    watchProps: {
      listData: ({ props, root }, listData: []) => {
        props.listHeight = String(listData.length * itemHeight) + 'px'
        const listEl = root.querySelector<HTMLHtmlElement>('.list')
        if (listEl) {
          scrollHandler(props, listEl)
        }
      },
    },
    evtHandlers: {
      scroll: ({ props }, evt: Event) => {
        scrollHandler(props, evt.target as HTMLHtmlElement)
      },
    },
    created: ({ root }) => {
      const listEl = root.querySelector<HTMLElement>('.list')
      if (listEl) {
        list.mount(listEl)
      }
    },
  }

  return createEl(config)
}
