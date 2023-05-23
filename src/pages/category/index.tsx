import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import Taro from "@tarojs/taro";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import CustomNavBar from "@components/CustomNavBar";
import SlideTabs, { IImgProps } from "@components/SlideTabs";
import ImageCard from "@components/ImageCard";
import { imgsListToTree } from "@utils/tools";
import { getCategoryTabs, getCategoryImage } from "@/api/category";
import { serverMap } from "@/services/config";
import { RootState } from "@store/index";
import { IImgResultModel } from "@/api/model/baseModel";
// import { categoryData, ICategoryDataProps, ICategory } from "./data";
// import "taro-ui/dist/style/components/button.scss"; // 按需引入
import styles from "./index.module.less";

function Category() {
  const navBarStyle = useSelector((state: RootState) => state.navBar);
  const [swiperHeight, setSwiperHeight] = useState<number[]>([]);
  const swiperItem = useRef(null);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [tabsData, setTabsData] = useState<IImgResultModel[]>([]);
  const swiperChange = (e) => {
    setCurrentTab(e.detail.current);
  };
  const swiperTransition = (e) => {
    console.log(e.detail);
  };

  useEffect(() => {
    // getCategoryTabs().then((res) => {
    //   const { status, data } = res;
    //   if (status) {
    //     const result = data.map((item, index) => {
    //       const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
    //       item.path = proxy + "/" + item.path;
    //       item.key = `tab_${index}`;
    //       return {
    //         ...item,
    //       };
    //     });
    //     setTabsData(result);
    //   }
    // });
    getCategoryImage().then((res) => {
      const { status, data } = res;
      if (status) {
        const result = data.map((item) => {
          const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
          return {
            ...item,
            path: proxy + "/" + item.path,
          };
        });
        const imgsTree = imgsListToTree(result);
        const totalHeight: number[] = [];
        imgsTree.forEach((item, index) => {
          item.key = `tab_${index}`;
          const itemHeight = Math.ceil(item.children.length / 3) * 216 + 65;
          const rHeight =
            navBarStyle.windowHeight > itemHeight
              ? navBarStyle.windowHeight - navBarStyle.totalHeight
              : itemHeight;
          totalHeight.push(rHeight);
        });
        setTabsData(imgsTree);
        console.log("imgsTree: ", imgsTree);
        setSwiperHeight(totalHeight);
      }
    });
    // categoryData.forEach((item) => {
    //   const itemHeight = Math.ceil(item.data.length / 3) * 216 + 65;
    //   const rHeight =
    //     navBarStyle.windowHeight > itemHeight
    //       ? navBarStyle.windowHeight - navBarStyle.totalHeight
    //       : itemHeight;
    //   swiperHeight.push(rHeight);
    // });
    // setTabsData(categoryData);
  }, []);

  return (
    <View className={classNames("app", styles["category"])}>
      <CustomNavBar />
      <View
        className={classNames("app-main", styles["category-main"])}
        // style={{
        //   height: `calc(100vh - ${navBarStyle.totalHeight}px)`,
        //   // marginTop: `${navBarStyle.totalHeight}px`,
        //   overflowY: "auto",
        // }}
      >
        <SlideTabs
          dataSource={tabsData}
          activeTabKey={`tab_${currentTab}`}
          changeTab={setCurrentTab}
          style={{ top: `${navBarStyle.totalHeight}px` }}
        ></SlideTabs>
        <Swiper
          style={{
            height: `${swiperHeight[currentTab]}px`,
          }}
          className={styles["slide-content"]}
          current={currentTab}
          onChange={swiperChange}
          onTransition={swiperTransition}
          easing-function="easeOutCubic"
        >
          {tabsData.length &&
            tabsData.map((item, index) => {
              return (
                <SwiperItem className="swiper-item" key={item.id}>
                  <ImageCard
                    // ref={}
                    className="image-card"
                    dataSource={item.children}
                    style={{
                      padding: "0 14px 14px",
                    }}
                    imgStyle={{ height: "200px" }}
                  />
                </SwiperItem>
              );
            })}
        </Swiper>
      </View>
    </View>
  );
}

export default Category;
