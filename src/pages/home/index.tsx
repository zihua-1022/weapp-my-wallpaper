import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import Taro, {
  useRouter,
  useShareAppMessage,
  usePullDownRefresh,
  useReachBottom,
} from "@tarojs/taro";
import { View, Text, ScrollView, PageContainer } from "@tarojs/components";
import SearchBox from "@components/SearchBox";
import CustomNavBar from "@components/CustomNavBar";
import ImageCard, { TDataSource } from "@components/ImageCard";
import Swiper from "@components/Swiper";
import ImageDetails from "@components/ImageDetails";
import Footer from "@components/Footer";
import Loading from "@components/Loading";
import store, { RootState } from "@store/index";
import { setCurrentTab, setShowTabBar } from "@store/tabBar";
import {
  setAvatarCategoryInfo,
  setComputerCategoryInfo,
} from "@store/category";
import { IBaseImgResult } from "@/api/model/baseModel";
import { IPcImgResult } from "@/api/model/computerModel";
import {
  getImageCategory,
  getDailyRecommend,
  getDailyPopular,
} from "@/api/home";
import { getCategoryTabs } from "@/api/category";
import { serverMap } from "@/services/config";

import styles from "./index.module.less";

const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
const dailyPageSize = 9;
const imageCategory = {
  //mid: imgProperty
  4: 0,
  7: 2,
};

