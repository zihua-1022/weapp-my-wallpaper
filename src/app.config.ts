const routerConfig = require("./router");

export default defineAppConfig({
  pages: routerConfig.pagesConfig,
  tabBar: routerConfig.tabBarConfig,
  usingComponents: {},
  window: {
    backgroundTextStyle: "dark",
    backgroundColor: "#202123",
    navigationBarBackgroundColor: "#202123",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
    navigationStyle: "custom",
  },
});
