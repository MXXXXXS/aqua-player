# 记录一下遇到的坑

- ES6模块不可用, 必须require
- index.html的js, require, src等路径都需要设为相对路径, 是相对与该html文件的位置
- AudioBufferSourceNode只能start()一次, 要再次播放需要重新createBufferSource并设置buffer, 并connect, 然后start该src
- AudioContext的currentTime is a read-only property
- AudioContext建立以后 currentTime 是一直增长的, currentTime应该视为一条增长的时间轴的当前长度
- AudioBufferSourceNode.start([when][, offset][, duration])的三个参数这么理解:
  - when 为该音乐素材加入时间轴的位置
  - offset 为在该时间轴上播放开始的位置
  - duration 就是播放的时长
- input[type="range"] 的拖动小按钮时改变其样式, 直觉的选择器是:

  *input[type="range"]::-webkit-slider-thumb:active*

  但这会有问题, 在单击轨道其他点(跳到某处)时按钮样式没有改变, 应该这么写选择器:
  
  *input[type="range"]:active::-webkit-slider-thumb*

TODO

- [x] 解决声音播放的问题
- [x] 寻找一个合适的audio文件metadata分析库
- [x] 调试electron主进程和渲染进程
- [ ] 学习audio api实现播放器功能
  - [x] 播放暂停功能
  - [x] 时间轨控制播放
  - [x] 音量调节
- [ ] data-view双向绑定
  - [x] proxy实现单向数据同步, 数据变动引起绑定的所有对象key的value更新
- [ ] 状态管理, 事件驱动, 管理所有的数据变动
- [ ] 列表渲染实现
- [ ] 写完所有groove的组件
- [ ] 全部整合成最终的app
