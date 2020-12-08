/* eslint-disable @typescript-eslint/no-non-null-assertion */
export type Path = Array<number>

export function genPath(root: Node, target: Node): Path {
  const path: Path = []
  if (target === root) {
    return path
  }
  let nextEl = target
  let index = 0
  function traverse(el: Node) {
    while (el.previousSibling) {
      el = el.previousSibling
      index++
    }
    path.unshift(index)
    index = 0
    return el.parentNode
  }
  do {
    nextEl = traverse(nextEl) as Node
  } while (nextEl && nextEl !== root)
  return path
}

export function getNode(root: Node, path: Path): Node {
  const pathCopy = [...path]
  let index
  let nextEl = root
  while ((index = pathCopy.shift()) !== undefined) {
    let child = nextEl.firstChild
    while (index > 0) {
      child = child!.nextSibling
      index--
    }
    nextEl = child!
  }
  return nextEl
}
