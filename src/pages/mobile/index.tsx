import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import Taro from "@tarojs/taro";
import { View, PageContainer } from "@tarojs/components";
import CustomNavBar from "@components/CustomNavBar";
import ImageCard, { TDataSource } from "@components/ImageCard";
import Loading from "@components/Loading";
import store, { RootState } from "@store/index";
import { setCategoryInfo } from "@store/category";
import { getCategoryImage } from "@/api/category";
import { serverMap } from "@/services/config";
import { getProfileImg } from "@assets/img/profile";

import styles from "./index.module.less";

const Phone: React.FC = () => {
  const navBarStyle = useSelector((state: RootState) => state.navBar);
  const [categoryData, setCategoryData] = useState<TDataSource[]>([]);
  const [imgsData, setImgsData] = useState<TDataSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const toImageDetails = (img: TDataSource, viewType: number) => {
    Taro.navigateTo({
      url: `/pages/category/index?imgId=${img.id}&cid=${img.cid}&isPhone=${img.isPhone}&activeTab=${img.index}&viewType=${viewType}`,
    });
  };

  useEffect(() => {
    getCategoryImage({ isPrimary: 1, isPhone: 1 }).then((res) => {
      const { status, data } = res;
      if (status) {
        const result = data.map((item, index) => {
          const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
          return {
            ...item,
            index,
            key: `tab_${index}`,
            path: proxy + "/" + item.path,
          };
        });
        store.dispatch(setCategoryInfo(result));
        setCategoryData(result);
        setLoading(false);
      }
    });
    const imgs = [
      {
        id: 1,
        imgName: "zihua",
        imgColor: "#3b504e",
        operationTitle: "头像昵称套图",
        operationDesc: "让你的朋友圈更有格调",
        operate: "立即查看",
        isHot: 0,
        isPhone: 0,
        isPrimary: 1,
        isRecommend: 1,
        path: getProfileImg("subscribe"),
      },
    ];
    setImgsData(imgs);
  }, []);

  return (
    <View className={classNames("app", styles["mobile"])}>
      <CustomNavBar />
      {loading && (
        <Loading
          containerStyle={{
            height: `${navBarStyle.windowHeight - navBarStyle.totalHeight}px`,
          }}
        />
      )}
      {!loading && (
        <View className={classNames("app-main", styles["mobile-main"])}>
          <ImageCard
            imgStyle={{
              width: "100%",
              height: "150px",
            }}
            dataSource={imgsData}
            viewType={0}
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

export default Phone;
