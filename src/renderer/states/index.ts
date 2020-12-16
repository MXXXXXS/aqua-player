import Aqua from 'r/fundamental/aqua'
export * from './ipc'
export * from './layers'
export * from './musicLists'
export * from './playingControl'
export * from './slots'
export * from './subWindows'
export * from './themeStyle'
export * from './router'
export * from './variables'

export interface States {
  [stateName: string]: Aqua<unknown>
}

// export const searchText = new Aqua<string>({
//   data: '',
//   acts: {
//     input(text: string) {
//       return text
//     },
//     // search() {}
//   },
// })
