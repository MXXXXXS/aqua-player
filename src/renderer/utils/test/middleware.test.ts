import execMiddlewares, { Middleware } from '../middleware'

const initial = 0

const middlewares = [
  (data: number, next: Middleware) => {
    test('初始值为0', () => {
      expect(data).toEqual(0)
    })
    next(data + 1)
  },
  (data: number, next: Middleware) => {
    test('0+1', () => {
      expect(data).toEqual(1)
    })
    next(data + 2)
  },
  (data: number, next: Middleware) => {
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

execMiddlewares(initial, middlewares as Array<Middleware>)
