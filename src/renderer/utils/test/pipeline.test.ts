import runPipeline, { Pipe } from '../pipeline'

const initial = 0

const pipeline = [
  (data: number, next: Pipe) => {
    test('初始值为0', () => {
      expect(data).toEqual(0)
    })
    next(data + 1)
  },
  (data: number, next: Pipe) => {
    test('0+1', () => {
      expect(data).toEqual(1)
    })
    next(data + 2)
  },
  (data: number, next: Pipe) => {
    test('1+2', () => {
      expect(data).toEqual(3)
    })
    next(data + 3)
  },
  (data: number) => {
    test('3+3', () => {
      expect(data).toEqual(6)
    })
  },
]

runPipeline(initial, pipeline as Array<Pipe>)