function Home() {
  const router = useRouter();
  console.log("router: ", router);
  const { activeCategory, viewBlock, activeTab, page, pageSize, to } =
    router.params;
  console.log("activeCateg_______________ory: ", activeCategory);
  const activeTabIndex = Number(activeTab);
  const curPageSize = Number(pageSize || dailyPageSize);
  const currentTab = useSelector((state: RootState) => state.tabBar.currentTab);
  const navBarStyle = useSelector((state: RootState) => state.navBar);
  const [popularImgs, setPopularImgs] = useState<IBaseImgResult[]>([]);
  const [avatarImgs, setAvatarImgs] = useState<IPcImgResult[]>([]);
  const [pcImgs, setPcImgs] = useState<IPcImgResult[]>([]);
  const [recommendImgs, setRecommendImgs] = useState<IBaseImgResult[]>([]);
  const [detailImageMode, setDetailImageMode] = useState<
    "aspectFit" | "aspectFill" | "top" | "bottom" | "widthFix" | undefined
  >("aspectFit");
  const [activeBlock, setActiveBlock] = useState<string>("");
  const [currentImg, setCurrentImg] = useState<number>(0);
  const [currentKey, setCurrentKey] = useState<number>(-1);
  const [isScroll, setIsScroll] = useState<boolean>(false);
  const [detailsData, setDetailsData] = useState<TDataSource[]>([]);
  const [showPage, setShowPage] = useState(false);
  const [showDateTime, setShowDateTime] = useState(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [moreLoading, setMoreLoading] = useState<boolean>(false);
  const [currentDailyPage, setCurrentDailyPage] = useState<number>(
    Number(page || 0)
  );
  const [dailyPageTotal, setDailyPageTotal] = useState<number>(0);

  useShareAppMessage((res) => {
    let shareAppMessage = {};
    if (res.from === "button" || showPage) {
      // 来自页面内转发按钮
      shareAppMessage = {
        title: "给你一张非常nice的壁纸 ~",
        path: `/pages/home/index?activeCategory=${activeBlock}&activeTab=${currentImg}&viewType=${1}&page=${currentDailyPage}&pageSize=${curPageSize}&source=home`,
      };
    } else {
      shareAppMessage = {
        title: "Zhua壁纸头像",
      };
    }
    return shareAppMessage;
  });

  usePullDownRefresh(() => {
    getImagesData().finally(() => {
      Taro.stopPullDownRefresh();
    });
  });

  useReachBottom(() => {
    if (dailyPageTotal === recommendImgs.length) {
      return;
    }
    setMoreLoading(true);
    getDailyRecommend({
      page: currentDailyPage + 1,
      pageSize: curPageSize,
    }).then(({ data }) => {
      setCurrentDailyPage(currentDailyPage + 1);
      const dailyImgsData = [...recommendImgs];
      const recommendData = handleInitData(data.value, "recommend");
      dailyImgsData.push(...recommendData);
      setRecommendImgs(dailyImgsData);
      setMoreLoading(false);
    });
  });

  const handleSearch = (keyword: string) => {
    console.log(`搜索关键词：${keyword}`);
  };

  const toViewMore = (img: IPcImgResult, activeIndex: number) => {
    console.log("itoViewMoremg: ", img);
    Taro.navigateTo({
      url: `/pages/category/index?activeCategory=${activeBlock}&mid=${img.mid}&cid=${img.cid}&imgProperty=${img.imgProperty}&activeTab=${activeIndex}&viewType=2&source=home`,
    });
  };
  // const toImageDetail = (img: TDataSource, index: number, viewType: number) => {
  //   console.log("indtoImageDetailex: ", index);
  //   setCurrentImg(index);
  //   setDetailsData([img]);
  //   setShowPage(true);
  //   store.dispatch(setShowTabBar(false));
  // };

  const toImagesDetail = (imgs: TDataSource[], index: number) => {
    console.log("i----------------mgs: ", imgs);
    store.dispatch(setShowTabBar(false));
    setCurrentImg(index);
    // setCurrentKey(index);
    setDetailsData(imgs);
    setShowPage(true);
  };

  const toImgsDetail = (imgs: TDataSource[], index: number) => {
    toImagesDetail(imgs, index);
    setIsScroll(false);
    setShowDateTime(true);
    setDetailImageMode("aspectFill");
  };

  const toSwiperImgsDetail = (imgs: TDataSource[], index: number) => {
    toImgsDetail(imgs, index);
    setActiveBlock("swiper");
  };

  // 头像pc
  const toAvatarImgsDetail = (imgs: TDataSource[], index: number) => {
    // toImagesDetail(imgs, index);
    // setIsScroll(true);
    // setShowDateTime(false);
    // setDetailImageMode("aspectFit");
    // setActiveBlock("avatar");
    const urls = imgs.map((img) => img.path);
    Taro.previewImage({
      current: imgs[index].path, // 当前显示图片的http链接
      urls: urls, // 需要预览的图片http链接列表
    });
  };

  const toPcImgsDetail = (imgs: TDataSource[], index: number) => {
    toImagesDetail(imgs, index);
    setIsScroll(true);
    setShowDateTime(false);
    setDetailImageMode("aspectFit");
    setActiveBlock("pc");
  };

  const toRecommendImgsDetail = (imgs: TDataSource[], index: number) => {
    toImgsDetail(imgs, index);
    setActiveBlock("recommend");
  };

  const detailSwiperChange = (currentIndex: number) => {
    setCurrentKey(currentIndex);
  };

  const handleInitData = (data: IBaseImgResult[], key: string) => {
    return data.map((item) => ({
      ...item,
      key: `${key}_${item.id}`,
      path: `${proxy}/${item.path}`,
      dPath: `${proxy}/${item.dPath}`,
    }));
  };

  const getImagesData = async () => {
    const [popularRes, avatarRes, pcRes, recommendRes] = await Promise.all([
      getDailyPopular(),
      getImageCategory({ mid: 7, imgProperty: 2 }),
      getImageCategory({ mid: 4, imgProperty: 0 }),
      getDailyRecommend({
        page: activeCategory ? 0 : currentDailyPage,
        pageSize: activeCategory
          ? (currentDailyPage + 1) * curPageSize
          : curPageSize,
      }),
    ]);

    const { value: avatarImgsData } = avatarRes.data;
    const { value: pcImgsData } = pcRes.data;
    const { total: dailyTotal, value: dailyImgsData } = recommendRes.data;
    const popularData = handleInitData(popularRes.data, "popular");
    const avatarData = handleInitData(avatarImgsData, "avatar");
    const pcData = handleInitData(pcImgsData, "pc");
    const dailyData = handleInitData(dailyImgsData, "recommend");

    setDailyPageTotal(dailyTotal);
    setPopularImgs(popularData);
    setAvatarImgs(avatarData);
    setPcImgs(pcData);
    setRecommendImgs(dailyData);
    setLoading(false);
    if (activeCategory) {
      const actionMap = {
        swiper: () => toSwiperImgsDetail(popularData, activeTabIndex),
        avatar: () => toAvatarImgsDetail(avatarData, activeTabIndex),
        pc: () => toPcImgsDetail(pcData, activeTabIndex),
        recommend: () => toRecommendImgsDetail(dailyData, activeTabIndex),
      };
      actionMap[activeCategory]();
    }
  };

  useEffect(() => {
    const viewActionMap = {
      avatar: (img: IPcImgResult) => toViewMore(img, activeTabIndex),
      pc: (img: IPcImgResult) => toViewMore(img, activeTabIndex),
    };

    const actionMap = {
      "category-7": (tabs: IPcImgResult[]) => {
        store.dispatch(setAvatarCategoryInfo(tabs));
        viewBlock && viewActionMap[viewBlock](tabs[activeTabIndex]);
      },
      "category-4": (tabs: IPcImgResult[]) => {
        store.dispatch(setComputerCategoryInfo(tabs));
        viewBlock && viewActionMap[viewBlock](tabs[activeTabIndex]);
      },
    };

    getImagesData();

    Object.keys(imageCategory).forEach((mid) => {
      getCategoryTabs({
        mid,
        imgProperty: imageCategory[mid],
      }).then(({ data: tabsData }) => {
        const res = tabsData.map((tab, index) => {
          return {
            ...tab,
            key: `tab_${index}`,
            path: `${proxy}/${tab.path}`,
            dPath: `${proxy}/${tab.dPath}`,
          };
        });
        actionMap[`category-${mid}`](res);
      });
    });
    if (currentTab !== 0) {
      store.dispatch(setCurrentTab(0));
    }
  }, []);

  return (
    <View className={classNames(styles["home"])}>
      <CustomNavBar>
        <SearchBox onSearch={handleSearch} />
      </CustomNavBar>
      {loading && (
        <Loading
          containerStyle={{
            height: `${navBarStyle.windowHeight}px`,
          }}
        />
      )}
      {!loading && (
        <>
          <View
            className={styles["home-main"]}
            style={{ paddingTop: `${navBarStyle.totalHeight}px` }}
          >
            <View className={styles["home-header"]}>
              <Swiper
                dataSource={popularImgs}
                toImgsDetail={toSwiperImgsDetail}
              ></Swiper>
            </View>
            <View className={styles["home-content"]}>
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
                      showMore
                      viewType={1}
                      toImgsDetail={toAvatarImgsDetail}
                      toViewMore={toViewMore}
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
                        width: "260px",
                        height: "140px",
                        flex: "0 0 auto",
                      }}
                      dataSource={pcImgs}
                      showMore
                      viewType={1}
                      toImgsDetail={toPcImgsDetail}
                      toViewMore={toViewMore}
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
                      height: "240px",
                    }}
                    dataSource={recommendImgs}
                    viewType={1}
                    toImgsDetail={toRecommendImgsDetail}
                  />
                  <Footer
                    loading={moreLoading}
                    hasMore={dailyPageTotal !== recommendImgs.length}
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
            }}
            onBeforeLeave={(e) => {
              console.log(e);
            }}
          >
            <ImageDetails
              dataSource={detailsData}
              imgMode={detailImageMode}
              currentImg={currentImg}
              showDateTime={showDateTime}
              showDetails={showPage}
              scroll={isScroll}
              navigateBack={() => {
                setShowPage(false);
                store.dispatch(setShowTabBar(true));
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
