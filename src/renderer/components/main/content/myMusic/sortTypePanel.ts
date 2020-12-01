import { El } from 'r/fundamental/creatEl'
import svgIcon from 'c/svgIcon'
import textButton from '~/renderer/components/textButton'
import { sortBy } from '~/renderer/states'

const randomIcon = svgIcon('random')
const changeSortButton = textButton({
  staticText: '添加日期',
  onClick: ({ host }) => {
    // 变更排序
    const { x, y } = host.getBoundingClientRect()
    sortBy.tap('change', { x, y })
  },
})
const changeTypeButton = textButton({
  staticText: '所有流派',
  onClick: () => {
    // 筛选种类
  },
})

const config: El = {
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

export default config
