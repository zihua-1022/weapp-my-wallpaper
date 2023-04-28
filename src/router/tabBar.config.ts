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
      selectedIconPath: "assets/img/tabBar/home.png",
    },
    {
      pagePath: "pages/category/index",
      iconPath: "assets/img/tabBar/sort.png",
      selectedIconPath: "assets/img/tabBar/sort.png",
    },
    {
      pagePath: "pages/collect/index",
      iconPath: "assets/img/tabBar/collect.png",
      selectedIconPath: "assets/img/tabBar/collect.png",
    },
    {
      pagePath: "pages/profile/index",
      // text: "我的",
      iconPath: "assets/img/tabBar/profile.png",
      selectedIconPath: "assets/img/tabBar/profile.png",
    },
  ],
};

module.exports = tabBarConfig;
