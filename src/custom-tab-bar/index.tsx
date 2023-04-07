import React, { useState, PropsWithChildren } from "react";
import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";

import "./index.less";

const CustomTabBar = (): JSX.Element => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const tabBarConfig = {
    selected: currentTab,
    color: "rgba(68, 68, 68, 1)",
    selectedColor: "rgba(68, 68, 68, 1)",
    list: [
      {
        key: 0,
        pagePath: "/pages/home/index",
        text: "",
        iconPath: "../assets/img/tabBar/home.png",
        selectedIconPath: "../assets/img/tabBar/collect.png",
      },
      {
        key: 1,
        pagePath: "/pages/category/index",
        text: "",
        iconPath: "../assets/img/tabBar/collect.png",
        selectedIconPath: "../assets/img/tabBar/profile.png",
      },
      {
        key: 2,
        pagePath: "/pages/collect/index",
        text: "",
        iconPath: "../assets/img/tabBar/sort.png",
        selectedIconPath: "../assets/img/tabBar/profile.png",
      },
      {
        key: 3,
        pagePath: "/pages/profile/index",
        text: "",
        iconPath: "../assets/img/tabBar/profile.png",
        selectedIconPath: "../assets/img/tabBar/home.png",
      },
    ],
  };

  const switchTabBar = (selectedKey: number) => {
    if (currentTab === selectedKey) {
      return;
    }
    setCurrentTab(selectedKey);
    console.log(currentTab, "selectedKey: ", selectedKey);
    Taro.switchTab({
      url: tabBarConfig.list[selectedKey].pagePath,
    });
  };

  return (
    <View className="custom-tab-bar">
      <View className="tab-bar-fixed">
        {tabBarConfig.list.map((item, index) => {
          return (
            <View
              className="tab-bar-item"
              key={item.key}
              onClick={() => switchTabBar(item.key)}
            >
              {item.key === currentTab ? "true" : "false"}
              {currentTab}
              {item.key}
              <Image
                className="icon"
                src={
                  item.key === currentTab
                    ? item.selectedIconPath
                    : item.iconPath
                }
              ></Image>
              {item.text && <Text className="text">{item.text}</Text>}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;
