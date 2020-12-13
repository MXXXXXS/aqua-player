import { El } from 'r/fundamental/creatEl'
import svgIcon from 'c/svgIcon'
import textButton from '~/renderer/components/textButton'
import * as states from '~/renderer/states'
import { ViewTypes } from '~/renderer/states'

const randomIcon = svgIcon({ icon: 'random' })

export default (
  sortTypes: keyof typeof states,
  genres: keyof typeof states
): El => {
  const changeSortButton = textButton<ViewTypes>({
    textSrc: sortTypes,
    textGetter: ({ list, cursor }) => list[cursor],
    onClick: ({ host }) => {
      // 变更排序
      const { x, y } = host.getBoundingClientRect()
      // states
      states[sortTypes].tap('change', { x, y })
    },
  })
  const changeTypeButton = textButton<ViewTypes>({
    textSrc: genres,
    textGetter: ({ list, cursor }) => list[cursor],
    onClick: ({ host }) => {
      // 筛选种类
      const { x, y } = host.getBoundingClientRect()
      states[genres].tap('change', { x, y })
    },
  })

  return {
    template: __filename,
    props: {
      total: 0,
    },
    children: {
      '.random': randomIcon,
      '.type': changeTypeButton,
      '.sortBy': changeSortButton,
    },
  }
}
