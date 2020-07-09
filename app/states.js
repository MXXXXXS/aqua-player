const { Store, List } = require('./utils/ReactiveObj.js')
// const ebus = require('./utils/eBus.js')
const {
  sortByInitial,
  sortByKeyWord,
  sortByInitialAndKeyWord
} = require('./utils/sortWords.js')

// const shared = {
//   timer: '',
//   audioState: 0,
//   sortedData: {},
//   playListBuf: [],
//   songsToAdd: [],
//   /*********************排序与索引*******************/
//   names: [],
//   paths: [],
//   singers: [],
//   albums: [],
//   years: [],
//   indexesOfSingers: {},
//   indexesOfAlbums: {},
//   /**************************************************/
//   recentPlayed: []
// }

// const storeStates = new Store({
//   themeColor: 'rgb(113, 204, 192)',
//   duration: '',
//   offset: 0,
//   gainVal: 0.5,
//   sortReady: false,
//   sortFn: '',
//   currentDBVer: '',
//   sListLoaded: false,
//   playing: false,
//   currentSongFinished: true,
//   fillFlag: '',
//   formatedDuration: '',
//   timePassedText: '',
//   coverSrc: '',
//   playListPointer: 0,
//   name: '',
//   artist: '',
//   total: 0,
//   playMode: 'unset', //unset, singleCycle, listCycle, random
//   RSongsItems: 'AQUASongs', //AQUASongs, AQUASingers, AQUAAlbums
//   RMenuItems: 'aqua-list', //`aqua-list`, `aqua-settings`, `aqua-play-list`, `aqua-recent-played`
//   RMainCurrentPlaying: '#main',
//   filterSortBy: '',
//   filterType: '所有流派',
//   shuffled: false,
//   showAddPlayList: false,
//   showAdd: false,
//   menuX: 0,
//   menuY: 0,
//   playList: '',
//   currentPlayingSongPath: '',
//   genres: []
// })

// const listSList = new List([])

// const listSPath = new List([])

// //存放当前播放的歌曲的index(用于从listSList获取歌曲)
// const playList = new List([])

// const listNames = new List([])

// listSList.onModified(() => {
//   //清空索引
//   shared.paths = []
//   shared.names = []
//   shared.singers = []
//   shared.albums = []
//   shared.years = []
//   //清空每个歌手或专辑含有的歌曲
//   shared.indexesOfSingers = {}
//   shared.indexesOfAlbums = {}
//   if (listSList.list.length !== 0) {
//     const genres = ['所有流派']
//     listSList.list.forEach((item, i) => {
//       //刷新各个索引
//       shared.paths.push(item[0].path)
//       shared.names.push(item[0].title)
//       shared.singers.push(item[0].artist)
//       shared.albums.push(item[0].album)
//       shared.years.push(item[0].year)
//       //收集每个歌手或专辑含有的歌曲
//       if (!shared.indexesOfSingers[item[0].artist])
//         shared.indexesOfSingers[item[0].artist] = []
//       shared.indexesOfSingers[item[0].artist].push(i)
//       if (!shared.indexesOfAlbums[item[0].album])
//         shared.indexesOfAlbums[item[0].album] = []
//       shared.indexesOfAlbums[item[0].album].push(i)
//       //收集所有的流派
//       genres.push(item[0].genre)
//     })
//     storeStates.states.genres = Array.from(new Set(genres))
//     //更新排序信息
//     shared.sortedData.songsByAZ = sortByInitial(Array.from(shared.names.entries()))
//     shared.sortedData.songsByYear = sortByKeyWord(Array.from(shared.years.entries()))

//     const sortedSingers = sortByInitialAndKeyWord(Array.from(shared.singers.entries()))
//     shared.sortedData.songsBySingers = sortedSingers.byKeyWord
//     shared.sortedData.songsBySingersInitial = sortedSingers.byInitial

//     const sortedAlbums = sortByInitialAndKeyWord(Array.from(shared.albums.entries()))
//     shared.sortedData.songsByAlbums = sortedAlbums.byKeyWord
//     shared.sortedData.songsByAlbumsInitial = sortedAlbums.byInitial
//     //切换播放列表
//     playList.changeSource(listSList.getIndexes())
//     //检查当前的歌曲指针是否越界
//     if (storeStates.states.playListPointer >= playList.list.length) {
//       storeStates.states.playListPointer = playList.list.length - 1
//     } else if (storeStates.states.playListPointer < 0) {
//       storeStates.states.playListPointer = 0
//     }
//   } else {
//     playList.changeSource([])
//     storeStates.states.playListPointer = -1
//     storeStates.states.genres = []
//   }
//   ebus.emit('Sorting ready')
// })

// module.exports = { store, storeStates, listSList, listSPath, shared, playList, listNames }