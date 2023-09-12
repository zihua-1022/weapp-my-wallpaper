import React, { useEffect, PropsWithChildren } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import { useSelector } from "react-redux";
import { getTabBarImg } from "@assets/img/tabBar";
import store, { RootState } from "@store/index";
import { setCurrentTab } from "@store/tabBar";

import "./index.less";

export type TDataSource = {
  id: number | string;
  path?: string;
  text?: string;
  iconPath: string;
  selectedIconPath: string;
};

export type TCustomTabBarProps = {
  dataSource: TDataSource[];
  className?: string;
  imgMode?: "aspectFill" | "aspectFit" | "widthFix" | "top" | "bottom";
  showTabBar?: boolean;
  navigateBack?: () => void;
  downloadImage?: () => void;
};

const TabBar: React.FC<TCustomTabBarProps & PropsWithChildren> = ({
  dataSource,
  className,
  imgMode = "aspectFit",
  showTabBar = true,
  navigateBack,
  downloadImage,
  children,
}) => {
  const actionMap = {
    // goBack: () => (navigateBack ? navigateBack() : Taro.navigateBack()),
    goBack: navigateBack,
    download: downloadImage,
    // share: onShareAppMessage,
  };

  const handleNavigate = (actionId: string | number) => {
    actionMap[actionId]();
  };

  return (
    <>
      {showTabBar && (
        <View className="tab-bar">
          {dataSource.length > 0 && (
            <>
              {dataSource.map((item) => {
                return (
                  <View
                    className="tab-bar-item"
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                  >
                    <Image
                      className={`icon ${item.id}`}
                      src={item.selectedIconPath}
                      mode={imgMode}
                    ></Image>
                    {item.text && <Text className="text">{item.text}</Text>}
                  </View>
                );
              })}
              <View className="tab-bar-item">
                <Button className="button-share" open-type="share">
                  <Image
                    className="icon"
                    src={getTabBarImg("share").selectedIconPath}
                    mode={imgMode}
                  ></Image>
                </Button>
              </View>
            </>
          )}
        </View>
      )}
    </>
  );
};

export default TabBar;
