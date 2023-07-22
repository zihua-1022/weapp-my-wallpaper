import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { useShareAppMessage } from "@tarojs/taro";
import { View, Image, ShareElement, PageContainer } from "@tarojs/components";
import CustomNavBar from "@components/CustomNavBar";
import ImageCard, { TDataSource } from "@components/ImageCard";
import ImageDetails from "@components/ImageDetails";
import Loading from "@components/Loading";
import store, { RootState } from "@store/index";
import { setShowTabBar } from "@store/tabBar";
import { imgsListToTree2, TImgsTreeData } from "@utils/tools";
import { getImageRecommend } from "@/api/computer";
import { serverMap } from "@/services/config";

import styles from "./index.module.less";

const Computer: React.FC = () => {
  const navBarStyle = useSelector((state: RootState) => state.navBar);
  const [showPage, setShowPage] = useState(false);
  const [imgsTreeData, setImgsTreeData] = useState<TImgsTreeData[]>([]);
  const [currentImg, setCurrentImg] = useState<number>(0);
  const [detailsData, setDetailsData] = useState<TDataSource[]>([]);
  const [imagesData, setImagesData] = useState<TDataSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useShareAppMessage((res) => {
    let shareAppMessage = {};
    if (res.from === "button" || showPage) {
      // 来自页面内转发按钮
      shareAppMessage = {
        title: "给你一张非常nice的壁纸 ~",
        // path: "/page/user?id=123",
      };
    } else {
      shareAppMessage = {
        title: "Zhua壁纸头像",
        // path: "/page/user?id=123",
      };
    }
    return shareAppMessage;
  });

  const toImageDetails = (imgs: TDataSource[], index: number) => {
    store.dispatch(setShowTabBar(false));
    setCurrentImg(index);
    setDetailsData(imgs);
    setShowPage(true);
  };

  const getImagesData = () => {
    getImageRecommend().then((res) => {
      const { status, data } = res;
      if (status) {
        const result = data.map((item) => {
          const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
          return {
            ...item,
            path: proxy + "/" + item.path,
          };
        });
        const imgsTree = imgsListToTree2(result);
        setImgsTreeData(imgsTree);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getImagesData();
  }, []);

  return (
    <View className={classNames("app", styles["computer"])}>
      <CustomNavBar />
      {loading && (
        <Loading
          containerStyle={{
            height: `${navBarStyle.windowHeight - navBarStyle.totalHeight}px`,
          }}
        />
      )}
      {!loading && (
        <>
          <View className={classNames("app-main", styles["computer-main"])}>
            {imgsTreeData.length > 0 &&
              imgsTreeData.map((item) => {
                return (
                  <View
                    className={styles["computer-category-card"]}
                    key={item.mid}
                  >
                    <View className={styles["category-desc"]}>
                      <View className={styles["category-desc-left"]}>
                        <View className={styles["title"]}>{item.cTitle}</View>
                        <View className={styles["subtitle"]}>{item.cDesc}</View>
                      </View>
                      <View className={styles["btn"]}>More .</View>
                    </View>
                    <ImageCard
                      imgStyle={{
                        width: "100%",
                        height: "180px",
                      }}
                      dataSource={item.children}
                      viewType={2}
                      toImgsDetail={toImageDetails}
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
