const { currentPlaying } = require(`../assets/components.js`)
const {
  playBack,
  stopAudioSrc,
  playNextSong,
  playPreviousSong
} = require(`../player.js`)
const second2time = require(`../utils/second2time.js`)
const { storeStates, shared, playList, listSList } = require(`../states.js`)
const icons = require(`../assets/icons.js`)
const states = storeStates.states

class AQUACurrentPlaying extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: `open` })
    shadow.innerHTML = currentPlaying
    this.root = this.shadowRoot

    //引用dom元素
    const root = this.root
    const timeLine = root.querySelector(`#timeLine`)
    timeLine.value = 0
    // const loudness = root.querySelector(`#loudness`)
    // loudness.value = states.gainVal
    const timePassed = root.querySelector(`.time-passed`)
    const totalTime = root.querySelector(`.totalTime`)
    const nextSong = root.querySelector(`.next`)
    const lastSong = root.querySelector(`.previous`)
    const title = root.querySelector(`.title`)
    const singerAndAlbum = root.querySelector(`.singerAndAlbum`)
    const play = root.querySelector(`.play`)
    const coverContainers = Array.from(root.querySelectorAll(`.cover`))
    const randomize = root.querySelector(`.random`)
    const controller = root.querySelector(`#controller`)
    const arrow = root.querySelector(`.arrow`)
    const hideList = root.querySelector(`.playList`)
    const list = root.querySelector(`.list`)
    const fullScreen = root.querySelector(`.fullScreen`)

    //一些自有状态
    let hidden = false

    //专辑封面显示
    storeStates.watch(`coverSrc`, src => {
      coverContainers.forEach(el => {
        el.innerHTML = ``
        if (src !== `svg`) {
          const img = document.createElement(`img`)
          img.src = src
          img.onload = () => {
            el.appendChild(img)
          }
        } else {
          el.innerHTML = icons[`cover`]
          el.style.display = `flex`
          el.querySelector(`svg`).style.margin = `auto`
        }
      })
    })

    //歌曲信息绑定
    storeStates.sync(`name`, title, `innerText`)
    storeStates.sync(`artist`, singerAndAlbum, `innerText`)

    //已消逝时长文字绑定
    storeStates.watch(`timePassedText`, text => {
      timePassed.innerText = text
    })

    //时间线值绑定
    storeStates.watch(`offset`, offset => {
      timeLine.value = (offset / states.duration) * 1000
    })

    //总时长文字绑定
    storeStates.watch(`formatedDuration`, text => {
      totalTime.innerText = text
    })

    //按钮动作绑定
    fullScreen.addEventListener(`click`, () => {
      if (!document.fullscreenElement) {
        this.root.querySelector(`#main`).requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    })

    function toggleList() {
      if (hidden) {
        hidden = false
        arrow.style.transform = `rotate(0deg)`
        list.style.transition = `transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1)`
        list.style.transform = `translateY(0)`
        controller.style.transition = `transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1)`
        controller.style.transform = `translateY(0)`
      } else {
        hidden = true
        arrow.style.transform = `rotate(-180deg)`
        list.style.transition = `transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1)`
        list.style.transform = `translateY(200vh)`
        controller.style.transition = `transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1)`
        controller.style.transform = `translateY(calc(100vh - 320px))`
      }
    }

    arrow.addEventListener(`click`, toggleList)

    hideList.addEventListener(`click`, toggleList)

    controller.addEventListener(`transitionend`, e => {
      controller.style.transition = `unset`
    })

    list.addEventListener(`transitionend`, e => {
      controller.style.transition = `unset`
    })

    randomize.addEventListener(`click`, () => {
      if (states.shuffled) {
        states.shuffled = false
        playList.changeSource(shared.playListBuf)
      } else {
        states.shuffled = true
        playList.changeSource(playList.getValues().shuffle())
      }

      //更新图标
      this.root.querySelectorAll(`.icon`).forEach(el => {
        el.innerHTML = icons[el.classList[1]]
      })
    })

    lastSong.addEventListener(`click`, playPreviousSong)

    play.addEventListener(`click`, () => {
      if (states.playing) {
        stopAudioSrc()
      } else {
        playBack()
      }
    })

    nextSong.addEventListener(`click`, playNextSong)

    timeLine.addEventListener(`mousedown`, (e) => {
      clearInterval(shared.timer)
    })

    timeLine.addEventListener(`input`, (e) => {
      //1000意思是range的最大值, range最小值是0
      timePassed.innerText = second2time(states.duration * (parseFloat(e.target.value) / 1000), states.fillFlag)
    })

    timeLine.addEventListener(`change`, (e) => {
      if (states.playing) {
        states.offset = states.duration * (parseFloat(e.target.value) / 1000)
        playBack()
      } else {
        states.offset = states.duration * (parseFloat(e.target.value) / 1000)
      }
    })

    // loudness.addEventListener(`input`, (e) => {
    //   states.gainVal = e.target.value
    // })

    //列表渲染
    function listEl(key, i, songKey) {
      const song = listSList.kGet(songKey)[0]
      const singleSongList = document.createElement(`aqua-single-song-list`)
      singleSongList.classList.add(`item`)
      singleSongList.states = {
        key: key,
        name: song.title,
        artist: song.artist,
        album: song.album,
        date: song.year,
        genre: song.genre,
        duration: second2time(Math.round(song.duration)),
        hoverColor: `white`,
        hoverBGColor: `#33333366`,
        hoverIconColor: `#6666`,
        nameColor: `white`,
        attributesColor: `#a5a5a5`
      }
      return singleSongList
    }

    this.addEventListener(`play`, e => {
      const currentList = Array.from(this.root.querySelectorAll(`.item`))
        .map(el => listSList.indexOfKey(el.states.key))
      playList.changeSource(currentList)
      const listIndex = listSList.indexOfKey(e.detail)
      states.playListPointer = playList.getValues().indexOf(listIndex)
      ebus.emit(`play this`, states.playListPointer)
    })

    this.addEventListener(`add`, e => {
      const pathOfSong = listSList.kGet(e.detail.key)[0].path
      shared.songsToAdd.push(pathOfSong)
      states.menuX = e.detail.coordinate[0] + 20 + `px`
      states.menuY = e.detail.coordinate[1] - 10 + `px`
      states.showAdd = true
    })

    playList.cast(`.list`, listEl, this.root)

    //图标渲染
    root.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML = icons[el.classList[1]]
    })

    //主题色同步
    this.root.querySelector(`#main`).style.setProperty(`--themeColor`, states.themeColor)
    storeStates.watch(`themeColor`, themeColor => {
      this.root.querySelector(`#main`).style.setProperty(`--themeColor`, themeColor)
    })

    //退出"正在播放"
    root.querySelector(`.back`).addEventListener(`click`, e => {
      states.RMainCurrentPlaying = `#main`
    })
  }
}
module.exports = AQUACurrentPlaying