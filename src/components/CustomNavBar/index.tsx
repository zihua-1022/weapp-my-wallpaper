import React, { PropsWithChildren } from "react";
import { useSelector } from "react-redux";
import { View, Text, Image } from "@tarojs/components";
import { RootState } from "@store/index";

import { getImg } from "@assets/img";

import "./index.less";

export interface ICustomNavBarProps extends PropsWithChildren {
  backgroundColor?: any;
  isShowLogo?: boolean;
  titleText?: string;
}

const CustomNavBar: React.FC<ICustomNavBarProps> = ({
  backgroundColor,
  isShowLogo = true,
  titleText,
  children,
}) => {
  const navBarStyle = useSelector((state: RootState) => state.navBar);

  const toHomePage = () => {
    // Taro.switchTab({
    //   url: "/pages/home/index",
    // });
  };
  return (
    // <View
    //   className="top-navbar"
    //   style={{ paddingTop: `${navBarStyle.totalHeight}px` }}
    // >
    <View
      className="navbar-fixed"
      style={{
        height: `${navBarStyle.totalHeight}px`,
        backgroundColor: backgroundColor,
      }}
    >
      <View
        className="bar-status"
        style={{ height: `${navBarStyle.statusBarHeight}px` }}
      ></View>
      <View
        className="bar-content"
        style={{
          height: `${navBarStyle.navBarHeight}px`,
          width: `${navBarStyle.windowWidth}px`,
        }}
      >
        {isShowLogo && (
          <Image
            className="bar-icon"
            src={getImg("logo")}
            mode="aspectFit"
            onClick={toHomePage}
          ></Image>
        )}
        {titleText && <Text className="bar-title">{titleText}</Text>}
        {children}
      </View>
    </View>
    // </View>
  );
};

export default CustomNavBar;
