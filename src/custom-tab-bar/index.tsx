import React, { PropsWithChildren } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { useSelector, useDispatch } from "react-redux";
import { getTabBarImg } from "@assets/img/tabBar";
import { RootState } from "../store";
import { setCurrentTab } from "../store/tabBar";

import "./index.less";

const CustomTabBar: React.FC<PropsWithChildren> = () => {
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
        ...getTabBarImg("home"),
      },
      {
        key: 1,
        pagePath: "/pages/mobile/index",
        text: "",
        ...getTabBarImg("mobile"),
      },
      {
        key: 2,
        pagePath: "/pages/computer/index",
        text: "",
        ...getTabBarImg("pc"),
      },
      {
        key: 3,
        pagePath: "/pages/profile/index",
        text: "",
        ...getTabBarImg("profile"),
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
