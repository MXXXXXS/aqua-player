import Aqua from 'r/fundamental/aqua'

// const hoverFontColor = new Aqua({
//   data: 'gray',
//   acts: {
//     log: [
//       function (data) {
//         //console.log('现在hoverFontColor为: ', data)
//       }
//     ]
//   }
// })

// const fontColor = new Aqua({
//   data: 'black',
//   acts: {
//     log: [
//       function (data) {
//         //console.log('现在fontColor为: ', data)
//       }
//     ]
//   }
// })

export const color = new Aqua({
  data: 'rgb(113, 204, 192)',
  reacts: [
    function ({ newData: data }) {
      //console.log('现在主题色color为: ', data)
    },
  ],
})

export const bgColor = new Aqua({
  data: '#f2f2f2',
  reacts: [
    ({ newData }) => {
      console.log('现在hoverBgColor为: ', newData)
    },
  ],
})

export const hoverBgColor = new Aqua({
  data: '#dfdfdf',
  reacts: [
    ({ newData }) => {
      console.log('现在hoverBgColor为: ', newData)
    },
  ],
})
