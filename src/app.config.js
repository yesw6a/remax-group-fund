module.exports = {
  pages: ['pages/launch/index', 'pages/home/index', 'pages/user/index'],
  window: {
    navigationBarTitleText: '群基金收益率排行榜',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#1A1920',
    selectedColor: '#000000',
    borderStyle: 'white',
    list: [
      {
        text: '首页',
        pagePath: 'pages/home/index',
        iconPath: 'assets/image/defaultHome.png',
        selectedIconPath: 'assets/image/selectHome.png',
      },
      {
        text: '我的',
        pagePath: 'pages/user/index',
        iconPath: 'assets/image/defaultUser.png',
        selectedIconPath: 'assets/image/selectUser.png',
      },
    ],
  },
}
