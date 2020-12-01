import * as fs from 'fs'
import { join } from 'path'
const iconDir = join(__dirname, '../assets/icons')
const rmStyle = (svg: string) => {
  return svg.replace(/style=".*?"/g, '')
}

export default (icon: string): string | undefined => {
  const iconPath = join(iconDir, `${icon}.svg`)
  try {
    const iconSVG = fs.readFileSync(iconPath, {
      encoding: 'utf8',
    })
    return rmStyle(iconSVG)
  } catch (error) {
    console.error(`图标"${icon}"svg文件读取失败:\n$`, error)
  }
}
