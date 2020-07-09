const { importTemplate, createEl, ReactiveObj, Base } = require('../utils/customElHelper')
const store = require('../store')
const { currentTag, color } = store

class MyMusicPanel extends Base {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = importTemplate(__filename)
    this.shadowRoot.appendChild(template.content)
    /* 属性定义 */
    this.props = new ReactiveObj({
      currentTag: '',
      curTagColor: ''
    })
    //---------//
    /* 元素引用 */
    this.rootEl = this.shadowRoot.querySelector('#root')
    this.songsEl = this.rootEl.querySelector('.songs')
    this.singersEl = this.rootEl.querySelector('.singers')
    this.albumsEl = this.rootEl.querySelector('.albums')
    //---------//
    /* 视图 => 逻辑 */
    this.songsEl.addEventListener('click', function(e) {
      currentTag.tap('set', '歌曲')
    })
    this.singersEl.addEventListener('click', function(e) {
      currentTag.tap('set', '歌手')
    })
    this.albumsEl.addEventListener('click', function(e) {
      currentTag.tap('set', '专辑')
    })
    //-------------//
    /* 属性 => 视图 */
    this.props.watch('currentTag', (newVal) => {
      this.rootEl.querySelector('.selected').classList.remove('selected')
      switch (newVal) {
        case '歌曲': {
          this.songsEl.classList.add('selected')
          break
        }
        case '歌手': {
          this.singersEl.classList.add('selected')
          break
        }
        case '专辑': {
          this.albumsEl.classList.add('selected')
          break
        }
      }
    })
    this.props.watch('curTagColor', (curTagColor) => {
      this.rootEl.style.setProperty('--curTagColor', curTagColor)
    })
    //-------------//
  }
  connectedCallback() {
    super.connectedCallback()
    /* 数据 => 属性 */
    currentTag.hook(this.props._obj, 'currentTag')
    color.hook(this.props._obj, 'curTagColor')
    //-------------//
  }
}

module.exports = createEl(MyMusicPanel)