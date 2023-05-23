import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import classNames from "classnames";
import Taro from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
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
  const userInfo = useSelector((state: RootState) => state.profile);

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
        {userInfo.user_id && (
          <View
            style={{
              textAlign: "center",
              color: "#fff",
            }}
          >
            暂无收藏
          </View>
        )}
        {!userInfo.user_id && (
          <Button
            style={{
              textAlign: "center",
              backgroundColor: "#000",
              color: "#fff",
            }}
          >
            请先登录！
          </Button>
        )}

        {/* <ImageCard
          dataSource={
            [
            ]
          }
          style={{
            gridTemplateColumns: "100%",
          }}
          imgStyle={{
            height: "180px",
            borderRadius: "10px",
          }}
        /> */}
      </View>
    </View>
  );
};

export default Collect;
