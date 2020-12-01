# 写一个仿 groove 的音乐播放器

记录一下遇到的坑

- ES6 模块不可用, 必须 require
- index.html 的 js, require, src 等路径都需要设为相对路径, 是相对与该 html 文件的位置
- AudioBufferSourceNode 只能 start()一次, 要再次播放需要重新 createBufferSource 并设置 buffer, 并 connect, 然后 start 该 src
- AudioContext 的 currentTime is a read-only property
- AudioContext 建立以后 currentTime 是一直增长的, currentTime 应该视为一条增长的时间轴的当前长度
- AudioBufferSourceNode.start([when][, offset][, duration])的三个参数这么理解:
  - when 为该音乐素材加入时间轴的位置
  - offset 为在该时间轴上播放开始的位置
  - duration 就是播放的时长
- input[type="range"] 的拖动小按钮时改变其样式, 直觉的选择器是:

  _input[type="range"]::-webkit-slider-thumb:active_

  但这会有问题, 在单击轨道其他点(跳到某处)时按钮样式没有改变, 应该这么写选择器:

  _input[type="range"]:active::-webkit-slider-thumb_

- AudioBufferSourceNode 的 buffer 只能 set 一次, 否则会报错. 需要销毁或替换掉, 重新创建该节点
- indexDB 使用方式:

  - 首先需要创建一个 IDBOpenDBRequest , 通过 indexedDB.open(name, version) 创建
  - 在 IDBOpenDBRequest 上绑定事件, onsuccess, onerror, onupgradeneeded 为常用的几个事件函数
  - 当 indexedDB.open(name, version) 的 version 比当前数值大时会触发 onupgradeneeded 事件函数调用, 之后会触发 onsuccess 事件函数调用. 第一次 indexedDB.open(name, version) 时会因为没有该数据库导致触发一次 onupgradeneeded. 至于为什么 version 从 1 开始可能是因为没有该数据库时内部实现默认为 0.
  - 依照上述行为, 当想要创建多个 IDBObjectStore 时, 逻辑是: 先在 onupgradeneeded 中多次调用 DBOpenRequest.result.createObjectStore 来创建. 完成后, 在 onsuccess 可以获得创建了的 IDBObjectStore. 踩坑: 如果在外部获取 IDBObjectStore 则会因为 createObjectStore 事务正在进行而报错, 一定要依据事件来获得正确的顺序
  - IDBDatabase.createObjectStore 和 IDBDatabase.deleteObjectStore 都是同步的方法, 必须在 onupgradeneeded 内.
  - 当有版本变动需求时, 必须在 onupgradeneeded 事件函数内添加

        db.onversionchange = () => {
        DBOpenRequest.result.close()
        }

    以关闭当前版本, 可选则添加 DBOpenRequest.onblocked 事件函数, 以观测 block 事件

- 关于播放停止的问题, 依据 w3c 的描述, 总结一下
  - onended 事件, 对于所有的 AudioScheduledSourceNodes 在 stop() 所定义的 stop time 触发, 对于 AudioBufferSourceNode(继承自 AudioScheduledSourceNodes) 当达到 duration 时或整个 buffer 被播放后, 这个事件也会触发
  - buffer 没有 stopped 时, 多次调用 stop() 只会应用最后一次
  - buffer 已经 stopped 后, 后续 stop() 无效
  - 播放会自动停止, 当 buffer 的 audio data 已经被完全播放, 或达到 stop() 所设定的停止时间
  - css 变量若为空, 不应该放任其为 undefined, 会出现未知状况, 应该保持为空: ``
  - 可以通过 css 变量向 shadowdom 传递样式
  - window.customElements.define(name, constructor, { extends: baseLocalName }) 其中 extends 的 baseLocalName 不能为一个 custom element 或一个未知的元素
  - 在使用 constructor 构造 custom element 时, 若没有先 window.customElements.define 会报错: Uncaught TypeError: Illegal constructor
- 对于已挂载到 shadow dom 的 slot 元素, 通过改变其 name 属性来实现组件渲染切换有延迟, 几秒到几十秒不等
- custom elements 通过设置其 css, `display: block; width: inherit; height: inherit;`来适应其容器元素的大小

TODO

- [x] 解决声音播放的问题
- [x] 寻找一个合适的 audio 文件 metadata 分析库
- [x] 调试 electron 主进程和渲染进程
- [x] 学习 audio api 实现播放器功能
  - [x] 起始状态各按钮点击情况
  - [x] 播放暂停功能
  - [x] 时间轨控制播放
  - [x] 音量调节
  - [x] 列表选歌播放
  - [x] 切换歌曲
  - [x] 按钮加入防抖, 加载动作设置了锁, 防止多次加载
  - [x] 记忆上一次关闭时的播放歌曲
  - [x] 将所有播放逻辑集中到 player.js, 分离 UI
    - [x] 基本播放暂停功能
    - [x] 前后切换歌曲(防止快速点击导致中间的几首歌被跳过)
- [x] data-view 双向绑定
  - [x] proxy 实现单向数据同步, 数据变动引起绑定的所有对象 key 的 value 更新
  - [x] view 通过事件通知改变对应数据
  - [x] 数组渲染
    - [x] 数组方法劫持
    - [x] 视图同步
- [x] 状态管理, 事件驱动, 管理所有的数据变动
- [x] 列表渲染实现
- [x] 路由功能
  - [x] 切换显示(通过 css "display" 切换)
  - [x] 自定义元素选择性挂载
