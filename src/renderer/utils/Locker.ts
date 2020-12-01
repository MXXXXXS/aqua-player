class Locker {
  private ids: Record<string, boolean>
  constructor() {
    this.ids = {}
  }
  lock(id: string): boolean {
    if (this.ids[id]) {
      return false
    }
    this.ids[id] = true
    return true
  }
  unlock(id: string): void {
    this.ids[id] = false
  }
}

const locker = new Locker()

export function lock(id: string): boolean {
  return locker.lock(id)
}
export function unlock(id: string): void {
  return locker.unlock(id)
}

export default Locker
