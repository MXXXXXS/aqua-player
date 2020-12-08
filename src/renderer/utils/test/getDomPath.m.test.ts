import { genPath, getNode } from '../nodePath'

const rootEl = document.querySelector<Element>('#root')
if (rootEl) {
  const elList = Array.from(
    document.querySelector('body')!.querySelectorAll('*')
  )
  elList.forEach((el) => {
    const nodeList = Array.from(el.childNodes)
    nodeList.forEach((node) => {
      switch (true) {
        case /textNode-1/.test(node.nodeValue || ''): {
          logNode(rootEl, node)
          break
        }
        case /textNode0/.test(node.nodeValue || ''): {
          logNode(rootEl, node)
          break
        }
        case /textNode1/.test(node.nodeValue || ''): {
          logNode(rootEl, node)
          break
        }
        case /textNode2/.test(node.nodeValue || ''): {
          logNode(rootEl, node)
          break
        }
        case /textNode3/.test(node.nodeValue || ''): {
          logNode(rootEl, node)
          break
        }
        case /H3/.test((node as HTMLHeadingElement).tagName || ''): {
          logNode(rootEl, node)
          break
        }
      }
    })
  })
}

function logNode(rootEl: Node, node: Node) {
  const path = genPath(rootEl, node)
  console.log(path)
  const textEl = getNode(rootEl, path)
  console.log(textEl.nodeValue, (textEl as Element).tagName)
  console.log('是同一个node', node === textEl)
}
