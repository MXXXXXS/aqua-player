// eslint-disable-next-line @typescript-eslint/ban-types
export default function isAsync(fn: Function): boolean {
  return fn.constructor.name === 'AsyncFunction'
}
