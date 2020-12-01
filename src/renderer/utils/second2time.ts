export function second2time(sec: number, fillFlag = ''): string {
  if (sec < 0) return ''
  sec = Math.round(sec)
  const hour = Math.floor(sec / 3600)
  const minute = Math.floor((sec - 3600 * hour) / 60)
  const second = sec - hour * 3600 - minute * 60
  switch (fillFlag) {
    case 'h+':
      return `${fill(hour)}:${fill(minute)}:${fill(second)}`
    case 'h':
      return `${hour}:${fill(minute)}:${fill(second)}`
    case 'm+':
      return `${fill(minute)}:${fill(second)}`
    case 'm':
      return `${minute}:${fill(second)}`
    case 's+':
      return `${fill(second)}`
    case 's':
      return `${second}`
  }
  if (hour > 0) {
    return `${hour}:${fill(minute)}:${fill(second)}`
  } else if (minute > 0) {
    return `${minute}:${fill(second)}`
  } else {
    return `0:${fill(second)}`
  }
}

export function time2second(time: string): number {
  const buf = time.split(':')
  switch (buf.length) {
    case 2:
      return Number(buf[0]) * 60 + Number(buf[1])
    case 3:
      return Number(buf[0]) * 3600 + Number(buf[1]) * 60 + Number(buf[2])
  }
  return Number(time)
}

function fill(val: number) {
  if (Number(val) < 10) return '0' + String(val)
  return String(val)
}
