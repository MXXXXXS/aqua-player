module.exports = second2time
function second2time(sec, fillFlag = false) {
  if (sec < 0)
    return
  const hour = Math.floor(sec / 3600)
  const minute = Math.floor((sec - 3600 * hour) / 60)
  const second = Math.round(sec % 60)
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

function fill(val) {
  if (Number(val) < 10)
    return `0` + String(val)
  return String(val)
}

function test() {
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

// test()