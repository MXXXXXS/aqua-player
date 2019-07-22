// window.onload = () => {
//   const menu = sel(`aqua-menu`).shadowRoot
//   menu.querySelector(`#switch`).addEventListener(`click`, () => {
//     console.log(`clicked`)
//     const style = document.createElement(`style`)
//     style.textContent = 
//     `div[tabindex="-1"]>div:last-child {
//       display: none;
//     }

//     .sideBar {
//       width: 50px;
//     }

//     #line0 {
//       display: none;
//     }

//     #line1 {
//       outline: none;
//       flex: 1;
//     }

//     .albums,
//     #search input,
//     #search .cross {
//       display: none;
//     }

//     #search .search:hover {
//       background-color: rgba(0, 0, 0, 0.1);
//       color: black;
//     }

//     #search .search {
//       width: 50px;
//       height: 50px;
//       background-color: inherit;
//     }

//     #playList {
//       flex-direction: column;
//     }`
//     menu.appendChild(style)
//   })
// }
// function sel(selector0, selector1) {
//   if (arguments.length === 1) {
//     return document.querySelector(selector0)
//   } else if (arguments.length === 2) {
//     return document.querySelector(selector0).shadowRoot.querySelector(selector1)
//   }
// }