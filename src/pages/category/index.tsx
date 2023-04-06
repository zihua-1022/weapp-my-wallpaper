import { useState, useEffect } from "react";
import classNames from "classnames";
import {
  View,
  Text,
  Swiper,
  SwiperItem,
  NavigationBar,
  PageMeta,
} from "@tarojs/components";
import { AtButton, AtTabBar } from "taro-ui";
import Taro from "@tarojs/taro";
import SlideTabs from "@components/SlideTabs";
import ImageCard from "@components/ImageCard";
import { categoryData, ICategoryDataProps, ICategory } from "./data";
// import "taro-ui/dist/style/components/button.scss"; // 按需引入
import "./index.less";

function Category() {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const toBlogPage = () => {
    Taro.navigateTo({ url: "/pages/blog/index?blogTitle=" });
  };
  const [imgData, setImgData] = useState<ICategory[]>([]);
  const swiperChange = (e) => {
    setCurrentTab(e.detail.current);
  };
  const swiperTransition = (e) => {
    console.log(e.detail);
  };

  useEffect(() => {
    setImgData(categoryData);
  }, []);

  return (
    <View
      className="category"
      style={{
        height: "100%",

        // padding: "20rpx 28rpx 0",
        // backgroundColor: "#2A2C2C",
      }}
    >
      <SlideTabs
        dataSource={imgData}
        activeTabKey={`tab_${currentTab}`}
        changeTab={setCurrentTab}
      >
        <Swiper
          style={{
          height: "calc(100vh - 62px)",
          marginTop: "62px",
          overflow:"auto",
        }}
          className="slide-content"
          current={currentTab}
          onChange={swiperChange}
          onTransition={swiperTransition}
          easing-function="easeOutCubic"
          
        >
          {imgData.length &&
            imgData.map((item,index) => {
              return (
                <SwiperItem className={classNames("swiper-item",{"active":currentTab===index})} key={item.id}>
                  <ImageCard dataSource={item.data} style={{padding: "0 14px"}}  imgStyle={{height: "200px",}} />
                </SwiperItem>
              );
            })}
        </Swiper>
      </SlideTabs>
      {/* <AtTabBar
        fixed
        tabList={[
          { title: "0", iconType: "home" },
          { title: "1", text: 8 },
          { title: "2", iconType: "heart" },
          { title: "3", text: "new" },
          { title: "4", dot: true },
        ]}
        onClick={handleClick}
        current={current}
      /> */}
    </View>
  );
}

export default Category;
