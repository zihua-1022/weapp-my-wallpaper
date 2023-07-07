import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import Taro, { useRouter } from "@tarojs/taro";
import { View, Swiper, SwiperItem, PageContainer } from "@tarojs/components";
import CustomNavBar from "@components/CustomNavBar";
import TabBar from "@components/TabBar";
import SlideTabs, { IImgProps } from "@components/SlideTabs";
import ImageCard, { TDataSource } from "@components/ImageCard";
import ImageDetails from "@components/ImageDetails";
import Loading from "@components/Loading";
import store, { RootState } from "@store/index";
import { setShowTabBar } from "@store/tabBar";
import { TImgsTreeData, arrCompositeTree } from "@utils/tools";
import { getCategoryTabs, getCategoryImage } from "@/api/category";
import { serverMap } from "@/services/config";
import { getTabBarImg } from "@assets/img/tabBar";
// import { categoryData, ICategoryDataProps, ICategory } from "./data";
import styles from "./index.module.less";

const Category: React.FC = () => {
  const router = useRouter();
  const { imgId, cid, isPhone, activeTab, viewType } = router.params;
  const navBarStyle = useSelector((state: RootState) => state.navBar);
  const tabsData = useSelector((state: RootState) => state.category);
  const [imgsData, setImgsData] = useState<TImgsTreeData[]>([]);
  const [detailsData, setDetailsData] = useState<TDataSource[]>([]);
  const [currentTab, setCurrentTab] = useState<number>(Number(activeTab));
  const [currentImg, setCurrentImg] = useState<number>(0);
  const [swiperHeight, setSwiperHeight] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<string | undefined>(cid);
  const [showPage, setShowPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const toImgsDetail = (img: TDataSource[], index: number) => {
    setCurrentImg(index);
    setShowPage(true);
  };

  const swiperChange = (e) => {
    const { current, currentItemId } = e.detail;
    setLoading(true);
    setCurrentTab(current);
    setCategoryId(currentItemId);
    getImagesData({ isPrimary: 0, isPhone, cid: currentItemId });
  };

  const getImagesData = (params: {
    isPrimary: number;
    isPhone?: number | string;
    cid?: string;
  }) => {
    getCategoryImage(params).then((res) => {
      const { status, data } = res;
      if (status) {
        const result = data.map((item) => {
          const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
          const [imgWidth, imgHeight] = item.imgResolution?.split("*") || [];
          return {
            ...item,
            path: proxy + "/" + item.path,
            imgWidth: Math.floor(
              Number(imgWidth) * (navBarStyle.windowHeight / Number(imgHeight))
            ),
            imgHeight,
          };
        });
        setDetailsData(result);
        const imgDataTree = arrCompositeTree(tabsData, result);
        const swiperItemHeight = Math.ceil(result.length / 3) * 210;
        const residueHeight =
          navBarStyle.windowHeight - navBarStyle.totalHeight - 55;
        const heightResult =
          swiperItemHeight > residueHeight
            ? swiperItemHeight + 14
            : residueHeight;
        setSwiperHeight(heightResult);
        setImgsData(imgDataTree);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    // store.dispatch(setShowTabBar(false));
    getImagesData({ isPrimary: 0, isPhone, cid });
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
          changeTab={swiperChange}
          style={{ top: `${navBarStyle.totalHeight}px` }}
        ></SlideTabs>

        <Swiper
          style={{
            height: `${swiperHeight}px`,
          }}
          className={styles["slide-content"]}
          current={currentTab}
          onChange={swiperChange}
          // onTransition={swiperTransition}
          easing-function="easeOutCubic"
        >
          {imgsData.length &&
            imgsData.map((item) => {
              return (
                <SwiperItem
                  className={styles["swiper-item"]}
                  itemId={String(item.cid)}
                  key={item.cid}
                >
                  {loading && (
                    <Loading
                      containerStyle={{
                        height: `${
                          navBarStyle.windowHeight -
                          navBarStyle.totalHeight -
                          55
                        }px`,
                      }}
                    />
                  )}
                  {!loading && (
                    <ImageCard
                      style={{ padding: "0rpx 18rpx 28rpx" }}
                      imgStyle={{
                        width: "calc(33.3% - 10px)",
                        height: "200px",
                      }}
                      className="image-card"
                      dataSource={item.children}
                      viewType={1}
                      toImgsDetail={toImgsDetail}
                    />
                  )}
                </SwiperItem>
              );
            })}
        </Swiper>
      </View>
      <PageContainer
        show={showPage}
        duration={500}
        position="right"
        onAfterLeave={() => {
          setCurrentImg(0);
          setShowPage(false);
          // store.dispatch(setShowTabBar(true));
        }}
      >
        <ImageDetails
          dataSource={detailsData}
          currentImg={currentImg}
          showDetails={showPage}
          navigateBack={() => {
            setShowPage(false);
            // store.dispatch(setShowTabBar(true));
          }}
        />
      </PageContainer>
    </View>
  );
};

export default Category;
