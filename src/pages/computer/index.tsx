import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import Taro, { useRouter, useShareAppMessage } from "@tarojs/taro";
import { View, PageContainer } from "@tarojs/components";
import CustomNavBar from "@components/CustomNavBar";
import ImageCard, { TDataSource } from "@components/ImageCard";
import ImageDetails from "@components/ImageDetails";
import Loading from "@components/Loading";
import store, { RootState } from "@store/index";
import { setCurrentTab, setShowTabBar } from "@store/tabBar";
import {
  setComputerCategoryInfo,
  setOfficialCategoryInfo,
  setNaturalCategoryInfo,
} from "@store/category";
import { imgsListToTree2, TImgsTreeData } from "@utils/tools";
import { IPcImgResult } from "@/api/model/computerModel";
import { getImageRecommend } from "@/api/computer";
import { getCategoryTabs } from "@/api/category";
import { serverMap } from "@/services/config";

import styles from "./index.module.less";

const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];

const Computer: React.FC = () => {
  const router = useRouter();
  const { activeCategory, activeTab, to } = router.params;
  const currentTab = useSelector((state: RootState) => state.tabBar.currentTab);
  const navBarStyle = useSelector((state: RootState) => state.navBar);
  const [showPage, setShowPage] = useState(false);
  const [imgsTreeData, setImgsTreeData] = useState<TImgsTreeData[]>([]);
  const [activeBlock, setActiveBlock] = useState<number | string>(0);
  const [currentImg, setCurrentImg] = useState<number>(0);
  const [detailsData, setDetailsData] = useState<TDataSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useShareAppMessage((res) => {
    let shareAppMessage = {};
    if (res.from === "button" || showPage) {
      // 来自页面内转发按钮
      shareAppMessage = {
        title: "给你一张非常nice的壁纸 ~",
        path: `/pages/computer/index?activeCategory=${activeBlock}&activeTab=${currentImg}&viewType=${2}&source=computer`,
      };
    }
    return shareAppMessage;
  });

  const toViewMore = (
    img: TImgsTreeData,
    activeIndex: number,
    cid?: number
  ) => {
    console.log("img: ", img);
    Taro.navigateTo({
      url: `/pages/category/index?mid=${
        img.mid
      }&cid=${cid}&imgProperty=${0}&activeTab=${activeIndex}&viewType=2&source=computer`,
    });
  };

  const toImageDetails = (
    imgs: TDataSource[],
    index: number,
    mid: number | string
  ) => {
    store.dispatch(setShowTabBar(false));
    setActiveBlock(mid);
    setCurrentImg(index);
    setDetailsData(imgs);
    setShowPage(true);
  };

  const getImagesData = () => {
    const actionMap = {
      1: (tabs: IPcImgResult[]) =>
        store.dispatch(setOfficialCategoryInfo(tabs)),
      3: (tabs: IPcImgResult[]) => store.dispatch(setNaturalCategoryInfo(tabs)),
      4: (tabs: IPcImgResult[]) =>
        store.dispatch(setComputerCategoryInfo(tabs)),
    };

    getImageRecommend({
      isPrimary: 1,
      imgProperty: 0,
    }).then(({ data }) => {
      const result = data.map((item) => {
        return {
          ...item,
          path: `${proxy}/${item.path}`,
          dPath: `${proxy}/${item.dPath}`,
        };
      });

      const imgsTree = imgsListToTree2(result);
      if (activeCategory) {
        console.log("activeC-------------ategory: ", activeCategory);
        const imgsDetail = imgsTree.filter(
          (item) => item.mid == activeCategory
        );
        toImageDetails(
          imgsDetail[0].children,
          Number(activeTab),
          activeCategory
        );
      }
      setImgsTreeData(imgsTree);
      console.log("imgsTree: ", imgsTree);
      setLoading(false);
      imgsTree.forEach((item) => {
        getCategoryTabs({
          mid: item.mid,
          imgProperty: 0,
        }).then(({ data: tabsData }) => {
          const tabsResult = tabsData.map((tab, index) => {
            return {
              ...tab,
              key: `tab_${index}`,
              path: `${proxy}/${tab.path}`,
              dPath: `${proxy}/${tab.dPath}`,
            };
          });
          actionMap[item.mid](tabsResult);
        });
      });
    });
  };

  useEffect(() => {
    getImagesData();
    if (currentTab !== 2) {
      store.dispatch(setCurrentTab(2));
    }
  }, []);

  return (
    <View className={styles["computer"]}>
      <CustomNavBar />
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
            className={classNames("app-main", styles["computer-main"])}
            style={{ paddingTop: `${navBarStyle.totalHeight}px` }}
          >
            {imgsTreeData.length > 0 &&
              imgsTreeData.map((item) => {
                return (
                  <View className={styles["category-card"]} key={item.mid}>
                    <View className={styles["category-desc"]}>
                      <View className={styles["category-desc-left"]}>
                        <View className={styles["title"]}>{item.cTitle}</View>
                        <View className={styles["subtitle"]}>{item.cDesc}</View>
                      </View>
                      <View
                        className={styles["btn"]}
                        onClick={() =>
                          toViewMore(item, 0, item.children[0].cid)
                        }
                      >
                        {"更多 >"}
                      </View>
                    </View>
                    <ImageCard
                      imgStyle={{
                        width: "100%",
                        height: "180px",
                      }}
                      dataSource={item.children}
                      viewType={2}
                      toImgsDetail={(
                        imgs: TDataSource[],
                        activeIndex: number
                      ) => toImageDetails(imgs, activeIndex, item.mid)}
                    />
                  </View>
                );
              })}
          </View>
          <PageContainer
            show={showPage}
            duration={500}
            position="center"
            onAfterLeave={() => {
              setCurrentImg(0);
              setShowPage(false);
              store.dispatch(setShowTabBar(true));
            }}
          >
            <ImageDetails
              dataSource={detailsData}
              scale
              currentImg={currentImg}
              showDetails={showPage}
              showDateTime={false}
              navigateBack={() => {
                setShowPage(false);
                store.dispatch(setShowTabBar(true));
              }}
            />
          </PageContainer>
        </>
      )}
    </View>
  );
};

export default Computer;
