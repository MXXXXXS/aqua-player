const icons = require(`./assets/icons.js`)

// setTimeout(()=> {
document.querySelectorAll(`.aqua`).forEach(el => {
  if (el.shadowRoot) {
    el.shadowRoot.querySelectorAll(`.icon`).forEach(el => {
      el.innerHTML += icons[el.classList[1]]
    })
  }
})
// }, 4000)
