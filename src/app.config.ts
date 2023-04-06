const routerConfig = require("./router");

export default defineAppConfig({
  pages: routerConfig.pagesConfig,
  tabBar: routerConfig.tabBarConfig,
  window: {
    backgroundTextStyle: "light",
    backgroundColor: "#2A2C2C",
    navigationBarBackgroundColor: "#2A2C2C",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
});
