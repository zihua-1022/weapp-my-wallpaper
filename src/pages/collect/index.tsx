import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import classNames from "classnames";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import SearchBox from "@components/SearchBox";
import CustomNavBar from "@components/CustomNavBar";
import ImageCard from "@components/ImageCard";
// import img1 from "@assets/img/kobe.png";
// import img2 from "@assets/img/测试2.jpg";
// import img3 from "@assets/img/测试3.jpg";
// import img4 from "@assets/img/测试4.jpg";
// import img5 from "@assets/img/测试5.jpg";

import styles from "./index.module.less";

const Collect: React.FC = () => {
  const navBarStyle = useSelector((state: RootState) => state.navBar);

  const handleSearch = (keyword: string) => {
    console.log(`搜索关键词：${keyword}`);
  };
  return (
    <View className={classNames("app", styles["collect"])}>
      <CustomNavBar>
        <SearchBox onSearch={handleSearch} />
      </CustomNavBar>
      <View
        className={classNames("app-main", styles["collect-main"])}
        // style={
        //   {
        //     // height: `calc(100vh - ${navBarStyle.totalHeight}px)`,
        //     // position: "relative",
        //     // overflowY: "auto",
        //   }
        // }
      >
        <ImageCard
          dataSource={
            [
              // { id: 1, path: img1 },
              // { id: 2, path: img2 },
              // { id: 3, path: img3 },
              // { id: 4, path: img4 },
              // { id: 5, path: img5 },
            ]
          }
          style={{
            gridTemplateColumns: "100%",
          }}
          imgStyle={{
            height: "180px",
            borderRadius: "10px",
          }}
        />
      </View>
    </View>
  );
};

export default Collect;
