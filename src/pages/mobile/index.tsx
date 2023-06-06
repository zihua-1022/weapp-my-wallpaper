import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { View } from "@tarojs/components";
import CustomNavBar from "@components/CustomNavBar";
import ImageCard, { TDataSource } from "@components/ImageCard";
import { getCategoryImage } from "@/api/category";
import { serverMap } from "@/services/config";
import Subscribe from "@assets/img/profile/subscribe_update.jpg";

import styles from "./index.module.less";

const Phone: React.FC = () => {
  const [categoryData, setCategoryData] = useState<TDataSource[]>([]);
  const [imgsData, setImgsData] = useState<TDataSource[]>([]);

  useEffect(() => {
    getCategoryImage({ isPhone: 1 }).then((res) => {
      const { status, data } = res;
      if (status) {
        const result = data.map((item) => {
          const proxy = serverMap[process.env.NODE_ENV || "default"]["static"];
          return {
            ...item,
            path: proxy + "/" + item.path,
          };
        });
        setCategoryData(result);
      }
    });
    const imgs = [
      {
        id: 1,
        imgName: "zihua",
        operationTitle: "头像昵称套图",
        operationDesc: "让你的朋友圈更有格调",
        operate: "立即查看",
        isHot: 0,
        isPhone: 0,
        isPrimary: 1,
        isRecommend: 1,
        path: Subscribe,
      },
    ];
    setImgsData(imgs);
  }, []);

  return (
    <View className={classNames("app", styles["mobile"])}>
      <CustomNavBar />
      <View className={classNames("app-main", styles["mobile-main"])}>
        <ImageCard
          dataSource={categoryData}
          showBottomBtn
          style={{
            gridTemplateColumns: "31.3% 31.3% 31.3%",
            columnGap: "3%",
            marginBottom: "14px",
          }}
          imgStyle={{
            height: "140px",
          }}
        />
        <ImageCard
          dataSource={imgsData}
          style={{
            gridTemplateColumns: "100%",
          }}
          imgStyle={{
            height: "150px",
          }}
        />
      </View>
    </View>
  );
};

export default Phone;
