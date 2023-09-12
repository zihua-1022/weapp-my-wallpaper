import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Taro, { useRouter } from "@tarojs/taro";
import { View } from "@tarojs/components";
import CustomNavBar from "@components/CustomNavBar";
import ImageCard, { TDataSource } from "@components/ImageCard";
import Loading from "@components/Loading";
import store, { RootState } from "@store/index";
import { setCurrentTab } from "@store/tabBar";
import { setMobileCategoryInfo } from "@store/category";
import { getCategoryTabs } from "@/api/category";
import { serverMap } from "@/services/config";
import { getProfileImg } from "@assets/img/profile";

import styles from "./index.module.less";

const Mobile: React.FC = () => {
  const router = useRouter();
  console.log("router: ", router);
  const { imgId, cid, imgProperty, activeTab, page, pageSize, to } =
    router.params;
  const currentTab = useSelector((state: RootState) => state.tabBar.currentTab);
  const navBarStyle = useSelector((state: RootState) => state.navBar);
  const [categoryData, setCategoryData] = useState<TDataSource[]>([]);
  const [imgsData, setImgsData] = useState<TDataSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const toImageDetails = (img: TDataSource, activeIndex: number) => {
    Taro.navigateTo({
      url: `/pages/category/index?imgId=${img.id}&cid=${img.cid}&imgProperty=${img.imgProperty}&activeTab=${activeIndex}&viewType=0&source=mobile`,
    });
  };

  useEffect(() => {
    if (to) {
      Taro.navigateTo({
        url: `/pages/${to}/index?imgId=${imgId}&cid=${cid}&imgProperty=${imgProperty}&activeTab=${activeTab}&page=${page}&pageSize=${pageSize}&source=mobile`,
      });
    }
    if (currentTab !== 1) {
      store.dispatch(setCurrentTab(1));
    }
    getCategoryTabs({ imgProperty: 1 }).then((res) => {
      const { status, data } = res;
      if (status) {
        const result = data.map((item, index) => {
          const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
          return {
            ...item,
            index,
            key: `tab_${index}`,
            path: `${proxy}/${item.path}`,
            dPath: `${proxy}/${item.dPath}`,
          };
        });
        store.dispatch(setMobileCategoryInfo(result));
        setCategoryData(result);
        setLoading(false);
      }
    });
    const imgs = [
      {
        id: 1,
        imgColor: "#3b504e",
        operationTitle: "头像昵称套图",
        operationDesc: "让你的朋友圈更有格调",
        operate: "立即查看",
        path: getProfileImg("subscribe"),
      },
    ];
    setImgsData(imgs);
  }, []);

  return (
    <View className={styles["mobile"]}>
      <CustomNavBar />
      {loading && (
        <Loading
          containerStyle={{
            height: `${navBarStyle.windowHeight}px`,
          }}
        />
      )}
      {!loading && (
        <View
          className="app-main"
          style={{ paddingTop: `${navBarStyle.totalHeight}px` }}
        >
          <ImageCard
            imgStyle={{
              width: "100%",
              height: "150px",
            }}
            dataSource={imgsData}
            viewType={0}
            toDetails={() => {
              Taro.showToast({
                title: "敬请期待！",
                icon: "none",
              });
            }}
          />
          <ImageCard
            imgStyle={{
              width: "calc(33.3% - 10px)",
              height: "140px",
            }}
            dataSource={categoryData}
            viewType={0}
            showBottomBtn
            toDetails={toImageDetails}
          />
        </View>
      )}
    </View>
  );
};

export default Mobile;
