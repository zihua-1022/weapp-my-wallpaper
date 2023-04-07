import React, { useState, PropsWithChildren } from "react";
import { View, Image } from "@tarojs/components";
import SearchBox from "@components/SearchBox";
import logo from "@assets/img/logo.png";

import "./index.less";

type TStyle = {
  totalHeight: number;
  statusBarHeight: number;
  navBarHeight: number;
  windowWidth: number;
};

interface INavigationProps {
  styles: TStyle;
}

const TopNavigation: React.FC<INavigationProps & PropsWithChildren> = (
  props
) => {
  const { styles } = props;
  const handleSearch = (keyword: string) => {
    console.log(`搜索关键词：${keyword}`);
  };
  return (
    <View className="top-navbar">
      <View
        className="navbar-fixed"
        style={{ height: `${styles.totalHeight}px` }}
      >
        <View
          className="bar-status"
          style={{ height: `${styles.statusBarHeight}px` }}
        ></View>
        <View
          className="bar-content"
          style={{
            height: `${styles.navBarHeight}px`,
            width: `${styles.windowWidth}px`,
          }}
        >
          <Image className="bar-icon" src={logo}></Image>
          <SearchBox onSearch={handleSearch} />
        </View>
      </View>
    </View>
  );
};

export default TopNavigation;
