import icons from './icons.js'

document.querySelectorAll(`.icon`).forEach(el => {
  el.innerHTML += icons[el.classList[1]]
})