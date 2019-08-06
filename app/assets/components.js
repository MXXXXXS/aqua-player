module.exports = {"addPlayList":"<div class=\"main\">\r\n  <div class=\"icon playList cover\">\r\n\r\n  </div>\r\n  <div class=\"item\" id=\"setName\">\r\n    <input type=\"text\" placeholder=\"命名此播放列表\">\r\n    <div class=\"icon cross\"></div>\r\n    <div class=\"icon search\"></div>\r\n  </div>\r\n  <div class=\"yourCreated\">\r\n    您创建的\r\n  </div>\r\n  <div class=\"creation\">\r\n    <div class=\"create\">\r\n      创建播放列表\r\n    </div>\r\n    <div class=\"cancel\">\r\n      取消\r\n    </div>\r\n  </div>\r\n</div>\r\n<style>\r\n  .cancel {\r\n    margin-top: 8px;\r\n  }\r\n  .create,\r\n  .cancel {\r\n    line-height: 40px;\r\n    text-align: center;\r\n  }\r\n\r\n  .create {\r\n    width: 250px;\r\n    height: 40px;\r\n    color: white;\r\n    background-color: burlywood;\r\n  }\r\n\r\n  .yourCreated {\r\n    margin: 10px 0 60px 0;\r\n  }\r\n\r\n  ::-webkit-input-placeholder {\r\n   text-align: right;\r\n}\r\n  #setName .icon {\r\n    display: flex;\r\n    flex-shrink: 0;\r\n    width: 56px;\r\n    height: 56px;\r\n  }\r\n\r\n  #setName svg {\r\n    width: 16px;\r\n    height: 16px;\r\n    margin: auto;\r\n    fill: none;\r\n    stroke: black;\r\n  }\r\n\r\n  #setName:hover {\r\n    background-color: rgb(230, 230, 230)\r\n  }\r\n\r\n  #setName {\r\n    display: flex;\r\n    /* width: 400px; */\r\n    height: 56px;\r\n    background-color: rgb(250, 250, 250)\r\n  }\r\n\r\n  #setName .search {\r\n    background-color: inherit;\r\n  }\r\n\r\n  #setName input:focus,\r\n  #setName input:focus~.icon {\r\n    background-color: rgb(250, 250, 250)\r\n  }\r\n\r\n  #setName .cross {\r\n    visibility: hidden;\r\n  }\r\n\r\n  #setName input:focus+.cross {\r\n    visibility: unset;\r\n  }\r\n\r\n  #setName input {\r\n    font-family: sans-serif;\r\n    font-weight: lighter;\r\n    font-size: 30px;\r\n    line-height: 56px;\r\n    outline: none;\r\n    border: none;\r\n    height: 56px;\r\n    width: 280px;\r\n    background-color: transparent;\r\n  }\r\n\r\n  .playList svg {\r\n    stroke: white;\r\n    fill: none;\r\n    width: 36px;\r\n    height: 36px;\r\n    margin: auto;\r\n  }\r\n\r\n  .cover {\r\n    margin:60px 0 20px 0;\r\n    display: flex;\r\n    width: 170px;\r\n    height: 170px;\r\n    border-radius: 5px;\r\n    background-color: burlywood;\r\n\r\n  }\r\n\r\n  .main {\r\n    width: 470px;\r\n    height: 520px;\r\n    align-items: center;\r\n    display: flex;\r\n    flex-direction: column;\r\n    box-shadow: 0 10px 20px 5px rgba(100, 100, 100, 0.2);\r\n  }\r\n</style>\r\n<script type=\"module\" src=\"../../assets/devIcon.js\"></script>","albums":"<div id=\"main\">\r\n  <!-- <div>\r\n    <div class=\"cover\">\r\n      <div class=\"icon play\"></div>\r\n      <div class=\"icon add\"></div>\r\n    </div>\r\n    <div class=\"info\">\r\n      <div class=\"name\">Departures～あなたにおくるアイの歌～</div>\r\n      <div class=\"artist\">未知艺术家</div>\r\n    </div>\r\n  </div> -->\r\n</div>\r\n<style>\r\n  .icon  svg {\r\n    margin: auto;\r\n    width: 16px;\r\n    height: 16px;\r\n    fill: none;\r\n    stroke: white;\r\n  }\r\n  .cover:hover .icon:hover {\r\n      padding: 0px;\r\n      transition: padding 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);\r\n    }\r\n    .icon {\r\n      transform-origin: center;\r\n      transform: scale(0);\r\n    }\r\n    .cover:hover .icon {\r\n      transition: transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);\r\n      transform: scale(1);\r\n      box-sizing: border-box;\r\n      background-clip: content-box;\r\n      padding: 4px;\r\n      border-radius: 50%;\r\n      color: rgba(0, 0, 0, 0.199);\r\n      background-color: currentColor;\r\n      display: flex;\r\n      width: 54px;\r\n      height: 54px;\r\n    }\r\n  body {\r\n    margin: 0;\r\n  }\r\n\r\n  .info {\r\n    width:180px;\r\n  }\r\n\r\n  .artist {\r\n    font-size: 12px;\r\n    margin: 0 10px 10px 10px;\r\n    color: rgb(140, 140, 140)\r\n  }\r\n\r\n  .name {\r\n    overflow: hidden;\r\n    height: 42px;\r\n    font-size: 14px;\r\n    margin: 0 10px;\r\n  }\r\n\r\n  #main {\r\n    display: flex;\r\n    align-content: flex-start;\r\n    flex-wrap: wrap;\r\n  }\r\n\r\n  .cover:hover {\r\n    box-shadow: 0 20px 20px rgba(100, 100, 100, 0.452);\r\n  }\r\n\r\n  .cover {\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    margin: 10px;\r\n    width: 160px;\r\n    height: 160px;\r\n\r\n  }\r\n</style>\r\n<script type=\"module\" src=\"../../assets/devIcon.js\"></script>","controller":"<div id=\"controller\">\r\n  <div class=\"cover-info-center\">\r\n    <div class=\"cover-info\">\r\n      <div class=\"cover\">\r\n        <img src=\"./assets/cover/avatar.png\" alt=\"cover\" srcset=\"\">\r\n      </div>\r\n      <div class=\"info\">\r\n        <div class=\"name\">\r\n          <!-- Departures ~あなたにおくるアイの歌~ -->\r\n        </div>\r\n        <div class=\"artist\">\r\n          <!-- 未知艺术家 -->\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"center\">\r\n      <div class=\"buttons\">\r\n        <div class=\"icon random middle-button\">\r\n        </div>\r\n        <div class=\"icon previous middle-button\">\r\n        </div>\r\n        <div class=\"icon play big-button\">\r\n        </div>\r\n        <div class=\"icon next middle-button\">\r\n        </div>\r\n        <div class=\"icon refresh middle-button\">\r\n        </div>\r\n      </div>\r\n      <div class=\"progress\">\r\n        <div class=\"timer time-passed\"></div>\r\n        <input id=\"timeLine\" type=\"range\" min=\"0\" max=\"1000\"></input>\r\n        <div class=\"timer duration\"></div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"right\">\r\n    <div class=\"icon sound middle-button\">\r\n    </div>\r\n    <input id=\"loudness\" type=\"range\" min=\"0\" max=\"1\" step=\"0.01\"></input>\r\n    <div class=\"icon resize middle-button\">\r\n    </div>\r\n    <div class=\"icon more middle-button\">\r\n    </div>\r\n  </div>\r\n</div>\r\n<style>\r\n  body {\r\n    margin: 0;\r\n  }\r\n\r\n  .cover img {\r\n    width: inherit;\r\n    object-fit: cover;\r\n  }\r\n\r\n  svg {\r\n    fill: none;\r\n    stroke: white;\r\n  }\r\n\r\n  .icon {\r\n    margin: 5px;\r\n  }\r\n\r\n  .timer {\r\n    text-align: center;\r\n    color: white;\r\n    font-size: 12px;\r\n    line-height: 20px;\r\n    margin: 0 5px;\r\n  }\r\n\r\n  .cover-info-center {\r\n    width: 66vw;\r\n    justify-content: space-between;\r\n  }\r\n\r\n  .info {\r\n    box-sizing: border-box;\r\n    white-space: nowrap;\r\n    color: white;\r\n    display: flex;\r\n    width: 22vw;\r\n    max-width: 333px;\r\n    flex-direction: column;\r\n    height: 90px;\r\n    padding: 0 15px;\r\n    justify-content: center;\r\n  }\r\n\r\n  .cover-info:hover {\r\n    background-color: rgba(0, 0, 0, 0.1);\r\n  }\r\n\r\n  .name,\r\n  .artist {\r\n    overflow: hidden;\r\n  }\r\n\r\n  .artist {\r\n    font-weight: bold;\r\n  }\r\n\r\n  .cover {\r\n    width: 90px;\r\n    height: 90px;\r\n  }\r\n\r\n  .right {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-around;\r\n    height: 64px;\r\n  }\r\n\r\n  .cover-info-center,\r\n  .cover-info,\r\n  .buttons>div,\r\n  .right>div {\r\n    display: flex;\r\n  }\r\n\r\n  .middle-button svg {\r\n    margin: auto;\r\n    height: 14px;\r\n    width: 14px;\r\n  }\r\n\r\n  .big-button svg {\r\n    margin: auto;\r\n    height: 20px;\r\n    width: 20px;\r\n  }\r\n\r\n  input {\r\n    width: 280px;\r\n    height: 2px;\r\n  }\r\n\r\n  .center {\r\n    position: relative;\r\n    display: flex;\r\n    justify-content: space-between;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    height: 90px;\r\n  }\r\n\r\n  .buttons {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    height: 64px;\r\n  }\r\n\r\n  .progress {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    width: 32vw;\r\n    height: 26px;\r\n  }\r\n\r\n  .right input {\r\n    width: 100px;\r\n  }\r\n\r\n  .progress input {\r\n    flex: 1;\r\n  }\r\n\r\n  input[type=\"range\"] {\r\n    color: currentColor;\r\n    -webkit-appearance: none;\r\n    margin: 0;\r\n    border: 0;\r\n    height: 20px;\r\n    background: transparent;\r\n  }\r\n\r\n  input[type=\"range\"]:focus {\r\n    outline: none;\r\n  }\r\n\r\n  input[type=\"range\"]::-webkit-slider-runnable-track {\r\n    height: 2px;\r\n    background-color: white;\r\n  }\r\n\r\n  input[type=\"range\"]::-webkit-slider-thumb:hover {\r\n    border-color: rgba(255, 255, 255, 0.6);\r\n  }\r\n\r\n  input[type=\"range\"]::-webkit-slider-thumb {\r\n    -webkit-appearance: none;\r\n    position: relative;\r\n    margin: 0;\r\n    border: 2px;\r\n    border-style: solid;\r\n    border-radius: 50%;\r\n    cursor: pointer;\r\n    top: -7px;\r\n    width: 16px;\r\n    height: 16px;\r\n    border-color: #ffffff;\r\n    outline: 2px solid currentColor;\r\n    background-color: currentColor;\r\n  }\r\n\r\n  input[type=\"range\"]:active::-webkit-slider-thumb {\r\n    top: -10px;\r\n    width: 22px;\r\n    height: 22px;\r\n    border-color: white;\r\n    outline: none;\r\n    background-color: white;\r\n}\r\n\r\n  .middle-button {\r\n    width: 32px;\r\n    height: 32px;\r\n    border-color: rgba(0, 0, 0, 0);\r\n  }\r\n\r\n  .big-button {\r\n    width: 46px;\r\n    height: 46px;\r\n    border-color: rgba(255, 255, 255, 0.2);\r\n  }\r\n\r\n  .middle-button:hover,\r\n  .big-button:hover {\r\n    border-color: rgba(0, 0, 0, 0.1);\r\n    background-color: rgba(0, 0, 0, 0.1);\r\n  }\r\n\r\n  .middle-button,\r\n  .big-button {\r\n    border-radius: 50%;\r\n    border-width: 2px;\r\n    border-style: solid;\r\n  }\r\n\r\n  .cover {\r\n    width: 90px;\r\n    height: 90px;\r\n  }\r\n\r\n  #controller {\r\n    overflow: hidden;\r\n    width: 100%;\r\n    height: 90px;\r\n    color: rgb(113, 204, 192);\r\n    background-color: currentColor;\r\n    display: flex;\r\n    justify-content: space-between;\r\n  }\r\n\r\n  @media (max-width: 860px) {\r\n\r\n    div.random,\r\n    div.refresh {\r\n      display: none\r\n    }\r\n  }\r\n\r\n  @media (max-width: 770px) {\r\n    div.resize {\r\n      display: none;\r\n    }\r\n  }\r\n\r\n  @media (max-width: 670px) {\r\n\r\n    .right [type=\"range\"],\r\n    div.sound,\r\n    div.cover {\r\n      display: none\r\n    }\r\n\r\n    div.more {\r\n      transform: rotate(90deg)\r\n    }\r\n\r\n    .cover-info-center {\r\n      flex: 1;\r\n    }\r\n\r\n    .cover-info {\r\n      height: 60px;\r\n      width: calc(100% - 152px);\r\n      max-width: 250px;\r\n    }\r\n\r\n    div.info {\r\n      height: 60px;\r\n      width: 100%;\r\n    }\r\n\r\n    div.progress {\r\n      position: absolute;\r\n      right: -38px;\r\n      top: 64px;\r\n      width: calc(100vw - 18px);\r\n    }\r\n\r\n    /* div.progress {\r\n      align-self: flex-end;\r\n      margin-right: -47px;\r\n      width: calc(100vw - 27px)\r\n    } */\r\n    div.center {\r\n      align-items: flex-end;\r\n    }\r\n  }\r\n</style>\r\n<script type=\"module\" src=\"../../assets/devIcon.js\"></script>","menu":"<div class=\"sideBar\">\r\n  <div class=\"item\" id=\"switch\">\r\n    <div class=\"icon menu\"></div>\r\n  </div>\r\n  <div class=\"item\" id=\"search\">\r\n    <input type=\"text\" placeholder=\"搜索\">\r\n    <div class=\"icon cross\"></div>\r\n    <div class=\"icon search\"></div>\r\n  </div>\r\n  <div tabindex=\"-1\" class=\"item\" id=\"music\">\r\n    <div class=\"icon music\"></div>\r\n    <div class=\"text\">我的音乐</div>\r\n  </div>\r\n  <div tabindex=\"-1\" class=\"item\" id=\"lastPlayed\">\r\n    <div class=\"icon clock\"></div>\r\n    <div class=\"text\">最近播放的内容</div>\r\n  </div>\r\n  <div tabindex=\"-1\" class=\"item\" id=\"playing\">\r\n    <div class=\"icon wave\"></div>\r\n    <div class=\"text\">正在播放</div>\r\n  </div>\r\n  <div id=\"line0\"></div>\r\n  <div id=\"playList\">\r\n    <div tabindex=\"-1\">\r\n      <div class=\"icon playList\"></div>\r\n      <div class=\"text\">播放列表</div>\r\n    </div>\r\n    <div class=\"icon add\"></div>\r\n  </div>\r\n  <div class=\"albums\">\r\n    <div tabindex=\"-1\" class=\"item albums\">\r\n      <div class=\"icon album\"></div>\r\n      <div>deemo</div>\r\n    </div>\r\n  </div>\r\n  <div id=\"line1\"></div>\r\n  <div tabindex=\"-1\" class=\"item\" id=\"settings\">\r\n    <div class=\"icon gear\"></div>\r\n    <div class=\"text\">设置</div>\r\n  </div>\r\n</div>\r\n<style>\r\n  body {\r\n    margin: 0;\r\n  }\r\n\r\n  .item>* {\r\n    pointer-events: none;\r\n  }\r\n\r\n  .text {\r\n    white-space: nowrap;\r\n    height: 100%;\r\n  }\r\n\r\n  .menu:hover {\r\n    background-color: rgba(0, 0, 0, 0.1)\r\n  }\r\n\r\n  .icon svg {\r\n    margin: auto;\r\n    width: 16px;\r\n    height: 16px;\r\n    fill: none;\r\n    stroke: black;\r\n  }\r\n\r\n  .sideBar {\r\n    overflow: hidden;\r\n    transition: width 0.2s cubic-bezier(0.19, 1, 0.22, 1);\r\n    min-height: 400px;\r\n    height: 100%;\r\n    width: 320px;\r\n    background-color: rgb(242, 242, 242);\r\n    display: flex;\r\n    flex-direction: column;\r\n\r\n  }\r\n\r\n  .close {\r\n    width: 40px;\r\n    height: 40px;\r\n  }\r\n\r\n  .albums {\r\n    flex: 1;\r\n    width: inherit;\r\n    background-color: inherit;\r\n  }\r\n\r\n  #line0,\r\n  #line1 {\r\n    align-self: center;\r\n    width: 290px;\r\n    height: 0px;\r\n    outline: 1px rgba(0, 0, 0, 0.1) solid;\r\n  }\r\n\r\n  #search {\r\n    display: flex;\r\n    align-items: center;\r\n    height: 50px;\r\n  }\r\n\r\n  #search .icon {\r\n    outline: none;\r\n    width: 40px;\r\n    height: 40px;\r\n    background-color: rgb(250, 250, 250);\r\n  }\r\n\r\n  #search .icon:hover {\r\n    color: rgb(1, 231, 231);\r\n  }\r\n\r\n  #search svg {\r\n    stroke: currentColor;\r\n    width: 14px;\r\n    height: 14px;\r\n  }\r\n\r\n  #search .cross svg {\r\n    visibility: hidden;\r\n  }\r\n\r\n  #search input:hover,\r\n  #search input:focus,\r\n  #search input:hover~.icon,\r\n  #search input:focus~.icon {\r\n    background-color: white;\r\n  }\r\n\r\n  #search input:focus+.icon svg {\r\n    visibility: unset;\r\n  }\r\n\r\n  #search input {\r\n    margin-left: 10px;\r\n    padding: 0 0 0 10px;\r\n    outline: none;\r\n    border: none;\r\n    width: 210px;\r\n    height: 40px;\r\n    background-color: rgb(250, 250, 250);\r\n  }\r\n\r\n  #settings {\r\n    justify-self: flex-end;\r\n  }\r\n\r\n  #playList>div:first-child {\r\n    display: flex;\r\n    flex: 1;\r\n  }\r\n\r\n  #playList>div:hover,\r\n  #playList>.add:hover {\r\n    background-color: rgba(0, 0, 0, 0.1)\r\n  }\r\n\r\n  #playList>div:first-child:focus {\r\n    outline: none;\r\n    box-shadow: inset 4px 0 rgb(1, 231, 231);\r\n  }\r\n\r\n  #playList>div:first-child:hover {\r\n    background-color: rgba(0, 0, 0, 0.1);\r\n  }\r\n\r\n  .icon {\r\n    display: flex;\r\n    width: 50px;\r\n    height: 50px;\r\n  }\r\n\r\n  .item:nth-child(n+3):focus,\r\n  .albums>.item:focus {\r\n    outline: none;\r\n    box-shadow: inset 4px 0 rgb(1, 231, 231);\r\n  }\r\n\r\n  .item:nth-child(n+3):hover,\r\n  .albums>.item:hover {\r\n    background-color: rgba(0, 0, 0, 0.1);\r\n  }\r\n\r\n  .item,\r\n  #playList>div {\r\n    box-shadow: inset 4px 0 rgba(236, 236, 236, 0);\r\n  }\r\n\r\n  .item,\r\n  #playList {\r\n    line-height: 50px;\r\n    display: flex;\r\n  }\r\n\r\n  @media (min-width: 769px) and (max-width: 1024px) {\r\n    div[tabindex=\"-1\"]>div:last-child {\r\n      display: none;\r\n    }\r\n\r\n    .sideBar {\r\n      width: 50px;\r\n    }\r\n\r\n    #line0 {\r\n      display: none;\r\n    }\r\n\r\n    #line1 {\r\n      outline: none;\r\n      flex: 1;\r\n    }\r\n\r\n    .albums,\r\n    #search input,\r\n    #search .cross {\r\n      display: none;\r\n    }\r\n\r\n    #search .search:hover {\r\n      background-color: rgba(0, 0, 0, 0.1);\r\n      color: black;\r\n    }\r\n\r\n    #search .search {\r\n      width: 50px;\r\n      height: 50px;\r\n      background-color: inherit;\r\n    }\r\n\r\n    #playList {\r\n      flex-direction: column;\r\n    }\r\n  }\r\n\r\n  @media (max-width: 768px) {\r\n    /* #search .icon.search {\r\n    width: 50px;\r\n    height: 50px;\r\n    background-color: transparent;\r\n} */\r\n\r\n#search {\r\n    flex: 1;\r\n    padding-right: 10px;\r\n}\r\n#search input {\r\n  flex:1;\r\n}\r\n    .sideBar {\r\n      width: 100%;\r\n      height: 50px;\r\n      overflow: hidden;\r\n      min-height: 0;\r\n      flex-direction: row;\r\n    }\r\n\r\n    .item:nth-child(n + 2),\r\n    #line0,\r\n    #line1,\r\n    #playList,\r\n    .albums {\r\n      display: none;\r\n    }\r\n  }\r\n\r\n  /* @media (max-width: 768px) {\r\n    .sideBar {\r\n      min-height: 300px;\r\n    }\r\n\r\n    #line0 {\r\n      display: none;\r\n    }\r\n\r\n    #line1 {\r\n      outline: none;\r\n      flex: 1;\r\n    }\r\n\r\n    .albums,\r\n    #playList .add,\r\n    #wave,\r\n    #search {\r\n      display: none;\r\n    }\r\n  } */\r\n</style>\r\n<script type=\"module\" src=\"../../assets/devIcon.js\"></script>","myMusic":"<div id=\"main\">\r\n  <div class=\"myMusic\">我的音乐</div>\r\n  <div class=\"tags\">\r\n    <div class=\"songs\">歌曲</div>\r\n    <div class=\"singers\">歌手</div>\r\n    <div class=\"albums\">专辑</div>\r\n  </div>\r\n  <div class=\"line\"></div>\r\n  <div class=\"preference\">\r\n    <div class=\"icon random\"></div>\r\n    <div class=\"randomAll\">无序播放所有(<span id=\"total\"></span>)</div>\r\n    <div class=\"sort\">排序依据: <span href=\"\">添加日期</span></div>\r\n    <div class=\"type\">类型: <span href=\"\">所有流派</span></div>\r\n  </div>\r\n</div>\r\n<style>\r\n  .icon {\r\n    display: flex;\r\n  }\r\n  svg {\r\n    margin: auto;\r\n  }\r\n  .sort,\r\n  .type {\r\n    margin-left: 20px;\r\n  }\r\n\r\n  .randomAll {\r\n    margin-left: 10px;\r\n  }\r\n\r\n  .preference {\r\n    height: 50px;\r\n    font-size: 14px;\r\n    align-items: center;\r\n    display: flex;\r\n  }\r\n\r\n  .random svg {\r\n    fill: none;\r\n    stroke: black;\r\n    width: 16px;\r\n    height: 16px;\r\n  }\r\n\r\n  .myMusic {\r\n    margin-top: 10px;\r\n    font-size: 34px;\r\n    font-weight: lighter;\r\n  }\r\n\r\n  .tags {\r\n    font-size: 20px;\r\n    display: flex;\r\n    width: 200px;\r\n    justify-content: space-between;\r\n  }\r\n\r\n  .tags>div {\r\n    margin-top: 10px;\r\n    padding: 0 0 3px 0;\r\n    border-bottom: 2px rgba(0, 224, 224, 0) solid;\r\n  }\r\n\r\n  .tags>div:hover {\r\n    border-bottom: 2px rgb(8, 184, 184) solid;\r\n  }\r\n\r\n  .line {\r\n    position: relative;\r\n    z-index: -1;\r\n    top: -2px;\r\n    width: 100%;\r\n    height: 1px;\r\n    border-bottom: 1px rgb(206, 206, 206) solid;\r\n  }\r\n\r\n  @media (max-width: 768px) {\r\n    #main {\r\n      padding-left: 10px;\r\n    }\r\n    .myMusic {\r\n      display: none;\r\n    }\r\n  }\r\n</style>\r\n<script type=\"module\" src=\"../../assets/devIcon.js\"></script>","settings":"<div class=\"setting\">设置</div>\r\n<div class=\"items first-item\">此PC上的音乐</div>\r\n<div class=\"add\">选择查找音乐的位置</div>\r\n<div class=\"items\">播放</div>\r\n<div class=\"adjust\">均衡器</div>\r\n<div class=\"items\">模式</div>\r\n<div class=\"mode\">\r\n  <div><input type=\"radio\" id=\"light\">浅色</div>\r\n  <div><input type=\"radio\" id=\"dark\">深色</div>\r\n</div>\r\n<div class=\"addPannel\">\r\n  <div class=\"title\">从本地曲库创建个人\"收藏\"</div>\r\n  <div class=\"statement\">现在我们正在查看这些文件夹</div>\r\n  <div class=\"container\">\r\n    <div class=\"mask\"></div>\r\n    <div class=\"addTile\">+</div>\r\n    <div class=\"tilesContainer\">\r\n\r\n      <!-- <div class=\"tile\">\r\n        <div class=\"icon\">+</div>\r\n        <div class=\"basename\">CloudMusic</div>\r\n        <div class=\"path\">D:/UW/CloudMusic</div>\r\n      </div>\r\n      <div class=\"tile\"></div>\r\n      <div class=\"tile\"></div> -->\r\n    </div>\r\n  </div>\r\n  <div class=\"ok\">完成</div>\r\n</div>\r\n<style>\r\n  body {\r\n    margin: 0;\r\n  }\r\n\r\n  .mask {\r\n    z-index: -1;\r\n    position: absolute;\r\n    top: 50%;\r\n    left: 50%;\r\n    transform: translate(-50%, -50%);\r\n    width: 100vw;\r\n    height: 100vh;\r\n    background-color: rgba(202, 202, 202, 0.199);\r\n  }\r\n\r\n  input {\r\n    width: 20px;\r\n    height: 20px;\r\n  }\r\n\r\n  .addTile > *, .tile > * {\r\n    pointer-events: none;\r\n  }\r\n\r\n  .addTile, .tile, .ok {\r\n    border: 2px solid transparent;\r\n  }\r\n  .addTile:hover, .tile:hover, .ok:hover {\r\n    border: 2px solid rgb(94, 94, 94);\r\n  }\r\n\r\n  .ok {\r\n    background-color: gainsboro;\r\n    margin: 20px 0;\r\n    float: right;\r\n    text-align: center;\r\n    line-height: 30px;\r\n    width: 150px;\r\n    height: 30px;\r\n  }\r\n\r\n  .setting {\r\n    position: sticky;\r\n    top: 0;\r\n    height: 45px;\r\n    padding-top: 10px;\r\n    text-align: bottom;\r\n    font-size: 34px;\r\n    font-weight: lighter;\r\n    background-color: white;\r\n  }\r\n\r\n  .items {\r\n    font-size: 24px;\r\n    margin-top: 26px;\r\n    margin-bottom: 5px;\r\n  }\r\n\r\n  .first-item {\r\n    margin-top: 15px;\r\n  }\r\n\r\n  .addPannel {\r\n    display: none;\r\n    z-index: 1;\r\n    box-sizing: border-box;\r\n    padding: 30px;\r\n    border: 1px solid blueviolet;\r\n    background-color: white; \r\n    height: 80vh;\r\n    width: 350px;\r\n    max-height: 756px;\r\n    position: absolute;\r\n    top: 50%;\r\n    left: 50%;\r\n    transform: translate(-50%, -50%);\r\n  }\r\n  .container {\r\n    overflow-y: auto;\r\n    height: calc(100% - 100px);\r\n  }\r\n  .title {\r\n    margin-bottom: 10px;\r\n    font-size: 20px;\r\n  }\r\n  .statement {\r\n    font-size: 14\r\n  }\r\n  .tile, .addTile {\r\n    margin-top: 8px;\r\n    font-size: 14px;\r\n    position: relative;\r\n    padding: 15px 10px;\r\n    box-sizing: border-box;\r\n    height: 72px;\r\n    background-color: gainsboro;\r\n  }\r\n\r\n  .addTile {\r\n    font-weight: lighter;\r\n    text-align: center;\r\n    line-height: 36px;\r\n    font-size: 50px;\r\n  }\r\n  .icon {\r\n    transform: rotate(45deg);\r\n    line-height: 20px;\r\n    font-size: 30px;\r\n    position: absolute;\r\n    right: 10px;\r\n  }\r\n  .basename {\r\n    font-weight: bold;\r\n    overflow: hidden;\r\n    width: 235px;\r\n    white-space: nowrap;\r\n  }\r\n  .path {\r\n    overflow: hidden;\r\n    width: 260px;\r\n    white-space: nowrap;\r\n  }\r\n</style>","singers":"<div id=\"main\">\r\n  <div>\r\n    <div class=\"letter\">D</div>\r\n    <div class=\"group\">\r\n      <div class=\"item\">\r\n        <div class=\"cover\">\r\n          <div class=\"icon play\"></div>\r\n          <div class=\"icon add\"></div>\r\n        </div>\r\n        <div class=\"artist\">Departures～あなたにおくるアイの歌～</div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div>\r\n    <div class=\"letter\">E</div>\r\n    <div class=\"group\">\r\n      <div class=\"item\">\r\n        <div class=\"cover\">\r\n          <div class=\"icon play\"></div>\r\n          <div class=\"icon add\"></div>\r\n        </div>\r\n        <div class=\"artist\">Departures～あなたにおくるアイの歌～</div>\r\n      </div>\r\n      <div class=\"item\">\r\n        <div class=\"cover\">\r\n          <div class=\"icon play\"></div>\r\n          <div class=\"icon add\"></div>\r\n        </div>\r\n        <div class=\"artist\">Departures～あなたにおくるアイの歌～</div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n<style>\r\n  .item {\r\n    margin-left: 10px;\r\n  }\r\n\r\n  .group {\r\n    display: flex;\r\n    margin: 10px 0;\r\n  }\r\n\r\n  .letter {\r\n    position: sticky;\r\n    top: 149px;\r\n    background-color: white;\r\n    z-index: 0;\r\n  }\r\n\r\n  .icon svg {\r\n    margin: auto;\r\n    width: 16px;\r\n    height: 16px;\r\n    fill: none;\r\n    stroke: white;\r\n  }\r\n\r\n  .cover:hover .icon:hover {\r\n    padding: 0px;\r\n    transition: padding 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);\r\n  }\r\n\r\n  .icon {\r\n    transform-origin: center;\r\n    transform: scale(0);\r\n  }\r\n\r\n  .cover:hover .icon {\r\n    transition: transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);\r\n    transform: scale(1);\r\n    box-sizing: border-box;\r\n    background-clip: content-box;\r\n    padding: 4px;\r\n    border-radius: 50%;\r\n    color: rgba(0, 0, 0, 0.199);\r\n    background-color: currentColor;\r\n    display: flex;\r\n    width: 54px;\r\n    height: 54px;\r\n  }\r\n\r\n  body {\r\n    margin: 0;\r\n  }\r\n\r\n  .artist {\r\n    width: 140px;\r\n    text-align: center;\r\n    overflow: hidden;\r\n    height: 42px;\r\n    font-size: 14px;\r\n    margin: 10px;\r\n  }\r\n\r\n  #main {\r\n    display: flex;\r\n    flex-direction: column;\r\n  }\r\n\r\n  .cover:hover {\r\n    box-shadow: 0 20px 20px 5px rgba(100, 100, 100, 0.2);\r\n  }\r\n\r\n  .cover {\r\n    display: flex;\r\n    color: rgb(216, 216, 216);\r\n    background-color: currentColor;\r\n    justify-content: center;\r\n    align-items: center;\r\n    border-radius: 50%;\r\n    box-sizing: border-box;\r\n    border: 1px solid white;\r\n    width: 160px;\r\n    height: 160px;\r\n\r\n  }\r\n</style>\r\n<script type=\"module\" src=\"../../assets/devIcon.js\"></script>","songs":"<div class=\"list\">\r\n  <!-- <div>\r\n      <div class=\"checkBox\"></div>\r\n      <div class=\"name\">\r\n        <div class=\"text\">\r\n          Departures ~あなたにおくるアイの歌~\r\n        </div>\r\n        <div class=\"icon play\"></div>\r\n        <div class=\"icon add\"></div>\r\n      </div>\r\n      <div class=\"attribute\">\r\n        <div class=\"artist\">未知艺术家</div>\r\n        <div class=\"album\">GREATESTHITS2011-2017'ALTEREGO'</div>\r\n        <div class=\"date\">2017年</div>\r\n        <div class=\"style\">R&B</div>\r\n      </div>\r\n      <div class=\"duration\">3:07</div>\r\n    </div> -->\r\n</div>\r\n<style>\r\n  .play>* {\r\n    pointer-events: none;\r\n  }\r\n\r\n  .name .text {\r\n    margin-right: 10px;\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    font-size: 14px;\r\n  }\r\n\r\n  .name {\r\n    display: flex;\r\n    align-items: center;\r\n    height: inherit;\r\n    width: 20vw;\r\n  }\r\n\r\n  .checkBox {\r\n    visibility: hidden;\r\n    width: 20px;\r\n    height: 20px;\r\n    margin: 12px;\r\n    outline: 1px solid rgba(31, 190, 164, 0.479);\r\n  }\r\n\r\n  .list>div:hover .checkBox {\r\n    visibility: visible;\r\n  }\r\n\r\n  .list>div:nth-child(2n-1) {\r\n    background-color: rgb(240, 240, 240);\r\n  }\r\n\r\n  .list>div:hover {\r\n    background-color: rgb(220, 220, 220);\r\n  }\r\n\r\n  .list svg {\r\n    margin: auto;\r\n    width: 16px;\r\n    height: 16px;\r\n    fill: none;\r\n    stroke: purple;\r\n  }\r\n\r\n  .list>div:hover .icon {\r\n    display: flex;\r\n  }\r\n\r\n  .list .icon:hover {\r\n    background-color: rgba(0, 0, 0, 0.1);\r\n  }\r\n\r\n  .list .icon {\r\n    display: none;\r\n    flex-shrink: 0;\r\n    height: 48px;\r\n    width: 48px;\r\n  }\r\n\r\n  .attribute {\r\n    flex: 1;\r\n    display: flex;\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    margin-right: 20px;\r\n    font-size: 12px\r\n  }\r\n\r\n  .artist,\r\n  .album {\r\n    flex:1;\r\n    overflow: hidden;\r\n    margin-right: 20px;\r\n  }\r\n\r\n  .date {\r\n    margin-right: 20px;\r\n  }\r\n\r\n  .duration {\r\n    font-size: 12px;\r\n    margin-right: 10px;\r\n  }\r\n\r\n  .list>div {\r\n    display: flex;\r\n    align-items: center;\r\n    height: 48px;\r\n  }\r\n\r\n  .style {\r\n    overflow: hidden;\r\n    flex:1;\r\n  }\r\n\r\n  @media (max-width: 1200px) {\r\n    .album {\r\n      display: none;\r\n    }\r\n\r\n    .name {\r\n      width: 25vw;\r\n    }\r\n  }\r\n\r\n  @media (max-width: 850px) {\r\n    .date {\r\n      display: none;\r\n    }\r\n  }\r\n\r\n  @media (max-width: 700px) {\r\n    .style {\r\n      display: none;\r\n    }\r\n  }\r\n</style>\r\n<script type=\"module\" src=\"../../assets/devIcon.js\"></script>","songsSortedByAZ":"<div id=\"main\">\r\n\r\n</div>\r\n<style>\r\n  .play>* {\r\n    pointer-events: none;\r\n  }\r\n\r\n  .name .text {\r\n    margin-right: 10px;\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    font-size: 14px;\r\n  }\r\n\r\n  .name {\r\n    display: flex;\r\n    align-items: center;\r\n    height: inherit;\r\n    width: 20vw;\r\n  }\r\n\r\n  .checkBox {\r\n    visibility: hidden;\r\n    width: 20px;\r\n    height: 20px;\r\n    margin: 12px;\r\n    outline: 1px solid rgba(31, 190, 164, 0.479);\r\n  }\r\n\r\n  .group>div:hover .checkBox {\r\n    visibility: visible;\r\n  }\r\n\r\n  .group>div:nth-child(2n-1) {\r\n    background-color: rgb(240, 240, 240);\r\n  }\r\n\r\n  .group>div:hover {\r\n    background-color: rgb(220, 220, 220);\r\n  }\r\n\r\n  .group svg {\r\n    margin: auto;\r\n    width: 16px;\r\n    height: 16px;\r\n    fill: none;\r\n    stroke: purple;\r\n  }\r\n\r\n  .group>div:hover .icon {\r\n    display: flex;\r\n  }\r\n\r\n  .group .icon:hover {\r\n    background-color: rgba(0, 0, 0, 0.1);\r\n  }\r\n\r\n  .group .icon {\r\n    display: none;\r\n    flex-shrink: 0;\r\n    height: 48px;\r\n    width: 48px;\r\n  }\r\n\r\n  .attribute {\r\n    flex: 1;\r\n    display: flex;\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    margin-right: 20px;\r\n    font-size: 12px\r\n  }\r\n\r\n  .artist,\r\n  .album {\r\n    flex:1;\r\n    overflow: hidden;\r\n    margin-right: 20px;\r\n  }\r\n\r\n  .date {\r\n    margin-right: 20px;\r\n  }\r\n\r\n  .duration {\r\n    font-size: 12px;\r\n    margin-right: 10px;\r\n  }\r\n\r\n  .group>div {\r\n    display: flex;\r\n    align-items: center;\r\n    height: 48px;\r\n  }\r\n\r\n  .style {\r\n    overflow: hidden;\r\n    flex:1;\r\n  }\r\n\r\n  @media (max-width: 1200px) {\r\n    .album {\r\n      display: none;\r\n    }\r\n\r\n    .name {\r\n      width: 25vw;\r\n    }\r\n  }\r\n\r\n  @media (max-width: 850px) {\r\n    .date {\r\n      display: none;\r\n    }\r\n  }\r\n\r\n  @media (max-width: 700px) {\r\n    .style {\r\n      display: none;\r\n    }\r\n  }\r\n</style>"}