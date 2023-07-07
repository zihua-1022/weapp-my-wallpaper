import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import Taro from "@tarojs/taro";
import { View, Text, ScrollView, PageContainer } from "@tarojs/components";
import SearchBox from "@components/SearchBox";
import CustomNavBar from "@components/CustomNavBar";
import ImageCard, { TDataSource } from "@components/ImageCard";
import Swiper from "@components/Swiper";
import ImageDetails from "@components/ImageDetails";
import Loading from "@components/Loading";
import store, { RootState } from "@store/index";
import { setShowTabBar } from "@store/tabBar";
import { IBaseImgResult } from "@/api/model/baseModel";
import { IPcImgResult } from "@/api/model/computerModel";
import {
  getImageCategory,
  getDailyRecommend,
  getDailyPopular,
} from "@/api/home";
import { serverMap } from "@/services/config";

import styles from "./index.module.less";

function Home() {
  const navBarStyle = useSelector((state: RootState) => state.navBar);
  const [popularImgs, setPopularImgs] = useState<IBaseImgResult[]>([]);
  const [avatarImgs, setAvatarImgs] = useState<IPcImgResult[]>([]);
  const [pcImgs, setPcImgs] = useState<IPcImgResult[]>([]);
  const [recommendImgs, setRecommendImgs] = useState<IBaseImgResult[]>([]);
  const [detailImageMode, setDetailImageMode] = useState<
    "aspectFit" | "aspectFill" | "top" | "bottom" | "widthFix" | undefined
  >("aspectFit");
  const [currentImg, setCurrentImg] = useState<number>(0);
  const [currentKey, setCurrentKey] = useState<number>(-1);
  const [isScroll, setIsScroll] = useState<boolean>(false);
  console.log("currentKey: ", currentKey);
  const [detailsData, setDetailsData] = useState<TDataSource[]>([]);
  const [showPage, setShowPage] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const handleSearch = (keyword: string) => {
    console.log(`搜索关键词：${keyword}`);
  };
  // const toImageDetail = (img: TDataSource, index: number, viewType: number) => {
  //   console.log("indtoImageDetailex: ", index);
  //   setCurrentImg(index);
  //   setDetailsData([img]);
  //   setShowPage(true);
  //   store.dispatch(setShowTabBar(false));
  // };

  const toImagesDetail = (imgs: TDataSource[], index: number) => {
    store.dispatch(setShowTabBar(false));
    setCurrentImg(index);
    // setCurrentKey(index);
    setDetailsData(imgs);
    setShowPage(true);
  };

  const toImgsDetail = (imgs: TDataSource[], index: number) => {
    toImagesDetail(imgs, index);
    setIsScroll(false);
    setDetailImageMode("aspectFill");
  };

  // 头像pc
  const toScrollImgsDetail = (imgs: TDataSource[], index: number) => {
    toImagesDetail(imgs, index);
    setIsScroll(true);
    setDetailImageMode("aspectFit");
  };

  const detailSwiperChange = (currentIndex: number) => {
    console.log("detailSwiperChange: ");
    setCurrentKey(currentIndex);
  };

  const getImagesData = async () => {
    const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];

    const [popularRes, avatarRes, pcRes, recommendRes] = await Promise.all([
      getDailyPopular(),
      getImageCategory({ mid: 7 }),
      getImageCategory({ mid: 4 }),
      getDailyRecommend(),
    ]);
    const popularData = popularRes.status
      ? popularRes.data.map((item) => {
          const [imgWidth, imgHeight] = item.imgResolution?.split("*") || [];
          return {
            ...item,
            path: `${proxy}/${item.path}`,
            imgWidth: Math.floor(
              Number(imgWidth) * (navBarStyle.windowHeight / Number(imgHeight))
            ),
            imgHeight,
          };
        })
      : [];
    const avatarData = avatarRes.status
      ? avatarRes.data.map((item) => ({
          ...item,
          key: `avatar_${item.id}`,
          path: `${proxy}/${item.path}`,
        }))
      : [];
    const pcData = pcRes.status
      ? pcRes.data.map((item) => ({
          ...item,
          path: `${proxy}/${item.path}`,
        }))
      : [];
    const recommendData = recommendRes.status
      ? recommendRes.data.map((item) => ({
          ...item,
          key: `recommend_${item.id}`,
          path: `${proxy}/${item.path}`,
        }))
      : [];
    setPopularImgs(popularData);
    setAvatarImgs(avatarData);
    setPcImgs(pcData);
    setRecommendImgs(recommendData);
    setLoading(false);
  };

  useEffect(() => {
    getImagesData();
    // getDailyPopular().then((res) => {
    //   const { status, data } = res;
    //   if (status) {
    //     const result = data.map((item) => {
    //       const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
    //       const [imgWidth, imgHeight] = item.imgResolution?.split("*") || [];
    //       return {
    //         ...item,
    //         path: proxy + "/" + item.path,
    //         imgWidth: Math.floor(
    //           Number(imgWidth) * (navBarStyle.windowHeight / Number(imgHeight))
    //         ),
    //         imgHeight,
    //       };
    //     });
    //     setPopularImgs(result);
    //   }
    // });
    // getImageCategory({ mid: 7 }).then((res) => {
    //   const { status, data } = res;
    //   if (status) {
    //     const result = data.map((item) => {
    //       const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
    //       return {
    //         ...item,
    //         path: proxy + "/" + item.path,
    //       };
    //     });
    //     setAvatarImgs(result);
    //   }
    // });
    // getImageCategory({ mid: 4 }).then((res) => {
    //   const { status, data } = res;
    //   if (status) {
    //     const result = data.map((item) => {
    //       const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
    //       return {
    //         ...item,
    //         path: proxy + "/" + item.path,
    //       };
    //     });
    //     setPcImgs(result);
    //   }
    // });
    // getDailyRecommend().then((res) => {
    //   const { status, data } = res;
    //   if (status) {
    //     const result = data.map((item) => {
    //       const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
    //       return {
    //         ...item,
    //         path: proxy + "/" + item.path,
    //       };
    //     });
    //     setRecommendImgs(result);
    //     setLoading(false);
    //   }
    // });
  }, []);

  return (
    <View className={classNames("app", styles["home"])}>
      <CustomNavBar>
        <SearchBox onSearch={handleSearch} />
      </CustomNavBar>
      {loading && (
        <Loading
          containerStyle={{
            height: `${navBarStyle.windowHeight - navBarStyle.totalHeight}px`,
          }}
        />
      )}
      {!loading && (
        <>
          <View className={classNames("app-main", styles["home-main"])}>
            <View className={styles["home-header"]}>
              <Swiper
                dataSource={popularImgs}
                toImgsDetail={toImgsDetail}
              ></Swiper>
            </View>
            <View
              className={styles["home-content"]}
              style={{ padding: "14px 9px" }}
            >
              {avatarImgs.length > 0 && (
                <View className={styles["recommend-avatar"]}>
                  <View className={styles["desc"]}>
                    <View className={styles["title"]}>
                      {avatarImgs[0].cTitle}
                    </View>
                    <Text className={styles["subtitle"]}>
                      {avatarImgs[0].cDesc}
                    </Text>
                  </View>
                  <ScrollView
                    className={styles["scroll-box"]}
                    enhanced
                    // paging-enabled
                    fast-deceleration
                    scrollX
                    scrollWithAnimation
                    scroll-into-view={`img_${currentKey}`}
                  >
                    <ImageCard
                      style={{ flexWrap: "nowrap" }}
                      imgStyle={{
                        width: "100px",
                        height: "100px",
                        flex: "0 0 auto",
                      }}
                      dataSource={avatarImgs}
                      viewType={1}
                      toImgsDetail={toScrollImgsDetail}
                    />
                  </ScrollView>
                </View>
              )}
              {pcImgs.length > 0 && (
                <View className={styles["recommend-pc"]}>
                  <View className={styles["desc"]}>
                    <View className={styles["title"]}>{pcImgs[0].cTitle}</View>
                    <Text className={styles["subtitle"]}>
                      {pcImgs[0].cDesc}
                    </Text>
                  </View>
                  <ScrollView
                    className={styles["scroll-box"]}
                    enhanced
                    // paging-enabled
                    fast-deceleration
                    scrollX
                    scrollWithAnimation
                    // scroll-into-view={activeTabKey}
                  >
                    <ImageCard
                      style={{ flexWrap: "nowrap" }}
                      imgStyle={{
                        width: "230px",
                        height: "129px",
                        flex: "0 0 auto",
                      }}
                      dataSource={pcImgs}
                      viewType={1}
                      toImgsDetail={toImgsDetail}
                    />
                  </ScrollView>
                </View>
              )}
              {recommendImgs.length > 0 && (
                <View className={styles["recommend-daily"]}>
                  <View className={styles["desc"]}>
                    <View className={styles["title"]}>每日一图</View>
                  </View>
                  <ImageCard
                    imgStyle={{
                      width: "calc(50% - 10px)",
                    }}
                    dataSource={recommendImgs}
                    viewType={1}
                    toImgsDetail={toImgsDetail}
                  />
                </View>
              )}
            </View>
          </View>
          <PageContainer
            show={showPage}
            duration={500}
            position="right"
            onAfterLeave={() => {
              setCurrentImg(0);
              setShowPage(false);
              store.dispatch(setShowTabBar(true));
              // setDetailsData([])
            }}
            onBeforeLeave={(e) => {
              console.log(e);
            }}
          >
            <ImageDetails
              dataSource={detailsData}
              imgMode={detailImageMode}
              currentImg={currentImg}
              showDetails={showPage}
              scroll={isScroll}
              navigateBack={() => {
                setShowPage(false);
                store.dispatch(setShowTabBar(true));
                // Taro.pageScrollTo({ scrollTop: 0 });
              }}
              onChange={detailSwiperChange}
            />
          </PageContainer>
        </>
      )}
    </View>
  );
}

export default Home;
