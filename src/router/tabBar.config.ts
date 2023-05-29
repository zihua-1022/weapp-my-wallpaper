const tabBarConfig = {
  custom: true,
  color: "rgba(68, 68, 68, 1)",
  selectedColor: "rgba(68, 68, 68, 1)",
  backgroundColor: "white",
  list: [
    {
      pagePath: "pages/home/index",
      // text: "首页",
      iconPath: "assets/img/tabBar/home.png",
      selectedIconPath: "assets/img/tabBar/home_selected.png",
    },
    {
      pagePath: "pages/category/index",
      iconPath: "assets/img/tabBar/mobile.png",
      selectedIconPath: "assets/img/tabBar/mobile_selected.png",
    },
    {
      pagePath: "pages/computer/index",
      iconPath: "assets/img/tabBar/pc.png",
      selectedIconPath: "assets/img/tabBar/pc_selected.png",
    },
    {
      pagePath: "pages/profile/index",
      // text: "我的",
      iconPath: "assets/img/tabBar/profile.png",
      selectedIconPath: "assets/img/tabBar/profile_selected.png",
    },
  ],
};

module.exports = tabBarConfig;
