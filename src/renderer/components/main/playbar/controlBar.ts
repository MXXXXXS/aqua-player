import button from './button'
import { El } from 'r/fundamental/creatEl'
import {
  nowPlayingSong,
  nowPlayingList,
  playMode,
  PlayMode,
} from '~/renderer/states'

const randomBtn = button({
  icons: ['random'],
})
const previousBtn = button({
  icons: ['playPrevious'],
  onclick: () => {
    nowPlayingList.tap('previous')
  },
})
const playBtn = button({
  icons: ['play', 'pause'],
  watchStates: {
    isPlaying: ({ props }, isPlaying) => {
      if (isPlaying) {
        props.iconIndex = 1
      } else {
        props.iconIndex = 0
      }
    },
  },
  onclick: () => {
    nowPlayingSong.tap('togglePlayState')
  },
  width: '46px',
})
const nextBtn = button({
  icons: ['playNext'],
  onclick: () => {
    nowPlayingList.tap('next')
  },
})
const modeBtn = button({
  icons: ['loop', 'loopSingle'],
  watchStates: {
    playMode: ({ props }, mode: PlayMode) => {
      const modeName = mode.list[mode.cursor]
      switch (modeName) {
        case 'loopList': {
          props.isActive = true
          props.iconIndex = 0
          break
        }
        case 'loopSingle': {
          props.isActive = true
          props.iconIndex = 1
          break
        }
        case 'onePassList': {
          props.isActive = false
          props.iconIndex = 0
          break
        }
      }
    },
  },
  onclick: () => {
    playMode.tap('next')
  },
})

const config: El = {
  template: __filename,
  children: {
    '.random': randomBtn,
    '.previous': previousBtn,
    '.play': playBtn,
    '.next': nextBtn,
    '.mode': modeBtn,
  },
}

export default config

// class PlayBarCenterBtns extends BaseCustomElement {
//   constructor() {
//     super()
//     const shadowRoot = this.attachShadow({ mode: 'open' })
//     const template = importTemplate(__filename)
//     shadowRoot.appendChild(template.content)
//     // 属性定义
//     this.props = new ReactiveObj({
//       isPlaying: '',
//     })
//     // 元素引用
//     this.rootEl = this.shadowRoot.querySelector('#root')
//     this.randomEl = this.rootEl.querySelector('.random')
//     this.previousEl = this.rootEl.querySelector('.previous')
//     this.playEl = this.rootEl.querySelector('.play')
//     this.nextEl = this.rootEl.querySelector('.next')
//     this.modeEl = this.rootEl.querySelector('.mode')
//     this.randomBtn = svgIcon({
//       width: 32,
//       height: 32,
//       icon: 'random',
//       isCycle: true,
//       hoverBgColor: 'rgba(0, 0, 0, 0.1)',
//       hoverBorderColor: 'rgba(0, 0, 0, 0.3)',
//       hoverBorderWidth: 1,
//       color: 'white',
//       hoverColor: 'white',
//       scale: 0.375,
//     })
//     this.previousBtn = svgIcon({
//       width: 32,
//       height: 32,
//       icon: 'previous',
//       isCycle: true,
//       hoverBgColor: 'rgba(0, 0, 0, 0.1)',
//       hoverBorderColor: 'rgba(0, 0, 0, 0.3)',
//       hoverBorderWidth: 1,
//       color: 'white',
//       hoverColor: 'white',
//       scale: 0.375,
//     })
//     this.playBtn = svgIcon({
//       width: 46,
//       height: 46,
//       icon: 'play',
//       isCycle: true,
//       hoverBgColor: 'rgba(0, 0, 0, 0.1)',
//       hoverBorderColor: 'rgba(0, 0, 0, 0.3)',
//       hoverBorderWidth: 1,
//       color: 'white',
//       borderColor: 'white',
//       borderwidth: 1,
//       hoverColor: 'white',
//       scale: 0.375,
//       iconQueue: ['play', 'next', 'previous'],
//     })
//     this.nextBtn = svgIcon({
//       width: 32,
//       height: 32,
//       icon: 'next',
//       isCycle: true,
//       hoverBgColor: 'rgba(0, 0, 0, 0.1)',
//       hoverBorderColor: 'rgba(0, 0, 0, 0.3)',
//       hoverBorderWidth: 1,
//       color: 'white',
//       hoverColor: 'white',
//       scale: 0.375,
//     })
//     this.modeBtn = svgIcon({
//       width: 32,
//       height: 32,
//       icon: 'refresh',
//       isCycle: true,
//       hoverBgColor: 'rgba(0, 0, 0, 0.1)',
//       hoverBorderColor: 'rgba(0, 0, 0, 0.3)',
//       hoverBorderWidth: 1,
//       color: 'white',
//       hoverColor: 'white',
//       scale: 0.375,
//     })

//     this.randomEl.appendChild(this.randomBtn)
//     this.previousEl.appendChild(this.previousBtn)
//     this.playEl.appendChild(this.playBtn)
//     this.nextEl.appendChild(this.nextBtn)
//     this.modeEl.appendChild(this.modeBtn)
//     // UI事件触发store的行为
//     // this.addEventListener('', function (e) {

//     // })
//     // 属性改变, 更新视图
//     this.props.watch('isPlaying', (newVal) => {})
//   }

//   connectedCallback() {
//     super.connectedCallback()
//     // 状态输入
//     isPlaying.hook(this.props, 'isPlaying')
//   }
// }

// export default createEl(PlayBarCenterBtns)
