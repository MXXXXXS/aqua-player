enum Path {
  leftUp,
  left,
  up,
  none,
}

export enum Operation {
  sub = 'sub',
  add = 'add',
  del = 'del',
  none = 'none',
}

export interface Modification {
  operation: Operation
  position: number
  content: string
}

interface distanceMatrixEl {
  len: number
  path: Path
}

type DistanceMatrix = Array<Array<distanceMatrixEl>>

function minDistance(
  text1: Array<string>,
  text2: Array<string>
): DistanceMatrix {
  const distanceMatrix: DistanceMatrix = []

  for (let indexA = 0; indexA <= text1.length; indexA++) {
    if (indexA === 0) {
      const arr = new Array(text2.length + 1)

      for (let indexB = 0; indexB < arr.length; indexB++) {
        arr[indexB] = {
          len: indexB,
          path: Path.left,
        }
      }
      distanceMatrix.push(arr)
    } else {
      distanceMatrix.push(
        new Array(text2.length + 1).fill(
          {
            len: indexA,
            path: Path.up,
          },
          0,
          1
        )
      )
    }
  }

  function min<T>(
    arr: Array<Array<T>>,
    indexR: number,
    indexC: number,
    withDiff: boolean,
    getter: (_: T) => number
  ): distanceMatrixEl {
    const leftUp = getter(arr[indexR - 1][indexC - 1]) + (withDiff ? 0 : 1)
    const up = getter(arr[indexR - 1][indexC]) + 1
    const left = getter(arr[indexR][indexC - 1]) + 1

    const result = {
      len: 0,
      path: Path.leftUp,
    }

    result.len = Math.min(left, up, leftUp)
    result.path = [leftUp, left, up].indexOf(result.len)

    return result
  }

  function getLen(el: distanceMatrixEl) {
    return el.len
  }

  function distance(strA: Array<string>, strB: Array<string>) {
    for (let indexA = 1; indexA <= strA.length; indexA++) {
      const wordA = strA[indexA - 1]
      for (let indexB = 1; indexB <= strB.length; indexB++) {
        const wordB = strB[indexB - 1]
        distanceMatrix[indexA][indexB] = min(
          distanceMatrix,
          indexA,
          indexB,
          wordA === wordB,
          getLen
        )
      }
    }
  }

  distance(text1, text2)

  return distanceMatrix
}

export function getOps(
  text1: Array<string>,
  text2: Array<string>
): Modification[] {
  const distanceMatrix = minDistance(text1, text2)

  const ops: Array<Modification> = []

  function genOperation(indexA: number, indexB: number) {
    if (indexA === 0 && indexB === 0) return
    const path = distanceMatrix[indexA][indexB].path
    if (path === Path.leftUp) {
      if (
        distanceMatrix[indexA][indexB].len ===
        distanceMatrix[indexA - 1][indexB - 1].len
      ) {
        ops.push({
          operation: Operation.none,
          position: indexA - 1,
          content: '',
        })
      } else {
        ops.push({
          operation: Operation.sub,
          position: indexA - 1,
          content: text2[indexB - 1],
        })
      }
      genOperation(indexA - 1, indexB - 1)
    } else if (path === Path.left) {
      ops.push({
        operation: Operation.add,
        position: indexA - 1,
        content: text2[indexB - 1],
      })
      genOperation(indexA, indexB - 1)
    } else {
      ops.push({
        operation: Operation.del,
        position: indexA - 1,
        content: text1[indexA - 1],
      })
      genOperation(indexA - 1, indexB)
    }
  }

  genOperation(text1.length, text2.length)

  return ops
}

export function modify<T>(
  listA: Array<T>,
  listB: Array<T>,
  getKey: (item: T) => string,
  {
    sub,
    add,
    del,
    init,
  }: {
    sub: (op: Modification) => void
    add: (op: Modification) => void
    del: (op: Modification) => void
    init: (op: Modification) => void
  }
): void {
  const keysA = listA.map((item) => getKey(item))
  const keysB = listB.map((item) => getKey(item))

  const ops = getOps(keysA, keysB)

  ops.forEach((op) => {
    if (op.position !== -1) {
      switch (op.operation) {
        case Operation.sub: {
          sub(op)
          break
        }
        case Operation.add: {
          add(op)
          break
        }
        case Operation.del: {
          del(op)
          break
        }
      }
    } else {
      init(op)
    }
  })
}

export default minDistance
