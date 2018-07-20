
export const sidebarMenu = [
  {
    url: '#/main',
    title: '欢迎',
    key: '#/main',
    defaultImgUrl: require('../styles/images/sidebarMenu/icon_fold.png'),
    selectedImgUrl: require('../styles/images/sidebarMenu/icon_unfold.png'),
  },
  {
    url: '#/hello',
    title: '你好',
    key: '#/hello',
    defaultImgUrl: require('../styles/images/sidebarMenu/icon_fold.png'),
    selectedImgUrl: require('../styles/images/sidebarMenu/icon_unfold.png'),
    subMenu: [{
      url: '#/hello/pageone',
      key: '#/hello/pageone',
      title: '首页1',
    },{
      url: '#/hello/pagetwo',
      key: '#/hello/pagetwo',
      title: '首页2',
    }],
  },

];

//declaration
