import { El } from 'r/fundamental/creatEl'

export default (el: El): El => {
  return {
    template: __filename,
    states: ['color', 'fontColor', 'hoverFontColor', 'hoverBgColor', 'bgColor'],
    props: {
      isHighlighted: false,
      scaleRatio: '1',
    },
    created: ({ root, props }) => {
      root.addEventListener('mousedown', () => {
        const scalePX = 8
        props.scaleRatio = String(1 - scalePX / root.offsetWidth)
      })
    },
    children: { '#root': el },
  }
}
