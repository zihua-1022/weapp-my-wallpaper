import React, { PropsWithChildren } from "react";
import { useSelector } from "react-redux";
import { View, Image } from "@tarojs/components";
import { RootState } from "@store/index";

import logo from "@assets/img/logo.png";

import "./index.less";

const CustomNavBar: React.FC<PropsWithChildren> = ({ children }) => {
  const navBarStyle = useSelector((state: RootState) => state.navBar);
  return (
    // <View
    //   className="top-navbar"
    //   style={{ paddingTop: `${navBarStyle.totalHeight}px` }}
    // >
    <View
      className="navbar-fixed"
      style={{
        height: `${navBarStyle.totalHeight}px`,
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
        <Image className="bar-icon" src={logo}></Image>
        {children}
      </View>
    </View>
    // </View>
  );
};

export default CustomNavBar;
