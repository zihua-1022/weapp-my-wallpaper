import React, { useState, PropsWithChildren } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setCurrentTab } from "../store/tabBar";

import "./index.less";

const CustomTabBar = (): JSX.Element => {
  const dispatch = useDispatch();
  const currentTab = useSelector((state: RootState) => state.tabBar.currentTab);
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
    dispatch(setCurrentTab(selectedKey));
    Taro.switchTab({
      url: tabBarConfig.list[selectedKey].pagePath,
    });
  };

  return (
    <View className="custom-tab-bar">
      <View className="tab-bar-fixed">
        {tabBarConfig.list.map((item) => {
          return (
            <View
              className="tab-bar-item"
              key={item.key}
              onClick={() => switchTabBar(item.key)}
            >
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
