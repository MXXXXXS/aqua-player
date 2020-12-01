import { El } from 'r/fundamental/creatEl'

import svgButton from 'c/svgButton'

const backBtn = svgButton({ icons: ['back'], height: '24px' })
const minimizeBtn = svgButton({
  icons: ['minus'],
  width: '45px',
  height: '24px',
})
const maximizeBtn = svgButton({
  icons: ['square'],
  width: '45px',
  height: '24px',
})
const closeBtn = svgButton({ icons: ['cross'], width: '45px', height: '24px' })

const elConfig: El = {
  template: __filename,
  states: ['color'],
  children: {
    '#back-btn': backBtn,
    '#minimize': minimizeBtn,
    '#maximize': maximizeBtn,
    '#close': closeBtn,
  },
}

export default elConfig
