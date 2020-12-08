import * as fs from 'fs'
import { forEach, isArray, cloneDeepWith } from 'lodash'
import { genPath, getNode, Path } from 'ru/nodePath'

type Result = ReturnType<typeof importTemplate>

type ResultBuffer = Record<string, Result>

const resultBuffer: ResultBuffer = {}

interface NodeWithPath extends Node {
  _path: Path
}

function markNode(rootEl: Node | null, node: Node) {
  if (rootEl) {
    const path = genPath(rootEl, node)
    ;((node as unknown) as NodeWithPath)._path = path
  }
}

function cloneResult(result: Result): Result {
  const { template, ...restObj } = result
  const newTemplate = template.cloneNode(true) as HTMLTemplateElement
  const rootEl = newTemplate.content.querySelector('#root')

  return {
    template: newTemplate,
    ...(cloneDeepWith(restObj, (value) => {
      if (value instanceof Node && rootEl) {
        return getNode(rootEl, (value as NodeWithPath)._path)
      }
    }) as typeof restObj),
  }
}

const textRe = (): RegExp => /\[([$#]?)(\w+)\]/g

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

/**
 *
 * @param pathOrHTML
 * 有三种形式
 *
 * 一个ts文件路径, 读取相同目录下同名的html文件
 *
 * 一个html文件路径, 读取该路径所指向的html文件
 *
 * 一段html文本, 直接传给innerHTML
 *
 * 如果缺省, 默认设为"\<div id="root">\</div>"
 */
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
  if (resultBuffer[pathOrHTML]) {
    return cloneResult(resultBuffer[pathOrHTML])
  }

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

  // innerHTML赋值
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
    template.innerHTML = filterCssVarMarks(pathOrHTML)
  }

  const renderTexts: BoundEls = []
  const classList: BoundEls = []
  const styleList: BoundEls = []
  const attrs: BoundEls = []
  const handlers: handlers = {}

  const rootEl = template.content.querySelector('#root')
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
            markNode(rootEl, childNode)
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
          let needMark = false
          // class绑定解析
          // 比如: :class="highlight, #color, $isActive"
          if (classMark.exec(attrName)) {
            needMark = true
            const rawAttrParts = splitAttribute(attrValue)
            classList.push([rawAttrParts, 'className', el])
          }
          // style绑定解析
          // 比如: :style="styleA, #styleB, $styleC"
          if (styleMark.exec(attrName)) {
            needMark = true
            const rawAttrParts = splitAttribute(attrValue)
            styleList.push([rawAttrParts, 'style', el])
          }
          // 其他属性值占位解析
          // 比如: value="[#valueA] + [$valueB] = [valueC]"
          if (textRe().test(attrValue)) {
            needMark = true
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
              needMark = true
              const handlerNames = attrValue
                .split(',')
                .map((handlerName) => handlerName.trim())
              handlers[evtName].push([handlerNames, el])
            }
          }

          if (needMark) {
            markNode(rootEl, el)
          }
        }
      })
    }
  )

  const result = {
    template,
    renderTexts,
    attrs,
    handlers,
    cssVariables,
    classList,
    styleList,
  }

  resultBuffer[pathOrHTML] = result

  return cloneResult(result)
}
