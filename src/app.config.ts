const routerConfig = require("./router");

export default defineAppConfig({
  pages: routerConfig.pagesConfig,
  tabBar: routerConfig.tabBarConfig,
  usingComponents: {},
  window: {
    // backgroundTextStyle: "dark",
    // backgroundColor: "#141414",
    // navigationBarBackgroundColor: "#202123",
    // navigationBarTitleText: "WeChat",
    // navigationBarTextStyle: "black",
    navigationStyle: "custom",
  },
  darkmode: true, // 添加这一行
});
