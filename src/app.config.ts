const routerConfig = require("./router");

export default defineAppConfig({
  entryPagePath: "pages/home/index",
  pages: routerConfig.pagesConfig,
  tabBar: routerConfig.tabBarConfig,
  usingComponents: {},
  window: {
    // backgroundTextStyle: "dark",
    backgroundColor: "#141414",
    // navigationBarBackgroundColor: "#202123",
    // navigationBarTitleText: "WeChat",
    // navigationBarTextStyle: "black",
    navigationStyle: "custom",
    onReachBottomDistance: 10,
  },
  darkmode: true, // 添加这一行
});
