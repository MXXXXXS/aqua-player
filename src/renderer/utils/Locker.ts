class Lock {
  private ids: Record<number | string, boolean>
  private id: number
  constructor() {
    this.id = 0
    this.ids = {}
  }
  lock(id: number | string): boolean {
    if (this.ids[id]) {
      return false
    }
    this.ids[id] = true
    return true
  }
  unlock(id: number | string): void {
    this.ids[id] = false
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addLock<T extends (...args: any[]) => any>(
    fn: (unlock: () => void, ...args: Parameters<T>) => ReturnType<T>
  ): (...args: Parameters<T>) => ReturnType<T> | undefined {
    const id = this.id
    this.id++
    const unlock = () => {
      this.unlock(id)
    }
    const isLocked = () => this.lock(id)
    return (...args: Parameters<T>) => {
      if (isLocked()) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return fn(unlock, ...args)
      }
    }
  }
}

const locker = new Lock()

export const addLock = locker.addLock.bind(locker)

export default Lock