- [ ] 写完所有 groove 的组件
  - [x] 底部播放控制器
  - [x] 左侧栏
  - [x] 我的音乐
    - [x] 歌曲列表
      - [x] 重名歌曲播放问题
      - [x] 高亮正在播放的歌曲
      - [x] 不同状态颜色样式变化
      - [ ] js 监视组件大小以响应式隐藏显示信息, 而非通过 css 媒体查询整个屏幕的尺寸, 因为 css 无法实现对某个元素的大小检测. 基于对组件本身的尺寸进行响应式调整更为准确
    - [x] 歌手列表
    - [x] 排序功能实现
    - [x] 排序结果缓存
    - [x] 各个列表的分类排序
    - [x] 专辑列表
    - [x] 封面显示
  - [ ] 设置
    - [x] 已收藏文件夹功能
    - [x] 已收藏文件夹列表增删
    - [x] 已收藏文件夹歌曲列表更新(检查文件夹内音乐新增, 删除)
    - [ ] 均衡器
    - [ ] 亮暗主题切换
  - [ ] 正在播放列表
    - [x] 基础结构
    - [x] 背景虚化
    - [x] 按钮功能
    - [x] 收起列表
    - [x] 全屏
    - [x] 随机播放
    - [x] 上下文同步
    - [ ] 音量调节
    - [ ] 最小化
  - [ ] 专辑列表
    - [x] 列表加载
    - [x] 加入歌曲
    - [x] 全部播放
    - [x] 删除歌曲
    - [x] 全部删除
    - [x] 封面加载
    - [x] 封面主题色提取显示
    - [x] 自定义排序
    - [ ] 重命名
    - [x] 歌曲失效检查
  - [ ] 播放列表
    - [x] 元素渲染
    - [x] 排序
    - [x] 歌曲失效检查
    - [x] 点击播放某个播放列表
    - [x] 点击添加到某个播放列表
    - [x] 跳转到某个播放列表
    - [ ] 添加新的播放列表
  - [ ] 最近播放的内容
    - [x] 元素渲染
    - [ ] 随机播放所有音乐
- [x] 主题色切换
- [x] 专辑封面主题色提取
- [x] 优化 svg 的像素级显示
- [ ] 某专辑歌曲播放页
- [ ] 某歌手歌曲播放页
- [ ] 每次都加载整个文件后才播放, 占内存, 耗时. 使用 ffmpeg 产生分块数据以即时播放(流式传输)
- [ ] 全部整合成最终的 app

BUG 修复

- [x] 严重的内存泄漏, 每次切换歌时都大幅增加内存占用
  - 原因: 泄露是因为 getSongSrc 闭包中创建的 AudioBufferSourceNode, 导致每次切歌增加内存占用
- [x] 全局事件总线 ebus 不断增加 listeners
  - 每次挂载组件后都新增一个, 忘了在组件卸载时删除相应的事件 listener
- [x] store.js 的 changeSource 未完成, 导致 settings 增删文件夹面板视图没有同步
- [x] 相同文件夹重复载入, 视图有多个相同的文件夹
- [x] 在播放时, 操作文件夹增删, 再次点歌播放会报错
  - 修复方法: 当前音乐未播放完毕时, 不加载新的歌曲源, 通过 currentSongFinished 控制
- [x] 第一次启动时, songsPaths 不存在, 但又触发了 upgradeneeded, 导致报错
  - 修复方法: 判断 songsPaths 是否存在, 以选择是否执行后续逻辑
- [x] 第一次启动后, 第一次添加文件夹报错
  - 修复方法: shared.keyItemBuf 是变化的, 不能赋值为一个常量
- [x] 数组同步视图, cast 方法添加监听器有内存泄露问题
  - 修复方法: 组件移除时清除监听器, 添加了 removeCasted 方法
- [ ] meta-data 模块只能读取 utf8 编码的信息, 其他编码会导致乱码
- [ ] meta-data 模块可能存在读取年份错误的问题, 也有可能是元数据本身有错误
- [x] pinyin 模块排序会把所有字符转为小写, 而 genre=R&B 包含大写字母, 所以统一把 genre 转为大写字母
- [x] storeStates.add() 某个属性注册多个同步值, 只有第一个同步值生效
  - 修复方法: 代码有疏漏, 已经修改
- [x] 歌曲信息若带有 html 符号会被渲染, 导致 UI 错误
  - 修复方法: 转义 html
- [x] List 的 splice 方法没有更新 length 属性
  - 修复方法: 修改了 proxy set handler 的 condition
- [x] List 的 changeSource 方法对比新旧数组是否相同存在误判, 导致没有更新. 具体表现为: 若新数组为旧数组去掉最后几项所得, 则不会得出两个数组相异的判断
  - 修复方法: 修改了比较数组元素的逻辑
- [ ] 整个应用疯狂泄露内存, 需要逐个修复
  - [x] Store 的 binded 添加了 unwatch, unwatchAll 用来清空绑定的监视函数
  - [x] 调用 List 的 removeOnModified 来清空不再用的监听函数
- [x] 对于已挂载到 shadow dom 的 slot 元素, 通过改变其 name 属性来实现组件渲染切换有延迟, 几秒到几十秒不等
  - 修复方法: 删除已挂载的 slot, 创建新的 slot 并设置 name, 再挂载到 dom 上可以立即更新, 延迟原因未知, 应该是浏览器内部渲染的机制导致

预览

![Alt preview](assets/sample0.jpg)

![Alt preview](assets/sample1.jpg)

![Alt preview](assets/sample2.jpg)
