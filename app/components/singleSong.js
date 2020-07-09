const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')
const { } = store

const svgIcon = require('./svgIcon')

class SingleSong extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)
    /* 属性定义 */
    this.props = new ReactiveObj({
      name: '',
      artist: '',
      album: '',
      date: '',
      genre: '',
      duration: '',
      hoverColor: '',
      hoverBgColor: '',
      nameColor: '',
      replaceAddWithRemove: false,
      isPlaying: false
    })
    //---------//
    /* 元素引用 */
    this.rootEl = this.shadowRoot.querySelector('#root')

    // 三个svg图标
    this.checkBoxEl = this.rootEl.querySelector('.checkBox')
    this.checkBox = svgIcon({
      icon: 'cross',
      scale: 0.375,
      width: 48,
      height: 48
    })
    this.checkBoxEl.appendChild(this.checkBox)
    this.playEl = this.rootEl.querySelector('.play')
    this.play = svgIcon({
      icon: 'add',
      iconQueue: ['add', 'remove'],
      scale: 0.375,
      width: 48,
      height: 48
    })
    this.playEl.appendChild(this.play)
    this.albumEl = this.rootEl.querySelector('.album')
    this.album = svgIcon({
      icon: 'album',
      scale: 0.375,
      width: 48,
      height: 48
    })
    this.albumEl.appendChild(this.album)

    this.playEl = this.rootEl.querySelector('.play')
    this.addEl = this.rootEl.querySelector('.add')
    this.removeEl = this.rootEl.querySelector('.remove')
    this.waveEl = this.rootEl.querySelector('.wave')
    this.nameEl = this.rootEl.querySelector('.text>span')
    this.artistEl = this.rootEl.querySelector('.artist')
    this.albumEl = this.rootEl.querySelector('.album')
    this.dateEl = this.rootEl.querySelector('.date')
    this.genreEl = this.rootEl.querySelector('.genre')
    this.durationEl = this.rootEl.querySelector('.duration')
    //---------//
    /* 视图 => 逻辑 */
    this.addEventListener('', function (e) {

    })
    //-------------//
    /* 属性 => 视图 */
    this.props.watch('name', (newVal) => {
      this.nameEl.innerText = newVal
    })
    this.props.watch('artist', (newVal) => {
      this.artistEl.innerText = newVal
    })
    this.props.watch('album', (newVal) => {
      this.albumEl.innerText = newVal
    })
    this.props.watch('date', (newVal) => {
      this.dateEl.innerText = newVal
    })
    this.props.watch('genre', (newVal) => {
      this.genreEl.innerText = newVal
    })
    this.props.watch('duration', (newVal) => {
      this.durationEl.innerText = newVal
    })

    this.props.watch('hoverColor', color => { this.rootEl.style.setProperty('--hoverColor', color) })
    this.props.watch('hoverBgColor', color => { this.rootEl.style.setProperty('--hoverBgColor', color) })
    this.props.watch('nameColor', color => { this.rootEl.style.setProperty('--nameColor', color) })

    this.props.watch('replaceAddWithRemove', (isAdd) => {

    })
    this.props.watch('isPlaying', (isAdd) => {
      if (isPlaying) {
        this.rootEl.style.setProperty('--nameColor', states.themeColor)
        this.rootEl.style.setProperty('--attributesColor', states.themeColor)
        this.rootEl.style.setProperty('--hoverColor', states.themeColor)
        this.waveEl.style.display = 'inline'
      } else {
        this.waveEl.style.display = 'none'
        this.rootEl.style.setProperty('--nameColor', this.inStore.states.nameColor)
        this.rootEl.style.setProperty('--attributesColor', this.inStore.states.attributesColor)
        this.rootEl.style.setProperty('--hoverColor', this.inStore.states.hoverColor)
      }
    })
    //-------------//
  }
  connectedCallback() {
    super.connectedCallback()
    /* 数据 => 属性 */
    // .hook(this.props._obj, '')
    //-------------//
  }
}

module.exports = createEl(SingleSong)