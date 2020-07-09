module.exports = {second2time, time2second}
function second2time(sec, fillFlag = false) {
  if (sec < 0)
    return
  sec = Math.round(sec)
  let hour = Math.floor(sec / 3600)
  let minute = Math.floor((sec - 3600 * hour) / 60)
  let second = sec - hour * 3600 - minute * 60
  if (fillFlag) {
    switch (fillFlag) {
      case `h+`:
        return `${fill(hour)}:${fill(minute)}:${fill(second)}`
      case `h`:
        return `${hour}:${fill(minute)}:${fill(second)}`
      case `m+`:
        return `${fill(minute)}:${fill(second)}`
      case `m`:
        return `${minute}:${fill(second)}`
      case `s+`:
        return `${fill(second)}`
      case `s`:
        return `${second}`
    }
  } else {
    if (hour > 0) {
      return `${hour}:${fill(minute)}:${fill(second)}`
    } else if (minute > 0) {
      return `${minute}:${fill(second)}`
    } else {
      return `0:${fill(second)}`
    }
  }
}

function time2second(time) {
  const buf = time.split(`:`)
  switch (buf.length) {
    case 2:
      return Number(buf[0]) * 60 + Number(buf[1])
    case 3:
      return Number(buf[0]) * 3600 + Number(buf[1]) * 60 + Number(buf[2])
  }
}

function fill(val) {
  if (Number(val) < 10)
    return `0` + String(val)
  return String(val)
}

function test1() {
  console.log(second2time(-10))
  console.log(second2time(0))
  console.log(second2time(12))
  console.log(second2time(124))
  console.log(second2time(642))
  console.log(second2time(4211))
  console.log(second2time(14211))
  console.log(second2time(164211))
  console.log(second2time(1604211))
}

function test2() {
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

// test1()
// test2()