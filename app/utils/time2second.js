module.exports = time2second
function time2second(time) {
  const buf = time.split(`:`)
  switch (buf.length) {
    case 2:
      return Number(buf[0]) * 60 + Number(buf[1])
    case 3:
      return Number(buf[0]) * 3600 + Number(buf[1]) * 60 + Number(buf[2])
  }
}

function test() {
  const arr = [
    `0:00`,
    `0:12`,
    `2:04`,
    `10:42`,
    `1:10:11`,
    `3:56:51`,
    `45:36:51`,
    `445:36:51`
  ]
  arr.forEach(time => {
    console.log(time2second(time))
  })
}

// test()