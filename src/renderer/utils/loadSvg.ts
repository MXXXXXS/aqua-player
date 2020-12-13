import * as fs from 'fs'
import { join } from 'path'
const iconDir = join(__dirname, '../assets/icons')
const rmStyle = (svg: string) => {
  return svg.replace(/style=".*?"/g, '')
}

export const svgElBuffer: Record<string, Node> = {}

export default (icon: string): HTMLElement | undefined => {
  const iconPath = join(iconDir, `${icon}.svg`)
  if (svgElBuffer[iconPath]) {
    return svgElBuffer[iconPath].cloneNode(true) as HTMLElement
  }
  try {
    const iconSVG = fs.readFileSync(iconPath, {
      encoding: 'utf8',
    })
    const svg = rmStyle(iconSVG)
    const template = document.createElement('template')
    template.innerHTML = svg
    svgElBuffer[iconPath] = template.content
    return svgElBuffer[iconPath].cloneNode(true) as HTMLElement
  } catch (error) {
    console.error(`图标"${icon}"svg文件读取失败:\n$`, error)
  }
}
