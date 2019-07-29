const { singers } = require(`../assets/components.js`)
const store = require(`../states.js`)
const sortWords = require(`../utils/sortWords.js`)
const states = store.states

class AQUASingers extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    const root = this.shadowRoot
    shadow.innerHTML = singers

    const template = song =>
      `
  <div>
    <div class="letter">D</div>
    <div class="group">
      <div class="item">
        <div class="cover">
          <div class="icon play"></div>
          <div class="icon add"></div>
        </div>
        <div class="artist">Departures～あなたにおくるアイの歌～</div>
      </div>
    </div>
  </div>
    `
    setTimeout(() => {
      const {en, zh} = sortWords(states.sList.map(song => song.title))
      console.log(en)
      console.log(zh)
      // root.innerHTML += template()
    }, 1000)

    run()
    async function run() {
    }
  }
}

module.exports = AQUASingers