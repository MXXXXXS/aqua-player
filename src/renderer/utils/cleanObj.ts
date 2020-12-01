/* eslint-disable */
export default (obj: any): any => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      delete obj[key]
    }
  }
  return obj
}
