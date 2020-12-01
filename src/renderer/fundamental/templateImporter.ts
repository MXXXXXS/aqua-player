import * as fs from 'fs'
import { forEach, isArray } from 'lodash'

export const textRe = (): RegExp => /\[([$#]?)(\w+)\]/g

function splitAttribute(text: string) {
  const attrParts: Array<BoundMark> = []
  text.split(',').map((part) => {
    const trimmed = part.trim()
    switch (trimmed[0]) {
      case '$': {
        attrParts.push(['$', trimmed.slice(1)])

        break
      }
      case '#': {
        attrParts.push(['#', trimmed.slice(1)])
        break
      }
      default: {
        attrParts.push(['', trimmed])
        break
      }
    }
  })
  return attrParts
}

function splitRawText(text: string): Array<string | BoundMark> {
  const rawTextParts = []
  let result
  let lastEnd = 0
  const reg = textRe()
  result = reg.exec(text)
  while (result) {
    const start = result.index
    rawTextParts.push(text.slice(lastEnd, start))
    const insertType = result[1]
    const name = result[2]
    rawTextParts.push([insertType, name] as BoundMark)
    lastEnd = start + result[0].length
    result = reg.exec(text)
  }
  rawTextParts.push(text.slice(lastEnd))
  return rawTextParts
}
// 作为绑定的key前缀, 用于区分绑定位置
// [textA], 对应局部非响应式的vars[textA]
// [$textB], 对应局部响应式的props[textB], 如果有对应的computed值, 则使用computed值
// [#textC], 对应全局的states[textC], 如果有对应的computed值, 则使用computed值
export type BoundType = '' | '$' | '#'

export type BoundMark = [type: BoundType, name: string]

export type BoundEl = [
  mark: Array<string | BoundMark>,
  propName: string,
  el: Node
]

export type BoundEls = Array<BoundEl>

interface cssVariables {
  [name: string]: Array<[boundType: BoundType, cssVarName: string]>
}

interface handlers {
  [evtName: string]: Array<[handlerNames: Array<string>, el: HTMLElement]>
}

const cssVarMark = /--(\w*)\s*:\s*\[([$#]?)(\w*)\];/g

export default function importTemplate(
  pathOrHTML = '<div id="root"></div>'
): {
  template: HTMLTemplateElement
  renderTexts: BoundEls
  attrs: BoundEls
  handlers: handlers
  cssVariables: cssVariables
  classList: BoundEls
  styleList: BoundEls
} {
  // 读取HTML模板
  // pathOrHTML有三种形式
  // (1) 是一个ts文件路径, 则读取相同路径下(除了后缀不同)的html文件
  // (2) 是一个html文件路径, 则读取该路径所指向的html文件
  // (3) 是一段html文本, 则直接传给innerHTML
  // 如果缺省, 默认设为"<div id="root"></div>"
  let tempHTMLText = ''

  const template = document.createElement('template')
  const cssVariables: cssVariables = {}

  // css variable绑定解析
  // 比如: "--color = [#color]"
  function filterCssVarMarks(html: string): string {
    return html.replace(
      cssVarMark,
      (matched, cssVarName: string, insertType: string, insertName: string) => {
        switch (insertType) {
          case '':
          case '$':
          case '#': {
            if (!isArray(cssVariables[insertName])) {
              cssVariables[insertName] = []
            }
            cssVariables[insertName].push([insertType, cssVarName])
            break
          }
        }
        return ''
      }
    )
  }

  if (fs.existsSync(pathOrHTML)) {
    let htmlFilePath = ''
    if (/\.ts$/.test(pathOrHTML)) {
      htmlFilePath = pathOrHTML.replace('.ts', '.html')
    } else if (/\.html?$/.test(pathOrHTML)) {
      htmlFilePath = pathOrHTML
    } else {
      htmlFilePath = pathOrHTML + '/index.html'
    }
    tempHTMLText = fs.readFileSync(htmlFilePath, {
      encoding: 'utf8',
    })
    // 在传给innerHTML之前处理css variables占位符
    template.innerHTML = filterCssVarMarks(tempHTMLText)
  } else {
    template.innerHTML = pathOrHTML
  }

  const renderTexts: BoundEls = []
  const classList: BoundEls = []
  const styleList: BoundEls = []
  const attrs: BoundEls = []
  const handlers: handlers = {}

  Array.from<HTMLElement>(template.content.querySelectorAll('*')).forEach(
    (el) => {
      // 文本占位解析
      // 比如: "[textA] is a [$textB] [#textC]"
      const childNodes = el.childNodes
      forEach(childNodes, (childNode) => {
        if (childNode.nodeType == 3) {
          const nodeValue = childNode.nodeValue
          if (nodeValue && textRe().test(nodeValue)) {
            const rawTextParts = splitRawText(nodeValue)
            renderTexts.push([rawTextParts, 'nodeValue', childNode])
          }
        }
      })

      const attributeNames = el.getAttributeNames()
      const classMark = /:class/
      const styleMark = /:style/

      const evtMark = /:(\w+)/

      attributeNames.forEach((attrName) => {
        const attrValue = el.getAttribute(attrName)
        if (attrValue) {
          // class绑定解析
          // 比如: :class="highlight, #color, $isActive"
          if (classMark.exec(attrName)) {
            const rawAttrParts = splitAttribute(attrValue)
            classList.push([rawAttrParts, 'className', el])
          }
          // style绑定解析
          // 比如: :style="styleA, #styleB, $styleC"
          if (styleMark.exec(attrName)) {
            const rawAttrParts = splitAttribute(attrValue)
            styleList.push([rawAttrParts, 'style', el])
          }
          // 其他属性值占位解析
          // 比如: value="[#valueA] + [$valueB] = [valueC]"
          if (textRe().test(attrValue)) {
            const rawAttrValueParts = splitRawText(attrValue)
            attrs.push([rawAttrValueParts, attrName, el])
          }
          // 事件处理函数绑定解析
          // 比如: ":click=highlight, requestA"
          // 标识符":", 事件名"click", 对应的事件处理函数"highlight", "requestA"
          // 事件处理函数可以有多个, 使用","分隔
          const result = evtMark.exec(attrName)
          if (result) {
            const attrName = result[0]
            const evtName = result[1]
            if (!isArray(handlers[evtName])) {
              handlers[evtName] = []
            }
            const attrValue = el.getAttribute(attrName)
            if (attrValue) {
              const handlerNames = attrValue
                .split(',')
                .map((handlerName) => handlerName.trim())
              handlers[evtName].push([handlerNames, el])
            }
          }
        }
      })
    }
  )

  return {
    template,
    renderTexts,
    attrs,
    handlers,
    cssVariables,
    classList,
    styleList,
  }
}
